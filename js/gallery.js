/**
 * gallery.js — Layer Zero Labs
 *
 * Filter button interactions for the print gallery.
 *
 * Current behavior:
 *   - Clicking a filter button sets it as .is-active (CSS handles styling)
 *   - When you add real images with a data-category attribute on each
 *     .gallery-item, the filtering logic below will show/hide them
 *
 * To activate real filtering:
 *   1. Add data-category="functional" (or miniatures, art, mechanical, custom)
 *      to each .gallery-item in index.html
 *   2. The filterGallery() function below already handles this —
 *      just uncomment the filter lines
 */

(function initGallery() {
  'use strict';

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  /* ── Active button state ──────────────────────────────────── */

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Remove active from all buttons
      filterBtns.forEach(function(b) {
        b.classList.remove('is-active');
      });

      // Set clicked button as active
      btn.classList.add('is-active');

      // Determine which category was clicked
      const category = btn.textContent.trim().toLowerCase();

      filterGallery(category);
    });
  });

  /* ── Filter items ─────────────────────────────────────────── */

  /**
   * @param {string} category - 'all' or a category string matching
   *                            data-category attributes on gallery items
   */
  function filterGallery(category) {
    galleryItems.forEach(function(item) {
      if (category === 'all') {
        showItem(item);
        return;
      }

      // Check if item matches — requires data-category on the element
      // e.g. <div class="gallery-item" data-category="functional">
      const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();

      if (itemCategory === category || itemCategory === '') {
        // Show items that match or have no category set yet
        showItem(item);
      } else {
        hideItem(item);
      }
    });
  }

  /* ── Show / hide helpers ──────────────────────────────────── */

  // Using opacity + pointer-events so layout doesn't reflow and
  // the mosaic grid stays intact during filtering

  function showItem(item) {
    item.style.opacity        = '';
    item.style.pointerEvents  = '';
    item.style.transform      = '';
  }

  function hideItem(item) {
    item.style.opacity        = '0.15';
    item.style.pointerEvents  = 'none';
    item.style.transform      = 'scale(0.97)';
  }

})();
