/**
 * form.js — Layer Zero Labs
 *
 * Quote form behaviors:
 *   1. File drag-and-drop zone — accepts STL, OBJ, STEP, 3MF files
 *   2. Form submission via Formspree (https://formspree.io/f/xojknlvk)
 *
 * Submissions are sent to Formspree and forwarded to your linked email.
 * To change the destination email, update it in Formspree dashboard:
 *   https://formspree.io/forms/xojknlvk/settings
 */

(function initForm() {
    'use strict';

   /* ── Configuration ──────────────────────────────────────── */
   var FORMSPREE_URL = 'https://formspree.io/f/xojknlvk';

   /* ── Element references ─────────────────────────────────── */
   var form      = document.getElementById('quote-form');
    var dropzone  = document.getElementById('file-dropzone');
    var fileInput = document.getElementById('file-input');
    var submitBtn = document.getElementById('submit-btn');

   if (!form) return;

   /* ══════════════════════════════════════════════════════════
       1. FILE DRAG-AND-DROP ZONE
       ══════════════════════════════════════════════════════════ */

   if (dropzone && fileInput) {
         dropzone.addEventListener('click', function() {
                 fileInput.click();
         });

      fileInput.addEventListener('change', function() {
              if (fileInput.files && fileInput.files.length > 0) {
                        displaySelectedFiles(fileInput.files);
              }
      });

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

      dropzone.addEventListener('drop', function(e) {
              e.preventDefault();
              dropzone.classList.remove('is-dragover');
              var files = e.dataTransfer.files;
              if (files && files.length > 0) {
                        try { fileInput.files = files; } catch (err) { }
                        displaySelectedFiles(files);
              }
      });
   }

   function displaySelectedFiles(files) {
         if (!dropzone) return;
         var names  = Array.from(files).map(function(f) { return f.name; });
         var hintEl = dropzone.querySelector('.dropzone-hint');
         var iconEl = dropzone.querySelector('.dropzone-icon');
         if (hintEl) hintEl.textContent = '\u2713 ' + names.join(', ');
         if (iconEl) iconEl.textContent = '\u2713';
         dropzone.classList.add('has-files');
         dropzone.classList.remove('is-dragover');
   }

   /* ══════════════════════════════════════════════════════════
       2. FORM SUBMISSION VIA FORMSPREE
       ══════════════════════════════════════════════════════════ */

   form.addEventListener('submit', function(e) {
         e.preventDefault();

                             if (!submitBtn) return;

                             // Show sending state
                             var originalText = submitBtn.textContent;
         submitBtn.textContent = 'TRANSMITTING...';
         submitBtn.disabled = true;
         submitBtn.style.background = 'var(--accent-blue)';
         submitBtn.style.color = 'var(--bg-deep)';

                             // Build FormData from the form
                             var data = new FormData(form);

                             // POST to Formspree
                             fetch(FORMSPREE_URL, {
                                     method: 'POST',
                                     body: data,
                                     headers: { 'Accept': 'application/json' }
                             })
         .then(function(response) {
                 if (response.ok) {
                           showSuccess();
                 } else {
                           return response.json().then(function(json) {
                                       var msg = (json.errors && json.errors.length)
                                         ? json.errors.map(function(err) { return err.message; }).join(', ')
                                                     : 'Submission failed. Please try again.';
                                       showError(msg);
                           });
                 }
         })
         .catch(function() {
                 showError('Network error \u2014 check your connection and try again.');
         });
   });

   /* ── Success state ──────────────────────────────────────── */
   function showSuccess() {
         if (!submitBtn) return;
         submitBtn.textContent  = '\u2713 QUOTE SUBMITTED \u2014 WE\u2019LL BE IN TOUCH WITHIN 24HRS';
         submitBtn.style.background = 'var(--accent-blue)';
         submitBtn.style.color      = 'var(--bg-deep)';
         submitBtn.style.boxShadow  = 'var(--glow-blue)';
         submitBtn.disabled         = true;

      var formSection = document.getElementById('quote');
         if (formSection) {
                 formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
   }

   /* ── Error state ────────────────────────────────────────── */
   function showError(msg) {
         if (!submitBtn) return;
         submitBtn.textContent    = '\u2717 ' + msg;
         submitBtn.style.background = '#CC4400';
         submitBtn.style.color      = '#fff';
         submitBtn.disabled         = false;

      // Reset button after 5 seconds so user can retry
      setTimeout(function() {
              submitBtn.textContent    = '\u25B8 SUBMIT QUOTE REQUEST';
              submitBtn.style.background = 'var(--accent-orange)';
              submitBtn.style.color      = '#030810';
              submitBtn.style.boxShadow  = '';
      }, 5000);
   }

})();


/**
 * Image-to-Print form behaviors:
 * 1. Image drag-and-drop zone — accepts JPG, PNG, SVG, AI, PDF
 * 2. Form submission via Formspree
 */
(function initImageForm() {
  'use strict';

  /* ── Configuration ──────────────────────────────────────── */
  var FORMSPREE_URL = 'https://formspree.io/f/xojknlvk';

  /* ── Element references ─────────────────────────────────── */
  var form       = document.getElementById('image-form');
  var dropzone   = document.getElementById('image-dropzone');
  var fileInput  = document.getElementById('image-file-input');
  var submitBtn  = document.getElementById('image-submit-btn');

  if (!form) return;

  /* ══════════════════════════════════════════════════════════
     1. IMAGE DRAG-AND-DROP ZONE
     ══════════════════════════════════════════════════════════ */
  if (dropzone && fileInput) {

    dropzone.addEventListener('click', function() {
      fileInput.click();
    });

    fileInput.addEventListener('change', function() {
      if (fileInput.files && fileInput.files.length > 0) {
        displayFile(fileInput.files[0]);
      }
    });

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

    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      var files = e.dataTransfer.files;
      if (files && files.length > 0) {
        try { fileInput.files = files; } catch (err) {}
        displayFile(files[0]);
      }
    });
  }

  function displayFile(file) {
    if (!dropzone) return;
    var hintEl = dropzone.querySelector('.dropzone-hint');
    var iconEl = dropzone.querySelector('.dropzone-icon');
    if (hintEl) hintEl.textContent = '\u2713 ' + file.name;
    if (iconEl) iconEl.textContent = '\u2713';
    dropzone.classList.add('has-files');
    dropzone.classList.remove('is-dragover');
  }

  /* ══════════════════════════════════════════════════════════
     2. FORM SUBMISSION VIA FORMSPREE
     ══════════════════════════════════════════════════════════ */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!submitBtn) return;

    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.disabled = true;
    submitBtn.style.background = 'var(--accent-blue)';
    submitBtn.style.color = 'var(--bg-deep)';

    var data = new FormData(form);

    fetch(FORMSPREE_URL, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        showSuccess();
      } else {
        return response.json().then(function(json) {
          var msg = (json.errors && json.errors.length)
            ? json.errors.map(function(err) { return err.message; }).join(', ')
            : 'Submission failed.';
          showError(msg);
        });
      }
    })
    .catch(function() {
      showError('Network error \u2014 check your connection and try again.');
    });
  });

  /* ── Success state ──────────────────────────────────────── */
  function showSuccess() {
    if (!submitBtn) return;
    submitBtn.textContent = '\u2713 REQUEST RECEIVED \u2014 WE\u2019LL BE IN TOUCH WITHIN 48HRS';
    submitBtn.style.background = 'var(--accent-blue)';
    submitBtn.style.color = 'var(--bg-deep)';
    submitBtn.style.boxShadow = 'var(--glow-blue)';
    submitBtn.disabled = true;
  }

  /* ── Error state ────────────────────────────────────────── */
  function showError(msg) {
    if (!submitBtn) return;
    submitBtn.textContent = '\u2717 SOMETHING WENT WRONG \u2014 EMAIL US DIRECTLY';
    submitBtn.style.background = '#CC2200';
    submitBtn.style.color = '#fff';
    submitBtn.disabled = false;
    setTimeout(function() {
      submitBtn.textContent = '\u25B8 SUBMIT IMAGE REQUEST';
      submitBtn.style.background = 'var(--accent-orange)';
      submitBtn.style.color = '#030810';
      submitBtn.style.boxShadow = '';
    }, 4000);
  }

})();
