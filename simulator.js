/* Safe storage wrapper — fallback for sandboxed environments */
var safeStorage=(function(){try{safeStorage.setItem("__t","1");safeStorage.removeItem("__t");return safeStorage;}catch(e){var m={};return{getItem:function(k){return m[k]||null;},setItem:function(k,v){m[k]=String(v);},removeItem:function(k){delete m[k];}};}})();
// simulator.js — Scenario Simulator Interactive Tool
(function() {
  'use strict';

  /* ─── SCENARIO DATABASE ─── */
  var SCENARIOS = [
    {
      id: 'hormuz',
      name: 'Strait of Hormuz Closure (60 Days)',
      shortName: 'Hormuz Closure',
      risk: 'CRITICAL',
      desc: 'Iran closes the Strait of Hormuz for 60 days, blocking ~21% of global daily oil transit. Energy markets spike, supply chains fracture, and emerging markets face import-cost shock.',
      context: 'The Strait of Hormuz is the world\'s most critical oil chokepoint. Goldman Sachs estimates a $14/barrel premium for just a 4-week halt. A 60-day closure would be catastrophic for global energy markets, triggering cascading effects across all asset classes. MSCI World already dropped 2.8% in just 2 weeks during the March 2026 disruption threat.',
      sources: 'Goldman Sachs Research (Mar 2026), MSCI World Index Data, Stimson Center Analysis, Bloomberg Commodity Research',
      icon: 'oil',
      assets: [
        { name: 'Oil / Brent Crude', direction: 'up', rangeMin: 25, rangeMax: 40, confidence: 'HIGH', rationale: 'Goldman estimates $14/bbl premium for 4-week halt; 60 days far worse' },
        { name: 'Gold', direction: 'up', rangeMin: 10, rangeMax: 18, confidence: 'HIGH', rationale: 'Safe-haven surge, already elevated at $5,100+/oz' },
        { name: 'S&P 500', direction: 'down', rangeMin: -15, rangeMax: -8, confidence: 'HIGH', rationale: 'MSCI World down 2.8% in just 2 weeks of threat' },
        { name: 'NASDAQ', direction: 'down', rangeMin: -15, rangeMax: -10, confidence: 'MEDIUM', rationale: 'Tech supply chains disrupted by energy costs' },
        { name: 'USD/ZAR (Rand)', direction: 'down', rangeMin: -12, rangeMax: -8, confidence: 'HIGH', rationale: 'SA is oil-import dependent; rand already vulnerable at R16.50' },
        { name: 'Bitcoin (BTC)', direction: 'down', rangeMin: -15, rangeMax: -5, confidence: 'MEDIUM', rationale: 'Initial risk-off, potential safe-haven recovery later' },
        { name: 'Gold Miners (SA)', direction: 'up', rangeMin: 8, rangeMax: 20, confidence: 'MEDIUM', rationale: 'Gold miners up, but higher input costs hurt base metals' },
        { name: 'Defense Stocks', direction: 'up', rangeMin: 10, rangeMax: 20, confidence: 'HIGH', rationale: 'Military escalation drives defense sector demand' }
      ],
      portfolioMap: {
        oil_energy: { impact: '+25% to +40%', direction: 'up' },
        gold: { impact: '+10% to +18%', direction: 'up' },
        silver_pgms: { impact: '+5% to +12%', direction: 'up' },
        us_broad: { impact: '-8% to -15%', direction: 'down' },
        us_tech: { impact: '-10% to -15%', direction: 'down' },
        sa_stocks: { impact: 'Mixed', direction: 'mixed' },
        emerging: { impact: '-10% to -18%', direction: 'down' },
        bitcoin: { impact: '-5% to -15%', direction: 'down' },
        ethereum: { impact: '-8% to -18%', direction: 'down' },
        altcoins: { impact: '-10% to -25%', direction: 'down' },
        bonds: { impact: '+2% to +5%', direction: 'up' },
        real_estate: { impact: '-3% to -8%', direction: 'down' },
        cash: { impact: 'Stable', direction: 'mixed' },
        stablecoins: { impact: 'Stable', direction: 'mixed' },
        european: { impact: '-8% to -14%', direction: 'down' },
        chinese: { impact: '-5% to -10%', direction: 'down' },
        rare_earths: { impact: '+5% to +10%', direction: 'up' }
      }
    },
    {
      id: 'taiwan',
      name: 'Taiwan Strait Blockade',
      shortName: 'Taiwan Blockade',
      risk: 'CRITICAL',
      desc: 'China imposes a naval blockade on Taiwan, disrupting 92% of advanced semiconductor supply and triggering a potential $10T+ global GDP hit.',
      context: 'Taiwan produces 92% of the world\'s most advanced semiconductors (sub-7nm). A blockade would devastate global tech supply chains, potentially wiping $1.6 trillion in semiconductor revenue. Bloomberg Economics estimates the global GDP impact could exceed $10 trillion — dwarfing any previous economic disruption. This is the single highest-impact tail risk in global markets.',
      sources: 'Rhodium Group (2026), Bloomberg Economics, NYT/SIA Semiconductor Analysis, TSMC Production Data',
      icon: 'chip',
      assets: [
        { name: 'NASDAQ / Tech', direction: 'down', rangeMin: -35, rangeMax: -20, confidence: 'HIGH', rationale: '92% of advanced chips at risk, $1.6T revenue exposed' },
        { name: 'S&P 500', direction: 'down', rangeMin: -20, rangeMax: -12, confidence: 'HIGH', rationale: 'Bloomberg estimates $10T+ global GDP hit' },
        { name: 'Gold', direction: 'up', rangeMin: 15, rangeMax: 25, confidence: 'HIGH', rationale: 'Massive safe-haven flow into physical gold' },
        { name: 'Bitcoin (BTC)', direction: 'down', rangeMin: -25, rangeMax: -15, confidence: 'MEDIUM', rationale: 'Severe risk-off environment; not yet an established safe haven' },
        { name: 'USD Index', direction: 'up', rangeMin: 5, rangeMax: 10, confidence: 'HIGH', rationale: 'Dollar strengthens as global safe-haven currency' },
        { name: 'Emerging Markets', direction: 'down', rangeMin: -25, rangeMax: -15, confidence: 'HIGH', rationale: 'Capital flight from EM to safe havens (USD, gold, Treasuries)' },
        { name: 'Chinese Equities', direction: 'down', rangeMin: -30, rangeMax: -15, confidence: 'MEDIUM', rationale: 'Sanctions, capital controls, and investor exodus' },
        { name: 'Rare Earths', direction: 'up', rangeMin: 30, rangeMax: 60, confidence: 'HIGH', rationale: 'China controls 80-90% of refining; total supply disruption' }
      ],
      portfolioMap: {
        us_tech: { impact: '-20% to -35%', direction: 'down' },
        us_broad: { impact: '-12% to -20%', direction: 'down' },
        gold: { impact: '+15% to +25%', direction: 'up' },
        bitcoin: { impact: '-15% to -25%', direction: 'down' },
        ethereum: { impact: '-20% to -30%', direction: 'down' },
        altcoins: { impact: '-25% to -40%', direction: 'down' },
        emerging: { impact: '-15% to -25%', direction: 'down' },
        chinese: { impact: '-15% to -30%', direction: 'down' },
        european: { impact: '-10% to -18%', direction: 'down' },
        sa_stocks: { impact: '-8% to -15%', direction: 'down' },
        bonds: { impact: '+5% to +10%', direction: 'up' },
        rare_earths: { impact: '+30% to +60%', direction: 'up' },
        silver_pgms: { impact: '+8% to +15%', direction: 'up' },
        oil_energy: { impact: '+5% to +15%', direction: 'up' },
        real_estate: { impact: '-5% to -12%', direction: 'down' },
        cash: { impact: 'USD strengthens', direction: 'up' },
        stablecoins: { impact: 'Peg risk elevated', direction: 'down' }
      }
    },
    {
      id: 'rand',
      name: 'Rand Crash to R22/USD',
      shortName: 'Rand Crash',
      risk: 'HIGH',
      desc: 'The South African rand collapses to R22/$, driven by capital flight, political instability, and emerging market contagion.',
      context: 'The rand already saw a 2.3% single-day drop during the March 2026 risk-off events. A crash to R22/USD (from ~R16.50) would represent a ~33% depreciation, devastating import-dependent sectors while creating windfall gains for ZAR-denominated gold and crypto holders. SA bond yields would spike as foreign investors flee, creating a self-reinforcing crisis.',
      sources: 'Reuters FX Analysis (Mar 2026), IMF South Africa Article IV, BusinessTech Economic Data, SARB Policy Reports',
      icon: 'currency',
      assets: [
        { name: 'JSE / SA Equities', direction: 'down', rangeMin: -18, rangeMax: -10, confidence: 'HIGH', rationale: 'SA equities drop in USD terms despite ZAR revenue boost' },
        { name: 'Gold (in ZAR)', direction: 'up', rangeMin: 30, rangeMax: 45, confidence: 'HIGH', rationale: 'Double benefit — global gold price + rand conversion gain' },
        { name: 'SA Government Bonds', direction: 'down', rangeMin: -8, rangeMax: -4, confidence: 'HIGH', rationale: 'Yields spike 150-250bps as foreign investors exit' },
        { name: 'SA Property / REITs', direction: 'down', rangeMin: -25, rangeMax: -15, confidence: 'HIGH', rationale: 'Rate-sensitive sector crushed by emergency rate hikes' },
        { name: 'BTC (in ZAR)', direction: 'up', rangeMin: 20, rangeMax: 35, confidence: 'MEDIUM', rationale: 'Crypto as rand hedge — locals flee to BTC/stablecoins' },
        { name: 'Import Costs', direction: 'up', rangeMin: 25, rangeMax: 35, confidence: 'HIGH', rationale: 'Fuel, food, electronics — all priced in dollars' },
        { name: 'Gold Miners (JSE)', direction: 'up', rangeMin: 20, rangeMax: 35, confidence: 'HIGH', rationale: 'Revenue in USD/ZAR, costs in weakened rand' },
        { name: 'Stablecoins (USDT/USDC)', direction: 'up', rangeMin: 25, rangeMax: 35, confidence: 'HIGH', rationale: 'Dollar-pegged stablecoins surge in ZAR value' }
      ],
      portfolioMap: {
        sa_stocks: { impact: '-10% to -18% (USD)', direction: 'down' },
        gold: { impact: '+30% to +45% (ZAR)', direction: 'up' },
        silver_pgms: { impact: '+15% to +25% (ZAR)', direction: 'up' },
        bonds: { impact: '-4% to -8%', direction: 'down' },
        real_estate: { impact: '-15% to -25%', direction: 'down' },
        bitcoin: { impact: '+20% to +35% (ZAR)', direction: 'up' },
        ethereum: { impact: '+15% to +30% (ZAR)', direction: 'up' },
        altcoins: { impact: '+10% to +25% (ZAR)', direction: 'up' },
        stablecoins: { impact: '+25% to +35% (ZAR)', direction: 'up' },
        us_tech: { impact: '+25% to +33% (ZAR)', direction: 'up' },
        us_broad: { impact: '+25% to +33% (ZAR)', direction: 'up' },
        emerging: { impact: '-5% to -12%', direction: 'down' },
        cash: { impact: '-25% purchasing power', direction: 'down' },
        oil_energy: { impact: '+25% to +35% (ZAR)', direction: 'up' },
        european: { impact: '+20% to +30% (ZAR)', direction: 'up' },
        chinese: { impact: '+15% to +25% (ZAR)', direction: 'up' },
        rare_earths: { impact: '+25% to +35% (ZAR)', direction: 'up' }
      }
    },
    {
      id: 'crypto_crackdown',
      name: 'Global Crypto Crackdown',
      shortName: 'Crypto Crackdown',
      risk: 'HIGH',
      desc: 'Coordinated global regulatory crackdown on crypto — exchanges restricted, DeFi protocols targeted, and mandatory reporting under OECD CARF framework.',
      context: 'The OECD\'s Crypto-Asset Reporting Framework (CARF) is being adopted by 50+ countries, with the EU\'s MiCA regulation already enforced. A coordinated crackdown would mean exchange shutdowns in key jurisdictions, DeFi protocol restrictions, and mandatory KYC across all on-ramps. This would trigger a severe liquidity crisis in crypto markets while pushing capital back into traditional finance.',
      sources: 'OECD CARF Framework (2025), EU MiCA Regulation, SEC Enforcement Actions 2025-2026, BIS Crypto Report',
      icon: 'lock',
      assets: [
        { name: 'Bitcoin (BTC)', direction: 'down', rangeMin: -45, rangeMax: -30, confidence: 'HIGH', rationale: 'Exchange restrictions and reporting requirements crush liquidity' },
        { name: 'Ethereum (ETH)', direction: 'down', rangeMin: -50, rangeMax: -35, confidence: 'HIGH', rationale: 'DeFi protocols most targeted by regulation' },
        { name: 'Altcoins (SOL, etc.)', direction: 'down', rangeMin: -60, rangeMax: -40, confidence: 'HIGH', rationale: 'Smaller tokens face existential regulatory risk' },
        { name: 'Gold', direction: 'up', rangeMin: 3, rangeMax: 8, confidence: 'MEDIUM', rationale: 'Alternative store of value benefits from crypto exodus' },
        { name: 'Traditional Equities', direction: 'up', rangeMin: 2, rangeMax: 5, confidence: 'LOW', rationale: 'Capital flows back to regulated markets' },
        { name: 'Stablecoins', direction: 'down', rangeMin: -5, rangeMax: -1, confidence: 'MEDIUM', rationale: 'Disrupted but survive with proper licensing' },
        { name: 'Crypto Exchange Stocks', direction: 'down', rangeMin: -40, rangeMax: -25, confidence: 'HIGH', rationale: 'Coinbase, Binance face operational restrictions' },
        { name: 'Bank Stocks', direction: 'up', rangeMin: 2, rangeMax: 6, confidence: 'LOW', rationale: 'Banks regain monopoly on financial services' }
      ],
      portfolioMap: {
        bitcoin: { impact: '-30% to -45%', direction: 'down' },
        ethereum: { impact: '-35% to -50%', direction: 'down' },
        altcoins: { impact: '-40% to -60%', direction: 'down' },
        stablecoins: { impact: '-1% to -5%', direction: 'down' },
        gold: { impact: '+3% to +8%', direction: 'up' },
        us_broad: { impact: '+2% to +5%', direction: 'up' },
        us_tech: { impact: '+1% to +4%', direction: 'up' },
        sa_stocks: { impact: '+1% to +3%', direction: 'up' },
        bonds: { impact: '+1% to +3%', direction: 'up' },
        real_estate: { impact: 'Neutral', direction: 'mixed' },
        cash: { impact: 'Stable', direction: 'mixed' },
        emerging: { impact: 'Neutral', direction: 'mixed' },
        european: { impact: '+1% to +3%', direction: 'up' },
        chinese: { impact: 'Neutral', direction: 'mixed' },
        oil_energy: { impact: 'Neutral', direction: 'mixed' },
        silver_pgms: { impact: '+1% to +3%', direction: 'up' },
        rare_earths: { impact: 'Neutral', direction: 'mixed' }
      }
    },
    {
      id: 'gold_surge',
      name: 'Gold Surge to $6,000/oz',
      shortName: 'Gold to $6K',
      risk: 'ELEVATED',
      desc: 'Gold rallies to $6,000/oz driven by central bank buying, de-dollarization, and persistent macro uncertainty. Mining stocks explode higher.',
      context: 'Gold has already surged past $5,100/oz in 2026, with central banks buying at record pace. JPMorgan and Deutsche Bank have both flagged $6,000 as achievable within 12-18 months. AuAg Funds notes the gold-silver ratio at extreme levels suggests silver is due for a catch-up rally. Mining stocks would see massive operational leverage — a 30% gold price increase translates to 50-80% earnings growth for efficient miners.',
      sources: 'JPMorgan Precious Metals Research (2026), Deutsche Bank Commodities, AuAg Funds Analysis, MarketWatch Gold Outlook',
      icon: 'gold',
      assets: [
        { name: 'Gold', direction: 'up', rangeMin: 15, rangeMax: 20, confidence: 'HIGH', rationale: 'Already at target — central banks + de-dollarization driving demand' },
        { name: 'Gold Miners', direction: 'up', rangeMin: 50, rangeMax: 80, confidence: 'HIGH', rationale: 'Operational leverage — costs fixed, revenue up 30%+' },
        { name: 'Silver', direction: 'up', rangeMin: 25, rangeMax: 40, confidence: 'MEDIUM', rationale: 'Gold-silver ratio compression from extreme levels' },
        { name: 'USD Index', direction: 'down', rangeMin: -8, rangeMax: -5, confidence: 'MEDIUM', rationale: 'Inverse correlation with gold reasserts' },
        { name: 'EM Currencies', direction: 'up', rangeMin: 3, rangeMax: 7, confidence: 'LOW', rationale: 'Weaker dollar helps emerging market FX' },
        { name: 'Equities (Broad)', direction: 'mixed', rangeMin: -3, rangeMax: 3, confidence: 'LOW', rationale: 'Mixed — defensive sectors up, growth flat to down' },
        { name: 'Bitcoin (BTC)', direction: 'up', rangeMin: 5, rangeMax: 15, confidence: 'LOW', rationale: 'Alternative assets correlate in macro uncertainty' },
        { name: 'SA Mining Stocks', direction: 'up', rangeMin: 40, rangeMax: 70, confidence: 'HIGH', rationale: 'SA gold miners benefit disproportionately from ZAR costs' }
      ],
      portfolioMap: {
        gold: { impact: '+15% to +20%', direction: 'up' },
        silver_pgms: { impact: '+25% to +40%', direction: 'up' },
        sa_stocks: { impact: '+10% to +25%', direction: 'up' },
        us_broad: { impact: '-3% to +3%', direction: 'mixed' },
        us_tech: { impact: '-5% to +2%', direction: 'mixed' },
        bitcoin: { impact: '+5% to +15%', direction: 'up' },
        ethereum: { impact: '+3% to +10%', direction: 'up' },
        altcoins: { impact: '+2% to +8%', direction: 'up' },
        emerging: { impact: '+3% to +7%', direction: 'up' },
        bonds: { impact: '+1% to +3%', direction: 'up' },
        real_estate: { impact: '+2% to +5%', direction: 'up' },
        cash: { impact: 'USD weakens', direction: 'down' },
        stablecoins: { impact: 'USD weakens', direction: 'down' },
        european: { impact: '+2% to +5%', direction: 'up' },
        chinese: { impact: '+1% to +4%', direction: 'up' },
        oil_energy: { impact: 'Neutral', direction: 'mixed' },
        rare_earths: { impact: '+5% to +10%', direction: 'up' }
      }
    },
    {
      id: 'decoupling',
      name: 'US-China Full Decoupling',
      shortName: 'US-China Split',
      risk: 'CRITICAL',
      desc: 'Complete economic separation between the US and China — full trade embargo, tech ban, financial decoupling, and rare earth supply cutoff.',
      context: 'Cambridge Associates warns that full decoupling would restructure the entire global economy into competing blocs. China controls 70% of rare earth mining and 90% of refining — a cutoff would cripple defense, EV, and electronics supply chains for years. South African miners (platinum, manganese, chromium) would become critical alternative suppliers, driving a commodity supercycle for SA-listed miners.',
      sources: 'Cambridge Associates (2026), Morgan Lewis Trade Analysis, USGS Rare Earth Data, S&P Global Supply Chain Intelligence',
      icon: 'split',
      assets: [
        { name: 'NASDAQ / Tech', direction: 'down', rangeMin: -25, rangeMax: -15, confidence: 'HIGH', rationale: 'Tech supply chain disruption across semiconductors and hardware' },
        { name: 'Chinese Equities', direction: 'down', rangeMin: -35, rangeMax: -20, confidence: 'HIGH', rationale: 'Capital controls, sanctions, and market isolation' },
        { name: 'Rare Earth Prices', direction: 'up', rangeMin: 40, rangeMax: 80, confidence: 'HIGH', rationale: 'China controls 80-90% of refining; no short-term alternatives' },
        { name: 'Gold', direction: 'up', rangeMin: 10, rangeMax: 15, confidence: 'HIGH', rationale: 'Safe-haven demand during unprecedented economic disruption' },
        { name: 'SA Mining (Pt, Mn)', direction: 'up', rangeMin: 15, rangeMax: 30, confidence: 'MEDIUM', rationale: 'SA becomes alternative critical mineral supplier' },
        { name: 'Bitcoin (BTC)', direction: 'mixed', rangeMin: -5, rangeMax: 5, confidence: 'LOW', rationale: 'Uncertain — mixed signals, potential capital controls' },
        { name: 'Defense Stocks', direction: 'up', rangeMin: 15, rangeMax: 25, confidence: 'HIGH', rationale: 'Military buildup on both sides drives defense spending' },
        { name: 'Emerging Markets', direction: 'down', rangeMin: -20, rangeMax: -10, confidence: 'MEDIUM', rationale: 'Caught between blocs; trade disruption + capital flight' }
      ],
      portfolioMap: {
        us_tech: { impact: '-15% to -25%', direction: 'down' },
        chinese: { impact: '-20% to -35%', direction: 'down' },
        rare_earths: { impact: '+40% to +80%', direction: 'up' },
        gold: { impact: '+10% to +15%', direction: 'up' },
        sa_stocks: { impact: '+15% to +30%', direction: 'up' },
        bitcoin: { impact: '-5% to +5%', direction: 'mixed' },
        ethereum: { impact: '-8% to +3%', direction: 'mixed' },
        altcoins: { impact: '-10% to +2%', direction: 'mixed' },
        us_broad: { impact: '-10% to -18%', direction: 'down' },
        emerging: { impact: '-10% to -20%', direction: 'down' },
        european: { impact: '-8% to -15%', direction: 'down' },
        silver_pgms: { impact: '+10% to +20%', direction: 'up' },
        oil_energy: { impact: '+5% to +12%', direction: 'up' },
        bonds: { impact: '+3% to +8%', direction: 'up' },
        real_estate: { impact: '-5% to -10%', direction: 'down' },
        cash: { impact: 'USD strengthens', direction: 'up' },
        stablecoins: { impact: 'Stable', direction: 'mixed' }
      }
    }
  ];

  /* ─── SVG ICONS ─── */
  var ICONS = {
    oil: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M2 22h20"/></svg>',
    chip: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    currency: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    gold: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    split: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    table: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
    portfolio: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
    deepdive: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    simulator: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  };

  /* ─── STATE ─── */
  var currentView = 'grid'; // 'grid', 'gate', 'detail'
  var selectedScenario = null;
  var scenariosViewed = 0;
  var simRoot = document.getElementById('simulatorApp');
  if (!simRoot) return;

  /* ─── HELPERS ─── */
  function checkEmailCaptured() {
    try {
      var keys = ['ih_quiz_data', 'ih_advisor_data', 'ih_checker_data', 'ih_simulator_data'];
      for (var i = 0; i < keys.length; i++) {
        var d = safeStorage.getItem(keys[i]);
        if (d) {
          var p = JSON.parse(d);
          if (p.emailCaptured) return true;
        }
      }
    } catch(e) {}
    return false;
  }

  function getPortfolioData() {
    try {
      var data = safeStorage.getItem('ih_checker_data');
      if (data) return JSON.parse(data);
    } catch(e) {}
    return null;
  }

  function getAssetName(id) {
    var nameMap = {
      us_tech: 'US Tech', us_broad: 'US Broad Market', chinese: 'Chinese Stocks',
      european: 'European Stocks', sa_stocks: 'SA Stocks', emerging: 'Emerging Markets',
      bitcoin: 'Bitcoin (BTC)', ethereum: 'Ethereum (ETH)', altcoins: 'Altcoins',
      stablecoins: 'Stablecoins', gold: 'Gold', silver_pgms: 'Silver / PGMs',
      oil_energy: 'Oil & Energy', rare_earths: 'Rare Earths', bonds: 'Government Bonds',
      real_estate: 'Real Estate', cash: 'Cash / Money Market'
    };
    return nameMap[id] || id;
  }

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ─── RENDER ROUTER ─── */
  function render() {
    if (currentView === 'grid') {
      renderGrid();
    } else if (currentView === 'gate') {
      renderGate();
    } else if (currentView === 'detail') {
      renderDetail();
    }
  }

  /* ─── GRID VIEW ─── */
  function renderGrid() {
    var html = '';

    // Header
    html += '<div class="sim-header">' +
      '<div class="sim-header-icon">' + ICONS.simulator + '</div>' +
      '<h2 class="sim-header-title">Scenario Simulator</h2>' +
      '<p class="sim-header-sub">Select a geopolitical scenario to see projected impacts across asset classes, powered by research from Goldman Sachs, Bloomberg, Rhodium Group, and more.</p>' +
      '</div>';

    // Grid
    html += '<div class="sim-grid">';
    for (var i = 0; i < SCENARIOS.length; i++) {
      var s = SCENARIOS[i];
      var riskClass = 'sim-risk-' + s.risk.toLowerCase();
      html += '<div class="sim-card" data-scenario="' + i + '">' +
        '<div class="sim-card-top">' +
        '<div class="sim-card-icon">' + ICONS[s.icon] + '</div>' +
        '<span class="sim-risk-badge ' + riskClass + '">' + s.risk + '</span>' +
        '</div>' +
        '<h3 class="sim-card-name">' + escHtml(s.shortName) + '</h3>' +
        '<p class="sim-card-desc">' + escHtml(s.desc) + '</p>' +
        '<div class="sim-card-footer">' +
        '<span class="sim-card-assets">' + s.assets.length + ' assets analyzed</span>' +
        '<span class="sim-card-arrow">Simulate &rarr;</span>' +
        '</div>' +
        '</div>';
    }
    html += '</div>';

    simRoot.innerHTML = html;

    // Bind card clicks
    var cards = simRoot.querySelectorAll('.sim-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-scenario'));
        selectedScenario = SCENARIOS[idx];
        scenariosViewed++;

        // Check if we should gate
        if (scenariosViewed >= 2 && !checkEmailCaptured()) {
          currentView = 'gate';
        } else {
          currentView = 'detail';
        }
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ─── EMAIL GATE ─── */
  function renderGate() {
    var html = '<div class="sim-detail">' +
      '<button class="sim-detail-back" id="simBackFromGate">' + ICONS.back + ' Back to scenarios</button>' +
      '</div>';

    html += '<div class="sim-gate">' +
      '<div class="sim-gate-icon">' + ICONS.shield + '</div>' +
      '<h2>Unlock Scenario Analysis</h2>' +
      '<p>You\u2019ve explored multiple scenarios. Enter your email to continue accessing detailed projections.</p>' +
      '<form class="sim-gate-form" id="simGateForm">' +
      '<input type="email" class="sim-gate-input" id="simEmail" placeholder="you@email.com" required autocomplete="email">' +
      '<button type="submit" class="sim-btn sim-btn-primary">Continue</button>' +
      '</form>' +
      '<button class="sim-gate-skip" id="simSkip">Skip \u2014 just show me</button>' +
      '<p class="sim-gate-fine">No spam. Unsubscribe anytime.</p>' +
      '</div>';

    simRoot.innerHTML = html;

    document.getElementById('simBackFromGate').addEventListener('click', function() {
      currentView = 'grid';
      render();
    });

    document.getElementById('simSkip').addEventListener('click', function() {
      currentView = 'detail';
      render();
    });

    document.getElementById('simGateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('simEmail').value;
      if (!email) return;

      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Loading\u2026';
      btn.disabled = true;

      fetch('https://formspree.io/f/xgoneypk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          _subject: 'Scenario Simulator \u2014 New Lead',
          tool: 'Scenario Simulator'
        })
      }).then(function() {
        try {
          safeStorage.setItem('ih_simulator_data', JSON.stringify({ emailCaptured: true, timestamp: new Date().toISOString() }));
        } catch(ex) {}
        currentView = 'detail';
        render();
      }).catch(function() {
        currentView = 'detail';
        render();
      });
    });
  }

  /* ─── DETAIL VIEW ─── */
  function renderDetail() {
    var s = selectedScenario;
    if (!s) { currentView = 'grid'; render(); return; }

    var html = '<div class="sim-detail">';

    // Back button
    html += '<button class="sim-detail-back" id="simBack">' + ICONS.back + ' Back to scenarios</button>';

    // Header card
    var riskClass = 'sim-risk-' + s.risk.toLowerCase();
    html += '<div class="sim-detail-header">' +
      '<div class="sim-detail-title-row">' +
      '<h2 class="sim-detail-title">' + escHtml(s.name) + '</h2>' +
      '<span class="sim-risk-badge ' + riskClass + '">' + s.risk + '</span>' +
      '</div>' +
      '<p class="sim-detail-desc">' + escHtml(s.context) + '</p>' +
      '<p class="sim-detail-sources">Sources: ' + escHtml(s.sources) + '</p>' +
      '</div>';

    // Impact Table
    html += '<div class="sim-impact-section">' +
      '<h3 class="sim-section-title">' + ICONS.table + ' Asset Impact Analysis</h3>' +
      '<table class="sim-impact-table">' +
      '<thead><tr>' +
      '<th>Asset</th>' +
      '<th>Direction</th>' +
      '<th>Range</th>' +
      '<th>Confidence</th>' +
      '<th>Rationale</th>' +
      '</tr></thead><tbody>';

    for (var i = 0; i < s.assets.length; i++) {
      var a = s.assets[i];
      var dirClass = a.direction;
      var dirArrow = a.direction === 'up' ? '\u2191' : a.direction === 'down' ? '\u2193' : '\u2194';
      var rangeStr = '';
      if (a.rangeMin >= 0 && a.rangeMax >= 0) {
        rangeStr = '+' + a.rangeMin + '% to +' + a.rangeMax + '%';
      } else if (a.rangeMin < 0 && a.rangeMax < 0) {
        rangeStr = a.rangeMin + '% to ' + a.rangeMax + '%';
      } else {
        rangeStr = a.rangeMin + '% to +' + a.rangeMax + '%';
      }
      var rangeClass = a.direction === 'up' ? 'positive' : a.direction === 'down' ? 'negative' : 'mixed-val';
      var confClass = 'sim-confidence-' + a.confidence.toLowerCase();

      html += '<tr>' +
        '<td class="sim-asset-cell">' + escHtml(a.name) + '</td>' +
        '<td><span class="sim-direction ' + dirClass + '">' + dirArrow + '</span></td>' +
        '<td><span class="sim-range ' + rangeClass + '">' + rangeStr + '</span></td>' +
        '<td><span class="sim-confidence ' + confClass + '">' + a.confidence + '</span></td>' +
        '<td class="sim-rationale">' + escHtml(a.rationale) + '</td>' +
        '</tr>';
    }

    html += '</tbody></table></div>';

    // Impact Bars (CSS chart)
    html += '<div class="sim-bars-section">' +
      '<h3 class="sim-section-title">' + ICONS.chart + ' Impact Range Visualization</h3>';

    for (var b = 0; b < s.assets.length; b++) {
      var asset = s.assets[b];
      var midpoint = (asset.rangeMin + asset.rangeMax) / 2;
      var maxAbs = 80; // max scale
      var barWidth = Math.min(Math.abs(midpoint) / maxAbs * 50, 50);
      var barClass = midpoint >= 0 ? 'positive' : 'negative';
      var valClass = midpoint > 0 ? 'positive' : midpoint < 0 ? 'negative' : 'mixed-val';
      var valStr = midpoint > 0 ? '+' + Math.round(midpoint) + '%' : Math.round(midpoint) + '%';

      var barStyle = '';
      if (midpoint >= 0) {
        barStyle = 'width:' + barWidth + '%;right:auto;left:50%;border-radius:0 var(--radius-sm) var(--radius-sm) 0;background:linear-gradient(90deg,rgba(34,197,94,0.3),rgba(34,197,94,0.6));';
      } else {
        barStyle = 'width:' + barWidth + '%;left:auto;right:50%;border-radius:var(--radius-sm) 0 0 var(--radius-sm);background:linear-gradient(90deg,rgba(239,68,68,0.6),rgba(239,68,68,0.3));';
      }

      html += '<div class="sim-bar-row">' +
        '<div class="sim-bar-label">' + escHtml(asset.name) + '</div>' +
        '<div class="sim-bar-track">' +
        '<div class="sim-bar-fill" style="' + barStyle + '"></div>' +
        '</div>' +
        '<div class="sim-bar-value ' + valClass + '">' + valStr + '</div>' +
        '</div>';
    }

    html += '</div>';

    // Portfolio integration
    var portfolio = getPortfolioData();
    if (portfolio && portfolio.assets && portfolio.assets.length > 0) {
      html += renderPortfolioIntegration(s, portfolio);
    } else {
      html += '<div class="sim-portfolio-cta" id="simPortfolioCta">' +
        '<div class="sim-portfolio-cta-icon">' + ICONS.portfolio + '</div>' +
        '<div class="sim-portfolio-cta-text">' +
        '<h4>Get a Personalized Breakdown</h4>' +
        '<p>Take the Portfolio Checker first to see how this scenario affects your specific holdings.</p>' +
        '</div>' +
        '</div>';
    }

    // Deep dive link
    html += '<div class="sim-deepdive-link" id="simDeepDive">' +
      ICONS.deepdive +
      '<div class="sim-deepdive-link-text">' +
      '<h4>Read the Deep Dive Research</h4>' +
      '<p>Explore the intelligence reports behind this analysis \u2014 free deep dive briefs.</p>' +
      '</div>' +
      '</div>';

    // Actions row
    var shareText = encodeURIComponent('I just simulated the ' + s.shortName + ' scenario. See the projected market impacts: informationhubnews.netlify.app');
    html += '<div class="sim-actions">' +
      '<button class="sim-btn sim-btn-primary" id="simTryAnother">Try Another Scenario</button>' +
      '<div class="sim-share">' +
      '<span>Share</span>' +
      '<a href="https://twitter.com/intent/tweet?text=' + shareText + '&via=HubInforma272" target="_blank" rel="noopener" aria-label="Share on X">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '</a>' +
      '<a href="https://wa.me/?text=' + shareText + '" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '</a>' +
      '</div>' +
      '</div>';

    html += '</div>'; // close sim-detail

    simRoot.innerHTML = html;

    // Bind events
    document.getElementById('simBack').addEventListener('click', function() {
      currentView = 'grid';
      selectedScenario = null;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('simTryAnother').addEventListener('click', function() {
      currentView = 'grid';
      selectedScenario = null;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var portfolioCta = document.getElementById('simPortfolioCta');
    if (portfolioCta) {
      portfolioCta.addEventListener('click', function() {
        if (typeof window.switchTab === 'function') {
          window.switchTab('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    var deepDiveLink = document.getElementById('simDeepDive');
    if (deepDiveLink) {
      deepDiveLink.addEventListener('click', function() {
        if (typeof window.switchTab === 'function') {
          window.switchTab('home');
          setTimeout(function() {
            var ddb = document.getElementById('deepDiveBrief');
            if (ddb) ddb.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 400);
        }
      });
    }

    // Animate bars
    setTimeout(function() {
      var bars = simRoot.querySelectorAll('.sim-bar-fill');
      for (var k = 0; k < bars.length; k++) {
        bars[k].style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }, 100);
  }

  /* ─── PORTFOLIO INTEGRATION ─── */
  function renderPortfolioIntegration(scenario, portfolio) {
    var assets = portfolio.assets;
    var html = '<div class="sim-portfolio-section">' +
      '<h3 class="sim-portfolio-title">' + ICONS.portfolio + ' How This Affects Your Portfolio</h3>' +
      '<p class="sim-portfolio-subtitle">Based on the ' + assets.length + ' assets you selected in the Portfolio Checker, here\u2019s how the <strong>' + escHtml(scenario.shortName) + '</strong> scenario impacts your specific holdings.</p>';

    // Individual asset impacts
    html += '<div class="sim-portfolio-grid">';
    var totalImpact = 0;
    var impactCount = 0;

    for (var i = 0; i < assets.length; i++) {
      var assetId = assets[i];
      var mapping = scenario.portfolioMap[assetId];
      if (!mapping) continue;

      var name = getAssetName(assetId);
      var dirClass = mapping.direction === 'up' ? 'positive' : mapping.direction === 'down' ? 'negative' : 'mixed-val';

      html += '<div class="sim-portfolio-item">' +
        '<span class="sim-portfolio-item-name">' + escHtml(name) + '</span>' +
        '<span class="sim-portfolio-item-impact ' + dirClass + '">' + escHtml(mapping.impact) + '</span>' +
        '</div>';

      // Parse impact for weighted score
      var match = mapping.impact.match(/([-+]?\d+)%/);
      if (match) {
        totalImpact += parseInt(match[1]);
        impactCount++;
      }
    }
    html += '</div>';

    // Weighted portfolio impact score
    if (impactCount > 0) {
      var avgImpact = Math.round(totalImpact / impactCount);
      var impactLabel = avgImpact > 5 ? 'Net Positive' : avgImpact < -5 ? 'Net Negative' : 'Mixed / Neutral';
      var impactColor = avgImpact > 5 ? 'var(--sim-positive)' : avgImpact < -5 ? 'var(--sim-negative)' : '#f59e0b';

      html += '<div class="sim-portfolio-score">' +
        '<div class="sim-portfolio-score-num" style="color:' + impactColor + ';">' + (avgImpact > 0 ? '+' : '') + avgImpact + '%</div>' +
        '<div class="sim-portfolio-score-label">' +
        '<strong>' + impactLabel + '</strong><br>' +
        'Weighted average impact across your ' + impactCount + ' matched holdings' +
        '</div>' +
        '</div>';
    }

    html += '</div>';
    return html;
  }

  /* ─── INITIALIZATION ─── */
  window.startSimulator = function() {
    currentView = 'grid';
    selectedScenario = null;
    render();
  };

  // MutationObserver pattern for tab switching
  var tabEl = document.getElementById('tab-scenarios');
  if (tabEl) {
    var observer = new MutationObserver(function() {
      if (simRoot && simRoot.closest('.tab-content') &&
          simRoot.closest('.tab-content').classList.contains('active') &&
          simRoot.innerHTML === '') {
        render();
      }
    });
    observer.observe(tabEl, { attributes: true, attributeFilter: ['class'] });

    if (tabEl.classList.contains('active')) {
      render();
    }
  }

  // Hook into switchTab
  var origSwitch = window.switchTab;
  window.switchTab = function(id) {
    origSwitch(id);
    if (id === 'scenarios' && simRoot && simRoot.innerHTML === '') {
      setTimeout(render, 50);
    }
  };
})();
