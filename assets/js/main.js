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


// ── Live Lviv time ────────────────────────────────────────────
function updateLvivTime() {
  var el = document.getElementById('lvivTime');
  if (!el) return;
  var now = new Date();
  var lviv = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kiev',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).format(now);
  el.textContent = lviv + ' local';
}
updateLvivTime();
setInterval(updateLvivTime, 1000);

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
