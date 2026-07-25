/**
 * Unified project request form.
 * Formspree forwards submissions according to the form settings at:
 * https://formspree.io/forms/xojknlvk/settings
 */
(function initProjectForm() {
  'use strict';

  var FORMSPREE_URL = 'https://formspree.io/f/xojknlvk';
  var MAX_FILES = 10;
  var MAX_FILE_BYTES = 25 * 1024 * 1024;
  var form = document.getElementById('quote-form');
  var dropzone = document.getElementById('file-dropzone');
  var fileInput = document.getElementById('file-input');
  var submitBtn = document.getElementById('submit-btn');
  var defaultButtonText = '\u25B8 SEND PROJECT FOR REVIEW';

  if (!form || !submitBtn) return;

  function setDropzoneMessage(message, isError) {
    if (!dropzone) return;
    var hint = dropzone.querySelector('.dropzone-hint');
    var icon = dropzone.querySelector('.dropzone-icon');
    if (hint) hint.textContent = message;
    if (icon) icon.textContent = isError ? '!' : '\u2713';
    dropzone.classList.toggle('has-files', !isError);
    dropzone.classList.remove('is-dragover');
  }

  function validateFiles(files) {
    if (!files || !files.length) return '';
    if (files.length > MAX_FILES) return 'Choose no more than 10 files.';
    for (var i = 0; i < files.length; i += 1) {
      if (files[i].size > MAX_FILE_BYTES) {
        return files[i].name + ' exceeds the 25MB per-file limit.';
      }
    }
    return '';
  }

  function displaySelectedFiles(files) {
    var error = validateFiles(files);
    if (error) {
      setDropzoneMessage(error, true);
      return false;
    }
    var names = Array.from(files).map(function(file) { return file.name; });
    setDropzoneMessage('\u2713 ' + names.join(', '), false);
    return true;
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', function() { fileInput.click(); });
    dropzone.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener('change', function() {
      displaySelectedFiles(fileInput.files);
    });
    ['dragover', 'dragenter'].forEach(function(eventName) {
      dropzone.addEventListener(eventName, function(event) {
        event.preventDefault();
        dropzone.classList.add('is-dragover');
      });
    });
    dropzone.addEventListener('dragleave', function() {
      dropzone.classList.remove('is-dragover');
    });
    dropzone.addEventListener('drop', function(event) {
      event.preventDefault();
      dropzone.classList.remove('is-dragover');
      var files = event.dataTransfer.files;
      if (!displaySelectedFiles(files)) return;
      try { fileInput.files = files; } catch (error) { }
    });
  }

  function showError(message) {
    submitBtn.textContent = '\u2717 ' + message;
    submitBtn.style.background = 'var(--accent-primary2)';
    submitBtn.style.color = '#fff';
    submitBtn.disabled = false;
    setTimeout(function() {
      submitBtn.textContent = defaultButtonText;
      submitBtn.style.background = 'var(--accent-primary)';
      submitBtn.style.color = 'var(--bg-deep)';
      submitBtn.style.boxShadow = '';
    }, 5000);
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var fileError = validateFiles(fileInput ? fileInput.files : null);
    if (fileError) {
      setDropzoneMessage(fileError, true);
      showError('CHECK YOUR ATTACHMENTS');
      return;
    }

    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.disabled = true;
    submitBtn.style.background = 'var(--accent-blue)';
    submitBtn.style.color = 'var(--bg-deep)';

    fetch(FORMSPREE_URL, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function(response) {
        if (response.ok) {
          submitBtn.textContent = '\u2713 PROJECT RECEIVED \u2014 EXPECT A REPLY IN 1\u20132 BUSINESS DAYS';
          submitBtn.style.background = 'var(--accent-blue)';
          submitBtn.style.color = 'var(--bg-deep)';
          submitBtn.style.boxShadow = 'var(--glow-blue)';
          document.getElementById('project-request').scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        return response.json().then(function(payload) {
          var message = payload.errors && payload.errors.length
            ? payload.errors.map(function(error) { return error.message; }).join(', ')
            : 'Submission failed. Please try again.';
          showError(message);
        });
      })
      .catch(function() {
        showError('NETWORK ERROR \u2014 PLEASE TRY AGAIN');
      });
  });
})();
