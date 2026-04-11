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


// ── Contact section reveal on scroll ─────────────────────────
var contactWrap = document.querySelector('.contact-wrap');
if (contactWrap) {
  contactWrap.style.transition = 'transform 0.1s ease-out';
  window.addEventListener('scroll', function() {
    var rect = contactWrap.getBoundingClientRect();
    var winH = window.innerHeight;
    var progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH * 0.6)));
    var scale = 0.92 + progress * 0.08;
    var ty = (1 - progress) * 60;
    contactWrap.style.transform = 'translateY(' + ty + 'px) scale(' + scale + ')';
  }, { passive: true });
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

// ── Hero parallax on scroll ───────────────────────────────────
var heroIn = document.querySelector('.hero-in');
if (heroIn) {
  window.addEventListener('scroll', function() {
    var s = window.scrollY;
    var progress = Math.min(s / window.innerHeight, 1);
    var scale = 1 - progress * 0.08;
    var ty = -s * 0.3;
    heroIn.style.transform = 'translateY(' + ty + 'px) scale(' + scale + ')';
  }, { passive: true });
}

// ── Hero title tilt parallax ──────────────────────────────────
var tiltEls = [document.querySelector('.h1'), document.querySelector('.contact-title')];
tiltEls.forEach(function(el) {
  if (!el) return;
  el.style.transition = 'transform 0.08s ease-out';
});
document.addEventListener('mousemove', function(e) {
  var cx = window.innerWidth / 2;
  var cy = window.innerHeight / 2;
  var dx = (e.clientX - cx) / cx;
  var dy = (e.clientY - cy) / cy;
  var rotateX = dy * -4;
  var rotateY = dx * 5;
  var tx = dx * 8;
  var ty = dy * 4;
  var val = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translate(' + tx + 'px,' + ty + 'px)';
  tiltEls.forEach(function(el) {
    if (!el) return;
    el.style.transition = 'transform 0.08s ease-out';
    el.style.transform = val;
  });
});
document.addEventListener('mouseleave', function() {
  tiltEls.forEach(function(el) {
    if (!el) return;
    el.style.transition = 'transform 0.6s ease-out';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate(0,0)';
  });
});

// ── Btn-fill ripple on mouse position ────────────────────────
document.querySelectorAll('.btn-fill, .nav-pill-cta').forEach(function(btn) {
  var ripple = btn.querySelector('.btn-ripple');
  if (!ripple) return;

  function setPos(e) {
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.5;
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - r.top  - size / 2) + 'px';
  }

  btn.addEventListener('mouseenter', function(e) {
    setPos(e);
    btn.classList.add('ripple-active');
  });
  btn.addEventListener('mousemove', setPos);
  btn.addEventListener('mouseleave', function() {
    btn.classList.remove('ripple-active');
  });
});

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
