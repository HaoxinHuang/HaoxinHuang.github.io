// Small page behaviors: light/dark toggle, phone menu, active nav link,
// and the full-screen photo viewer. No libraries.
(function () {
  var root = document.documentElement;

  // ---- Light / dark toggle (choice is remembered in this browser) ----
  var themeBtn = document.getElementById('theme-toggle');
  var prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return prefersDark && prefersDark.matches ? 'dark' : 'light';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ---- Phone menu ----
  var menuBtn = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');
  function closeMenu() {
    links.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }

  // ---- Highlight the nav link of the section in view ----
  if (links && 'IntersectionObserver' in window) {
    var navLinks = Array.prototype.slice.call(links.querySelectorAll('a'));
    var setActive = function (id) {
      navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
    };
    var atBottom = function () {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    };
    var observer = new IntersectionObserver(function (entries) {
      if (atBottom()) return;
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { observer.observe(s); });
    // The last section is short, so it never reaches the middle band: mark it at the page bottom.
    var lastId = navLinks.length ? navLinks[navLinks.length - 1].getAttribute('href').slice(1) : '';
    window.addEventListener('scroll', function () { if (atBottom()) setActive(lastId); }, { passive: true });
  }

  // ---- Photo viewer ----
  var gallery = document.getElementById('gallery');
  var viewer = document.getElementById('lightbox');
  if (gallery && viewer && typeof viewer.showModal === 'function') {
    var photos = Array.prototype.slice.call(gallery.querySelectorAll('.photo'));
    var vImg = document.getElementById('lb-img');
    var vCap = document.getElementById('lb-cap');
    var index = 0;

    function show(i) {
      index = (i + photos.length) % photos.length;
      var fig = photos[index];
      var img = fig.querySelector('img');
      vImg.src = img.getAttribute('data-full') || img.currentSrc || img.src;
      vImg.alt = img.alt;
      var title = fig.querySelector('.photo-title');
      var meta = fig.querySelector('.photo-meta');
      vCap.textContent = [title && title.textContent, meta && meta.textContent].filter(Boolean).join('  ·  ');
    }

    photos.forEach(function (fig, i) {
      var btn = fig.querySelector('.photo-btn');
      if (btn) btn.addEventListener('click', function () { show(i); viewer.showModal(); });
    });
    viewer.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    viewer.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    viewer.querySelector('.lb-close').addEventListener('click', function () { viewer.close(); });
    // Click on the dark area around the photo closes the viewer.
    viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  // ---- Research videos marked data-autoplay: play muted while on screen, pause off screen ----
  var autoVideos = Array.prototype.slice.call(document.querySelectorAll('video[data-autoplay]'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (autoVideos.length && 'IntersectionObserver' in window && !reduceMotion) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});  // ignore browsers that block autoplay
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.5 });
    autoVideos.forEach(function (v) { v.muted = true; videoObserver.observe(v); });
  }

  // ---- Footer year ----
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
