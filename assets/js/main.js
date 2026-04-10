// ── Burger menu ───────────────────────────────────────────────
var menuBtn = document.getElementById('menuBtn');
var navLinks = document.querySelector('.nav-links');

// Build overlay once
var mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
// Clone links from desktop nav into overlay
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(function(a) {
    var clone = a.cloneNode(true);
    mobileMenu.appendChild(clone);
  });
}
document.body.appendChild(mobileMenu);

function closeMenu() {
  menuBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (menuBtn) {
  menuBtn.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
}


// ── Nav — transparent on top, pill on scroll ──────────────────
var nav = document.querySelector('nav');
var navPill = document.getElementById('navPill');
if (nav) {
  function updateNav() {
    if (window.scrollY > 80) {
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
      if (navPill) navPill.classList.add('visible');
    } else {
      if (window.scrollY > 10) {
        nav.style.background = 'rgba(247,248,255,0.75)';
        nav.style.backdropFilter = 'blur(16px)';
        nav.style.webkitBackdropFilter = 'blur(16px)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
      }
      nav.style.opacity = '1';
      nav.style.pointerEvents = '';
      if (navPill) navPill.classList.remove('visible');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
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
