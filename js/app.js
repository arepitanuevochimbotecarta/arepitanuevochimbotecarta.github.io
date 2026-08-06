/* ===========================================================
   AREPITA FAST FOOD — app.js
   Header scroll state · mobile nav · smooth active-link
   scroll reveal (fade up) · back-to-top · image fallback
   =========================================================== */
(function () {
  'use strict';

  var header   = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var mainNav  = document.getElementById('mainNav');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('.menu-section');
  var backToTop = document.getElementById('backToTop');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header background on scroll ---------- */
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (backToTop) {
      if (window.scrollY > window.innerHeight * 0.8) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close mobile menu after choosing a link
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active link highlighting on scroll ---------- */
  if ('IntersectionObserver' in window && sections.length) {
    var linkMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      linkMap[id] = link;
    });

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var link = linkMap[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Scroll reveal (fade up) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: no IntersectionObserver support
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Image fallback ----------
     If an assets/*.webp hasn't been added yet, show a clean
     placeholder instead of a broken image icon, labelled with
     the expected filename so it's easy to know what to drop in. */
  document.querySelectorAll('.section-frame img').forEach(function (img) {
    img.addEventListener('error', function handleError() {
      img.removeEventListener('error', handleError);
      var expected = img.getAttribute('src').split('/').pop();
      img.classList.add('img-missing');
      img.alt = 'Falta la imagen: ' + expected;
      img.removeAttribute('src');
      img.style.aspectRatio = '16 / 9';
    });
  });

})();
