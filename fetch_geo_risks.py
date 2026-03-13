#!/usr/bin/env python3
"""fetch_geo_risks.py — Automated Geopolitical Risk Data Fetcher"""
import json, urllib.request, urllib.error, xml.etree.ElementTree as ET, re, os, base64
from datetime import datetime, timezone, timedelta

OUTPUT_FILE = "geo-risks.json"
GITHUB_TOKEN = os.environ.get("GH_TOKEN", "")
API_URL = "https://api.github.com/repos/jameslowebba-star/information-hub-data/contents/geo-risks.json"

RSS_FEEDS = [
    {"url": "https://feeds.reuters.com/Reuters/worldNews", "source": "Reuters", "weight": 3},
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "source": "BBC World", "weight": 2},
    {"url": "https://www.aljazeera.com/xml/rss/all.xml", "source": "Al Jazeera", "weight": 2},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "source": "NYT World", "weight": 2},
    {"url": "https://feeds.reuters.com/reuters/businessNews", "source": "Reuters Business", "weight": 1}
]

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

BASE_RISKS = [
    {"id":"middle-east","name":"Middle East Regional War","likelihood":"high","score":9.2,"description":"Regional conflict has escalated following U.S.-Israel 'Epic Fury' operation.","impacts":["Oil & Gas","Gold","Brent Crude","S&P 500","Defense Stocks"],"direction":"up","region":"Middle East","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"U.S.-Iran direct military engagement ongoing since Feb 28, 2026","impactOnPortfolio":{"positive":["Gold","Brent Crude","Defense Stocks"],"negative":["S&P 500","Emerging Market Equities"]}},
    {"id":"us-china","name":"U.S.\u2013China Strategic Competition","likelihood":"high","score":8.8,"description":"Technology decoupling accelerating. Semiconductor export controls tightened.","impacts":["Tech Stocks","Semiconductors","Bitcoin","USD/CNY","Taiwan ETFs"],"direction":"up","region":"Indo-Pacific","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"New U.S. semiconductor restrictions on China, March 2026","impactOnPortfolio":{"positive":["Gold","Bitcoin","Defense Stocks"],"negative":["Tech Stocks","Semiconductors","Taiwan ETFs"]}},
    {"id":"trade-war","name":"Global Trade Fragmentation","likelihood":"high","score":8.5,"description":"U.S. pursuing transactional foreign policy with broad tariff threats.","impacts":["S&P 500","Manufacturing","USD/ZAR","Emerging Markets","Commodities"],"direction":"up","region":"Global","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"U.S. tariff threats against multiple nations","impactOnPortfolio":{"positive":["Gold","USD"],"negative":["Emerging Markets","Manufacturing","Global Trade ETFs"]}},
    {"id":"russia-nato","name":"Russia\u2013NATO Confrontation","likelihood":"medium","score":7.6,"description":"Risk of miscalculation remains elevated. Ukraine war continues.","impacts":["European Equities","Natural Gas","Defense Stocks","EUR/USD","Gold"],"direction":"up","region":"Europe","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"Continued fighting in Ukraine, NATO Article 5 drills expanded","impactOnPortfolio":{"positive":["Defense Stocks","Gold","Natural Gas"],"negative":["European Equities","EUR/USD"]}},
    {"id":"cyber-warfare","name":"Major Cyber Attack","likelihood":"medium","score":7.2,"description":"State-sponsored cyber operations targeting critical infrastructure.","impacts":["Cybersecurity Stocks","Tech Stocks","Banking","Crypto Exchanges","Insurance"],"direction":"up","region":"Global","lastUpdated":"","source":"Stifel Dashboard","keyEvent":"Multiple state-sponsored attacks on European energy grids detected","impactOnPortfolio":{"positive":["Cybersecurity Stocks"],"negative":["Banking","Tech Stocks","Crypto Exchanges"]}},
    {"id":"energy-crisis","name":"Global Energy Disruption","likelihood":"high","score":8.1,"description":"Strait of Hormuz chokepoint under active threat.","impacts":["Brent Crude","Natural Gas","Energy Stocks","Airlines","Emerging Markets"],"direction":"up","region":"Global","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"Hormuz Strait shipping insurance premiums at record highs","impactOnPortfolio":{"positive":["Brent Crude","Energy Stocks","Natural Gas"],"negative":["Airlines","Manufacturing"]}},
    {"id":"western-alliance","name":"Western Alliance Fractures","likelihood":"medium","score":7.0,"description":"Transactional U.S. foreign policy straining traditional alliances.","impacts":["EUR/USD","NATO Defense ETFs","European Equities","USD","Treasury Bonds"],"direction":"up","region":"Transatlantic","lastUpdated":"","source":"BlackRock BGRI","keyEvent":"EU announces independent defense fund","impactOnPortfolio":{"positive":["European Defense Stocks","Gold"],"negative":["USD","U.S. Treasury Bonds"]}},
    {"id":"africa-instability","name":"African Political Instability","likelihood":"medium","score":6.8,"description":"Coup contagion in Sahel region. Resource nationalism rising.","impacts":["JSE All Share","USD/ZAR","Mining Stocks","Platinum","Rare Earth Minerals"],"direction":"up","region":"Africa","lastUpdated":"","source":"ZeroFox Intel","keyEvent":"Multiple Sahel nations restricting Western mining operations","impactOnPortfolio":{"positive":["Platinum","Rare Earth ETFs"],"negative":["JSE All Share","USD/ZAR"]}},
    {"id":"crypto-regulation","name":"Crypto Regulatory Crackdown","likelihood":"medium","score":6.5,"description":"Global regulatory frameworks tightening.","impacts":["Bitcoin","Ethereum","Exchange Tokens","DeFi","Stablecoins"],"direction":"down","region":"Global","lastUpdated":"","source":"J.P. Morgan GPR","keyEvent":"EU MiCA fully enforced","impactOnPortfolio":{"positive":["Regulated Crypto ETFs"],"negative":["Bitcoin","Altcoins","Exchange Tokens"]}},
    {"id":"debt-crisis","name":"Emerging Market Debt Crisis","likelihood":"medium","score":6.3,"description":"High USD rates straining EM debt sustainability.","impacts":["EM Bonds","USD/ZAR","EM Equities","Commodities","Gold"],"direction":"up","region":"Global","lastUpdated":"","source":"J.P. Morgan GPR","keyEvent":"Multiple frontier economies in IMF debt restructuring talks","impactOnPortfolio":{"positive":["Gold","USD","U.S. Treasury Bonds"],"negative":["EM Bonds","EM Equities","USD/ZAR"]}}
]

BASE_EVENTS = [
    {"date":"2026-03-18","event":"Fed FOMC Interest Rate Decision","risk":"trade-war","category":"economic"},
    {"date":"2026-03-20","event":"EU Emergency Defense Summit","risk":"western-alliance","category":"political"},
    {"date":"2026-03-25","event":"OPEC+ Emergency Production Meeting","risk":"energy-crisis","category":"economic"},
    {"date":"2026-04-01","event":"U.S.-China Trade Review Deadline","risk":"us-china","category":"economic"},
    {"date":"2026-04-10","event":"IMF Spring Meetings","risk":"debt-crisis","category":"economic"},
    {"date":"2026-04-15","event":"UN Security Council \u2014 Iran Resolution Vote","risk":"middle-east","category":"political"},
    {"date":"2026-04-22","event":"NATO Defense Ministers Meeting","risk":"russia-nato","category":"military"},
    {"date":"2026-05-01","event":"South Africa Budget Supplementary","risk":"africa-instability","category":"economic"},
    {"date":"2026-05-15","event":"EU Crypto Compliance Deadline (MiCA Phase 2)","risk":"crypto-regulation","category":"regulatory"},
    {"date":"2026-06-01","event":"G7 Summit \u2014 Trade & Security Agenda","risk":"trade-war","category":"political"},
    {"date":"2026-06-15","event":"PLA Anniversary \u2014 Taiwan Strait Watch","risk":"us-china","category":"military"},
    {"date":"2026-07-01","event":"African Union Mid-Year Summit","risk":"africa-instability","category":"political"}
]

def fetch_rss(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "InformationHub-GeoTracker/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            data = response.read()
        root = ET.fromstring(data)
        items = []
        for item in root.iter("item"):
            items.append({"title": item.findtext("title",""), "description": item.findtext("description",""), "link": item.findtext("link",""), "pubDate": item.findtext("pubDate","")})
        return items
    except Exception as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return []

def calculate_risk_mentions(articles):
    mentions = {risk_id: 0 for risk_id in RISK_KEYWORDS}
    for article in articles:
        text = (article.get("title","") + " " + article.get("description","")).lower()
        for risk_id, keywords in RISK_KEYWORDS.items():
            for kw in keywords:
                if kw in text:
                    mentions[risk_id] += article.get("weight", 1)
                    break
    return mentions

def adjust_scores(base_risks, mentions):
    total_mentions = sum(mentions.values()) or 1
    risks = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for risk in base_risks:
        r = dict(risk)
        r["lastUpdated"] = now
        risk_mentions = mentions.get(r["id"], 0)
        avg = total_mentions / len(mentions) if mentions else 1
        if avg > 0:
            attention = risk_mentions / avg
            adjustment = max(-0.5, min(0.5, (attention - 1) * 0.3))
            r["score"] = round(max(1.0, min(10.0, r["score"] + adjustment)), 1)
        if r["score"] >= 8.0: r["likelihood"] = "high"
        elif r["score"] >= 6.0: r["likelihood"] = "medium"
        else: r["likelihood"] = "low"
        r["newsAttention"] = risk_mentions
        risks.append(r)
    return risks

def main():
    print("[GeoTracker] Starting geopolitical risk data update...")
    all_articles = []
    for feed in RSS_FEEDS:
        print(f"  Fetching {feed['source']}...")
        items = fetch_rss(feed["url"])
        for item in items: item["weight"] = feed["weight"]
        all_articles.extend(items)
        print(f"    Got {len(items)} articles")
    print(f"\n  Total articles collected: {len(all_articles)}")
    mentions = calculate_risk_mentions(all_articles)
    risks = adjust_scores(BASE_RISKS, mentions)
    now = datetime.now(timezone.utc).date()
    events = [e for e in BASE_EVENTS if datetime.strptime(e["date"], "%Y-%m-%d").date() >= now]
    output = {"last_updated": datetime.now(timezone.utc).isoformat(), "total_articles_analyzed": len(all_articles), "risks": risks, "events": events}
    json_content = json.dumps(output, indent=2)
    with open(OUTPUT_FILE, "w") as f: f.write(json_content)
    print(f"\n[GeoTracker] Wrote {OUTPUT_FILE} with {len(risks)} risks and {len(events)} events")
    if not GITHUB_TOKEN:
        print("\n  [WARN] No GH_TOKEN \u2014 skipping GitHub push")
        return
    try:
        sha = None
        try:
            req = urllib.request.Request(API_URL, headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                sha = json.loads(resp.read()).get("sha")
        except urllib.error.HTTPError as e:
            if e.code != 404: raise
        encoded = base64.b64encode(json_content.encode()).decode()
        payload = {"message": f"[GeoTracker] Auto-update risk data \u2014 {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}", "content": encoded, "branch": "main"}
        if sha: payload["sha"] = sha
        req = urllib.request.Request(API_URL, data=json.dumps(payload).encode(), method="PUT", headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json", "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
            print(f"  [OK] Pushed to GitHub \u2014 commit: {result['commit']['sha'][:8]}")
    except Exception as e:
        print(f"  [ERR] GitHub push failed: {e}")

if __name__ == "__main__": main()