#!/usr/bin/env python3
"""
Information Hub — News Pipeline QA Checker
Runs 10 min after each news push (:25 past the hour).
Fetches the live feed, audits for sports leaks, noise, miscategorisation,
and push freshness. Sends a Telegram alert ONLY if problems are found.
"""

import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from collections import Counter
from datetime import datetime, timezone, timedelta

# ─── CONFIG ───────────────────────────────────────────────────────────

FEED_URL = (
    "https://cdn.jsdelivr.net/gh/jameslowebba-star/"
    "information-hub-data@main/latest-news.json"
)
PURGE_URL = (
    "https://purge.jsdelivr.net/gh/jameslowebba-star/"
    "information-hub-data@main/latest-news.json"
)

TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

MAX_STALE_MINUTES = 120  # flag if newest article is older than this

# ─── SPORTS KEYWORDS ─────────────────────────────────────────────────

SPORTS_KEYWORDS = [
    # Football — leagues & cups
    "premier league", "champions league", "la liga", "serie a",
    "bundesliga", "europa league", "carabao cup", "fa cup",
    "ligue 1", "eredivisie", "copa del rey", "coppa italia",
    "nedbank cup", "dstv premiership",
    # Football — clubs (international)
    "man city", "manchester city", "manchester united", "man united",
    "liverpool fc", "chelsea fc", "arsenal fc", "tottenham",
    "real madrid", "barcelona fc", "atletico madrid", "bayern munich",
    "juventus", "ac milan", "inter milan",
    "west ham", "everton", "aston villa", "newcastle united",
    # Football — SA clubs
    "kaizer chiefs", "orlando pirates", "mamelodi sundowns",
    "ts galaxy", "stellenbosch fc", "sekhukhune", "amazulu",
    "supersport united", "chippa united", "cape town city fc",
    "golden arrows", "moroka swallows", "polokwane city",
    "richards bay fc", "gallants", "millford fc", "royal am",
    # Football — match terms
    "hat-trick", "hat trick", "penalty kick", "red card",
    "yellow card", "clean sheet", "golden boot", "ballon d'or",
    "transfer window", "transfer deadline", "loan deal",
    "player ban", "unfair ban", "match ban",
    "mutually terminate", "sacked as manager",
    "gattuso", "mourinho",
    # Rugby
    "challenge cup", "united rugby", "currie cup", "european campaign",
    "stormers v ", "v stormers", "stormers to ",
    "sharks v ", "v sharks",
    "bulls v ", "v bulls", "bulls' effort",
    "toulon", "connacht", "leinster", "munster", "clermont", "la rochelle",
    "springbok", "springboks", "all blacks", "wallabies",
    "bok prop", "contract extension with stormers",
    "six nations", "rugby world cup",
    # Cricket
    "proteas women", "proteas men", "white ferns", "black caps",
    "cricket world cup", "t20 world", "test match",
    "series defeat", "series victory",
    # Tennis
    "tennis open", "grand slam", "wimbledon",
    # US leagues
    "super bowl",
    # Olympics / F1
    "olympics medal", "olympic games",
    "formula 1", "grand prix",
]

SPORTS_REGEX = [
    r"\bnba\b", r"\bnfl\b", r"\bnhl\b", r"\bmlb\b", r"\bf1 race\b",
    r"\bpsl\b",
]

# ─── NOISE KEYWORDS ──────────────────────────────────────────────────

NOISE_KEYWORDS = [
    # Gambling
    "powerball", "lotto", "lottery results",
    # Weather
    "weather forecast", "weather:", "weather alert",
    # Astrology
    "horoscope", "zodiac", "star sign",
    # Food / cooking
    "recipe of the day", "recipes:", "easter lamb cake",
    "jelly bean eyes", "buttercream", "rustic meal",
    # Cars / vehicle recalls
    "car review", "road test", "bakkies recalled", "vehicle recall",
    "fastest of the bunch", "volkswagen golf gti", "vw golf gti",
    "ford ranger bakki",
    # Lifestyle / relationships
    "soft-life aesthetic", "aesthetic is hot",
    "rethinking sex", "financially naked", "dating tips",
    "skincare routine", "beauty tips",
    "weight loss", "fitness routine",
    "home decor", "interior design",
    "gen z is rethinking",
    # Entertainment / celebrity
    "entertainment:", "celebrity gossip", "reality tv", "big brother",
    "turned heartbreak into music", "heartbreak into",
    "kanye west uk festival", "kanye west festival",
    # Animals / shelters
    "cat heaven", "cat rescue", "dog rescue", "animal shelter",
    "home to 22 rescues",
    # Science curiosities
    "rock-climbing fish", "shimmy up a",
    # Consumer recalls
    "pans sold at walmart", "burn hazard",
    # Urban planning fluff
    "swapped cars for bikes",
    # Misc
    "world marbles championship", "spelling bee",
    "razzie award", "razzie", "golden raspberry",
]

# ─── FINANCE CONTAMINATION SIGNALS ───────────────────────────────────

FINANCE_RED_FLAGS = [
    "pope", "earthquake", "nasa", "moon mission", "artemis",
    "space station", "astronaut", "mafia", "murder", "serial killer",
    "celebrity", "kardashian", "festival", "concert",
    "football rally", "soccer", "rugby",
]

# ─── HELPER FUNCTIONS ─────────────────────────────────────────────────


def fetch_feed():
    """Fetch the live news JSON from jsDelivr (with cache-bust)."""
    try:
        urllib.request.urlopen(PURGE_URL, timeout=10)
    except Exception:
        pass
    time.sleep(2)

    url = f"{FEED_URL}?t={int(time.time())}"
    req = urllib.request.Request(url, headers={"User-Agent": "InformationHub-QA/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except Exception as e:
        return {"error": str(e)}


def check_sports(articles):
    """Return list of sports articles that slipped through."""
    leaks = []
    for a in articles:
        text = f"{a.get('headline', '')} {a.get('excerpt', '')}".lower()
        found = False
        for kw in SPORTS_KEYWORDS:
            if kw in text:
                leaks.append((a, kw))
                found = True
                break
        if not found:
            for pattern in SPORTS_REGEX:
                if re.search(pattern, text):
                    leaks.append((a, pattern))
                    break
    return leaks


def check_noise(articles):
    """Return list of noise/lifestyle articles that slipped through."""
    leaks = []
    for a in articles:
        text = f"{a.get('headline', '')} {a.get('excerpt', '')}".lower()
        for kw in NOISE_KEYWORDS:
            if kw in text:
                leaks.append((a, kw))
                break
    return leaks


def check_finance_contamination(articles):
    """Return finance-tab articles that don't belong."""
    issues = []
    finance_articles = [a for a in articles if a.get("category") == "finance"]
    for a in finance_articles:
        text = f"{a.get('headline', '')} {a.get('excerpt', '')}".lower()
        for flag in FINANCE_RED_FLAGS:
            if flag in text:
                issues.append((a, flag))
                break
    return issues


def check_freshness(articles):
    """Check if the feed was recently updated."""
    now = datetime.now(timezone.utc)
    newest = None
    for a in articles:
        ts = a.get("published") or a.get("timestamp") or a.get("date", "")
        if not ts:
            continue
        try:
            dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            if newest is None or dt > newest:
                newest = dt
        except (ValueError, TypeError):
            pass
    if newest is None:
        return "⚠️ Could not determine feed freshness (no timestamps found)"
    age = now - newest
    age_minutes = age.total_seconds() / 60
    if age_minutes > MAX_STALE_MINUTES:
        return (
            f"⚠️ Feed is STALE — newest article is {int(age_minutes)} min old "
            f"(threshold: {MAX_STALE_MINUTES} min). Pipeline may have failed."
        )
    return None


def send_telegram(message):
    """Send alert via Telegram bot."""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        print(f"[QA] No Telegram credentials — printing alert:")
        print(message)
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            if result.get("ok"):
                print("[QA] Telegram alert sent.")
                return True
            else:
                print(f"[QA] Telegram error: {result}")
                return False
    except Exception as e:
        print(f"[QA] Telegram failed: {e}")
        return False


# ─── MAIN ─────────────────────────────────────────────────────────────


def main():
    now_utc = datetime.now(timezone.utc)
    sast = timezone(timedelta(hours=2))
    now_sast = now_utc.astimezone(sast)
    print(f"[QA] Information Hub QA Checker — {now_sast.strftime('%Y-%m-%d %H:%M SAST')}")
    print(f"[QA] Fetching live feed...")

    data = fetch_feed()

    # Handle fetch errors
    if isinstance(data, dict) and "error" in data:
        send_telegram(
            "🚨 <b>Information Hub — Pipeline FAILURE</b>\n\n"
            f"Failed to fetch live feed.\n"
            f"Error: {data['error']}\n\n"
            f"The news pipeline may be down."
        )
        sys.exit(1)

    # Parse articles
    articles = data if isinstance(data, list) else data.get("articles", [])
    if not articles:
        send_telegram(
            "🚨 <b>Information Hub — Feed EMPTY</b>\n\n"
            "The live feed returned 0 articles.\n"
            "Pipeline may have failed."
        )
        sys.exit(1)

    print(f"[QA] Found {len(articles)} articles")

    # Category counts
    cats = Counter(a.get("category", "unknown") for a in articles)
    cat_lines = [f"  {cat}: {count}" for cat, count in sorted(cats.items(), key=lambda x: -x[1])]
    cat_summary = "\n".join(cat_lines)
    print(f"[QA] Categories:\n{cat_summary}")

    # Run all checks
    issues = []

    # 1. Freshness
    stale = check_freshness(articles)
    if stale:
        issues.append(stale)
        print(f"[QA] {stale}")

    # 2. Sports leaks
    sports = check_sports(articles)
    if sports:
        issues.append(f"\n🏟️ <b>Sports leaks ({len(sports)}):</b>")
        for a, kw in sports:
            issues.append(f"  • [{a.get('category', '?')}] {a.get('headline', '')[:55]}")
        print(f"[QA] Found {len(sports)} sports leaks")

    # 3. Noise leaks
    noise = check_noise(articles)
    if noise:
        issues.append(f"\n🗑️ <b>Noise leaks ({len(noise)}):</b>")
        for a, kw in noise:
            issues.append(f"  • [{a.get('category', '?')}] {a.get('headline', '')[:55]}")
        print(f"[QA] Found {len(noise)} noise leaks")

    # 4. Finance contamination
    finance_issues = check_finance_contamination(articles)
    if finance_issues:
        issues.append(f"\n💰 <b>Finance tab contamination ({len(finance_issues)}):</b>")
        for a, flag in finance_issues:
            issues.append(f"  • {a.get('headline', '')[:55]} (flag: {flag})")
        print(f"[QA] Found {len(finance_issues)} finance contamination issues")

    # 5. Report
    if issues:
        header = (
            f"⚠️ <b>Information Hub — QA Alert</b>\n"
            f"🕐 {now_sast.strftime('%H:%M SAST · %d %b %Y')}\n\n"
            f"<b>Feed:</b> {len(articles)} articles\n"
            f"<b>Breakdown:</b>\n{cat_summary}\n"
        )
        body = header + "\n".join(issues)
        body += "\n\n—\n<i>Automated QA · Hourly at :25</i>"

        send_telegram(body)
        print(f"[QA] ALERT SENT — {len(issues)} issue line(s)")
        sys.exit(1)
    else:
        print("[QA] ✅ All clear — no issues found")
        sys.exit(0)


if __name__ == "__main__":
    main()
