/**
 * cursor.js — Layer Zero Labs
 *
 * Custom crosshair cursor with inertia-lag on the outer ring.
 *
 * How it works:
 *   - #cursor-inner tracks the real mouse position exactly (no lag)
 *   - #cursor-outer uses linear interpolation (lerp) each frame to
 *     smoothly chase the inner dot, creating a cinematic trail effect
 *   - Interactive elements add/remove .cursor-hover on <body> to
 *     trigger the expanded orange state via CSS
 */

(function initCursor() {
  'use strict';

  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  if (!outer || !inner) return;

  // Real mouse position (updated on every mousemove)
  let mouseX = -200;
  let mouseY = -200;

  // Lagged position for the outer ring
  let outerX = -200;
  let outerY = -200;

  // Lerp factor — lower = more lag, higher = snappier
  // 0.12 gives a smooth ~8-frame trail at 60fps
  const LERP = 0.12;

  /* ── Track mouse ──────────────────────────────────────────── */

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Inner dot is instant — no lerp
    inner.style.left = mouseX + 'px';
    inner.style.top  = mouseY + 'px';
  });

  /* ── Animation loop — outer ring lerps to mouse ───────────── */

  function animate() {
    outerX += (mouseX - outerX) * LERP;
    outerY += (mouseY - outerY) * LERP;

    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  /* ── Hover state ──────────────────────────────────────────── */

  // Any element with [data-hover] or these interactive tags
  // will expand the cursor ring and switch it to orange
  const hoverSelectors = [
    'a',
    'button',
    '.filter-btn',
    '.gallery-item',
    '.service-card',
    '.file-dropzone',
    '.nav-cta',
    '[data-hover]'
  ].join(', ');

  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* ── Hide default cursor when mouse enters window ─────────── */

  document.addEventListener('mouseenter', function() {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });

  document.addEventListener('mouseleave', function() {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });

})();
