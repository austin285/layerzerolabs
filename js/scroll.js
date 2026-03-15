/**
 * scroll.js — Layer Zero Labs
 *
 * Two responsibilities:
 *   1. Scroll Reveal — IntersectionObserver watches all .reveal
 *      elements and adds .is-visible when they enter the viewport,
 *      triggering the CSS transition defined in animations.css
 *
 *   2. Active Nav Tracking — updates which nav link is highlighted
 *      as the user scrolls through sections
 */

(function initScroll() {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. SCROLL REVEAL
     ══════════════════════════════════════════════════════════ */

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  /**
   * IntersectionObserver fires when an element enters/leaves
   * the configured root margin zone.
   *
   * threshold: 0.08  — trigger when 8% of the element is visible
   * rootMargin        — shrinks the trigger zone slightly from the
   *                     bottom so reveals fire as elements approach
   */
  const revealObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry, index) {
        if (!entry.isIntersecting) return;

        // Stagger multiple elements entering at once by their
        // index in the batch — gives a ripple effect on card grids
        // NOTE: delay variants (.reveal-d1, etc.) also add CSS delay
        // on top of this, so the two stack together for grids
        setTimeout(function() {
          entry.target.classList.add('is-visible');
        }, index * 75);

        // Stop watching once revealed — element stays visible
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold:  0.08,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════════════════════════
     2. ACTIVE NAV LINK TRACKING
     ══════════════════════════════════════════════════════════ */

  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const NAV_HEIGHT = 70; // matches nav height in layout.css

  /**
   * On each scroll event, check which section occupies the
   * upper portion of the viewport and highlight the matching
   * nav link with .is-active.
   */
  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(function(section) {
      const sectionTop    = section.offsetTop - NAV_HEIGHT - 40;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(function(link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  // Throttle scroll handler using requestAnimationFrame
  // so we don't fire layout-triggering work on every pixel
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on load in case the page was refreshed mid-scroll
  updateActiveNav();

})();
