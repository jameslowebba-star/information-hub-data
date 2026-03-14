/* Safe storage wrapper — fallback for sandboxed environments */
var safeStorage=(function(){try{safeStorage.setItem("__t","1");safeStorage.removeItem("__t");return safeStorage;}catch(e){var m={};return{getItem:function(k){return m[k]||null;},setItem:function(k,v){m[k]=String(v);},removeItem:function(k){delete m[k];}};}})();
// quiz.js — K-Shaped Economy Interactive Quiz
(function() {
  'use strict';

  var QUESTIONS = [
    {
      q: "Over the past 3 years, how has your household income changed?",
      opts: [
        { text: "Grown significantly — I've had raises, promotions, or new income streams", score: 3 },
        { text: "Stayed roughly the same — keeping up, but not getting ahead", score: 2 },
        { text: "Declined or stagnated — my spending power has dropped", score: 1 }
      ]
    },
    {
      q: "How would you describe your exposure to financial assets (stocks, crypto, property)?",
      opts: [
        { text: "Heavily invested — I hold multiple asset classes", score: 3 },
        { text: "Some exposure — a retirement fund or a small portfolio", score: 2 },
        { text: "Little to none — I don't own assets beyond essentials", score: 1 }
      ]
    },
    {
      q: "How has inflation affected your day-to-day life?",
      opts: [
        { text: "Barely noticed — my income absorbs price increases easily", score: 3 },
        { text: "I've had to adjust — cut some luxuries, switched brands", score: 2 },
        { text: "It's crushing — food, transport, and rent are a constant pressure", score: 1 }
      ]
    },
    {
      q: "Which best describes your industry or sector?",
      opts: [
        { text: "Tech, finance, digital services, or remote-friendly work", score: 3 },
        { text: "Government, healthcare, education, or established corporate", score: 2 },
        { text: "Informal sector, gig work, retail, hospitality, or mining labour", score: 1 }
      ]
    },
    {
      q: "If you lost your primary income today, how long could you sustain yourself?",
      opts: [
        { text: "6+ months — I have savings and backup income", score: 3 },
        { text: "1-3 months — some buffer, but it would get tight", score: 2 },
        { text: "Less than a month — I live paycheque to paycheque", score: 1 }
      ]
    },
    {
      q: "How do you feel about your economic future over the next 5 years?",
      opts: [
        { text: "Optimistic — I see clear paths to grow my wealth", score: 3 },
        { text: "Uncertain — could go either way depending on the economy", score: 2 },
        { text: "Pessimistic — the system feels stacked against people like me", score: 1 }
      ]
    }
  ];

  var RESULTS = {
    rising: {
      cls: 'result-rising',
      badge: 'Rising Arm of the K',
      title: "You're on the upper arm — but don't get comfortable.",
      desc: "Your income, assets, and industry position you on the winning side of the K-shaped divide. You've benefited from asset inflation, digital-economy access, and financial buffers. But this divide is accelerating — the top 1% in the US now own 32% of all wealth, and in South Africa, the top 10% hold 86%. The gap between your reality and the majority's is widening every quarter.",
      stats: [
        { num: '32%', label: 'US wealth held by top 1%' },
        { num: '86%', label: 'SA wealth held by top 10%' },
        { num: '$174T', label: 'Global wealth — most at the top' }
      ]
    },
    middle: {
      cls: 'result-middle',
      badge: 'The Squeezed Middle',
      title: "You're at the inflection point — the fork in the K.",
      desc: "You're not falling, but you're not rising either. You have some assets, some stability — but inflation is eroding your purchasing power and one bad quarter could tip the balance. You represent the majority: workers who technically have jobs but are watching the cost of living outpace their earnings. This is where the K-shaped divide is most dangerous — and most invisible.",
      stats: [
        { num: '0.63', label: 'SA Gini coefficient — worst on Earth' },
        { num: '60.1%', label: 'SA youth unemployment' },
        { num: '+400%', label: 'Insurance costs surge' }
      ]
    },
    falling: {
      cls: 'result-falling',
      badge: 'Falling Arm of the K',
      title: "You're on the lower arm — and the system isn't built to help you climb.",
      desc: "Your income has stagnated or declined, assets are limited, and inflation hits you hardest on the things you can't cut: food, transport, housing. You're not alone — 60.1% of South Africa's youth are unemployed, and globally, the bottom half of the population holds less than 2% of total wealth. The K-shaped recovery isn't a recovery for those on the bottom — it's a divergence.",
      stats: [
        { num: '60.1%', label: 'SA youth unemployment' },
        { num: '<2%', label: 'Global wealth held by bottom 50%' },
        { num: '0.63', label: 'SA Gini — highest inequality' }
      ]
    }
  };

  var current = 0;
  var answers = [];
  var quizRoot = document.getElementById('quizApp');
  if (!quizRoot) return;

  function render() {
    if (current < QUESTIONS.length) {
      renderQuestion();
    } else if (current === QUESTIONS.length) {
      renderGate();
    } else {
      renderResult();
    }
  }

  function renderQuestion() {
    var q = QUESTIONS[current];
    var pct = ((current) / QUESTIONS.length * 100).toFixed(0);
    var selected = answers[current] !== undefined ? answers[current] : -1;
    var markers = ['A', 'B', 'C'];

    var html = '<div class="quiz-progress">' +
      '<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="quiz-progress-text"><span>Question ' + (current + 1) + ' of ' + QUESTIONS.length + '</span><span>' + pct + '%</span></div>' +
      '</div>' +
      '<div class="quiz-card">' +
      '<div class="quiz-question-num">Question ' + (current + 1) + '</div>' +
      '<div class="quiz-question">' + q.q + '</div>' +
      '<div class="quiz-options">';

    for (var i = 0; i < q.opts.length; i++) {
      var sel = selected === i ? ' selected' : '';
      html += '<button class="quiz-option' + sel + '" data-idx="' + i + '">' +
        '<span class="quiz-option-marker">' + markers[i] + '</span>' +
        '<span>' + q.opts[i].text + '</span></button>';
    }

    html += '</div>' +
      '<div class="quiz-nav">';
    if (current > 0) {
      html += '<button class="quiz-btn quiz-btn-back" id="quizBack">Back</button>';
    }
    html += '<button class="quiz-btn quiz-btn-next" id="quizNext"' + (selected === -1 ? ' disabled' : '') + '>' +
      (current === QUESTIONS.length - 1 ? 'See My Result' : 'Next') + '</button>' +
      '</div></div>';

    quizRoot.innerHTML = html;

    // Bind option clicks
    var opts = quizRoot.querySelectorAll('.quiz-option');
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        answers[current] = idx;
        render();
      });
    }

    var backBtn = document.getElementById('quizBack');
    if (backBtn) {
      backBtn.addEventListener('click', function() { current--; render(); });
    }
    var nextBtn = document.getElementById('quizNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (answers[current] !== undefined) { current++; render(); }
      });
    }
  }

  function renderGate() {
    var html = '<div class="quiz-card">' +
      '<div class="quiz-gate">' +
      '<h2>Your result is ready.</h2>' +
      '<p>Enter your email to unlock your personalized K-Shaped Economy position and get our free Deep Dive Brief.</p>' +
      '<form class="quiz-gate-form" id="quizGateForm">' +
      '<input type="email" class="quiz-gate-input" id="quizEmail" placeholder="you@email.com" required autocomplete="email">' +
      '<button type="submit" class="quiz-btn quiz-btn-next">Unlock My Result</button>' +
      '</form>' +
      '<p class="quiz-gate-fine">No spam. Unsubscribe anytime.</p>' +
      '<div class="quiz-nav" style="justify-content:center;margin-top:var(--space-4);">' +
      '<button class="quiz-btn quiz-btn-back" id="quizGateBack">Back to questions</button>' +
      '</div>' +
      '</div></div>';

    quizRoot.innerHTML = html;

    document.getElementById('quizGateBack').addEventListener('click', function() {
      current = QUESTIONS.length - 1;
      render();
    });

    document.getElementById('quizGateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('quizEmail').value;
      if (!email) return;

      // Submit to Formspree
      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      fetch('https://formspree.io/f/xgoneypk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          _subject: 'K-Shaped Economy Quiz — New Lead',
          quiz_result: getResultKey(),
          quiz_score: calcScore()
        })
      }).then(function(res) {
        current = QUESTIONS.length + 1;
        render();
      }).catch(function() {
        // Show result even if Formspree fails
        current = QUESTIONS.length + 1;
        render();
      });
    });
  }

  function calcScore() {
    var total = 0;
    for (var i = 0; i < answers.length; i++) {
      total += QUESTIONS[i].opts[answers[i]].score;
    }
    return total;
  }

  function getResultKey() {
    var score = calcScore();
    if (score >= 15) return 'rising';
    if (score >= 10) return 'middle';
    return 'falling';
  }

  function renderResult() {
    var key = getResultKey();
    var r = RESULTS[key];

    var html = '<div class="quiz-card ' + r.cls + '">' +
      '<div class="quiz-result">' +
      '<span class="quiz-result-badge">' + r.badge + '</span>' +
      '<h2>' + r.title + '</h2>' +
      '<p class="quiz-result-desc">' + r.desc + '</p>' +
      '<div class="quiz-result-stats">';

    for (var i = 0; i < r.stats.length; i++) {
      html += '<div class="quiz-stat">' +
        '<div class="quiz-stat-num">' + r.stats[i].num + '</div>' +
        '<div class="quiz-stat-label">' + r.stats[i].label + '</div></div>';
    }

    html += '</div>' +
      '<div class="quiz-result-cta">' +
      '<button class="quiz-cta-primary" id="quizToAdvisor" style="border:none;cursor:pointer;">Get Your Personalized Strategy &rarr;</button>' +
      '<a href="./k-shaped-economy-deep-dive.pdf" download class="quiz-cta-secondary" style="text-decoration:none;display:inline-block;">Download the Full Deep Dive</a>' +
      '<button class="quiz-cta-secondary" id="quizRetake">Retake Quiz</button>' +
      '</div>' +
      '<div class="quiz-share">' +
      '<span>Share</span>' +
      '<a href="https://twitter.com/intent/tweet?text=I%20just%20found%20out%20which%20side%20of%20the%20K-Shaped%20Economy%20I%27m%20on.%20Take%20the%20quiz%3A%20informationhubnews.netlify.app&via=HubInforma272" target="_blank" rel="noopener" aria-label="Share on X">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '</a>' +
      '<a href="https://wa.me/?text=I%20just%20found%20out%20which%20side%20of%20the%20K-Shaped%20Economy%20I%27m%20on.%20Take%20the%20quiz%3A%20informationhubnews.netlify.app" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '</a>' +
      '</div>' +
      '</div></div>';

    quizRoot.innerHTML = html;

    document.getElementById('quizRetake').addEventListener('click', function() {
      current = 0;
      answers = [];
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Strategy Advisor CTA
    var advBtn = document.getElementById('quizToAdvisor');
    if (advBtn) {
      advBtn.addEventListener('click', function() {
        var quizPayload = {
          resultKey: getResultKey(),
          score: calcScore(),
          emailCaptured: true
        };
        if (typeof window.startAdvisor === 'function') {
          window.startAdvisor(quizPayload);
        } else {
          safeStorage.setItem('ih_quiz_data', JSON.stringify(quizPayload));
        }
        if (typeof window.switchTab === 'function') {
          window.switchTab('strategy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  // Initialize when visible
  var observer = new MutationObserver(function() {
    if (quizRoot && quizRoot.closest('.tab-content') && 
        quizRoot.closest('.tab-content').classList.contains('active') &&
        quizRoot.innerHTML === '') {
      render();
    }
  });
  var tabEl = document.getElementById('tab-quiz');
  if (tabEl) {
    observer.observe(tabEl, { attributes: true, attributeFilter: ['class'] });
  }
  // Also try immediate render if already active
  if (tabEl && tabEl.classList.contains('active')) {
    render();
  }
  // Fallback: render on first switchTab call
  var origSwitch = window.switchTab;
  window.switchTab = function(id) {
    origSwitch(id);
    if (id === 'quiz' && quizRoot && quizRoot.innerHTML === '') {
      setTimeout(render, 50);
    }
  };
})();
