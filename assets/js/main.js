// ── Burger menu ───────────────────────────────────────────────
var menuBtn = document.getElementById('menuBtn');
var navLinks = document.querySelector('.nav-links');
var navEl = document.querySelector('nav');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', function() {
    var isOpen = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    navEl.classList.toggle('nav-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
      navEl.classList.remove('nav-open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll reveal ─────────────────────────────────────────────
var ro = new IntersectionObserver(function(es) {
  es.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function(el) { ro.observe(el); });

// ── Animated counters (index only) ───────────────────────────
function runCounter(el) {
  var target = +el.dataset.to;
  var inc = target / (1600 / 16);
  var v = 0;
  var s = setInterval(function() {
    v = Math.min(v + inc, target);
    el.textContent = Math.round(v);
    if (v >= target) clearInterval(s);
  }, 16);
}
var co = new IntersectionObserver(function(es) {
  es.forEach(function(e) {
    if (e.isIntersecting) {
      runCounter(e.target);
      co.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(function(el) { co.observe(el); });

// ── Nav scroll border ─────────────────────────────────────────
var nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', function() {
    nav.style.borderBottomColor = window.scrollY > 30
      ? 'transparent'
      : 'var(--border)';
  }, { passive: true });
}
