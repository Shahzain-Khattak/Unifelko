/* ==========================================================================
   UNIFELKO PRIVATE LIMITED — Site scripts
   Progressive enhancement only: every page works with JavaScript disabled.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealItems.forEach(function (el) { io.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Pre-select the service from ?service=... ----------
     Links such as contact.html?service=automotive pre-fill the
     enquiry form so the visitor does not have to choose twice.     */
  var params = new URLSearchParams(window.location.search);
  var wanted = params.get('service');
  if (wanted) {
    var select = document.querySelector('#service');
    if (select) {
      var matched = Array.prototype.some.call(select.options, function (opt) {
        if (opt.value === wanted) {
          select.value = wanted;
          return true;
        }
        return false;
      });

      if (matched) {
        var status = document.querySelector('#formStatus');
        if (status) {
          status.className = 'form-status is-visible';
          status.textContent = 'Enquiry type pre-selected for you — just add your details below.';
        }
        var nameField = document.querySelector('#name');
        if (nameField && window.location.hash === '#enquiry') {
          setTimeout(function () { nameField.focus({ preventScroll: true }); }, 500);
        }
      }
    }
  }

  /* ---------- Enquiry form validation + mail client hand-off ----------
     The site is static and has no server. On submit we validate the
     fields and open the visitor's mail client with a pre-filled draft.
     To use a real form endpoint later, replace the block marked
     "SUBMIT HANDLER" below.                                          */
  var form = document.querySelector('#enquiryForm');

  if (form) {
    var statusBox = document.querySelector('#formStatus');

    var setError = function (field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var msg = wrap.querySelector('.error-msg');
      if (msg && message) msg.textContent = message;
    };

    var clearError = function (field) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('has-error');
    };

    var isEmail = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    form.addEventListener('input', function (e) {
      if (e.target.matches('.input, .select, .textarea')) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var phone = form.querySelector('#phone');
      var service = form.querySelector('#service');
      var message = form.querySelector('#message');
      var valid = true;
      var firstBad = null;

      [name, email, phone, service, message].forEach(clearError);

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, 'Please enter your name.');
        valid = false; firstBad = firstBad || name;
      }

      if (!isEmail(email.value.trim())) {
        setError(email, 'Please enter a valid email address.');
        valid = false; firstBad = firstBad || email;
      }

      if (phone.value.trim() && phone.value.replace(/[^0-9]/g, '').length < 7) {
        setError(phone, 'Please check the phone number.');
        valid = false; firstBad = firstBad || phone;
      }

      if (!service.value) {
        setError(service, 'Please choose what your enquiry is about.');
        valid = false; firstBad = firstBad || service;
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        setError(message, 'Please tell us a little more (at least 10 characters).');
        valid = false; firstBad = firstBad || message;
      }

      if (!valid) {
        if (statusBox) {
          statusBox.className = 'form-status is-visible is-error';
          statusBox.textContent = 'Please correct the highlighted fields and try again.';
        }
        if (firstBad) firstBad.focus();
        return;
      }

      /* --- SUBMIT HANDLER -------------------------------------------------
         The lines below open the visitor's email app with a prepared draft.
         To send the enquiry to a server instead (e.g. Formspree, Netlify
         Forms, or your own API), replace this block with a fetch() call.   */
      var to = form.getAttribute('data-mailto') || 'info@unifelko.com';
      var subject = 'UNIFELKO enquiry — ' + service.options[service.selectedIndex].text;
      var body = [
        'Name: ' + name.value.trim(),
        'Email: ' + email.value.trim(),
        'Phone: ' + (phone.value.trim() || '—'),
        'Enquiry: ' + service.options[service.selectedIndex].text,
        '',
        'Message:',
        message.value.trim()
      ].join('\n');

      var href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (statusBox) {
        statusBox.className = 'form-status is-visible';
        statusBox.innerHTML = 'Your email app should open with the message ready to send. ' +
          'If nothing opened, email us directly at <a href="mailto:' + to + '">' + to + '</a>.';
      }

      window.location.href = href;
      /* --- END SUBMIT HANDLER -------------------------------------------- */
    });
  }
})();
