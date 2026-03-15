/**
 * form.js — Layer Zero Labs
 *
 * Quote form behaviors:
 *   1. File drag-and-drop zone — accepts STL, OBJ, STEP, 3MF files
 *      with visual feedback during drag-over and on file select
 *   2. Form submission handler — shows a success state inline
 *      (swap this for a real API call or Formspree endpoint)
 *
 * To wire to a real backend:
 *   - Replace the handleSubmit body with a fetch() POST to your
 *     endpoint (e.g. Formspree, Netlify Forms, your own API)
 *   - The FormData object is already built — just pass it in
 */

(function initForm() {
  'use strict';

  /* ── Element references ───────────────────────────────────── */

  const form       = document.getElementById('quote-form');
  const dropzone   = document.getElementById('file-dropzone');
  const fileInput  = document.getElementById('file-input');
  const submitBtn  = document.getElementById('submit-btn');

  if (!form) return;

  /* ══════════════════════════════════════════════════════════
     1. FILE DRAG-AND-DROP ZONE
     ══════════════════════════════════════════════════════════ */

  /* ── Click to open file picker ────────────────────────────── */

  if (dropzone && fileInput) {

    dropzone.addEventListener('click', function() {
      fileInput.click();
    });

    /* ── File picker selection ──────────────────────────────── */

    fileInput.addEventListener('change', function() {
      if (fileInput.files && fileInput.files.length > 0) {
        displaySelectedFiles(fileInput.files);
      }
    });

    /* ── Drag over — visual feedback ────────────────────────── */

    dropzone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragenter', function(e) {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', function() {
      dropzone.classList.remove('is-dragover');
    });

    /* ── Drop ───────────────────────────────────────────────── */

    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        // Try to assign dropped files to the real input
        // (not always possible due to browser security, but works in most cases)
        try {
          fileInput.files = files;
        } catch (err) {
          // Browser blocked — just display the names
        }
        displaySelectedFiles(files);
      }
    });
  }

  /**
   * Update the dropzone UI to show selected file names
   * @param {FileList} files
   */
  function displaySelectedFiles(files) {
    if (!dropzone) return;

    const names = Array.from(files).map(function(f) { return f.name; });
    const hintEl = dropzone.querySelector('.dropzone-hint');
    const iconEl = dropzone.querySelector('.dropzone-icon');

    if (hintEl) {
      hintEl.textContent = '\u2713 ' + names.join(', ');
    }
    if (iconEl) {
      iconEl.textContent = '\u2713';
    }

    dropzone.classList.add('has-files');
    dropzone.classList.remove('is-dragover');
  }

  /* ══════════════════════════════════════════════════════════
     2. FORM SUBMISSION
     ══════════════════════════════════════════════════════════ */

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect all form data
    // const data = new FormData(form);

    // Use data with fetch() when wiring to a real endpoint:
    //
    // fetch('https://your-endpoint.com/quote', {
    //   method: 'POST',
    //   body: data
    // })
    // .then(res => res.json())
    // .then(result => showSuccess())
    // .catch(err => showError(err));

    // For now: show inline success state
    showSuccess();
  });

  /* ── Success state ────────────────────────────────────────── */

  function showSuccess() {
    if (!submitBtn) return;

    submitBtn.textContent = '\u2713 QUOTE SUBMITTED \u2014 WE\'LL BE IN TOUCH WITHIN 24HRS';
    submitBtn.style.background   = 'var(--accent-blue)';
    submitBtn.style.color        = 'var(--bg-deep)';
    submitBtn.style.boxShadow    = 'var(--glow-blue)';
    submitBtn.disabled           = true;

    // Optionally scroll back to top of form
    const formSection = document.getElementById('quote');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

})();
