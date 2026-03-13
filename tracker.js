// tracker.js — Geopolitical Risk Tracker v1
// Sources: BlackRock BGRI March 2026, Stifel Geopolitical Dashboard, J.P. Morgan GPR
(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const TRACKER_COLOR = '#06b6d4';
  const RISK_DATA_URL = 'https://raw.githubusercontent.com/jameslowebba-star/information-hub-data/main/geo-risks.json';

  // ===== RISK DATABASE — BlackRock BGRI March 2026 =====
  const DEFAULT_RISKS = [
    {
      id: 'middle-east',
      name: 'Middle East Regional War',
      likelihood: 'high',
      score: 9.2,
      description: 'Regional conflict has escalated following U.S.-Israel "Epic Fury" operation targeting Iran\'s leadership and military infrastructure. Iran retaliating with strikes on Israel, U.S. assets, and regional targets.',
      impacts: ['Oil & Gas', 'Gold', 'Brent Crude', 'S&P 500', 'Defense Stocks'],
      direction: 'up', // risk direction for assets
      region: 'Middle East',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'U.S.-Iran direct military engagement ongoing since Feb 28, 2026',
      impactOnPortfolio: { positive: ['Gold', 'Brent Crude', 'Defense Stocks'], negative: ['S&P 500', 'Emerging Market Equities'] }
    },
    {
      id: 'us-china',
      name: 'U.S.–China Strategic Competition',
      likelihood: 'high',
      score: 8.8,
      description: 'Technology decoupling accelerating. Semiconductor export controls tightened. Taiwan Strait tensions elevated with increased PLA military exercises.',
      impacts: ['Tech Stocks', 'Semiconductors', 'Bitcoin', 'USD/CNY', 'Taiwan ETFs'],
      direction: 'up',
      region: 'Indo-Pacific',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'New U.S. semiconductor restrictions on China, March 2026',
      impactOnPortfolio: { positive: ['Gold', 'Bitcoin', 'Defense Stocks'], negative: ['Tech Stocks', 'Semiconductors', 'Taiwan ETFs'] }
    },
    {
      id: 'trade-war',
      name: 'Global Trade Fragmentation',
      likelihood: 'high',
      score: 8.5,
      description: 'U.S. pursuing transactional foreign policy with broad tariff threats. WTO system under strain. Supply chain restructuring accelerating across industries.',
      impacts: ['S&P 500', 'Manufacturing', 'USD/ZAR', 'Emerging Markets', 'Commodities'],
      direction: 'up',
      region: 'Global',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'U.S. tariff threats against multiple nations over Greenland dispute',
      impactOnPortfolio: { positive: ['Gold', 'USD'], negative: ['Emerging Markets', 'Manufacturing', 'Global Trade ETFs'] }
    },
    {
      id: 'russia-nato',
      name: 'Russia–NATO Confrontation',
      likelihood: 'medium',
      score: 7.6,
      description: 'Risk of miscalculation remains elevated. Ukraine war continues with no ceasefire in sight. NATO eastern flank reinforcement ongoing. Hybrid warfare targeting European infrastructure.',
      impacts: ['European Equities', 'Natural Gas', 'Defense Stocks', 'EUR/USD', 'Gold'],
      direction: 'up',
      region: 'Europe',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'Continued fighting in Ukraine, NATO Article 5 drills expanded',
      impactOnPortfolio: { positive: ['Defense Stocks', 'Gold', 'Natural Gas'], negative: ['European Equities', 'EUR/USD'] }
    },
    {
      id: 'cyber-warfare',
      name: 'Major Cyber Attack',
      likelihood: 'medium',
      score: 7.2,
      description: 'State-sponsored cyber operations targeting critical infrastructure, financial systems, and energy grids. AI-enhanced attacks increasing in sophistication.',
      impacts: ['Cybersecurity Stocks', 'Tech Stocks', 'Banking', 'Crypto Exchanges', 'Insurance'],
      direction: 'up',
      region: 'Global',
      lastUpdated: '2026-03-14',
      source: 'Stifel Dashboard',
      keyEvent: 'Multiple state-sponsored attacks on European energy grids detected',
      impactOnPortfolio: { positive: ['Cybersecurity Stocks'], negative: ['Banking', 'Tech Stocks', 'Crypto Exchanges'] }
    },
    {
      id: 'energy-crisis',
      name: 'Global Energy Disruption',
      likelihood: 'high',
      score: 8.1,
      description: 'Strait of Hormuz chokepoint under active threat. Oil supply disruptions from Middle East conflict. OPEC+ production cuts maintaining price pressure.',
      impacts: ['Brent Crude', 'Natural Gas', 'Energy Stocks', 'Airlines', 'Emerging Markets'],
      direction: 'up',
      region: 'Global',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'Hormuz Strait shipping insurance premiums at record highs',
      impactOnPortfolio: { positive: ['Brent Crude', 'Energy Stocks', 'Natural Gas'], negative: ['Airlines', 'Manufacturing'] }
    },
    {
      id: 'western-alliance',
      name: 'Western Alliance Fractures',
      likelihood: 'medium',
      score: 7.0,
      description: 'Transactional U.S. foreign policy straining traditional alliances. European defense autonomy push. Divergence on China strategy between U.S. and EU.',
      impacts: ['EUR/USD', 'NATO Defense ETFs', 'European Equities', 'USD', 'Treasury Bonds'],
      direction: 'up',
      region: 'Transatlantic',
      lastUpdated: '2026-03-14',
      source: 'BlackRock BGRI',
      keyEvent: 'EU announces independent defense fund, reduced reliance on U.S.',
      impactOnPortfolio: { positive: ['European Defense Stocks', 'Gold'], negative: ['USD', 'U.S. Treasury Bonds'] }
    },
    {
      id: 'africa-instability',
      name: 'African Political Instability',
      likelihood: 'medium',
      score: 6.8,
      description: 'Coup contagion in Sahel region. Resource nationalism rising. South Africa political uncertainty ahead of coalition negotiations. Critical mineral supply at risk.',
      impacts: ['JSE All Share', 'USD/ZAR', 'Mining Stocks', 'Platinum', 'Rare Earth Minerals'],
      direction: 'up',
      region: 'Africa',
      lastUpdated: '2026-03-14',
      source: 'ZeroFox Intel',
      keyEvent: 'Multiple Sahel nations restricting Western mining operations',
      impactOnPortfolio: { positive: ['Platinum', 'Rare Earth ETFs'], negative: ['JSE All Share', 'USD/ZAR'] }
    },
    {
      id: 'crypto-regulation',
      name: 'Crypto Regulatory Crackdown',
      likelihood: 'medium',
      score: 6.5,
      description: 'Global regulatory frameworks tightening. U.S. SEC enforcement actions. EU MiCA implementation creating compliance burdens. Central bank digital currencies competing.',
      impacts: ['Bitcoin', 'Ethereum', 'Exchange Tokens', 'DeFi', 'Stablecoins'],
      direction: 'down',
      region: 'Global',
      lastUpdated: '2026-03-14',
      source: 'J.P. Morgan GPR',
      keyEvent: 'EU MiCA fully enforced, multiple exchanges exit smaller markets',
      impactOnPortfolio: { positive: ['Regulated Crypto ETFs'], negative: ['Bitcoin', 'Altcoins', 'Exchange Tokens'] }
    },
    {
      id: 'debt-crisis',
      name: 'Emerging Market Debt Crisis',
      likelihood: 'medium',
      score: 6.3,
      description: 'High USD rates straining EM debt sustainability. Several frontier economies approaching default. Chinese lending slowdown reducing safety nets.',
      impacts: ['EM Bonds', 'USD/ZAR', 'EM Equities', 'Commodities', 'Gold'],
      direction: 'up',
      region: 'Global',
      lastUpdated: '2026-03-14',
      source: 'J.P. Morgan GPR',
      keyEvent: 'Multiple frontier economies in IMF debt restructuring talks',
      impactOnPortfolio: { positive: ['Gold', 'USD', 'U.S. Treasury Bonds'], negative: ['EM Bonds', 'EM Equities', 'USD/ZAR'] }
    }
  ];

  // ===== UPCOMING EVENTS CALENDAR =====
  const DEFAULT_EVENTS = [
    { date: '2026-03-18', event: 'Fed FOMC Interest Rate Decision', risk: 'trade-war', category: 'economic' },
    { date: '2026-03-20', event: 'EU Emergency Defense Summit', risk: 'western-alliance', category: 'political' },
    { date: '2026-03-25', event: 'OPEC+ Emergency Production Meeting', risk: 'energy-crisis', category: 'economic' },
    { date: '2026-04-01', event: 'U.S.-China Trade Review Deadline', risk: 'us-china', category: 'economic' },
    { date: '2026-04-10', event: 'IMF Spring Meetings', risk: 'debt-crisis', category: 'economic' },
    { date: '2026-04-15', event: 'UN Security Council — Iran Resolution Vote', risk: 'middle-east', category: 'political' },
    { date: '2026-04-22', event: 'NATO Defense Ministers Meeting', risk: 'russia-nato', category: 'military' },
    { date: '2026-05-01', event: 'South Africa Budget Supplementary', risk: 'africa-instability', category: 'economic' },
    { date: '2026-05-15', event: 'EU Crypto Compliance Deadline (MiCA Phase 2)', risk: 'crypto-regulation', category: 'regulatory' },
    { date: '2026-06-01', event: 'G7 Summit — Trade & Security Agenda', risk: 'trade-war', category: 'political' },
    { date: '2026-06-15', event: 'PLA Anniversary — Taiwan Strait Watch', risk: 'us-china', category: 'military' },
    { date: '2026-07-01', event: 'African Union Mid-Year Summit', risk: 'africa-instability', category: 'political' }
  ];

  // ===== PORTFOLIO CHECKER ASSET MAP =====
  // Maps tracker risks to the 17 assets in the Portfolio Exposure Checker
  const ASSET_RISK_MAP = {
    'Bitcoin': ['us-china', 'crypto-regulation', 'trade-war'],
    'Ethereum': ['crypto-regulation', 'us-china'],
    'Solana': ['crypto-regulation'],
    'XRP': ['crypto-regulation'],
    'Gold': ['middle-east', 'energy-crisis', 'russia-nato', 'debt-crisis', 'trade-war'],
    'Silver': ['middle-east', 'energy-crisis', 'trade-war'],
    'Brent Crude': ['middle-east', 'energy-crisis'],
    'S&P 500': ['middle-east', 'trade-war', 'us-china'],
    'NASDAQ 100': ['us-china', 'cyber-warfare', 'trade-war'],
    'Dow Jones': ['trade-war', 'middle-east'],
    'JSE All Share': ['africa-instability', 'debt-crisis'],
    'USD/ZAR': ['africa-instability', 'debt-crisis', 'trade-war'],
    'EUR/USD': ['russia-nato', 'western-alliance'],
    'Platinum': ['africa-instability', 'energy-crisis'],
    'Palladium': ['russia-nato', 'africa-instability'],
    'Natural Gas': ['russia-nato', 'energy-crisis'],
    'Treasury Bonds': ['debt-crisis', 'western-alliance', 'trade-war']
  };

  // ===== STATE =====
  let risks = [...DEFAULT_RISKS];
  let events = [...DEFAULT_EVENTS];
  let selectedRisk = null;
  let filterLikelihood = 'all';

  // ===== INIT =====
  const container = document.getElementById('trackerApp');
  if (!container) return;

  // Try to load live data
  fetchLiveRiskData();

  // Initial render
  render();

  // ===== FETCH LIVE DATA =====
  async function fetchLiveRiskData() {
    try {
      const res = await fetch(RISK_DATA_URL + '?t=' + Date.now(), { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data.risks && data.risks.length > 0) {
        risks = data.risks;
      }
      if (data.events && data.events.length > 0) {
        events = data.events;
      }
      render();
      console.log('[GeoTracker] Live risk data loaded');
    } catch (e) {
      console.log('[GeoTracker] Using embedded risk data (live fetch unavailable)');
    }
  }

  // ===== COMPOSITE SCORE =====
  function getCompositeScore() {
    if (risks.length === 0) return 0;
    const sum = risks.reduce((acc, r) => acc + r.score, 0);
    return (sum / risks.length).toFixed(1);
  }

  function getCompositeLevel() {
    const score = parseFloat(getCompositeScore());
    if (score >= 8.0) return { label: 'CRITICAL', class: 'level-critical' };
    if (score >= 6.5) return { label: 'ELEVATED', class: 'level-elevated' };
    if (score >= 4.0) return { label: 'MODERATE', class: 'level-moderate' };
    return { label: 'LOW', class: 'level-low' };
  }

  function getLikelihoodClass(l) {
    if (l === 'high') return 'likelihood-high';
    if (l === 'medium') return 'likelihood-medium';
    return 'likelihood-low';
  }

  function getCategoryIcon(cat) {
    switch(cat) {
      case 'economic': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
      case 'political': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>';
      case 'military': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      case 'regulatory': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
      default: return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    }
  }

  // ===== RENDER =====
  function render() {
    const composite = getCompositeScore();
    const level = getCompositeLevel();
    const highCount = risks.filter(r => r.likelihood === 'high').length;
    const medCount = risks.filter(r => r.likelihood === 'medium').length;
    const filteredRisks = filterLikelihood === 'all' 
      ? risks 
      : risks.filter(r => r.likelihood === filterLikelihood);

    // Sort by score descending
    filteredRisks.sort((a, b) => b.score - a.score);

    // Upcoming events (next 90 days)
    const now = new Date();
    const futureEvents = events.filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8);

    container.innerHTML = `
      <!-- Composite Risk Meter -->
      <div class="trk-meter-section">
        <div class="trk-meter-card">
          <div class="trk-meter-header">
            <div class="trk-meter-title-row">
              <h2 class="trk-meter-title">Global Risk Index</h2>
              <span class="trk-meter-source">Sources: BlackRock BGRI, Stifel, J.P. Morgan</span>
            </div>
            <div class="trk-meter-badge ${level.class}">${level.label}</div>
          </div>
          <div class="trk-meter-body">
            <div class="trk-meter-gauge">
              <div class="trk-gauge-track">
                <div class="trk-gauge-fill" style="width:${(composite / 10) * 100}%"></div>
                <div class="trk-gauge-marker" style="left:${(composite / 10) * 100}%"></div>
              </div>
              <div class="trk-gauge-labels">
                <span>LOW</span>
                <span>MODERATE</span>
                <span>ELEVATED</span>
                <span>CRITICAL</span>
              </div>
            </div>
            <div class="trk-meter-score">
              <span class="trk-score-num">${composite}</span>
              <span class="trk-score-label">/10</span>
            </div>
          </div>
          <div class="trk-meter-stats">
            <div class="trk-stat">
              <span class="trk-stat-num trk-stat-high">${highCount}</span>
              <span class="trk-stat-label">High Risk</span>
            </div>
            <div class="trk-stat">
              <span class="trk-stat-num trk-stat-med">${medCount}</span>
              <span class="trk-stat-label">Medium Risk</span>
            </div>
            <div class="trk-stat">
              <span class="trk-stat-num">${risks.length}</span>
              <span class="trk-stat-label">Tracked Risks</span>
            </div>
            <div class="trk-stat">
              <span class="trk-stat-num">${futureEvents.length}</span>
              <span class="trk-stat-label">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="trk-filter-bar">
        <button class="trk-filter ${filterLikelihood === 'all' ? 'active' : ''}" data-filter="all">All Risks (${risks.length})</button>
        <button class="trk-filter ${filterLikelihood === 'high' ? 'active' : ''}" data-filter="high">
          <span class="trk-filter-dot" style="background:#ef4444;"></span>High (${highCount})
        </button>
        <button class="trk-filter ${filterLikelihood === 'medium' ? 'active' : ''}" data-filter="medium">
          <span class="trk-filter-dot" style="background:#f59e0b;"></span>Medium (${medCount})
        </button>
      </div>

      <!-- Risk Cards Grid -->
      <div class="trk-risk-grid">
        ${filteredRisks.map(r => renderRiskCard(r)).join('')}
      </div>

      <!-- Risk Detail Panel (shown when a card is selected) -->
      <div class="trk-detail-panel ${selectedRisk ? 'open' : ''}" id="trkDetailPanel">
        ${selectedRisk ? renderDetailPanel(selectedRisk) : ''}
      </div>

      <!-- Asset Impact Map -->
      <div class="trk-section">
        <div class="trk-section-header">
          <h3 class="trk-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${TRACKER_COLOR}" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Asset Impact Map
          </h3>
          <p class="trk-section-sub">How tracked risks affect specific assets in your portfolio</p>
        </div>
        <div class="trk-asset-grid">
          ${renderAssetImpactMap()}
        </div>
      </div>

      <!-- Events Timeline -->
      <div class="trk-section">
        <div class="trk-section-header">
          <h3 class="trk-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${TRACKER_COLOR}" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Geopolitical Events Calendar
          </h3>
          <p class="trk-section-sub">Key dates that could trigger market volatility</p>
        </div>
        <div class="trk-events-list">
          ${futureEvents.map(e => renderEventItem(e)).join('')}
          ${futureEvents.length === 0 ? '<p class="trk-no-data">No upcoming events in the next 90 days.</p>' : ''}
        </div>
      </div>

      <!-- Methodology -->
      <div class="trk-section">
        <div class="trk-methodology">
          <h4 class="trk-method-title">Methodology & Sources</h4>
          <p class="trk-method-text">Risk scores are derived from the <strong>BlackRock Geopolitical Risk Indicator (BGRI)</strong>, which measures market attention to geopolitical risks via brokerage reports and financial media sentiment analysis. Supplemented by <strong>Stifel's Geopolitical Dashboard</strong> (3-5 year likelihood assessments) and <strong>J.P. Morgan's Geopolitical Risk Index</strong> (GPR). Asset impact mappings are based on BlackRock's Aladdin Portfolio Risk Tools framework. Data refreshed automatically via our intelligence pipeline.</p>
          <div class="trk-source-links">
            <a href="https://www.blackrock.com/corporate/insights/blackrock-investment-institute/interactive-charts/geopolitical-risk-dashboard" target="_blank" rel="noopener noreferrer">BlackRock BGRI</a>
            <a href="https://www.stifel.com/Newsletters/AdGraphics/InSight/Outlook/2026/Outlook2026_Geopolitical-Dashboard.pdf" target="_blank" rel="noopener noreferrer">Stifel Dashboard</a>
            <a href="https://am.jpmorgan.com/ch/en/asset-management/adv/insights/portfolio-insights/strategy-report/how-investors-should-think-about-geopolitical-risk/" target="_blank" rel="noopener noreferrer">J.P. Morgan GPR</a>
          </div>
        </div>
      </div>

      <!-- CTA to Portfolio Checker -->
      <div class="trk-cta-section">
        <div class="trk-cta-card">
          <div class="trk-cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="trk-cta-content">
            <h3>Check Your Portfolio Exposure</h3>
            <p>See exactly how these geopolitical risks impact your specific asset holdings.</p>
          </div>
          <button class="trk-cta-btn" onclick="switchTab('portfolio');">Open Portfolio Checker &rarr;</button>
        </div>
      </div>
    `;

    // Attach event listeners
    attachListeners();
  }

  // ===== RENDER RISK CARD =====
  function renderRiskCard(risk) {
    const isSelected = selectedRisk && selectedRisk.id === risk.id;
    const scorePercent = (risk.score / 10) * 100;
    return `
      <div class="trk-risk-card ${isSelected ? 'selected' : ''} ${getLikelihoodClass(risk.likelihood)}" data-risk-id="${risk.id}">
        <div class="trk-card-top">
          <span class="trk-card-region">${risk.region}</span>
          <span class="trk-card-likelihood ${getLikelihoodClass(risk.likelihood)}">${risk.likelihood.toUpperCase()}</span>
        </div>
        <h3 class="trk-card-name">${risk.name}</h3>
        <p class="trk-card-desc">${risk.description.length > 120 ? risk.description.substring(0, 120) + '...' : risk.description}</p>
        <div class="trk-card-score-bar">
          <div class="trk-score-track">
            <div class="trk-score-fill ${getLikelihoodClass(risk.likelihood)}" style="width:${scorePercent}%"></div>
          </div>
          <span class="trk-card-score-num">${risk.score}</span>
        </div>
        <div class="trk-card-impacts">
          ${risk.impacts.slice(0, 3).map(i => `<span class="trk-impact-chip">${i}</span>`).join('')}
          ${risk.impacts.length > 3 ? `<span class="trk-impact-more">+${risk.impacts.length - 3}</span>` : ''}
        </div>
        <div class="trk-card-footer">
          <span class="trk-card-source">${risk.source}</span>
          <button class="trk-card-expand" data-risk-id="${risk.id}">Details &rarr;</button>
        </div>
      </div>
    `;
  }

  // ===== RENDER DETAIL PANEL =====
  function renderDetailPanel(risk) {
    return `
      <div class="trk-detail-inner">
        <button class="trk-detail-close" id="trkDetailClose">&times;</button>
        <div class="trk-detail-head">
          <span class="trk-detail-region">${risk.region}</span>
          <span class="trk-detail-likelihood ${getLikelihoodClass(risk.likelihood)}">${risk.likelihood.toUpperCase()} LIKELIHOOD</span>
        </div>
        <h2 class="trk-detail-name">${risk.name}</h2>
        <div class="trk-detail-score-row">
          <div class="trk-detail-score-bar">
            <div class="trk-score-track">
              <div class="trk-score-fill ${getLikelihoodClass(risk.likelihood)}" style="width:${(risk.score / 10) * 100}%"></div>
            </div>
          </div>
          <span class="trk-detail-score">${risk.score}/10</span>
        </div>
        <p class="trk-detail-desc">${risk.description}</p>
        <div class="trk-detail-event">
          <strong>Key Development:</strong> ${risk.keyEvent}
        </div>
        <div class="trk-detail-impacts-section">
          <h4>Portfolio Impact</h4>
          <div class="trk-detail-impact-groups">
            <div class="trk-impact-group trk-impact-negative">
              <span class="trk-impact-group-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                At Risk
              </span>
              <div class="trk-impact-chips">
                ${risk.impactOnPortfolio.negative.map(a => `<span class="trk-chip-negative">${a}</span>`).join('')}
              </div>
            </div>
            <div class="trk-impact-group trk-impact-positive">
              <span class="trk-impact-group-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                Potential Benefit
              </span>
              <div class="trk-impact-chips">
                ${risk.impactOnPortfolio.positive.map(a => `<span class="trk-chip-positive">${a}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="trk-detail-meta">
          <span>Source: ${risk.source}</span>
          <span>Updated: ${formatDate(risk.lastUpdated)}</span>
        </div>
      </div>
    `;
  }

  // ===== RENDER ASSET IMPACT MAP =====
  function renderAssetImpactMap() {
    return Object.entries(ASSET_RISK_MAP).map(([asset, riskIds]) => {
      const assetRisks = riskIds.map(id => risks.find(r => r.id === id)).filter(Boolean);
      const maxScore = Math.max(...assetRisks.map(r => r.score), 0);
      const riskLevel = maxScore >= 8 ? 'high' : maxScore >= 6 ? 'medium' : 'low';
      return `
        <div class="trk-asset-item ${riskLevel}">
          <div class="trk-asset-name">${asset}</div>
          <div class="trk-asset-risks">
            ${assetRisks.slice(0, 2).map(r => `<span class="trk-asset-risk-tag ${getLikelihoodClass(r.likelihood)}">${r.name.split(' ').slice(0, 2).join(' ')}</span>`).join('')}
            ${assetRisks.length > 2 ? `<span class="trk-asset-risk-more">+${assetRisks.length - 2}</span>` : ''}
          </div>
          <div class="trk-asset-score-mini">
            <div class="trk-mini-track">
              <div class="trk-mini-fill ${getLikelihoodClass(riskLevel === 'high' ? 'high' : riskLevel === 'medium' ? 'medium' : 'low')}" style="width:${(maxScore / 10) * 100}%"></div>
            </div>
            <span class="trk-asset-score-val">${maxScore.toFixed(1)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ===== RENDER EVENT ITEM =====
  function renderEventItem(event) {
    const linkedRisk = risks.find(r => r.id === event.risk);
    const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntil <= 7 ? 'trk-event-urgent' : daysUntil <= 30 ? 'trk-event-soon' : '';
    return `
      <div class="trk-event-item ${urgency}">
        <div class="trk-event-date-col">
          <span class="trk-event-day">${new Date(event.date).getDate()}</span>
          <span class="trk-event-month">${new Date(event.date).toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
        </div>
        <div class="trk-event-content">
          <div class="trk-event-name">${event.event}</div>
          <div class="trk-event-meta">
            ${getCategoryIcon(event.category)}
            <span class="trk-event-cat">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
            ${linkedRisk ? `<span class="trk-event-risk-link" data-risk-id="${linkedRisk.id}">→ ${linkedRisk.name}</span>` : ''}
          </div>
        </div>
        <div class="trk-event-countdown">
          ${daysUntil <= 0 ? '<span class="trk-event-today">TODAY</span>' : `<span class="trk-days-num">${daysUntil}</span><span class="trk-days-label">days</span>`}
        </div>
      </div>
    `;
  }

  // ===== HELPERS =====
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ===== EVENT LISTENERS =====
  function attachListeners() {
    // Risk card clicks
    container.querySelectorAll('.trk-risk-card, .trk-card-expand').forEach(el => {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.dataset.riskId || this.closest('.trk-risk-card')?.dataset.riskId;
        const risk = risks.find(r => r.id === id);
        if (risk) {
          selectedRisk = selectedRisk && selectedRisk.id === id ? null : risk;
          render();
          if (selectedRisk) {
            setTimeout(() => {
              const panel = document.getElementById('trkDetailPanel');
              if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      });
    });

    // Detail close
    const closeBtn = document.getElementById('trkDetailClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => { selectedRisk = null; render(); });
    }

    // Filter buttons
    container.querySelectorAll('.trk-filter').forEach(btn => {
      btn.addEventListener('click', function() {
        filterLikelihood = this.dataset.filter;
        render();
      });
    });

    // Event risk links
    container.querySelectorAll('.trk-event-risk-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.dataset.riskId;
        const risk = risks.find(r => r.id === id);
        if (risk) {
          selectedRisk = risk;
          render();
          setTimeout(() => {
            const panel = document.getElementById('trkDetailPanel');
            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });
    });
  }

  // Store tracker data in sessionStorage for cross-tool reference
  sessionStorage.setItem('ih_tracker_data', JSON.stringify({
    compositeScore: getCompositeScore(),
    level: getCompositeLevel().label,
    highRiskCount: risks.filter(r => r.likelihood === 'high').length,
    risks: risks.map(r => ({ id: r.id, name: r.name, score: r.score, likelihood: r.likelihood }))
  }));

})();
