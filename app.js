/* Safe storage wrapper — fallback for sandboxed environments */
var safeStorage=(function(){try{safeStorage.setItem("__t","1");safeStorage.removeItem("__t");return safeStorage;}catch(e){var m={};return{getItem:function(k){return m[k]||null;},setItem:function(k,v){m[k]=String(v);},removeItem:function(k){delete m[k];}};}})();
// app.js — Information Hub v2
(function() {
  'use strict';

  // ===== THEME =====
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = 'dark';
  root.setAttribute('data-theme', theme);
  updateIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateIcon();
    });
  }

  function updateIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileMenu.style.display = 'block';
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
      } else {
        mobileMenu.classList.remove('open');
        setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
      }
    });
  }

  // ===== TABS =====
  const allTabs = document.querySelectorAll('[data-tab]');
  const allContent = document.querySelectorAll('.tab-content');

  window.switchTab = function(tabId) {
    allTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
      t.setAttribute('aria-selected', t.dataset.tab === tabId ? 'true' : 'false');
    });
    allContent.forEach(c => {
      if (c.id === 'tab-' + tabId) {
        c.style.display = 'block';
        requestAnimationFrame(() => c.classList.add('active'));
      } else {
        c.classList.remove('active');
        setTimeout(() => { if (!c.classList.contains('active')) c.style.display = 'none'; }, 350);
      }
    });
    if (hamburger && hamburger.classList.contains('open')) hamburger.click();
    // Hide the global Deep Dive Brief section on quiz tab (quiz has its own)
    var ddb = document.getElementById('deepDiveBrief');
    if (ddb) ddb.style.display = (tabId === 'quiz' || tabId === 'strategy' || tabId === 'portfolio' || tabId === 'tracker' || tabId === 'scenarios') ? 'none' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  allTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchTab(tab.dataset.tab); }
    });
  });

  document.querySelectorAll('.division-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  // ===== CHIPS =====
  // Chip filtering: filter news-cards within the parent tab-content
  document.querySelectorAll('.chip-row').forEach(chipRow => {
    const parentTab = chipRow.closest('.tab-content');
    const chips = chipRow.querySelectorAll('.chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Update active state within this chip-row only
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filterText = chip.textContent.trim();
        const cards = parentTab.querySelectorAll('.news-card');

        cards.forEach(card => {
          const badge = card.querySelector('.badge');
          const badgeText = badge ? badge.textContent.trim() : '';

          if (filterText === 'All' || badgeText === filterText) {
            card.classList.remove('chip-hidden');
            card.classList.add('chip-fade-in');
            // Remove animation class after it completes
            card.addEventListener('animationend', () => {
              card.classList.remove('chip-fade-in');
            }, { once: true });
          } else {
            card.classList.add('chip-hidden');
            card.classList.remove('chip-fade-in');
          }
        });
      });

      // Keyboard support for chips
      chip.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
        }
      });
    });
  });

  // ===== CRYPTO & MARKET PRICES =====
  // All price data now powered by TradingView embedded widgets (real-time streaming)
  // No CoinGecko API dependency — widgets handle BTC, altcoins, gold, indices, forex directly
  // TradingView widgets: Ticker Tape (top banner + hero), Market Quotes (crypto + finance grids),
  //                      Symbol Overview (BTC chart, Gold/Commodities chart)

  // ===== FORM =====
  const submitBtn = document.getElementById('submitSuggestion');
  if (submitBtn) {
    var sugFormEl = document.getElementById('suggestionFormEl');
    if (sugFormEl) {
      sugFormEl.addEventListener('submit', function(e) {
        e.preventDefault();
        var msg = document.getElementById('sug-message');
        if (!msg || !msg.value.trim()) { showToast('Please enter a suggestion.'); return; }
        var formData = new FormData(sugFormEl);
        fetch(sugFormEl.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
          .then(function(r) {
            if (r.ok) {
              document.getElementById('suggestionForm').style.display = 'none';
              document.getElementById('formSuccess').classList.add('show');
              showToast('Suggestion submitted. Thank you!');
            } else { showToast('Something went wrong. Try again.'); }
          })
          .catch(function() { showToast('Network error. Please try again.'); });
      });
    }
  }

  // ===== UPVOTE =====
  window.upvote = function(btn) {
    const span = btn.querySelector('span');
    if (!span) return;
    let count = parseInt(span.textContent);
    if (!btn.dataset.voted) {
      span.textContent = count + 1;
      btn.style.color = 'var(--color-success)';
      btn.dataset.voted = 'true';
    } else {
      span.textContent = count - 1;
      btn.style.color = '';
      delete btn.dataset.voted;
    }
  };

  // ===== TOAST =====
  window.showToast = function(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // ===== CONTACT FORM =====
  const contactBtn = document.getElementById('submitContact');
  if (contactBtn) {
    var contactFormEl = document.getElementById('contactFormEl');
    if (contactFormEl) {
      contactFormEl.addEventListener('submit', function(e) {
        e.preventDefault();
        var message = document.getElementById('contact-message');
        var name = document.getElementById('contact-name');
        var email = document.getElementById('contact-email');
        if (!message || !message.value.trim()) { showToast('Please enter a message.'); return; }
        if (!name || !name.value.trim()) { showToast('Please enter your name.'); return; }
        if (!email || !email.value.trim()) { showToast('Please enter your email.'); return; }
        var formData = new FormData(contactFormEl);
        fetch(contactFormEl.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
          .then(function(r) {
            if (r.ok) {
              document.getElementById('contactForm').style.display = 'none';
              document.getElementById('contactSuccess').classList.add('show');
              showToast('Message sent successfully.');
            } else { showToast('Something went wrong. Try again.'); }
          })
          .catch(function() { showToast('Network error. Please try again.'); });
      });
    }
  }

  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== KEYBOARD NAVIGATION ENHANCEMENTS =====
  // Ensure all interactive elements respond to Enter/Space
  document.querySelectorAll('.btn-notify, .vote-btn, .btn-submit').forEach(btn => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Make news cards focusable for keyboard navigation
  document.querySelectorAll('.news-card').forEach(card => {
    if (!card.getAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
  });

  // ===== LIVE NEWS FEED =====
  const NEWS_API = 'https://raw.githubusercontent.com/jameslowebba-star/information-hub-data/main/latest-news.json';

  // Map category to badge class
  const BADGE_MAP = {
    crypto: 'badge-crypto',
    africa: 'badge-africa',
    finance: 'badge-finance',
    europe: 'badge-europe',
    usa: 'badge-usa',
    world: 'badge-politics'
  };

  function buildNewsCard(article) {
    const badgeClass = BADGE_MAP[article.category] || 'badge-politics';
    const typeLabel = article.type === 'breaking'
      ? '<span class="live-badge">LIVE</span>'
      : '';
    var hasUrl = article.url && article.url.length > 0;
    var tag = hasUrl ? 'a' : 'article';
    var hrefAttr = hasUrl ? ' href="' + escHtml(article.url) + '" target="_blank" rel="noopener noreferrer"' : '';
    return '<' + tag + ' class="news-card fade-in" data-badge="' + (article.badge || '') + '" tabindex="0"' + hrefAttr + '>'
      + typeLabel
      + '<span class="badge ' + badgeClass + '">' + escHtml(article.badge) + '</span>'
      + '<h3>' + escHtml(article.headline) + '</h3>'
      + '<p class="excerpt">' + escHtml(article.excerpt) + '</p>'
      + '<div class="meta"><span>' + escHtml(article.source) + '</span><span class="dot-sep"></span><span>' + escHtml(article.date) + '</span></div>'
      + '</' + tag + '>';
  }

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function populateTab(tabId, articles) {
    // Try specific grid ID first, then fallback to tab container
    var grid = document.getElementById(tabId + 'NewsGrid');
    if (!grid) {
      var container = document.getElementById('tab-' + tabId);
      if (!container) return;
      grid = container.querySelector('.news-grid');
    }
    if (!grid) return;
    var filtered = articles.filter(function(a) { return a.category === tabId; });
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="feed-placeholder">No ' + tabId + ' news available right now.</p>';
      return;
    }
    // Sort by timestamp descending (newest first)
    filtered.sort(function(a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });
    // Limit to 10 per tab
    filtered = filtered.slice(0, 10);
    var html = '';
    filtered.forEach(function(a) { html += buildNewsCard(a); });
    grid.innerHTML = html;
    // Re-apply chip filters if any active
    var tabContainer = grid.closest('.tab-content');
    if (tabContainer) {
      var chipRow = tabContainer.querySelector('.chip-row');
      if (chipRow) {
        var activeChip = chipRow.querySelector('.chip.active');
        if (activeChip && activeChip.textContent.trim() !== 'All') {
          activeChip.click();
        }
      }
    }
  }

  function populateHomeFeed(articles) {
    // Breaking / Latest News — show up to 6 breaking articles (or newest if none breaking)
    var breakingGrid = document.getElementById('homeBreakingGrid');
    if (breakingGrid) {
      var breaking = articles.filter(function(a) { return a.type === 'breaking'; });
      // If no breaking articles, show the newest 6 regardless of type
      if (breaking.length === 0) {
        breaking = articles.slice(0, 6);
      }
      breaking.sort(function(a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });
      breaking = breaking.slice(0, 6);
      if (breaking.length > 0) {
        var html = '';
        breaking.forEach(function(a) { html += buildNewsCard(a); });
        breakingGrid.innerHTML = html;
      }
    }

    // ICYMI — show up to 8 icymi articles
    var icymiGrid = document.getElementById('homeIcymiGrid');
    if (icymiGrid) {
      var icymi = articles.filter(function(a) { return a.type === 'icymi'; });
      icymi.sort(function(a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });
      icymi = icymi.slice(0, 8);
      if (icymi.length > 0) {
        var html = '';
        icymi.forEach(function(a) { html += buildNewsCard(a); });
        icymiGrid.innerHTML = html;
      }
    }
  }

  async function fetchLiveNews() {
    try {
      var controller = new AbortController();
      var tid = setTimeout(function() { controller.abort(); }, 10000);
      var res = await fetch(NEWS_API + '?t=' + Date.now(), { signal: controller.signal });
      clearTimeout(tid);
      if (!res.ok) throw new Error(res.status);
      var data = await res.json();
      if (!data.articles || !data.articles.length) return;

      // Populate each news tab
      ['crypto', 'africa', 'finance', 'europe', 'usa'].forEach(function(cat) {
        populateTab(cat, data.articles);
      });

      // Populate Home page feeds
      populateHomeFeed(data.articles);

      // Update last updated timestamp in footer if available
      if (data.last_updated) {
        var tsEl = document.getElementById('lastUpdated');
        if (tsEl) {
          var d = new Date(data.last_updated);
          tsEl.textContent = 'Last updated: ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
        }
      }

      console.log('Live news loaded: ' + data.articles.length + ' articles');
    } catch (e) {
      console.warn('Live news fetch failed, keeping static content:', e.message);
    }
  }

  // Fetch live news on load, refresh every 3 minutes
  fetchLiveNews();
  setInterval(fetchLiveNews, 180000);

  // ===== DEEP DIVE BRIEF: WAITLIST + COUNTER =====
  // Spots remaining counter (placeholder until real payment integration)
  var spotsRemaining = 20;

  // Waitlist form handler
  var waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    var isSubmitting = false;
    waitlistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (isSubmitting) return;

      var emailInput = document.getElementById('waitlist-email');
      var email = emailInput ? emailInput.value.trim() : '';

      // Simple email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      isSubmitting = true;
      var btn = waitlistForm.querySelector('.ddb-waitlist-btn');
      if (btn) btn.disabled = true;

      // Submit to Formspree
      var formData = new FormData(waitlistForm);
      fetch(waitlistForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        .then(function(r) {
          if (r.ok) {
            showToast("You're on the list. We'll notify you when we launch.");
            if (emailInput) emailInput.value = '';
          } else {
            showToast('Something went wrong. Try again.');
          }
        })
        .catch(function() { showToast('Network error. Please try again.'); })
        .finally(function() {
          setTimeout(function() {
            isSubmitting = false;
            if (btn) btn.disabled = false;
          }, 2000);
        });
    });
  }

  // ===== "WHAT THE DATA SAYS" CALLOUTS =====
  (async function loadDataCallouts() {
    const grid = document.getElementById('dataCalloutsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="data-callout-loading">Loading live data...</div>';
    try {
      var risks = [];
      try {
        var res = await fetch('https://raw.githubusercontent.com/jameslowebba-star/information-hub-data/main/geo-risks.json?t=' + Date.now(), { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(res.status);
        var data = await res.json();
        risks = data.risks || [];
      } catch (fetchErr) {
        // Fallback: try safeStorage from tracker, or use embedded defaults
        try {
          var stored = safeStorage.getItem('ih_tracker_data');
          if (stored) {
            var parsed = JSON.parse(stored);
            // Only use if risks have the impacts field (full data)
            if (parsed.risks && parsed.risks.length > 0 && parsed.risks[0].impacts) risks = parsed.risks;
          }
        } catch (_) {}
        if (risks.length === 0) {
          // Embedded minimal defaults
          risks = [
            { name: 'Middle East Regional War', score: 9.2, likelihood: 'high', impacts: ['Oil & Gas', 'Gold', 'Brent Crude', 'S&P 500', 'Defense Stocks'] },
            { name: 'U.S.\u2013China Strategic Competition', score: 8.8, likelihood: 'high', impacts: ['Tech Stocks', 'Semiconductors', 'Bitcoin', 'USD/CNY', 'Taiwan ETFs'] },
            { name: 'Global Trade Fragmentation', score: 8.5, likelihood: 'high', impacts: ['S&P 500', 'Manufacturing', 'USD/ZAR', 'Emerging Markets', 'Commodities'] },
            { name: 'Global Energy Disruption', score: 8.1, likelihood: 'high', impacts: ['Brent Crude', 'Natural Gas', 'Energy Stocks', 'Airlines', 'Emerging Markets'] },
            { name: 'Russia\u2013NATO Confrontation', score: 7.6, likelihood: 'medium', impacts: ['European Equities', 'Natural Gas', 'Defense Stocks', 'EUR/USD', 'Gold'] },
            { name: 'Major Cyber Attack', score: 7.2, likelihood: 'medium', impacts: ['Cybersecurity Stocks', 'Tech Stocks', 'Banking', 'Crypto Exchanges', 'Insurance'] },
            { name: 'Western Alliance Fractures', score: 7.0, likelihood: 'medium', impacts: ['EUR/USD', 'NATO Defense ETFs', 'European Equities', 'USD', 'Treasury Bonds'] },
            { name: 'African Political Instability', score: 6.8, likelihood: 'medium', impacts: ['JSE All Share', 'USD/ZAR', 'Mining Stocks', 'Platinum', 'Rare Earth Minerals'] },
            { name: 'Crypto Regulatory Crackdown', score: 6.5, likelihood: 'medium', impacts: ['Bitcoin', 'Ethereum', 'Exchange Tokens', 'DeFi', 'Stablecoins'] },
            { name: 'Emerging Market Debt Crisis', score: 6.3, likelihood: 'medium', impacts: ['EM Bonds', 'USD/ZAR', 'EM Equities', 'Commodities', 'Gold'] }
          ];
        }
      }
      if (risks.length === 0) { grid.innerHTML = ''; return; }

      // 1. Highest risk
      const highest = risks.reduce(function(a, b) { return a.score > b.score ? a : b; });

      // 2. Most assets at risk
      const mostAssets = risks.reduce(function(a, b) { return (a.impacts || []).length > (b.impacts || []).length ? a : b; });

      // 3. Composite score
      const compositeRaw = risks.reduce(function(sum, r) { return sum + r.score; }, 0) / risks.length;
      const composite = compositeRaw.toFixed(1);
      var levelLabel, levelClass;
      if (compositeRaw >= 8.0) { levelLabel = 'CRITICAL'; levelClass = 'level-critical'; }
      else if (compositeRaw >= 6.5) { levelLabel = 'ELEVATED'; levelClass = 'level-elevated'; }
      else if (compositeRaw >= 4.0) { levelLabel = 'MODERATE'; levelClass = 'level-moderate'; }
      else { levelLabel = 'LOW'; levelClass = 'level-low'; }

      grid.innerHTML = ''
        // Card 1: Highest Risk
        + '<div class="data-callout-card">'
        + '  <div class="data-callout-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>'
        + '  <h3 class="data-callout-headline"><span class="callout-accent">' + escHtml(highest.name) + '</span> at ' + highest.score + '</h3>'
        + '  <p class="data-callout-desc">The top threat to global markets right now, scored by BlackRock BGRI intelligence data.</p>'
        + '</div>'
        // Card 2: Most assets at risk
        + '<div class="data-callout-card">'
        + '  <div class="data-callout-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>'
        + '  <h3 class="data-callout-headline"><span class="callout-accent">' + escHtml(mostAssets.name) + '</span> impacts ' + (mostAssets.impacts || []).length + ' assets</h3>'
        + '  <p class="data-callout-desc">The risk with the broadest portfolio exposure across equities, commodities, and currencies.</p>'
        + '</div>'
        // Card 3: Composite Score
        + '<div class="data-callout-card">'
        + '  <div class="data-callout-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>'
        + '  <h3 class="data-callout-headline">Global risk index at <span class="callout-accent">' + composite + '/10</span></h3>'
        + '  <p class="data-callout-desc">Composite score across ' + risks.length + ' tracked geopolitical risks, updated automatically.</p>'
        + '  <span class="data-callout-meter ' + levelClass + '">' + levelLabel + '</span>'
        + '</div>';

      console.log('[DataCallouts] Rendered from live geo-risks.json');
    } catch (e) {
      console.warn('[DataCallouts] Failed to load:', e.message);
      grid.innerHTML = '';
    }
  })();

  // Smooth scroll for anchor links to #deepDiveBrief
  document.querySelectorAll('a[href="#deepDiveBrief"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById('deepDiveBrief');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
