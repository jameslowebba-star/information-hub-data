#!/usr/bin/env python3
"""
Information Hub — Autonomous News Pipeline
Fetches RSS feeds from priority sources, categorises articles,
and updates latest-news.json in the GitHub data repo.

Runs via GitHub Actions every 2 hours. Zero human dependencies.
"""

import json
import base64
import hashlib
import re
import os
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from html import unescape

# ─── CONFIG ──────────────────────────────────────────────────────────

GITHUB_TOKEN = os.environ.get("GH_TOKEN", "")
API_URL = "https://api.github.com/repos/jameslowebba-star/information-hub-data/contents/latest-news.json"
SAST = timezone(timedelta(hours=2))
MAX_ARTICLES = 60  # keep in JSON
MAX_AGE_HOURS = 48  # discard articles older than this
MAX_HEADLINE_LEN = 75
MAX_EXCERPT_LEN = 220

# ─── RSS FEED SOURCES ────────────────────────────────────────────────
# Each feed: (url, default_category, source_name, article_type)
# article_type: "breaking" for major wires, "icymi" for recaps

FEEDS = [
    # ── CURRENT AFFAIRS / GEOPOLITICS ──
    ("https://www.aljazeera.com/xml/rss/all.xml", "auto", "Al Jazeera", "breaking"),
    ("https://feeds.bbci.co.uk/news/world/rss.xml", "auto", "BBC News", "breaking"),
    ("https://feeds.bbci.co.uk/news/world/africa/rss.xml", "africa", "BBC Africa", "icymi"),
    ("https://feeds.bbci.co.uk/news/world/europe/rss.xml", "europe", "BBC Europe", "icymi"),
    ("https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml", "usa", "BBC News", "icymi"),
    ("https://feeds.bbci.co.uk/news/business/rss.xml", "finance", "BBC Business", "icymi"),

    # ── CRYPTO ──
    ("https://cointelegraph.com/rss/tag/bitcoin", "crypto", "CoinTelegraph", "breaking"),
    ("https://cointelegraph.com/rss/tag/altcoin", "crypto", "CoinTelegraph", "icymi"),
    ("https://cointelegraph.com/rss/tag/regulation", "crypto", "CoinTelegraph", "icymi"),
    ("https://www.coindesk.com/arc/outboundfeeds/rss/", "crypto", "CoinDesk", "breaking"),
    ("https://decrypt.co/feed", "crypto", "Decrypt", "icymi"),

    # ── FINANCE ──
    ("https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114", "finance", "CNBC", "icymi"),

    # ── SOUTH AFRICA / AFRICA ──
    ("https://feeds.news24.com/articles/News24/TopStories/rss", "africa", "News24", "icymi"),
    # Daily Maverick blocks bot requests — removed
    # ("https://www.dailymaverick.co.za/feed/", "africa", "Daily Maverick", "icymi"),
]

# ─── CATEGORY DETECTION KEYWORDS ─────────────────────────────────────

CATEGORY_KEYWORDS = {
    "crypto": [
        "bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "defi",
        "nft", "stablecoin", "solana", "cardano", "xrp", "binance", "coinbase",
        "altcoin", "web3", "token", "mining", "wallet", "dex", "cefi",
        "cbdc", "digital asset", "digital currency", "ledger", "dogecoin",
    ],
    "africa": [
        "south africa", "africa", "nigeria", "kenya", "ethiopia", "ghana",
        "tanzania", "egypt", "morocco", "angola", "mozambique", "zimbabwe",
        "eskom", "anc", "ramaphosa", "rand", "jse", "sarb", "pretoria",
        "johannesburg", "cape town", "durban", "gnu", "sabc", "brics africa",
        "african union", "afcfta", "sahel", "congo", "sudan", "somalia",
        "ivory coast", "senegal", "cameroon", "uganda", "rwanda", "mali",
        "burkina faso", "niger", "chad", "botswana", "namibia", "zambia",
    ],
    "europe": [
        "europe", "european", "eu ", "brexit", "nato", "uk ", "britain",
        "british", "france", "french", "germany", "german", "spain", "spanish",
        "italy", "italian", "poland", "ukraine", "russia", "macron", "merz",
        "starmer", "brussels", "ecb", "euro ", "eurozone", "eurostoxx",
        "london", "paris", "berlin", "nordstream", "türkiye", "turkey",
        "alps", "swiss", "austria", "hungary", "czech", "romania", "greece",
    ],
    "usa": [
        "us ", "u.s.", "united states", "american", "trump", "biden",
        "congress", "senate", "pentagon", "fbi", "cia", "white house",
        "wall street", "fed ", "federal reserve", "capitol hill",
        "republican", "democrat", "washington d.c.", "new york", "texas",
        "california", "florida", "michigan", "virginia", "ohio",
        "operation epic", "mar-a-lago",
    ],
    "finance": [
        "stock", "market", "nasdaq", "dow jones", "s&p 500", "gold",
        "silver", "oil", "crude", "brent", "commodity", "forex",
        "interest rate", "inflation", "gdp", "economy", "economic",
        "bank", "imf", "world bank", "trade", "tariff", "bond",
        "yield", "recession", "bull", "bear", "rally", "plunge",
        "earnings", "revenue", "profit", "ipo", "merger", "acquisition",
    ],
}

# Keywords that should NEVER assign a category (too generic / cross-cutting)
# "military", "war" etc. alone shouldn't auto-assign to USA
GENERIC_KEYWORDS = {"military", "war", "conflict", "attack", "strike", "troops"}

# ─── SPORTS FILTER ───────────────────────────────────────────────────
# Pure sports/match results don't fit our mission (news, politics,
# business, finance, crypto, geopolitics). But sports stories WITH
# geopolitical angles (e.g. F1 cancelled due to war) should stay.

SPORTS_KEYWORDS = {
    # Football/Soccer
    "premier league", "champions league", "la liga", "serie a",
    "bundesliga", "europa league", "carabao cup", "fa cup",
    "ligue 1", "eredivisie", "copa del rey", "coppa italia",
    # Match result language
    "man city", "manchester city", "manchester united", "man united",
    "liverpool", "chelsea", "arsenal", "tottenham", "spurs",
    "real madrid", "barcelona", "atletico madrid", "bayern munich",
    "juventus", "ac milan", "inter milan", "psg",
    "west ham", "everton", "aston villa", "newcastle united",
    "leicester", "wolves", "crystal palace", "brighton",
    "fulham", "bournemouth", "brentford", "nottingham forest",
    # Match-specific terms
    "hat-trick", "hat trick", "penalty kick", "red card",
    "yellow card", "clean sheet", "golden boot", "ballon d'or",
    "transfer window", "transfer deadline", "loan deal",
    # Other pure sports
    "tennis open", "grand slam", "wimbledon", "us open tennis",
    "rugby world cup", "six nations",
    "cricket world cup", "t20", "test match",
    "nba", "nfl", "nhl", "mlb", "super bowl",
    "olympics medal", "olympic games",
}

# These override the sports filter — if present alongside sports
# keywords, the article has geopolitical relevance and should stay
SPORTS_EXCEPTION_KEYWORDS = {
    "war", "conflict", "cancel", "cancelled", "boycott", "ban",
    "sanction", "protest", "political", "government", "security",
    "terror", "bomb", "attack", "killed", "death", "threat",
    "corruption", "arrest", "investigation", "fraud", "money laundering",
    "human rights", "racism", "discrimination", "refugee",
    "economic impact", "financial", "billion", "million",
}


# Noise content — always filter out regardless of context
NOISE_KEYWORDS = {
    "powerball", "lotto", "lottery results",
    "weather forecast", "weather:", "heatwave hits",
    "hockey festival", "rugby festival", "cricket festival",
    "razzie award", "razzie", "golden raspberry",
    "horoscope", "zodiac", "star sign",
    "recipe of the day", "recipes:",
}


def is_pure_sports(title, description):
    """Return True if article is pure sports content with no geopolitical angle."""
    text = f"{title} {description}".lower()
    # Check if it contains sports keywords
    has_sports = any(kw in text for kw in SPORTS_KEYWORDS)
    if not has_sports:
        return False
    # Check if it also has geopolitical/exception keywords
    has_exception = any(kw in text for kw in SPORTS_EXCEPTION_KEYWORDS)
    if has_exception:
        return False  # Keep it — has a real-world angle
    return True  # Pure sports, filter it out


def is_noise(title, description):
    """Return True if article is irrelevant filler (lottery, weather, entertainment)."""
    text = f"{title} {description}".lower()
    return any(kw in text for kw in NOISE_KEYWORDS)

# Badge keywords — short labels for article chips
BADGE_KEYWORDS = {
    "crypto": {
        "bitcoin": "Bitcoin", "btc": "Bitcoin", "ethereum": "Ethereum",
        "eth": "Ethereum", "solana": "Solana", "xrp": "XRP",
        "defi": "DeFi", "nft": "NFT", "stablecoin": "Stablecoin",
        "regulation": "Regulation", "etf": "ETF", "mining": "Mining",
        "cbdc": "CBDC", "exchange": "Exchange",
    },
    "africa": {
        "south africa": "South Africa", "nigeria": "Nigeria",
        "kenya": "Kenya", "ethiopia": "Ethiopia", "eskom": "Energy",
        "ramaphosa": "Politics", "jse": "Markets", "rand": "Forex",
        "african union": "Continental", "sahel": "Sahel",
        "egypt": "Egypt", "morocco": "Morocco",
    },
    "europe": {
        "germany": "Germany", "france": "France", "uk": "UK",
        "britain": "UK", "spain": "Spain", "italy": "Italy",
        "nato": "NATO", "eu": "EU", "ecb": "ECB",
        "ukraine": "Ukraine", "russia": "Russia", "defence": "Defence",
        "defense": "Defence", "türkiye": "Türkiye", "turkey": "Türkiye",
    },
    "usa": {
        "trump": "Politics", "congress": "Politics", "senate": "Politics",
        "pentagon": "Military", "military": "Military", "war": "Conflict",
        "iran": "Iran", "election": "Elections", "poll": "Polls",
        "economy": "Economy", "fbi": "Security", "cia": "Security",
    },
    "finance": {
        "gold": "Gold", "silver": "Silver", "oil": "Oil",
        "crude": "Oil", "stock": "Markets", "nasdaq": "Markets",
        "dow": "Markets", "inflation": "Inflation", "fed": "Fed",
        "interest rate": "Rates", "bond": "Bonds", "forex": "Forex",
        "earnings": "Earnings", "ipo": "IPO",
    },
}


# ─── HELPERS ──────────────────────────────────────────────────────────

def fetch_feed(url, timeout=15):
    """Fetch and parse an RSS feed. Returns list of item Elements."""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "InformationHub-NewsBot/1.0 (+https://informationhubnews.netlify.app)",
            "Accept": "application/rss+xml, application/xml, text/xml",
        })
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            # Try to parse as XML
            root = ET.fromstring(raw)
            # Handle RSS 2.0
            items = root.findall(".//item")
            if items:
                return items
            # Handle Atom
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            entries = root.findall(".//atom:entry", ns)
            return entries
    except Exception as e:
        print(f"  ⚠ Failed to fetch {url}: {e}")
        return []


def clean_html(text):
    """Strip HTML tags and decode entities."""
    if not text:
        return ""
    text = unescape(text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_date(date_str):
    """Parse RSS date formats into datetime."""
    if not date_str:
        return None
    # Common RSS date formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%d %H:%M:%S",
        "%d %b %Y %H:%M:%S %z",
    ]
    # Clean up timezone abbreviations
    date_str = date_str.strip()
    date_str = re.sub(r"\s+GMT$", " +0000", date_str)
    date_str = re.sub(r"\s+EDT$", " -0400", date_str)
    date_str = re.sub(r"\s+EST$", " -0500", date_str)
    date_str = re.sub(r"\s+CDT$", " -0500", date_str)
    date_str = re.sub(r"\s+CST$", " -0600", date_str)
    date_str = re.sub(r"\s+PDT$", " -0700", date_str)
    date_str = re.sub(r"\s+PST$", " -0800", date_str)

    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    return None


def detect_category(title, description, default_cat):
    """Auto-detect category from text content."""
    if default_cat != "auto":
        return default_cat

    text = f"{title} {description}".lower()
    scores = {}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        # Only count keywords that are specific (not in GENERIC_KEYWORDS)
        score = 0
        for kw in keywords:
            if kw in text:
                # Give 2 points to specific geo keywords, 1 to generic ones
                if kw.strip() in GENERIC_KEYWORDS:
                    score += 0  # skip generic keywords for scoring
                else:
                    score += 1
        if score > 0:
            scores[cat] = score

    if not scores:
        return "finance"  # fallback: general world/business news

    # Require a minimum score of 2 for auto-detected categories to avoid
    # weak single-keyword matches (e.g. "washington" in a non-USA story)
    best = max(scores, key=scores.get)
    if scores[best] < 2:
        # If the best match is weak, check if there's a strong runner-up
        # Otherwise default to finance (neutral catch-all)
        return best  # still use it, just one match is okay for now

    return best


def detect_badge(title, description, category):
    """Pick a short badge label based on content."""
    text = f"{title} {description}".lower()
    badges = BADGE_KEYWORDS.get(category, {})
    for keyword, badge in badges.items():
        if keyword in text:
            return badge
    # Fallback badges
    fallbacks = {
        "crypto": "Crypto",
        "africa": "Africa",
        "europe": "Europe",
        "usa": "USA",
        "finance": "Finance",
    }
    return fallbacks.get(category, "News")


def truncate(text, max_len):
    """Truncate text to max length at word boundary."""
    if len(text) <= max_len:
        return text
    truncated = text[:max_len].rsplit(" ", 1)[0]
    return truncated.rstrip(".,;:!?") + "…"


def make_id(title, source, article_type):
    """Generate a deterministic article ID from content."""
    prefix = "brk" if article_type == "breaking" else "icymi"
    raw = f"{title}-{source}".lower()
    short_hash = hashlib.md5(raw.encode()).hexdigest()[:6]
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"{prefix}-{today}-{short_hash}"


def extract_image(item):
    """Try to extract a thumbnail/image URL from an RSS item."""
    ns_media = "http://search.yahoo.com/mrss/"
    # 1. media:thumbnail (BBC)
    mt = item.find(f"{{{ns_media}}}thumbnail")
    if mt is not None:
        url = mt.get("url", "")
        if url:
            return url
    # 2. media:content with medium=image (CoinTelegraph)
    mc = item.find(f"{{{ns_media}}}content")
    if mc is not None and mc.get("medium") == "image":
        url = mc.get("url", "")
        if url:
            return url
    # 3. enclosure with type=image/* 
    enc = item.find("enclosure")
    if enc is not None:
        enc_url = enc.get("url", "")
        enc_type = enc.get("type", "")
        if enc_url and ("image" in enc_type or enc_url.endswith((".jpg", ".jpeg", ".png", ".webp"))):
            return enc_url
    # 4. Check description for <img> tag as last resort
    desc_el = item.find("description")
    if desc_el is not None and desc_el.text:
        match = re.search(r'<img[^>]+src=["\']([^"\']+)', desc_el.text)
        if match:
            return match.group(1)
    return ""


def extract_item(item, default_cat, source_name, article_type):
    """Extract article dict from an RSS item Element."""
    # Handle both RSS and Atom namespaces
    ns = {"atom": "http://www.w3.org/2005/Atom", "content": "http://purl.org/rss/1.0/modules/content/"}

    # Title
    title_el = item.find("title")
    if title_el is None:
        title_el = item.find("atom:title", ns)
    title = clean_html(title_el.text if title_el is not None and title_el.text else "")
    if not title:
        return None

    # Link / URL
    link_el = item.find("link")
    if link_el is None:
        link_el = item.find("atom:link", ns)
    if link_el is not None:
        article_url = (link_el.text or link_el.get("href", "")).strip()
    else:
        article_url = ""

    # Description / excerpt
    desc_el = item.find("description")
    if desc_el is None:
        desc_el = item.find("atom:summary", ns)
    if desc_el is None:
        desc_el = item.find("content:encoded", ns)
    description = clean_html(desc_el.text if desc_el is not None and desc_el.text else "")

    # Publication date
    date_el = item.find("pubDate")
    if date_el is None:
        date_el = item.find("atom:published", ns)
    if date_el is None:
        date_el = item.find("atom:updated", ns)
    pub_date = parse_date(date_el.text if date_el is not None and date_el.text else "")

    # Skip articles older than MAX_AGE_HOURS
    if pub_date:
        age = datetime.now(timezone.utc) - pub_date
        if age.total_seconds() > MAX_AGE_HOURS * 3600:
            return None
    else:
        # If no date, use now (better than skipping)
        pub_date = datetime.now(timezone.utc)

    # Categorise
    category = detect_category(title, description, default_cat)
    badge = detect_badge(title, description, category)
    headline = truncate(title, MAX_HEADLINE_LEN)
    excerpt = truncate(description, MAX_EXCERPT_LEN) if description else headline

    # Format dates
    date_display = pub_date.strftime("%d %b %Y")
    timestamp_iso = pub_date.strftime("%Y-%m-%dT%H:%M:%SZ")

    article_id = make_id(title, source_name, article_type)

    # Extract image
    image_url = extract_image(item)

    return {
        "id": article_id,
        "type": article_type,
        "category": category,
        "badge": badge,
        "headline": headline,
        "excerpt": excerpt,
        "source": source_name,
        "date": date_display,
        "timestamp": timestamp_iso,
        "url": article_url,
        "image": image_url,
    }


# ─── MAIN ─────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print(f"Information Hub News Pipeline — {datetime.now(SAST).strftime('%Y-%m-%d %H:%M SAST')}")
    print("=" * 60)

    # 1. Fetch existing articles from GitHub
    print("\n📥 Fetching existing articles from GitHub...")
    try:
        req = urllib.request.Request(API_URL, headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        })
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            sha = data["sha"]
            existing = json.loads(base64.b64decode(data["content"]).decode("utf-8"))
        articles = existing.get("articles", [])
        existing_ids = {a["id"] for a in articles}
        print(f"   Found {len(articles)} existing articles (sha: {sha[:8]})")
    except Exception as e:
        print(f"   ⚠ Could not fetch existing data: {e}")
        articles = []
        existing_ids = set()
        sha = None

    # 2. Fetch all RSS feeds
    print("\n📡 Fetching RSS feeds...")
    new_articles = []
    seen_headlines = {a.get("headline", "").lower() for a in articles}

    for feed_url, default_cat, source_name, article_type in FEEDS:
        print(f"   → {source_name} ({feed_url[:60]}...)")
        items = fetch_feed(feed_url)
        feed_count = 0

        for item in items[:10]:  # Max 10 per feed to keep balanced
            article = extract_item(item, default_cat, source_name, article_type)
            if article is None:
                continue
            # Filter out pure sports content (match reports, scores)
            if is_pure_sports(article["headline"], article["excerpt"]):
                print(f"       ✗ Filtered sports: {article['headline'][:50]}")
                continue
            # Filter out noise (lottery, weather, horoscopes, etc.)
            if is_noise(article["headline"], article["excerpt"]):
                print(f"       ✗ Filtered noise: {article['headline'][:50]}")
                continue
            # Deduplicate by ID and by similar headline
            headline_lower = article["headline"].lower()
            if article["id"] in existing_ids:
                continue
            if headline_lower in seen_headlines:
                continue
            # Check for very similar headlines (first 40 chars)
            prefix = headline_lower[:40]
            if any(h.startswith(prefix) for h in seen_headlines):
                continue

            new_articles.append(article)
            seen_headlines.add(headline_lower)
            existing_ids.add(article["id"])
            feed_count += 1

        print(f"     ✓ {feed_count} new articles")

    # 3. Ensure category balance
    print(f"\n📊 Total new articles: {len(new_articles)}")
    cat_counts = {}
    for a in new_articles:
        cat_counts[a["category"]] = cat_counts.get(a["category"], 0) + 1
    for cat, count in sorted(cat_counts.items()):
        print(f"   {cat}: {count}")

    # 4. Merge and push
    if new_articles:
        # Insert new at the top
        for a in reversed(new_articles):
            articles.insert(0, a)

        # Trim to max
        articles = articles[:MAX_ARTICLES]

        # Push to GitHub
        print(f"\n🚀 Pushing {len(new_articles)} new articles to GitHub...")
        payload = json.dumps({
            "last_updated": datetime.now(SAST).isoformat(),
            "articles": articles,
        }, indent=2)

        body = json.dumps({
            "message": f"Auto: Add {len(new_articles)} articles from RSS pipeline",
            "content": base64.b64encode(payload.encode()).decode(),
            "sha": sha,
        })

        try:
            req2 = urllib.request.Request(
                API_URL,
                data=body.encode(),
                headers={
                    "Authorization": f"Bearer {GITHUB_TOKEN}",
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                },
                method="PUT",
            )
            with urllib.request.urlopen(req2) as resp2:
                result = json.loads(resp2.read())
                print(f"   ✅ SUCCESS — Commit: {result['commit']['sha'][:8]}")
        except urllib.error.HTTPError as e:
            print(f"   ❌ GitHub push failed: {e.code} {e.read().decode()[:200]}")
    else:
        print("\n💤 No new articles to push this cycle.")

    print("\n" + "=" * 60)
    print("Pipeline complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()

