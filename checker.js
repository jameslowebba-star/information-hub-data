// checker.js — Portfolio Exposure Checker Interactive Tool
(function() {
  'use strict';

  /* ─── ASSET RISK DATABASE ─── */
  var ASSET_CATEGORIES = [
    {
      label: 'Stocks & Indices',
      assets: [
        { id: 'us_tech', name: 'US Tech', desc: 'FAANG, semiconductors, AI stocks', icon: '💻' },
        { id: 'us_broad', name: 'US Broad Market', desc: 'S&P 500, Dow Jones', icon: '📊' },
        { id: 'chinese', name: 'Chinese Stocks', desc: 'Alibaba, Tencent, BYD, Chinese ETFs', icon: '🇨🇳' },
        { id: 'european', name: 'European Stocks', desc: 'DAX, FTSE, Eurozone', icon: '🇪🇺' },
        { id: 'sa_stocks', name: 'South African Stocks', desc: 'JSE Top 40, SA-listed miners', icon: '🇿🇦' },
        { id: 'emerging', name: 'Emerging Markets', desc: 'EM ETFs, frontier markets', icon: '🌍' }
      ]
    },
    {
      label: 'Crypto',
      assets: [
        { id: 'bitcoin', name: 'Bitcoin (BTC)', desc: 'Digital gold, store of value', icon: '₿' },
        { id: 'ethereum', name: 'Ethereum (ETH)', desc: 'Smart contracts, DeFi backbone', icon: 'Ξ' },
        { id: 'altcoins', name: 'Altcoins', desc: 'SOL, XRP, ADA, etc.', icon: '🪙' },
        { id: 'stablecoins', name: 'Stablecoins', desc: 'USDT, USDC', icon: '💵' }
      ]
    },
    {
      label: 'Commodities',
      assets: [
        { id: 'gold', name: 'Gold', desc: 'Safe haven, inflation hedge', icon: '🥇' },
        { id: 'silver_pgms', name: 'Silver / Platinum / PGMs', desc: 'Industrial + precious metals', icon: '⚙' },
        { id: 'oil_energy', name: 'Oil & Energy', desc: 'Brent crude, energy stocks', icon: '🛢' },
        { id: 'rare_earths', name: 'Rare Earths / Critical Minerals', desc: 'Supply chain critical', icon: '⛏' }
      ]
    },
    {
      label: 'Other',
      assets: [
        { id: 'bonds', name: 'Government Bonds', desc: 'US Treasuries, SA bonds', icon: '🏛' },
        { id: 'real_estate', name: 'Real Estate', desc: 'SA property, REITs', icon: '🏠' },
        { id: 'cash', name: 'Cash / Money Market', desc: 'Savings, money market funds', icon: '💰' }
      ]
    }
  ];

  var RISK_DATA = {
    us_tech: {
      score: 75,
      level: 'HIGH',
      factors: [
        'China rare earth export controls threaten semiconductor supply chains (S&P Global, Jan 2026)',
        'US-China tech decoupling accelerating \u2014 chip restrictions + retaliatory controls',
        'AI sector correction risk \u2014 market concentration in top 5 stocks'
      ],
      watch: 'Monitor rare earth pricing and any escalation in US-China tech restrictions'
    },
    us_broad: {
      score: 55,
      level: 'MODERATE',
      factors: [
        'Universal tariffs (10-15%) creating margin pressure across sectors',
        'VIX elevated near 20 \u2014 investor sentiment bearish for 6th time in 13 weeks (AAII survey)',
        'S&P 500 approaching correction territory from 7000 peak'
      ],
      watch: 'Supreme Court tariff rulings could shift market direction overnight'
    },
    chinese: {
      score: 80,
      level: 'HIGH',
      factors: [
        'Property sector crisis (Evergrande/Country Garden) dragging GDP \u2014 ~30% of economy',
        'Youth unemployment above 20% \u2014 data publication suspended',
        'Total debt exceeding 300% of GDP with hidden local government liabilities'
      ],
      watch: 'Xi-Trump summit (April 2026) could reset or escalate trade tensions'
    },
    european: {
      score: 50,
      level: 'MODERATE',
      factors: [
        'Energy price volatility from Middle East conflict driving inflation',
        'NATO defense spending increases creating fiscal pressure',
        'Germany\u2019s economic slowdown dragging EU growth'
      ],
      watch: 'European Central Bank rate decisions in response to oil-driven inflation'
    },
    sa_stocks: {
      score: 55,
      level: 'MODERATE',
      factors: [
        'Rand vulnerability \u2014 2.3% single-day drop during risk-off events (Reuters, Mar 2026)',
        'Mining production up 4.6% but commodity price volatility remains high',
        'FATF grey list removal in 2025 boosted confidence but emerging market outflows persist'
      ],
      watch: 'USD/ZAR movements and load shedding schedule for mining output impact'
    },
    emerging: {
      score: 70,
      level: 'HIGH',
      factors: [
        'Capital flight to safe havens (USD, gold) during geopolitical escalation',
        'Dollar strength crushing EM currencies and debt servicing costs',
        'Trade route disruptions increasing import costs'
      ],
      watch: 'Federal Reserve rate path \u2014 any delay in cuts hammers EM assets'
    },
    bitcoin: {
      score: 72,
      level: 'HIGH',
      factors: [
        'Correlation with Nasdaq surged to 0.75 \u2014 trading as high-beta tech, not safe haven',
        '42% below ATH of $126K despite ETF inflows ($55B+ cumulative)',
        'Historical midterm year drawdowns: -56% (2014), -73% (2018), -64% (2022)'
      ],
      watch: 'If BTC breaks below $65K support, historical patterns suggest deeper correction'
    },
    ethereum: {
      score: 75,
      level: 'HIGH',
      factors: [
        'Largest 3-day loss since 2022 during tariff shock \u2014 down 25%',
        'DeFi regulatory uncertainty increasing globally',
        'Competition from Solana and layer-2s fragmenting ecosystem'
      ],
      watch: 'ETH/BTC ratio trend \u2014 continued decline signals structural weakness'
    },
    altcoins: {
      score: 88,
      level: 'CRITICAL',
      factors: [
        'Extreme volatility amplified during risk-off events',
        'Regulatory crackdowns accelerating (SEC enforcement actions)',
        'Most altcoins still 60-80% below 2024 highs'
      ],
      watch: 'Altcoins typically lag BTC recovery by 2-4 months \u2014 don\u2019t catch falling knives'
    },
    stablecoins: {
      score: 15,
      level: 'LOW',
      factors: [
        'USDT/USDC maintain peg stability through market turmoil',
        'Regulatory frameworks solidifying (MiCA in EU, potential US stablecoin bill)',
        'De-peg risk exists but historically brief and recoverable'
      ],
      watch: 'Tether reserve transparency reports \u2014 any audit concerns could shake confidence'
    },
    gold: {
      score: 12,
      level: 'LOW',
      factors: [
        'Record highs above $5,100/oz \u2014 central banks aggressively buying',
        'Ultimate safe haven during US-Iran conflict and trade war uncertainty',
        'Inverse correlation with risk assets strengthening'
      ],
      watch: 'Gold is your hedge, not your risk \u2014 but watch for profit-taking if tensions ease'
    },
    silver_pgms: {
      score: 30,
      level: 'LOW-MODERATE',
      factors: [
        'Industrial demand component adds volatility vs pure gold play',
        'SA platinum production strong but global demand shifting with EV adoption',
        'PGMs benefit from supply concentration risk (SA + Russia = 70%+ of platinum)'
      ],
      watch: 'Hydrogen economy developments could be the next catalyst for platinum'
    },
    oil_energy: {
      score: 78,
      level: 'HIGH',
      factors: [
        'Strait of Hormuz disruption \u2014 1/5 of global daily oil supply blocked',
        'Brent crude touched $100, Bloomberg estimates $150 if closure extends 60 days',
        'Oil stocks benefiting short-term but demand destruction risk if prices stay elevated'
      ],
      watch: 'Duration of Hormuz disruption is everything \u2014 weeks vs months changes the calculus'
    },
    rare_earths: {
      score: 85,
      level: 'CRITICAL',
      factors: [
        'China controls 70% mining, 90% processing \u2014 weaponizing supply as economic warfare',
        'New dual-use export controls targeting Japan, US defense supply chains',
        'Ex-China supply won\u2019t come online until 2027-2028 at earliest'
      ],
      watch: 'Any military escalation involving Taiwan would trigger total rare earth cutoff'
    },
    bonds: {
      score: 28,
      level: 'LOW-MODERATE',
      factors: [
        'US Treasuries = ultimate safe haven, yields declining as money flows in',
        'SA bonds saw 13.5bp yield spike during risk-off events \u2014 vulnerable to rand weakness',
        'Tariff-driven inflation expectations could push yields higher'
      ],
      watch: 'Real yields (yield minus inflation) \u2014 if negative, bonds are losing you money'
    },
    real_estate: {
      score: 45,
      level: 'MODERATE',
      factors: [
        'SA property market stabilizing but interest rate sensitivity remains high',
        'REITs correlated with bond yields \u2014 rate path is key',
        'Residential demand solid but commercial office space oversupply continues'
      ],
      watch: 'SARB rate decisions \u2014 next cut would boost property and REIT valuations'
    },
    cash: {
      score: 8,
      level: 'LOW',
      factors: [
        'Purchasing power erosion from inflation is the main risk',
        'SA money market rates attractive at current levels (~8%+)',
        'Opportunity cost if markets recover sharply'
      ],
      watch: 'Cash is a position, not a default \u2014 reassess allocation quarterly'
    }
  };

  /* ─── STATE ─── */
  var selectedAssets = {};
  var checkerStep = 0; // 0=selection, 1=email gate, 2=results
  var checkerRoot = document.getElementById('checkerApp');
  if (!checkerRoot) return;

  /* ─── SVG ICONS ─── */
  function alertIcon() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  }
  function eyeIcon() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
  function shieldCheckIcon() {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
  }

  /* ─── HELPERS ─── */
  function getSelectedIds() {
    var ids = [];
    for (var id in selectedAssets) {
      if (selectedAssets[id]) ids.push(id);
    }
    return ids;
  }

  function getSelectedCount() {
    return getSelectedIds().length;
  }

  function getLevelColor(level) {
    switch (level) {
      case 'LOW': return '#22c55e';
      case 'LOW-MODERATE': return '#84cc16';
      case 'MODERATE': return '#eab308';
      case 'HIGH': return '#f97316';
      case 'CRITICAL': return '#ef4444';
      default: return '#9ca3af';
    }
  }

  function getLevelBgAlpha(level) {
    switch (level) {
      case 'LOW': return 'rgba(34,197,94,0.1)';
      case 'LOW-MODERATE': return 'rgba(132,204,22,0.1)';
      case 'MODERATE': return 'rgba(234,179,8,0.1)';
      case 'HIGH': return 'rgba(249,115,22,0.1)';
      case 'CRITICAL': return 'rgba(239,68,68,0.15)';
      default: return 'rgba(156,163,175,0.1)';
    }
  }

  function calcPortfolioScore(ids) {
    if (ids.length === 0) return 0;
    var total = 0;
    for (var i = 0; i < ids.length; i++) {
      total += RISK_DATA[ids[i]].score;
    }
    return Math.round(total / ids.length);
  }

  function getPortfolioLevel(score) {
    if (score <= 20) return 'LOW';
    if (score <= 40) return 'LOW-MODERATE';
    if (score <= 60) return 'MODERATE';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  }

  function getTopRisks(ids) {
    var sorted = ids.slice().sort(function(a, b) {
      return RISK_DATA[b].score - RISK_DATA[a].score;
    });
    var top = [];
    for (var i = 0; i < Math.min(3, sorted.length); i++) {
      var d = RISK_DATA[sorted[i]];
      top.push({ id: sorted[i], name: getAssetName(sorted[i]), score: d.score, level: d.level, factor: d.factors[0] });
    }
    return top;
  }

  function getBlindSpot(ids) {
    // Find the highest-risk asset that people commonly overlook
    // Prioritize: rare_earths, oil_energy, altcoins, emerging — things people hold without realizing the risk
    var blindSpotOrder = ['rare_earths', 'oil_energy', 'altcoins', 'emerging', 'chinese', 'ethereum', 'bitcoin', 'us_tech'];
    for (var i = 0; i < blindSpotOrder.length; i++) {
      if (ids.indexOf(blindSpotOrder[i]) !== -1) {
        var d = RISK_DATA[blindSpotOrder[i]];
        return { name: getAssetName(blindSpotOrder[i]), score: d.score, level: d.level, watch: d.watch };
      }
    }
    // Fallback: highest score asset
    var sorted = ids.slice().sort(function(a, b) { return RISK_DATA[b].score - RISK_DATA[a].score; });
    if (sorted.length > 0) {
      var fd = RISK_DATA[sorted[0]];
      return { name: getAssetName(sorted[0]), score: fd.score, level: fd.level, watch: fd.watch };
    }
    return null;
  }

  function getAssetName(id) {
    for (var c = 0; c < ASSET_CATEGORIES.length; c++) {
      for (var a = 0; a < ASSET_CATEGORIES[c].assets.length; a++) {
        if (ASSET_CATEGORIES[c].assets[a].id === id) return ASSET_CATEGORIES[c].assets[a].name;
      }
    }
    return id;
  }

  function getAssetIcon(id) {
    for (var c = 0; c < ASSET_CATEGORIES.length; c++) {
      for (var a = 0; a < ASSET_CATEGORIES[c].assets.length; a++) {
        if (ASSET_CATEGORIES[c].assets[a].id === id) return ASSET_CATEGORIES[c].assets[a].icon;
      }
    }
    return '📦';
  }

  function checkEmailCaptured() {
    try {
      var quiz = sessionStorage.getItem('ih_quiz_data');
      if (quiz) {
        var parsed = JSON.parse(quiz);
        if (parsed.emailCaptured) return true;
      }
    } catch(e) {}
    try {
      var adv = sessionStorage.getItem('ih_advisor_data');
      if (adv) {
        var parsed2 = JSON.parse(adv);
        if (parsed2.emailCaptured) return true;
      }
    } catch(e) {}
    return false;
  }

  /* ─── RENDER ROUTER ─── */
  function render() {
    if (checkerStep === 0) {
      renderSelection();
    } else if (checkerStep === 1) {
      renderGate();
    } else {
      renderResults();
    }
  }

  /* ─── STEP 1: ASSET SELECTION ─── */
  function renderSelection() {
    var count = getSelectedCount();

    var html = '<div class="chk-selection">';
    html += '<div class="chk-sel-header">' +
      '<div class="chk-sel-icon">' + alertIcon() + '</div>' +
      '<h2 class="chk-sel-title">What\u2019s in your portfolio?</h2>' +
      '<p class="chk-sel-sub">Select everything you hold or are considering. We\u2019ll check your exposure.</p>' +
      '</div>';

    for (var c = 0; c < ASSET_CATEGORIES.length; c++) {
      var cat = ASSET_CATEGORIES[c];
      html += '<div class="chk-cat">' +
        '<div class="chk-cat-label">' + cat.label + '</div>' +
        '<div class="chk-cat-grid">';
      for (var a = 0; a < cat.assets.length; a++) {
        var asset = cat.assets[a];
        var isSelected = selectedAssets[asset.id] ? ' selected' : '';
        html += '<button class="chk-asset-card' + isSelected + '" data-asset="' + asset.id + '">' +
          '<span class="chk-asset-icon">' + asset.icon + '</span>' +
          '<span class="chk-asset-name">' + asset.name + '</span>' +
          '<span class="chk-asset-desc">' + asset.desc + '</span>' +
          '<span class="chk-asset-check">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</span>' +
          '</button>';
      }
      html += '</div></div>';
    }

    html += '<div class="chk-sel-footer">' +
      '<div class="chk-sel-count">' + count + ' asset' + (count !== 1 ? 's' : '') + ' selected</div>' +
      '<button class="chk-btn chk-btn-primary" id="chkAnalyze"' + (count === 0 ? ' disabled' : '') + '>Check My Exposure \u2192</button>' +
      '</div>';

    html += '</div>';

    checkerRoot.innerHTML = html;

    // Bind asset card clicks
    var cards = checkerRoot.querySelectorAll('.chk-asset-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function() {
        var id = this.getAttribute('data-asset');
        selectedAssets[id] = !selectedAssets[id];
        render();
      });
    }

    // Bind analyze button
    var analyzeBtn = document.getElementById('chkAnalyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', function() {
        if (getSelectedCount() > 0) {
          checkerStep = 1;
          render();
        }
      });
    }
  }

  /* ─── STEP 2: EMAIL GATE ─── */
  function renderGate() {
    // Skip if email already captured
    if (checkEmailCaptured()) {
      checkerStep = 2;
      render();
      return;
    }

    var html = '<div class="chk-card">' +
      '<div class="chk-gate">' +
      '<div class="chk-gate-icon">' + shieldCheckIcon() + '</div>' +
      '<h2>Before we reveal your risk profile\u2026</h2>' +
      '<p>Where should we send your full report?</p>' +
      '<form class="chk-gate-form" id="chkGateForm">' +
      '<input type="email" class="chk-gate-input" id="chkEmail" placeholder="you@email.com" required autocomplete="email">' +
      '<button type="submit" class="chk-btn chk-btn-primary">Get My Risk Report</button>' +
      '</form>' +
      '<button class="chk-gate-skip" id="chkSkip">Skip \u2014 just show me</button>' +
      '<p class="chk-gate-fine">No spam. Unsubscribe anytime.</p>' +
      '</div></div>';

    checkerRoot.innerHTML = html;

    // Skip button
    document.getElementById('chkSkip').addEventListener('click', function() {
      checkerStep = 2;
      render();
    });

    // Form submit
    document.getElementById('chkGateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('chkEmail').value;
      if (!email) return;

      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Analyzing\u2026';
      btn.disabled = true;

      var ids = getSelectedIds();
      fetch('https://formspree.io/f/xgoneypk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          _subject: 'Portfolio Exposure Checker \u2014 New Lead',
          assets_selected: ids.join(', '),
          portfolio_score: calcPortfolioScore(ids),
          asset_count: ids.length
        })
      }).then(function() {
        checkerStep = 2;
        render();
      }).catch(function() {
        checkerStep = 2;
        render();
      });
    });
  }

  /* ─── STEP 3: RESULTS ─── */
  function renderResults() {
    var ids = getSelectedIds();
    var portfolioScore = calcPortfolioScore(ids);
    var portfolioLevel = getPortfolioLevel(portfolioScore);
    var topRisks = getTopRisks(ids);
    var blindSpot = getBlindSpot(ids);

    // Store in sessionStorage
    try {
      sessionStorage.setItem('ih_checker_data', JSON.stringify({
        assets: ids,
        score: portfolioScore,
        level: portfolioLevel,
        timestamp: new Date().toISOString()
      }));
    } catch(e) {}

    var html = '<div class="chk-results">';

    // ── Portfolio Summary ──
    html += '<div class="chk-summary">';
    html += '<div class="chk-summary-header">' +
      '<h2 class="chk-summary-title">Portfolio Risk Report</h2>' +
      '<p class="chk-summary-sub">' + ids.length + ' asset' + (ids.length !== 1 ? 's' : '') + ' analyzed \u2022 Based on current geopolitical events</p>' +
      '</div>';

    // Risk meter
    html += '<div class="chk-meter-wrap">' +
      '<div class="chk-meter">' +
      '<div class="chk-meter-track">' +
      '<div class="chk-meter-fill" style="width:' + portfolioScore + '%;background:' + getLevelColor(portfolioLevel) + ';"></div>' +
      '</div>' +
      '<div class="chk-meter-labels">' +
      '<span>LOW</span><span>MODERATE</span><span>HIGH</span><span>CRITICAL</span>' +
      '</div>' +
      '</div>' +
      '<div class="chk-meter-score">' +
      '<div class="chk-meter-number" style="color:' + getLevelColor(portfolioLevel) + ';">' + portfolioScore + '</div>' +
      '<div class="chk-meter-label">Overall Risk Score</div>' +
      '<span class="chk-level-badge" style="background:' + getLevelBgAlpha(portfolioLevel) + ';color:' + getLevelColor(portfolioLevel) + ';border-color:' + getLevelColor(portfolioLevel) + ';">' + portfolioLevel + '</span>' +
      '</div>' +
      '</div>';

    // Top 3 risks
    if (topRisks.length > 0) {
      html += '<div class="chk-top-risks">' +
        '<div class="chk-top-risks-title">Top Risks in Your Portfolio</div>' +
        '<div class="chk-top-risks-list">';
      for (var t = 0; t < topRisks.length; t++) {
        var tr = topRisks[t];
        html += '<div class="chk-top-risk-item">' +
          '<div class="chk-top-risk-rank">' + (t + 1) + '</div>' +
          '<div class="chk-top-risk-info">' +
          '<div class="chk-top-risk-name">' + tr.name +
          ' <span class="chk-level-badge chk-level-badge-sm" style="background:' + getLevelBgAlpha(tr.level) + ';color:' + getLevelColor(tr.level) + ';border-color:' + getLevelColor(tr.level) + ';">' + tr.level + '</span></div>' +
          '<div class="chk-top-risk-factor">' + tr.factor + '</div>' +
          '</div>' +
          '<div class="chk-top-risk-score" style="color:' + getLevelColor(tr.level) + ';">' + tr.score + '</div>' +
          '</div>';
      }
      html += '</div></div>';
    }

    // Blind spot
    if (blindSpot) {
      html += '<div class="chk-blindspot">' +
        '<div class="chk-blindspot-icon">' + eyeIcon() + '</div>' +
        '<div class="chk-blindspot-content">' +
        '<div class="chk-blindspot-label">Your Biggest Blind Spot</div>' +
        '<div class="chk-blindspot-name">' + blindSpot.name + ' <span style="color:' + getLevelColor(blindSpot.level) + ';">(' + blindSpot.score + '/100)</span></div>' +
        '<div class="chk-blindspot-watch">' + blindSpot.watch + '</div>' +
        '</div>' +
        '</div>';
    }

    html += '</div>'; // close chk-summary

    // ── Individual Risk Cards ──
    html += '<div class="chk-cards-header">' +
      '<h3>Detailed Asset Analysis</h3>' +
      '</div>';
    html += '<div class="chk-risk-cards">';

    // Sort by risk score descending
    var sortedIds = ids.slice().sort(function(a, b) { return RISK_DATA[b].score - RISK_DATA[a].score; });

    for (var i = 0; i < sortedIds.length; i++) {
      var assetId = sortedIds[i];
      var data = RISK_DATA[assetId];
      var name = getAssetName(assetId);
      var icon = getAssetIcon(assetId);
      var levelColor = getLevelColor(data.level);

      html += '<div class="chk-risk-card" style="--risk-color:' + levelColor + ';">' +
        '<div class="chk-risk-card-head">' +
        '<div class="chk-risk-card-left">' +
        '<span class="chk-risk-card-icon">' + icon + '</span>' +
        '<div>' +
        '<div class="chk-risk-card-name">' + name + '</div>' +
        '<span class="chk-level-badge" style="background:' + getLevelBgAlpha(data.level) + ';color:' + levelColor + ';border-color:' + levelColor + ';">' + data.level + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="chk-risk-card-score" style="color:' + levelColor + ';">' + data.score + '<span>/100</span></div>' +
        '</div>';

      // Score bar
      html += '<div class="chk-risk-bar">' +
        '<div class="chk-risk-bar-fill" style="width:' + data.score + '%;background:' + levelColor + ';"></div>' +
        '</div>';

      // Risk factors
      html += '<ul class="chk-risk-factors">';
      for (var f = 0; f < data.factors.length; f++) {
        html += '<li>' + data.factors[f] + '</li>';
      }
      html += '</ul>';

      // What to watch
      html += '<div class="chk-risk-watch">' +
        '<div class="chk-risk-watch-icon">' + eyeIcon() + '</div>' +
        '<div class="chk-risk-watch-text"><strong>What to watch:</strong> ' + data.watch + '</div>' +
        '</div>';

      html += '</div>'; // close chk-risk-card
    }

    html += '</div>'; // close chk-risk-cards

    // ── CTAs ──
    html += '<div class="chk-ctas">';

    // Strategy advisor CTA
    html += '<div class="chk-cta-card chk-cta-strategy" id="chkCtaStrategy">' +
      '<div class="chk-cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>' +
      '<h4>Explore Your Strategy</h4>' +
      '<p>Get a personalized action plan based on your goals and risk profile.</p>' +
      '<span class="chk-cta-link">Open Strategy Advisor \u2192</span>' +
      '</div>';

    // Deep dives CTA
    html += '<div class="chk-cta-card chk-cta-deepdives" id="chkCtaDeepDives">' +
      '<div class="chk-cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>' +
      '<h4>Read the Deep Dives</h4>' +
      '<p>The research behind this analysis \u2014 free intelligence reports.</p>' +
      '<span class="chk-cta-link">Explore Deep Dives \u2192</span>' +
      '</div>';

    // Premium CTA
    html += '<a href="https://paystack.shop/pay/sv2a1f-7t-" target="_blank" rel="noopener noreferrer" class="chk-cta-card chk-cta-premium">' +
      '<div class="chk-cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>' +
      '<h4>Get Premium Intelligence</h4>' +
      '<p>Weekly reports covering the markets and signals that matter to your portfolio.</p>' +
      '<span class="chk-cta-link">Become a Founding Member \u2192</span>' +
      '</a>';

    html += '</div>'; // close chk-ctas

    // ── Actions row ──
    html += '<div class="chk-actions">' +
      '<button class="chk-action-btn chk-action-retake" id="chkRetake">Recheck Portfolio</button>' +
      '<div class="chk-share">' +
      '<span>Share</span>' +
      '<a href="https://twitter.com/intent/tweet?text=My%20portfolio%20risk%20score%20is%20' + portfolioScore + '%2F100.%20Check%20your%20exposure%3A%20informationhubnews.netlify.app&via=HubInforma272" target="_blank" rel="noopener" aria-label="Share on X">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '</a>' +
      '<a href="https://wa.me/?text=My%20portfolio%20risk%20score%20is%20' + portfolioScore + '%2F100.%20Check%20your%20exposure%3A%20informationhubnews.netlify.app" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '</a>' +
      '</div>' +
      '</div>';

    html += '</div>'; // close chk-results

    checkerRoot.innerHTML = html;

    // Bind retake
    document.getElementById('chkRetake').addEventListener('click', function() {
      checkerStep = 0;
      selectedAssets = {};
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Bind strategy CTA
    var stratBtn = document.getElementById('chkCtaStrategy');
    if (stratBtn) {
      stratBtn.addEventListener('click', function() {
        if (typeof window.switchTab === 'function') {
          window.switchTab('strategy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // Bind deep dives CTA
    var ddBtn = document.getElementById('chkCtaDeepDives');
    if (ddBtn) {
      ddBtn.addEventListener('click', function() {
        if (typeof window.switchTab === 'function') {
          window.switchTab('home');
          setTimeout(function() {
            var ddSection = document.getElementById('deepDiveBrief');
            if (ddSection) {
              ddSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 400);
        }
      });
    }

    // Animate risk cards
    setTimeout(function() {
      var riskCards = checkerRoot.querySelectorAll('.chk-risk-card');
      for (var rc = 0; rc < riskCards.length; rc++) {
        (function(el, delay) {
          setTimeout(function() { el.classList.add('visible'); }, delay);
        })(riskCards[rc], rc * 120);
      }
    }, 100);

    // Animate meter fill
    setTimeout(function() {
      var fill = checkerRoot.querySelector('.chk-meter-fill');
      if (fill) fill.classList.add('animate');
    }, 200);
  }

  /* ─── INITIALIZATION ─── */
  // Expose for external triggering
  window.startChecker = function() {
    checkerStep = 0;
    selectedAssets = {};
    render();
  };

  // Auto-init when tab becomes visible
  var observer = new MutationObserver(function() {
    if (checkerRoot && checkerRoot.closest('.tab-content') &&
        checkerRoot.closest('.tab-content').classList.contains('active') &&
        checkerRoot.innerHTML === '') {
      render();
    }
  });
  var tabEl = document.getElementById('tab-portfolio');
  if (tabEl) {
    observer.observe(tabEl, { attributes: true, attributeFilter: ['class'] });
  }
  if (tabEl && tabEl.classList.contains('active')) {
    render();
  }

  // Hook into switchTab
  var origSwitch3 = window.switchTab;
  window.switchTab = function(id) {
    origSwitch3(id);
    if (id === 'portfolio' && checkerRoot && checkerRoot.innerHTML === '') {
      setTimeout(render, 50);
    }
  };
})();
