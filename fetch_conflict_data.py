#!/usr/bin/env python3
"""
Conflict & Resource Map — Auto-Update Pipeline
Runs hourly via GitHub Actions. Fetches conflict-related news from RSS feeds,
scores severity, and updates conflict-data.json with latest developments.
"""

import json
import os
import re
import hashlib
import time
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from xml.etree import ElementTree as ET
import ssl

# --- Configuration ---
OWNER = "jameslowebba-star"
REPO = "information-hub-data"
BRANCH = "main"
OUTPUT_FILE = "conflict-data.json"
MAX_NEWS_AGE_HOURS = 6  # Only consider news from last 6 hours

# RSS Feeds for conflict news
RSS_FEEDS = [
    ("Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml"),
    ("Reuters World", "https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best"),
    ("UN News", "https://news.un.org/feed/subscribe/en/news/all/rss.xml"),
]

# Conflict zone keywords — maps conflict ID to search terms
CONFLICT_KEYWORDS = {
    "hormuz": ["hormuz", "strait of hormuz", "iran blockade", "iran oil", "bab el-mandeb", "iran navy", "iran strait"],
    "gaza": ["gaza", "palestine", "palestinian", "west bank", "idf gaza", "hamas", "rafah", "israeli occupation"],
    "ukraine": ["ukraine", "russia war", "russian invasion", "donetsk", "zelensky", "crimea", "kherson"],
    "lebanon": ["lebanon war", "hezbollah", "south lebanon", "litani", "unifil", "israel lebanon"],
    "sudan": ["sudan war", "sudan civil", "rsf sudan", "darfur", "khartoum fighting", "sudanese army"],
    "drc": ["congo war", "drc conflict", "m23", "goma", "north kivu", "eastern congo", "cobalt conflict"],
    "sahel": ["sahel", "jnim", "burkina faso attack", "mali conflict", "niger attack", "sahel insurgency"],
    "taiwan": ["taiwan", "south china sea", "tsmc", "china taiwan", "scarborough shoal", "philippines china sea"],
    "ethiopia": ["ethiopia conflict", "tigray", "amhara", "fano militia", "gerd dam", "tplf"],
    "myanmar": ["myanmar", "myanmar junta", "myanmar resistance", "kachin", "shan state", "operation 1027"],
    "libya": ["libya oil", "libya conflict", "haftar", "tripoli fighting", "libya political"],
    "arctic": ["arctic military", "nato arctic", "arctic sentry", "northern sea route", "arctic russia"],
    "yemen": ["yemen", "houthi", "red sea attack", "bab el-mandeb", "ansarallah"],
    "somalia": ["somalia", "al-shabaab", "al shabaab", "mogadishu attack", "aussom"],
    "haiti": ["haiti gang", "haiti crisis", "port-au-prince", "haiti violence", "barbecue haiti"],
    "venezuela": ["essequibo", "guyana venezuela", "stabroek", "venezuela territory"],
    "kashmir": ["kashmir", "india pakistan", "line of control", "loc violation", "jammu kashmir"],
    "mexico": ["mexico cartel", "cjng", "sinaloa cartel", "el mencho", "fentanyl mexico", "culiacan", "narco"],
    "mozambique": ["mozambique", "cabo delgado", "total lng mozambique", "maputo", "ismoz"],
    "ecuador": ["ecuador gang", "ecuador violence", "los choneros", "los lobos", "noboa ecuador", "guayaquil violence"],
}

# Severity weights for news signals
SEVERITY_SIGNALS = {
    "killed": 3, "dead": 3, "death toll": 3, "massacre": 3,
    "attack": 2, "bomb": 2, "strike": 2, "airstrike": 2, "drone strike": 2,
    "invasion": 3, "ground offensive": 3,
    "ceasefire": -1, "peace talks": -1, "negotiations": -1,
    "escalat": 2, "tensions": 1, "military buildup": 2,
    "displaced": 2, "refugees": 1, "humanitarian": 1, "famine": 2,
    "sanctions": 1, "blockade": 2,
    "nuclear": 3, "chemical": 3,
}

# --- SSL context (for environments with cert issues) ---
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def fetch_rss(name, url, timeout=15):
    """Fetch and parse an RSS feed, return list of (title, description, pubdate, link)."""
    items = []
    try:
        req = Request(url, headers={"User-Agent": "InformationHub-ConflictPipeline/1.0"})
        with urlopen(req, timeout=timeout, context=ctx) as resp:
            data = resp.read()
        root = ET.fromstring(data)
        # Handle both RSS and Atom
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        for item in root.iter("item"):
            title = (item.findtext("title") or "").strip()
            desc = (item.findtext("description") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub = (item.findtext("pubDate") or "").strip()
            if title:
                items.append({"title": title, "desc": desc, "link": link, "pub": pub, "source": name})
        for entry in root.iter("{http://www.w3.org/2005/Atom}entry"):
            title = (entry.findtext("{http://www.w3.org/2005/Atom}title") or "").strip()
            desc = (entry.findtext("{http://www.w3.org/2005/Atom}summary") or "").strip()
            link_el = entry.find("{http://www.w3.org/2005/Atom}link")
            link = link_el.get("href", "") if link_el is not None else ""
            pub = (entry.findtext("{http://www.w3.org/2005/Atom}published") or
                   entry.findtext("{http://www.w3.org/2005/Atom}updated") or "").strip()
            if title:
                items.append({"title": title, "desc": desc, "link": link, "pub": pub, "source": name})
        print(f"  [{name}] {len(items)} items")
    except Exception as e:
        print(f"  [{name}] Error: {e}")
    return items


def match_conflict(text, conflict_id):
    """Check if text matches any keywords for a conflict zone."""
    text_lower = text.lower()
    keywords = CONFLICT_KEYWORDS.get(conflict_id, [])
    for kw in keywords:
        if kw.lower() in text_lower:
            return True
    return False


def score_severity(text):
    """Score the severity of a news item based on signal words."""
    text_lower = text.lower()
    score = 0
    for signal, weight in SEVERITY_SIGNALS.items():
        if signal in text_lower:
            score += weight
    return score


def load_existing_data():
    """Load existing conflict-data.json from repo if it exists."""
    try:
        url = f"https://cdn.jsdelivr.net/gh/{OWNER}/{REPO}@{BRANCH}/{OUTPUT_FILE}"
        req = Request(url, headers={"User-Agent": "InformationHub-Pipeline/1.0"})
        with urlopen(req, timeout=15, context=ctx) as resp:
            return json.loads(resp.read())
    except:
        return None


def push_to_github(content, message):
    """Push updated conflict-data.json to GitHub."""
    token = os.environ.get("GH_TOKEN", "")
    if not token:
        print("No GH_TOKEN — saving locally only")
        with open(OUTPUT_FILE, "w") as f:
            json.dump(content, f, indent=2)
        return False

    api_url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{OUTPUT_FILE}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InformationHub-Pipeline/1.0",
    }

    # Get current SHA
    sha = None
    try:
        req = Request(api_url, headers=headers)
        with urlopen(req, timeout=15, context=ctx) as resp:
            sha = json.loads(resp.read()).get("sha")
    except:
        pass

    import base64
    encoded = base64.b64encode(json.dumps(content, indent=2).encode()).decode()

    payload = {
        "message": message,
        "content": encoded,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha

    data = json.dumps(payload).encode()
    req = Request(api_url, data=data, headers=headers, method="PUT")
    try:
        with urlopen(req, timeout=30, context=ctx) as resp:
            print(f"  Pushed to GitHub: {resp.status}")
            return True
    except HTTPError as e:
        print(f"  GitHub push error: {e.code} {e.read().decode()[:200]}")
        return False


def main():
    print("=" * 60)
    print(f"CONFLICT MAP PIPELINE — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print("=" * 60)

    # 1. Fetch RSS feeds
    print("\n[1/4] Fetching RSS feeds...")
    all_items = []
    for name, url in RSS_FEEDS:
        items = fetch_rss(name, url)
        all_items.extend(items)
    print(f"  Total items: {len(all_items)}")

    # 2. Match items to conflict zones
    print("\n[2/4] Matching news to conflict zones...")
    conflict_news = {}  # conflict_id -> list of matched items
    for item in all_items:
        text = f"{item['title']} {item['desc']}"
        for cid in CONFLICT_KEYWORDS:
            if match_conflict(text, cid):
                if cid not in conflict_news:
                    conflict_news[cid] = []
                conflict_news[cid].append(item)

    for cid, items in conflict_news.items():
        print(f"  {cid}: {len(items)} matches")

    # 3. Load existing data (from last run or defaults)
    print("\n[3/4] Loading existing conflict data...")
    existing = load_existing_data()

    if existing and isinstance(existing, list) and len(existing) > 0:
        print(f"  Loaded {len(existing)} existing zones")
        data = existing
    else:
        print("  No existing data — this shouldn't happen if defaults are in JS")
        # We can't generate the full structure from scratch here.
        # The JS has DEFAULT_CONFLICT_DATA as fallback.
        # Just create a minimal update file.
        data = None

    if data is None:
        print("  Skipping — no base data to update")
        return

    # 4. Update severity scores and inject latest headlines
    print("\n[4/4] Updating severity scores and latest news...")
    now = datetime.now(timezone.utc)
    updated = False

    for zone in data:
        cid = zone.get("id", "")
        matched = conflict_news.get(cid, [])

        if matched:
            # Calculate severity adjustment
            total_score = sum(score_severity(f"{i['title']} {i['desc']}") for i in matched)
            news_count = len(matched)

            # Base severity stays, but we can bump it if lots of urgent news
            base_severity = zone.get("severity", 5)
            if total_score > 10 and news_count >= 3:
                zone["severity"] = min(10, base_severity + 1)
            elif total_score < -3:
                zone["severity"] = max(1, base_severity - 1)

            # Add latest headlines
            headlines = []
            for item in matched[:3]:  # Top 3
                headlines.append({
                    "title": item["title"][:120],
                    "source": item["source"],
                    "link": item["link"],
                })
            zone["latestNews"] = headlines
            zone["lastUpdated"] = now.strftime("%Y-%m-%d %H:%M UTC")
            updated = True
            print(f"  {cid}: score={total_score}, headlines={len(headlines)}")
        else:
            # Keep lastUpdated from previous run if exists
            if "lastUpdated" not in zone:
                zone["lastUpdated"] = now.strftime("%Y-%m-%d %H:%M UTC")

    # 5. Push to GitHub
    if updated:
        ts = now.strftime("%Y-%m-%d %H:%M")
        msg = f"conflict-map: auto-update {ts} UTC"
        print(f"\nPushing update: {msg}")
        push_to_github(data, msg)
    else:
        print("\nNo new conflict news found — skipping push")

    print("\nDone.")


if __name__ == "__main__":
    main()
