#!/usr/bin/env python3
"""
fetch_geo_risks.py — Automated Geopolitical Risk Data Fetcher
Runs via GitHub Actions on a schedule to update geo-risks.json
Sources: RSS feeds from Reuters, Al Jazeera, BBC; filtered for geopolitical keywords
Now also maintains geo-risks-history.json with timestamped score snapshots
"""

import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import re
import os
import base64
from datetime import datetime, timezone, timedelta

# ===== CONFIGURATION =====
OUTPUT_FILE = "geo-risks.json"
HISTORY_FILE = "geo-risks-history.json"
GITHUB_TOKEN = os.environ.get("GH_TOKEN", "")
REPO_API = "https://api.github.com/repos/jameslowebba-star/information-hub-data/contents"
API_URL = f"{REPO_API}/geo-risks.json"
HISTORY_API_URL = f"{REPO_API}/geo-risks-history.json"

# Keep 30 days of hourly data (max ~720 entries)
MAX_HISTORY_ENTRIES = 720

# RSS feeds for geopolitical intelligence
RSS_FEEDS = [
    {"url": "https://feeds.reuters.com/Reuters/worldNews", "source": "Reuters", "weight": 3},
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "source": "BBC World", "weight": 2},
    {"url": "https://www.aljazeera.com/xml/rss/all.xml", "source": "Al Jazeera", "weight": 2},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "source": "NYT World", "weight": 2},
    {"url": "https://feeds.reuters.com/reuters/businessNews", "source": "Reuters Business", "weight": 1},
]

# Keywords that signal geopolitical relevance for each risk
RISK_KEYWORDS = {
    "middle-east": ["iran", "israel", "hamas", "hezbollah", "gaza", "hormuz", "epic fury", "middle east", "saudi", "yemen", "houthi", "red sea"],
    "us-china": ["china", "taiwan", "semiconductor", "xi jinping", "beijing", "tariff", "trade war", "south china sea", "chips act", "decoupling"],
    "trade-war": ["tariff", "trade war", "wto", "sanctions", "trade deal", "import duty", "export controls", "greenland", "protectionism"],
    "russia-nato": ["russia", "ukraine", "nato", "putin", "kyiv", "crimea", "black sea", "nuclear", "nord stream", "zelensky"],
    "cyber-warfare": ["cyber attack", "ransomware", "hacking", "cyber warfare", "critical infrastructure", "data breach", "state-sponsored"],
    "energy-crisis": ["oil price", "opec", "energy crisis", "natural gas", "crude oil", "pipeline", "lng", "energy supply", "brent crude"],
    "western-alliance": ["nato", "eu defense", "transatlantic", "alliance", "european defense", "g7", "western unity"],
    "africa-instability": ["africa coup", "sahel", "south africa", "mining", "rare earth", "african union", "jse", "rand"],
    "crypto-regulation": ["crypto regulation", "sec crypto", "mica", "cbdc", "stablecoin", "bitcoin ban", "crypto enforcement"],
    "debt-crisis": ["debt crisis", "imf", "default", "sovereign debt", "emerging market debt", "frontier economy", "debt restructuring"]
}

# ===== BASE RISK DATA (fallback/enrichment) =====
BASE_RISKS = [
    {
        "id": "middle-east",
        "name": "Middle East Regional War",
        "likelihood": "high",
        "score": 9.2,
        "description": "Regional conflict has escalated following U.S.-Israel 'Epic Fury' operation targeting Iran's leadership and military infrastructure. Iran retaliating with strikes on Israel, U.S. assets, and regional targets.",
        "impacts": ["Oil & Gas", "Gold", "Brent Crude", "S&P 500", "Defense Stocks"],
        "direction": "up",
        "region": "Middle East",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "U.S.-Iran direct military engagement ongoing since Feb 28, 2026",
        "impactOnPortfolio": {"positive": ["Gold", "Brent Crude", "Defense Stocks"], "negative": ["S&P 500", "Emerging Market Equities"]}
    },
    {
        "id": "us-china",
        "name": "U.S.\u2013China Strategic Competition",
        "likelihood": "high",
        "score": 8.8,
        "description": "Technology decoupling accelerating. Semiconductor export controls tightened. Taiwan Strait tensions elevated with increased PLA military exercises.",
        "impacts": ["Tech Stocks", "Semiconductors", "Bitcoin", "USD/CNY", "Taiwan ETFs"],
        "direction": "up",
        "region": "Indo-Pacific",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "New U.S. semiconductor restrictions on China, March 2026",
        "impactOnPortfolio": {"positive": ["Gold", "Bitcoin", "Defense Stocks"], "negative": ["Tech Stocks", "Semiconductors", "Taiwan ETFs"]}
    },
    {
        "id": "trade-war",
        "name": "Global Trade Fragmentation",
        "likelihood": "high",
        "score": 8.5,
        "description": "U.S. pursuing transactional foreign policy with broad tariff threats. WTO system under strain. Supply chain restructuring accelerating across industries.",
        "impacts": ["S&P 500", "Manufacturing", "USD/ZAR", "Emerging Markets", "Commodities"],
        "direction": "up",
        "region": "Global",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "U.S. tariff threats against multiple nations over Greenland dispute",
        "impactOnPortfolio": {"positive": ["Gold", "USD"], "negative": ["Emerging Markets", "Manufacturing", "Global Trade ETFs"]}
    },
    {
        "id": "russia-nato",
        "name": "Russia\u2013NATO Confrontation",
        "likelihood": "medium",
        "score": 7.6,
        "description": "Risk of miscalculation remains elevated. Ukraine war continues with no ceasefire in sight. NATO eastern flank reinforcement ongoing.",
        "impacts": ["European Equities", "Natural Gas", "Defense Stocks", "EUR/USD", "Gold"],
        "direction": "up",
        "region": "Europe",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "Continued fighting in Ukraine, NATO Article 5 drills expanded",
        "impactOnPortfolio": {"positive": ["Defense Stocks", "Gold", "Natural Gas"], "negative": ["European Equities", "EUR/USD"]}
    },
    {
        "id": "cyber-warfare",
        "name": "Major Cyber Attack",
        "likelihood": "medium",
        "score": 7.2,
        "description": "State-sponsored cyber operations targeting critical infrastructure, financial systems, and energy grids.",
        "impacts": ["Cybersecurity Stocks", "Tech Stocks", "Banking", "Crypto Exchanges", "Insurance"],
        "direction": "up",
        "region": "Global",
        "lastUpdated": "",
        "source": "Stifel Dashboard",
        "keyEvent": "Multiple state-sponsored attacks on European energy grids detected",
        "impactOnPortfolio": {"positive": ["Cybersecurity Stocks"], "negative": ["Banking", "Tech Stocks", "Crypto Exchanges"]}
    },
    {
        "id": "energy-crisis",
        "name": "Global Energy Disruption",
        "likelihood": "high",
        "score": 8.1,
        "description": "Strait of Hormuz chokepoint under active threat. Oil supply disruptions from Middle East conflict. OPEC+ production cuts maintaining price pressure.",
        "impacts": ["Brent Crude", "Natural Gas", "Energy Stocks", "Airlines", "Emerging Markets"],
        "direction": "up",
        "region": "Global",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "Hormuz Strait shipping insurance premiums at record highs",
        "impactOnPortfolio": {"positive": ["Brent Crude", "Energy Stocks", "Natural Gas"], "negative": ["Airlines", "Manufacturing"]}
    },
    {
        "id": "western-alliance",
        "name": "Western Alliance Fractures",
        "likelihood": "medium",
        "score": 7.0,
        "description": "Transactional U.S. foreign policy straining traditional alliances. European defense autonomy push.",
        "impacts": ["EUR/USD", "NATO Defense ETFs", "European Equities", "USD", "Treasury Bonds"],
        "direction": "up",
        "region": "Transatlantic",
        "lastUpdated": "",
        "source": "BlackRock BGRI",
        "keyEvent": "EU announces independent defense fund, reduced reliance on U.S.",
        "impactOnPortfolio": {"positive": ["European Defense Stocks", "Gold"], "negative": ["USD", "U.S. Treasury Bonds"]}
    },
    {
        "id": "africa-instability",
        "name": "African Political Instability",
        "likelihood": "medium",
        "score": 6.8,
        "description": "Coup contagion in Sahel region. Resource nationalism rising. South Africa political uncertainty.",
        "impacts": ["JSE All Share", "USD/ZAR", "Mining Stocks", "Platinum", "Rare Earth Minerals"],
        "direction": "up",
        "region": "Africa",
        "lastUpdated": "",
        "source": "ZeroFox Intel",
        "keyEvent": "Multiple Sahel nations restricting Western mining operations",
        "impactOnPortfolio": {"positive": ["Platinum", "Rare Earth ETFs"], "negative": ["JSE All Share", "USD/ZAR"]}
    },
    {
        "id": "crypto-regulation",
        "name": "Crypto Regulatory Crackdown",
        "likelihood": "medium",
        "score": 6.5,
        "description": "Global regulatory frameworks tightening. U.S. SEC enforcement actions. EU MiCA implementation creating compliance burdens.",
        "impacts": ["Bitcoin", "Ethereum", "Exchange Tokens", "DeFi", "Stablecoins"],
        "direction": "down",
        "region": "Global",
        "lastUpdated": "",
        "source": "J.P. Morgan GPR",
        "keyEvent": "EU MiCA fully enforced, multiple exchanges exit smaller markets",
        "impactOnPortfolio": {"positive": ["Regulated Crypto ETFs"], "negative": ["Bitcoin", "Altcoins", "Exchange Tokens"]}
    },
    {
        "id": "debt-crisis",
        "name": "Emerging Market Debt Crisis",
        "likelihood": "medium",
        "score": 6.3,
        "description": "High USD rates straining EM debt sustainability. Several frontier economies approaching default.",
        "impacts": ["EM Bonds", "USD/ZAR", "EM Equities", "Commodities", "Gold"],
        "direction": "up",
        "region": "Global",
        "lastUpdated": "",
        "source": "J.P. Morgan GPR",
        "keyEvent": "Multiple frontier economies in IMF debt restructuring talks",
        "impactOnPortfolio": {"positive": ["Gold", "USD", "U.S. Treasury Bonds"], "negative": ["EM Bonds", "EM Equities", "USD/ZAR"]}
    }
]

# ===== UPCOMING EVENTS =====
BASE_EVENTS = [
    {"date": "2026-03-18", "event": "Fed FOMC Interest Rate Decision", "risk": "trade-war", "category": "economic"},
    {"date": "2026-03-20", "event": "EU Emergency Defense Summit", "risk": "western-alliance", "category": "political"},
    {"date": "2026-03-25", "event": "OPEC+ Emergency Production Meeting", "risk": "energy-crisis", "category": "economic"},
    {"date": "2026-04-01", "event": "U.S.-China Trade Review Deadline", "risk": "us-china", "category": "economic"},
    {"date": "2026-04-10", "event": "IMF Spring Meetings", "risk": "debt-crisis", "category": "economic"},
    {"date": "2026-04-15", "event": "UN Security Council \u2014 Iran Resolution Vote", "risk": "middle-east", "category": "political"},
    {"date": "2026-04-22", "event": "NATO Defense Ministers Meeting", "risk": "russia-nato", "category": "military"},
    {"date": "2026-05-01", "event": "South Africa Budget Supplementary", "risk": "africa-instability", "category": "economic"},
    {"date": "2026-05-15", "event": "EU Crypto Compliance Deadline (MiCA Phase 2)", "risk": "crypto-regulation", "category": "regulatory"},
    {"date": "2026-06-01", "event": "G7 Summit \u2014 Trade & Security Agenda", "risk": "trade-war", "category": "political"},
    {"date": "2026-06-15", "event": "PLA Anniversary \u2014 Taiwan Strait Watch", "risk": "us-china", "category": "military"},
    {"date": "2026-07-01", "event": "African Union Mid-Year Summit", "risk": "africa-instability", "category": "political"}
]


def fetch_rss(url, timeout=10):
    """Fetch and parse an RSS feed."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "InformationHub-GeoTracker/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            data = response.read()
        root = ET.fromstring(data)
        items = []
        for item in root.iter("item"):
            title = item.findtext("title", "")
            desc = item.findtext("description", "")
            link = item.findtext("link", "")
            pub_date = item.findtext("pubDate", "")
            items.append({"title": title, "description": desc, "link": link, "pubDate": pub_date})
        return items
    except Exception as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return []


def calculate_risk_mentions(articles):
    """Count keyword mentions per risk across all articles."""
    mentions = {risk_id: 0 for risk_id in RISK_KEYWORDS}
    for article in articles:
        text = (article.get("title", "") + " " + article.get("description", "")).lower()
        for risk_id, keywords in RISK_KEYWORDS.items():
            for kw in keywords:
                if kw in text:
                    mentions[risk_id] += article.get("weight", 1)
                    break  # Count each article only once per risk
    return mentions


def adjust_scores(base_risks, mentions):
    """Adjust risk scores based on current news attention."""
    total_mentions = sum(mentions.values()) or 1
    risks = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    for risk in base_risks:
        r = dict(risk)
        r["lastUpdated"] = now
        risk_mentions = mentions.get(r["id"], 0)
        
        # Attention factor: if this risk has more mentions than average, nudge score up
        avg = total_mentions / len(mentions) if mentions else 1
        if avg > 0:
            attention = risk_mentions / avg
            # Clamp adjustment to +/- 0.5
            adjustment = max(-0.5, min(0.5, (attention - 1) * 0.3))
            r["score"] = round(max(1.0, min(10.0, r["score"] + adjustment)), 1)
        
        # Update likelihood based on adjusted score
        if r["score"] >= 8.0:
            r["likelihood"] = "high"
        elif r["score"] >= 6.0:
            r["likelihood"] = "medium"
        else:
            r["likelihood"] = "low"
        
        r["newsAttention"] = risk_mentions
        risks.append(r)
    
    return risks


def github_get_file(api_url):
    """Get file content and SHA from GitHub."""
    try:
        req = urllib.request.Request(api_url, headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            content = base64.b64decode(data["content"]).decode()
            return json.loads(content), data.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None, None
        raise
    except Exception as e:
        print(f"  [WARN] Could not fetch {api_url}: {e}")
        return None, None


def github_put_file(api_url, content_str, sha, message):
    """Create or update a file on GitHub."""
    encoded = base64.b64encode(content_str.encode()).decode()
    payload = {
        "message": message,
        "content": encoded,
        "branch": "main"
    }
    if sha:
        payload["sha"] = sha
    
    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode(),
        method="PUT",
        headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read())
        return result["commit"]["sha"][:8]


def update_history(risks):
    """Append current scores to the history file."""
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Build snapshot — just the scores and composite
    snapshot = {
        "timestamp": now_iso,
        "composite": round(sum(r["score"] for r in risks) / len(risks), 1),
        "scores": {r["id"]: r["score"] for r in risks}
    }
    
    # Fetch existing history from GitHub
    history_data, history_sha = github_get_file(HISTORY_API_URL)
    
    if history_data and isinstance(history_data, dict) and "snapshots" in history_data:
        snapshots = history_data["snapshots"]
    else:
        snapshots = []
    
    # Append new snapshot
    snapshots.append(snapshot)
    
    # Trim to max entries (keep most recent)
    if len(snapshots) > MAX_HISTORY_ENTRIES:
        snapshots = snapshots[-MAX_HISTORY_ENTRIES:]
    
    history_output = {
        "last_updated": now_iso,
        "total_snapshots": len(snapshots),
        "snapshots": snapshots
    }
    
    history_json = json.dumps(history_output, indent=2)
    
    # Write locally
    with open(HISTORY_FILE, "w") as f:
        f.write(history_json)
    
    # Push to GitHub
    if GITHUB_TOKEN:
        try:
            commit = github_put_file(
                HISTORY_API_URL,
                history_json,
                history_sha,
                f"[GeoTracker] History update — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}"
            )
            print(f"  [OK] History pushed to GitHub — commit: {commit}")
        except Exception as e:
            print(f"  [ERR] History push failed: {e}")
    
    return len(snapshots)


def main():
    print("[GeoTracker] Starting geopolitical risk data update...")
    
    # Fetch all RSS feeds
    all_articles = []
    for feed in RSS_FEEDS:
        print(f"  Fetching {feed['source']}...")
        items = fetch_rss(feed["url"])
        for item in items:
            item["weight"] = feed["weight"]
        all_articles.extend(items)
        print(f"    Got {len(items)} articles")
    
    print(f"\n  Total articles collected: {len(all_articles)}")
    
    # Calculate mentions
    mentions = calculate_risk_mentions(all_articles)
    print("\n  Risk attention (article mentions):")
    for risk_id, count in sorted(mentions.items(), key=lambda x: -x[1]):
        print(f"    {risk_id}: {count}")
    
    # Adjust scores
    risks = adjust_scores(BASE_RISKS, mentions)
    
    # Filter events to only include future ones
    now = datetime.now(timezone.utc).date()
    events = [e for e in BASE_EVENTS if datetime.strptime(e["date"], "%Y-%m-%d").date() >= now]
    
    # Build output
    output = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "total_articles_analyzed": len(all_articles),
        "risks": risks,
        "events": events
    }
    
    json_content = json.dumps(output, indent=2)
    
    # Write locally
    with open(OUTPUT_FILE, "w") as f:
        f.write(json_content)
    
    print(f"\n[GeoTracker] Wrote {OUTPUT_FILE} with {len(risks)} risks and {len(events)} events")
    print(f"  Composite score: {sum(r['score'] for r in risks) / len(risks):.1f}/10")
    
    # Push risk data to GitHub
    if GITHUB_TOKEN:
        try:
            _, sha = github_get_file(API_URL)
            commit = github_put_file(
                API_URL,
                json_content,
                sha,
                f"[GeoTracker] Auto-update risk data — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}"
            )
            print(f"  [OK] Pushed to GitHub — commit: {commit}")
        except Exception as e:
            print(f"  [ERR] GitHub push failed: {e}")
    else:
        print("\n  [WARN] No GH_TOKEN — skipping GitHub push")
    
    # Update historical data
    print("\n[GeoTracker] Updating historical data...")
    snapshot_count = update_history(risks)
    print(f"  Total snapshots in history: {snapshot_count}")


if __name__ == "__main__":
    main()
