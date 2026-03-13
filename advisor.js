// advisor.js — Strategy Advisor Interactive Tool
(function() {
  'use strict';

  /* ─── ADVISOR QUESTIONS (4 new inputs) ─── */
  var ADVISOR_QUESTIONS = [
    {
      q: "What is your primary financial goal right now?",
      opts: [
        { text: "Build an emergency fund — I need a safety net first", value: "emergency", icon: "🛡" },
        { text: "Start investing — I want my money working for me", value: "invest", icon: "📈" },
        { text: "Protect existing wealth — preserve what I've built", value: "protect", icon: "🔒" },
        { text: "Generate side income — diversify my revenue streams", value: "income", icon: "💡" }
      ]
    },
    {
      q: "How much can you realistically set aside each month?",
      opts: [
        { text: "Under R500 — tight, but I want to start somewhere", value: "under500", icon: "R" },
        { text: "R500 – R2,000 — steady contributions", value: "500to2k", icon: "R" },
        { text: "R2,000 – R10,000 — meaningful capital", value: "2kto10k", icon: "R" },
        { text: "R10,000+ — significant monthly allocation", value: "over10k", icon: "R" }
      ]
    },
    {
      q: "What is your risk tolerance?",
      opts: [
        { text: "Conservative — protect my capital above all else", value: "conservative", icon: "🟢" },
        { text: "Moderate — steady growth, I can handle some dips", value: "moderate", icon: "🟡" },
        { text: "Aggressive — high growth potential, I accept volatility", value: "aggressive", icon: "🔴" }
      ]
    },
    {
      q: "What is your investment time horizon?",
      opts: [
        { text: "Under 1 year — short-term moves", value: "short", icon: "⚡" },
        { text: "1 – 3 years — medium-term positioning", value: "medium", icon: "📅" },
        { text: "3 – 5+ years — long-term wealth building", value: "long", icon: "🏔" }
      ]
    }
  ];

  /* ─── STRATEGY ENGINE ─── */
  // Strategy recommendations keyed by pillar
  function generateStrategy(quizData, advisorAnswers) {
    var kPosition = quizData.resultKey || 'middle';
    var score = quizData.score || 12;
    var goal = advisorAnswers[0];
    var budget = advisorAnswers[1];
    var risk = advisorAnswers[2];
    var horizon = advisorAnswers[3];

    var strategy = {
      shield: { title: 'SHIELD', subtitle: 'Inflation Protection', icon: shieldIcon(), items: [], color: '#22c55e' },
      build:  { title: 'BUILD',  subtitle: 'Asset Allocation',    icon: buildIcon(),  items: [], color: '#d4a843' },
      earn:   { title: 'EARN',   subtitle: 'Income Diversification', icon: earnIcon(), items: [], color: '#8b5cf6' },
      watch:  { title: 'WATCH',  subtitle: 'Market Signals',      icon: watchIcon(),  items: [], color: '#3b82f6' }
    };

    // ── SHIELD pillar ──
    if (kPosition === 'falling') {
      strategy.shield.items.push('Track your actual inflation rate — food, transport, and rent hit the lower K hardest. Log monthly spend to spot where to cut.');
      strategy.shield.items.push('Move any savings out of a standard savings account into a money market fund (e.g., Allan Gray, Satrix) — these beat inflation without locking your capital.');
      if (budget === 'under500') {
        strategy.shield.items.push('Even R200/month into a tax-free savings account (TFSA) compounds significantly over 5 years — start before you feel ready.');
      }
    } else if (kPosition === 'middle') {
      strategy.shield.items.push('Your purchasing power is being eroded silently. Audit subscriptions, insurance premiums, and recurring costs quarterly — switch providers if you are overpaying.');
      strategy.shield.items.push('Consider inflation-linked bonds (ILBs) as a portion of your portfolio — they are specifically designed to preserve purchasing power.');
      strategy.shield.items.push('If you hold ZAR-only assets, you are fully exposed to Rand weakness. Even a small USD or EUR allocation acts as a natural hedge.');
    } else {
      strategy.shield.items.push('Your asset base absorbs inflation well, but complacency is the risk. Review whether your returns are beating CPI + 3% — anything less means you are losing ground in real terms.');
      strategy.shield.items.push('Diversify across jurisdictions — SA-only exposure carries concentration risk regardless of asset class.');
      if (risk === 'conservative') {
        strategy.shield.items.push('Gold allocation of 5–10% of portfolio acts as a crisis hedge without sacrificing long-term returns. Our Gold in 2026 deep dive covers this in detail.');
      }
    }

    // ── BUILD pillar ──
    if (goal === 'emergency') {
      strategy.build.items.push('Target 3 months of expenses before investing. Use a high-yield money market account (Tyme Bank, Discovery Bank, or Allan Gray Money Market) for instant access.');
      if (budget === 'under500') {
        strategy.build.items.push('R500/month gets you to a R6,000 emergency fund in 12 months. That is a genuine financial buffer — do not underestimate its psychological value.');
      } else {
        strategy.build.items.push('Automate the transfer on payday — what is automated gets done. Set up a debit order to remove willpower from the equation.');
      }
    } else if (goal === 'invest') {
      if (risk === 'aggressive' && horizon === 'long') {
        strategy.build.items.push('With a long horizon and high risk tolerance, allocate: 40% equities (global ETFs like Vanguard S&P 500), 25% crypto (BTC/ETH core), 20% SA equities (Top 40 ETF), 15% commodities/gold.');
        strategy.build.items.push('Dollar-cost average into positions — do not try to time the market. Set up monthly auto-buys on Luno (crypto) and EasyEquities (equities).');
      } else if (risk === 'moderate') {
        strategy.build.items.push('Balanced allocation: 50% equities (mix of SA and global ETFs), 20% bonds/money market, 15% gold/commodities, 15% crypto (BTC only for moderate risk).');
        strategy.build.items.push('Rebalance quarterly — when one asset class runs up significantly, trim and redistribute. This is how you buy low and sell high systematically.');
      } else {
        strategy.build.items.push('Conservative investing: 40% money market/bonds, 30% diversified equity ETFs, 20% inflation-linked bonds, 10% gold. Avoid single stocks and speculative crypto.');
        strategy.build.items.push('Focus on income-generating assets — dividend ETFs (Satrix DIVI) provide steady returns without relying on capital growth.');
      }
    } else if (goal === 'protect') {
      strategy.build.items.push('Wealth preservation = diversification across asset classes, currencies, and jurisdictions. No single position should exceed 15% of total portfolio.');
      strategy.build.items.push('Consider offshore feeder funds through Allan Gray, Coronation, or Ninety One for USD-denominated exposure without the complexity of foreign accounts.');
      if (horizon === 'short') {
        strategy.build.items.push('Short-term preservation: move to money market and short-duration bonds. Avoid equity exposure if you need access within 12 months.');
      }
    } else {
      strategy.build.items.push('Side income assets: consider dividend-paying stocks, rental property (if capital allows), or digital products. The goal is cash flow, not capital gains.');
      if (budget === 'over10k' || budget === '2kto10k') {
        strategy.build.items.push('With R2K+ monthly surplus, you have enough to build a meaningful dividend portfolio. Satrix DIVI or global REIT ETFs provide monthly/quarterly income.');
      }
    }

    // ── EARN pillar ──
    if (kPosition === 'falling') {
      strategy.earn.items.push('Focus on skills that pay in the digital economy — freelance writing, data entry, social media management, or basic coding can be learned free on YouTube and freeCodeCamp.');
      strategy.earn.items.push('Gig platforms (Fiverr, Upwork, Mr D, Bolt) provide immediate income while you build longer-term revenue streams.');
      strategy.earn.items.push('The K-shaped divide rewards those with digital access and skills — closing that gap is the highest-ROI move you can make.');
    } else if (kPosition === 'middle') {
      strategy.earn.items.push('Your industry position is stable but not growing. Identify one adjacent skill that would increase your market value by 20% — certifications, technical skills, or management training.');
      strategy.earn.items.push('Consider a side project that leverages your existing expertise — consulting, freelancing, or creating educational content in your field.');
      if (goal === 'income') {
        strategy.earn.items.push('Newsletter or content businesses have near-zero startup costs and can generate R5K–R50K/month within 12–18 months if you are consistent.');
      }
    } else {
      strategy.earn.items.push('Your earning power is strong — the leverage move is passive income. Focus on assets that generate cash flow without your direct time (dividends, rental income, royalties, digital products).');
      strategy.earn.items.push('Invest in systems, not just assets. Automate your portfolio management, set up alerts for rebalancing triggers, and delegate where possible.');
    }

    // ── WATCH pillar ──
    strategy.watch.items.push('USD/ZAR — the Rand is your single biggest macro risk if you earn and spend in ZAR. A weakening Rand erodes your purchasing power even if your salary stays flat.');

    if (risk === 'aggressive' || goal === 'invest') {
      strategy.watch.items.push('BTC dominance and ETH/BTC ratio — these signal whether capital is flowing into or out of risk assets. When BTC dominance rises, altcoins typically underperform.');
      strategy.watch.items.push('Federal Reserve rate decisions — US monetary policy moves all global markets. Rate cuts = risk-on (good for equities/crypto). Rate hikes = risk-off.');
    }

    if (kPosition === 'falling' || kPosition === 'middle') {
      strategy.watch.items.push('SA CPI (Consumer Price Index) — released monthly by Stats SA. If CPI is rising faster than your income growth, you are falling behind in real terms.');
      strategy.watch.items.push('Gold price — gold historically outperforms during periods of uncertainty and inflation. Our Gold in 2026 deep dive provides the full analysis.');
    }

    if (horizon === 'long') {
      strategy.watch.items.push('US-China trade tensions — the Thucydides Trap dynamic reshapes global supply chains and commodity prices. Our deep dive covers the investment implications.');
    }

    strategy.watch.items.push('Global shipping and trade routes — disruptions in the Strait of Hormuz or Suez Canal directly impact oil prices, which cascade into food and transport costs. Our Sea Trade deep dive maps this in detail.');

    return strategy;
  }

  /* ─── SVG ICONS ─── */
  function shieldIcon() {
    return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
  }
  function buildIcon() {
    return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
  }
  function earnIcon() {
    return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
  }
  function watchIcon() {
    return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  }

  /* ─── STATE ─── */
  var advisorCurrent = 0;
  var advisorAnswers = [];
  var quizDataFromQuiz = null; // populated when coming from quiz
  var advisorRoot = document.getElementById('advisorApp');
  if (!advisorRoot) return;

  // Check if quiz data was passed
  function checkQuizData() {
    try {
      var stored = sessionStorage.getItem('ih_quiz_data');
      if (stored) {
        quizDataFromQuiz = JSON.parse(stored);
        return true;
      }
    } catch(e) {}
    return false;
  }

  /* ─── RENDER ROUTER ─── */
  function render() {
    if (advisorCurrent < ADVISOR_QUESTIONS.length) {
      renderQuestion();
    } else if (advisorCurrent === ADVISOR_QUESTIONS.length) {
      renderGate();
    } else {
      renderResult();
    }
  }

  /* ─── QUESTION RENDERER ─── */
  function renderQuestion() {
    var q = ADVISOR_QUESTIONS[advisorCurrent];
    var pct = ((advisorCurrent) / ADVISOR_QUESTIONS.length * 100).toFixed(0);
    var selected = advisorAnswers[advisorCurrent] !== undefined ? advisorAnswers[advisorCurrent] : -1;

    var html = '<div class="adv-progress">' +
      '<div class="adv-progress-bar"><div class="adv-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="adv-progress-text"><span>Question ' + (advisorCurrent + 1) + ' of ' + ADVISOR_QUESTIONS.length + '</span><span>' + pct + '%</span></div>' +
      '</div>' +
      '<div class="adv-card">' +
      '<div class="adv-question-num">Question ' + (advisorCurrent + 1) + '</div>' +
      '<div class="adv-question">' + q.q + '</div>' +
      '<div class="adv-options">';

    for (var i = 0; i < q.opts.length; i++) {
      var sel = selected === i ? ' selected' : '';
      html += '<button class="adv-option' + sel + '" data-idx="' + i + '">' +
        '<span class="adv-option-icon">' + q.opts[i].icon + '</span>' +
        '<span>' + q.opts[i].text + '</span></button>';
    }

    html += '</div>' +
      '<div class="adv-nav">';
    if (advisorCurrent > 0) {
      html += '<button class="adv-btn adv-btn-back" id="advBack">Back</button>';
    }
    html += '<button class="adv-btn adv-btn-next" id="advNext"' + (selected === -1 ? ' disabled' : '') + '>' +
      (advisorCurrent === ADVISOR_QUESTIONS.length - 1 ? 'Get My Strategy' : 'Next') + '</button>' +
      '</div></div>';

    advisorRoot.innerHTML = html;

    // Bind clicks
    var opts = advisorRoot.querySelectorAll('.adv-option');
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        advisorAnswers[advisorCurrent] = idx;
        render();
      });
    }

    var backBtn = document.getElementById('advBack');
    if (backBtn) {
      backBtn.addEventListener('click', function() { advisorCurrent--; render(); });
    }
    var nextBtn = document.getElementById('advNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (advisorAnswers[advisorCurrent] !== undefined) { advisorCurrent++; render(); }
      });
    }
  }

  /* ─── EMAIL GATE ─── */
  function renderGate() {
    // Skip gate if email already captured from quiz
    if (quizDataFromQuiz && quizDataFromQuiz.emailCaptured) {
      advisorCurrent = ADVISOR_QUESTIONS.length + 1;
      render();
      return;
    }

    var html = '<div class="adv-card">' +
      '<div class="adv-gate">' +
      '<h2>Your strategy brief is ready.</h2>' +
      '<p>Enter your email to unlock your personalized economic strategy — tailored to your K-position, goals, and risk profile.</p>' +
      '<form class="adv-gate-form" id="advGateForm">' +
      '<input type="email" class="adv-gate-input" id="advEmail" placeholder="you@email.com" required autocomplete="email">' +
      '<button type="submit" class="adv-btn adv-btn-next">Unlock My Strategy</button>' +
      '</form>' +
      '<p class="adv-gate-fine">No spam. Unsubscribe anytime.</p>' +
      '<div class="adv-nav" style="justify-content:center;margin-top:1.5rem;">' +
      '<button class="adv-btn adv-btn-back" id="advGateBack">Back to questions</button>' +
      '</div>' +
      '</div></div>';

    advisorRoot.innerHTML = html;

    document.getElementById('advGateBack').addEventListener('click', function() {
      advisorCurrent = ADVISOR_QUESTIONS.length - 1;
      render();
    });

    document.getElementById('advGateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('advEmail').value;
      if (!email) return;

      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Generating...';
      btn.disabled = true;

      // Get advisor answer values
      var answerValues = [];
      for (var i = 0; i < advisorAnswers.length; i++) {
        answerValues.push(ADVISOR_QUESTIONS[i].opts[advisorAnswers[i]].value);
      }

      var quizInfo = quizDataFromQuiz || { resultKey: 'middle', score: 12 };

      fetch('https://formspree.io/f/xgoneypk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          _subject: 'Strategy Advisor — New Lead',
          k_position: quizInfo.resultKey,
          quiz_score: quizInfo.score,
          goal: answerValues[0],
          budget: answerValues[1],
          risk: answerValues[2],
          horizon: answerValues[3]
        })
      }).then(function() {
        advisorCurrent = ADVISOR_QUESTIONS.length + 1;
        render();
      }).catch(function() {
        advisorCurrent = ADVISOR_QUESTIONS.length + 1;
        render();
      });
    });
  }

  /* ─── RESULT RENDERER ─── */
  function renderResult() {
    // Resolve answer values
    var answerValues = [];
    for (var i = 0; i < advisorAnswers.length; i++) {
      answerValues.push(ADVISOR_QUESTIONS[i].opts[advisorAnswers[i]].value);
    }

    var quizInfo = quizDataFromQuiz || { resultKey: 'middle', score: 12 };
    var strategy = generateStrategy(quizInfo, answerValues);

    var kLabel = { rising: 'Rising Arm', middle: 'Squeezed Middle', falling: 'Falling Arm' };
    var kColor = { rising: '#22c55e', middle: '#d4a843', falling: '#ef4444' };
    var kKey = quizInfo.resultKey || 'middle';

    // Build HTML
    var html = '<div class="adv-result">';

    // Header
    html += '<div class="adv-result-header">' +
      '<span class="adv-result-kbadge" style="border-color:' + kColor[kKey] + ';color:' + kColor[kKey] + ';">' + kLabel[kKey] + '</span>' +
      '<h2 class="adv-result-title">Your Personalized Strategy Brief</h2>' +
      '<p class="adv-result-sub">Built from your K-position, financial goal, risk profile, and time horizon. These are actionable steps — not generic advice.</p>' +
      '</div>';

    // Strategy Cards
    var pillars = ['shield', 'build', 'earn', 'watch'];
    html += '<div class="adv-pillars">';
    for (var p = 0; p < pillars.length; p++) {
      var s = strategy[pillars[p]];
      html += '<div class="adv-pillar" style="--pillar-color:' + s.color + ';">' +
        '<div class="adv-pillar-head">' +
        '<div class="adv-pillar-icon">' + s.icon + '</div>' +
        '<div><div class="adv-pillar-title">' + s.title + '</div>' +
        '<div class="adv-pillar-sub">' + s.subtitle + '</div></div>' +
        '</div>' +
        '<ul class="adv-pillar-list">';
      for (var li = 0; li < s.items.length; li++) {
        html += '<li>' + s.items[li] + '</li>';
      }
      html += '</ul></div>';
    }
    html += '</div>';

    // Relevant Deep Dives
    html += '<div class="adv-deepdives">' +
      '<h3 class="adv-deepdives-title">Recommended Reading</h3>' +
      '<p class="adv-deepdives-sub">These deep dives are directly relevant to your strategy profile.</p>' +
      '<div class="adv-deepdives-grid">';

    // Always show K-Shaped
    html += deepDiveCard('The K-Shaped Economy', 'Understand the economic divide shaping your position', './k-shaped-economy-deep-dive.pdf');

    // Conditional deep dives
    if (answerValues[2] === 'conservative' || kKey === 'middle' || kKey === 'falling') {
      html += deepDiveCard('Gold in 2026', 'Precious metals as an inflation hedge and crisis asset', null);
    }
    if (answerValues[3] === 'long') {
      html += deepDiveCard('The Thucydides Trap', 'US-China dynamics and their impact on global investments', './thucydides-trap-deep-dive.pdf');
    }
    html += deepDiveCard('Sea Trade Route Race', 'How shipping disruptions cascade into prices you pay daily', './sea-trade-route-deep-dive.pdf');

    html += '</div></div>';

    // Subscription CTA
    html += '<div class="adv-subscription-cta">' +
      '<p class="adv-sub-lead">This strategy was built on today\'s data. Markets shift weekly.</p>' +
      '<h3>Get Updated Strategy Insights</h3>' +
      '<p>The Deep Dive Brief delivers weekly intelligence reports covering the exact markets, trends, and signals that matter to your profile.</p>' +
      '<a href="https://paystack.shop/pay/sv2a1f-7t-" target="_blank" rel="noopener noreferrer" class="adv-sub-btn">Become a Founding Member — R99/month</a>' +
      '<p class="adv-sub-fine">First 20 subscribers lock in R99/month forever.</p>' +
      '</div>';

    // Actions
    html += '<div class="adv-actions">' +
      '<button class="adv-action-btn adv-action-retake" id="advRetake">Retake Strategy Advisor</button>' +
      '<div class="adv-share">' +
      '<span>Share</span>' +
      '<a href="https://twitter.com/intent/tweet?text=I%20just%20got%20my%20personalized%20economic%20strategy%20from%20Information%20Hub.%20Try%20it%3A%20informationhubnews.netlify.app&via=HubInforma272" target="_blank" rel="noopener" aria-label="Share on X">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '</a>' +
      '<a href="https://wa.me/?text=I%20just%20got%20my%20personalized%20economic%20strategy%20from%20Information%20Hub.%20Try%20it%3A%20informationhubnews.netlify.app" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '</a>' +
      '</div>' +
      '</div>';

    html += '</div>'; // close adv-result

    advisorRoot.innerHTML = html;

    // Bind retake
    document.getElementById('advRetake').addEventListener('click', function() {
      advisorCurrent = 0;
      advisorAnswers = [];
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animate pillars
    setTimeout(function() {
      var cards = advisorRoot.querySelectorAll('.adv-pillar');
      for (var c = 0; c < cards.length; c++) {
        (function(el, delay) {
          setTimeout(function() { el.classList.add('visible'); }, delay);
        })(cards[c], c * 150);
      }
    }, 100);
  }

  function deepDiveCard(title, desc, href) {
    if (href) {
      return '<a href="' + href + '" download class="adv-dd-card">' +
        '<div class="adv-dd-title">' + title + '</div>' +
        '<div class="adv-dd-desc">' + desc + '</div>' +
        '<span class="adv-dd-action">Download Free PDF →</span>' +
        '</a>';
    }
    return '<div class="adv-dd-card adv-dd-coming">' +
      '<div class="adv-dd-title">' + title + '</div>' +
      '<div class="adv-dd-desc">' + desc + '</div>' +
      '<span class="adv-dd-action">Coming Soon</span>' +
      '</div>';
  }

  /* ─── INITIALIZATION ─── */
  // Expose for external triggering
  window.startAdvisor = function(quizData) {
    if (quizData) {
      quizDataFromQuiz = quizData;
      sessionStorage.setItem('ih_quiz_data', JSON.stringify(quizData));
    }
    advisorCurrent = 0;
    advisorAnswers = [];
    checkQuizData();
    render();
  };

  // Auto-init when tab becomes visible
  var observer = new MutationObserver(function() {
    if (advisorRoot && advisorRoot.closest('.tab-content') &&
        advisorRoot.closest('.tab-content').classList.contains('active') &&
        advisorRoot.innerHTML === '') {
      checkQuizData();
      render();
    }
  });
  var tabEl = document.getElementById('tab-strategy');
  if (tabEl) {
    observer.observe(tabEl, { attributes: true, attributeFilter: ['class'] });
  }
  if (tabEl && tabEl.classList.contains('active')) {
    checkQuizData();
    render();
  }

  // Hook into switchTab
  var origSwitch2 = window.switchTab;
  window.switchTab = function(id) {
    origSwitch2(id);
    if (id === 'strategy' && advisorRoot && advisorRoot.innerHTML === '') {
      checkQuizData();
      setTimeout(render, 50);
    }
  };
})();
