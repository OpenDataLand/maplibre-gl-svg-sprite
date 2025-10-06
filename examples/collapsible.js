// Enhance <details class="info"> for map demos:
// - Auto-collapse on small screens by default (unless remembered state exists)
// - Persist open/closed state per page
// - Smooth height/opacity animation on toggle
// - Chevron indicator (via CSS) for clear toggle affordance
// - Keyboard and a11y remain native via <summary>
(function () {
  function storageKey(idx) {
    return 'infoPanel:' + location.pathname + ':' + idx;
  }

  function isSmallScreen() {
    try {
      var mql = window.matchMedia && window.matchMedia('(max-width: 640px)');
      return !!(mql && mql.matches);
    } catch (e) {
      return false;
    }
  }

  function animateHeight(detailsEl, bodyEl, opening) {
    if (!bodyEl) return;
    bodyEl.style.willChange = 'height, opacity, transform';
    bodyEl.style.overflow = 'hidden';
    var from = opening ? 0 : bodyEl.scrollHeight;
    var to = opening ? bodyEl.scrollHeight : 0;
    // Set start state
    bodyEl.style.height = from + 'px';
    bodyEl.style.opacity = opening ? '0' : '1';
    bodyEl.style.transform = opening ? 'translateY(-6px)' : 'translateY(0)';

    requestAnimationFrame(function () {
      bodyEl.style.transition = 'height 200ms ease, opacity 180ms ease, transform 180ms ease';
      // Trigger to state
      bodyEl.style.height = to + 'px';
      bodyEl.style.opacity = opening ? '1' : '0';
      bodyEl.style.transform = opening ? 'translateY(0)' : 'translateY(-6px)';

      var done = function (ev) {
        if (ev && ev.target !== bodyEl) return;
        bodyEl.style.transition = '';
        bodyEl.style.height = opening ? 'auto' : '0px';
        bodyEl.style.willChange = '';
        bodyEl.removeEventListener('transitionend', done);
      };
      bodyEl.addEventListener('transitionend', done);
    });
  }

  function enhancePanels() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('details.info'));
    nodes.forEach(function (d, idx) {
      if (d.__enhancedInfo) return;
      d.__enhancedInfo = true;
      d.setAttribute('data-enhanced', '');

      var key = storageKey(idx);
      var saved = null;
      try { saved = localStorage.getItem(key); } catch {}

      // Build a wrapper around non-summary children for animation
      var summary = d.querySelector('summary');
      // If missing summary, create a minimal one
      if (!summary) {
        summary = document.createElement('summary');
        summary.textContent = 'Details';
        d.insertBefore(summary, d.firstChild);
      }

      var body = document.createElement('div');
      body.className = 'panel-body';
      // Move all siblings after summary into body
      while (summary.nextSibling) {
        body.appendChild(summary.nextSibling);
      }
      d.appendChild(body);
      // No separate close button; summary chevron is the toggle affordance

      // Apply initial state
      var initialOpen = d.hasAttribute('open');
      if (saved === 'open') initialOpen = true;
      else if (saved === 'closed') initialOpen = false;
      else if (isSmallScreen()) initialOpen = false; // auto-collapse by default on small screens

      if (initialOpen) {
        d.open = true;
        body.style.height = 'auto';
      } else {
        d.open = false;
        body.style.height = '0px';
        body.style.opacity = '0';
        body.style.transform = 'translateY(-6px)';
        body.style.overflow = 'hidden';
      }

      // Persist state + animate on toggle
      d.addEventListener('toggle', function () {
        try { localStorage.setItem(key, d.open ? 'open' : 'closed'); } catch {}
        animateHeight(d, body, d.open);
      });
    });
  }

  function init() {
    try { enhancePanels(); } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
