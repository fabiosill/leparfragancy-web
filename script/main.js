/* ============================================================
   LE PARFRAGANCY — script (new identity)
   ============================================================ */
'use strict';

/* ——— PRELOADER ——— */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = preloader ? preloader.querySelector('.pre-fill') : null;
  if (!preloader || !fill) return;

  let progress = 0;
  document.body.style.overflow = 'hidden';

  const interval = setInterval(() => {
    progress += Math.random() * 14 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    fill.style.width = progress + '%';
  }, 80);

  function hidePreloader() {
    clearInterval(interval);
    fill.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      startHeroAnimation();
    }, 600);
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1400);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 800));
  }
})();

/* ——— SCROLL PROGRESS ——— */
const scrollProgressEl = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (scrollProgressEl) scrollProgressEl.style.width = Math.min(pct, 100) + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ——— CUSTOM CURSOR ——— */
const cursorEl   = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorEl && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top  = mouseY + 'px';
  });

  (function animCursor() {
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a, button, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorEl.style.width = '16px';
      cursorEl.style.height = '16px';
      cursorRing.style.width = '52px';
      cursorRing.style.height = '52px';
      cursorRing.style.borderColor = 'rgba(192,192,192,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursorEl.style.width = '6px';
      cursorEl.style.height = '6px';
      cursorRing.style.width = '30px';
      cursorRing.style.height = '30px';
      cursorRing.style.borderColor = 'rgba(192,192,192,0.4)';
    });
  });
}

/* ——— MAGNETIC BUTTONS ——— */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ——— PARTICLES — silver/grey tones ——— */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas ? canvas.getContext('2d') : null;
if (canvas && ctx) {
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.vx = (Math.random() - 0.5) * 0.18;
      this.opacity = Math.random() * 0.2 + 0.04;
      this.life = 0;
      this.maxLife = Math.random() * 260 + 160;
    }
    update() {
      this.x += this.vx + Math.sin(this.life * 0.02) * 0.12;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const fade = this.life < 40 ? this.life / 40 : this.life > this.maxLife - 45 ? (this.maxLife - this.life) / 45 : 1;
      ctx.globalAlpha = this.opacity * fade;
      ctx.fillStyle = `hsl(0,0%,${68 + Math.random() * 18}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 90; i++) {
    const p = new P();
    p.y = Math.random() * canvas.height;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  (function animP() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animP);
  })();
}

/* ——— GSAP ——— */
gsap.registerPlugin(ScrollTrigger);

/* ——— HERO ANIMATION ——— */
function startHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const heroRules      = document.querySelector('.hero-rules');
  const heroContent    = document.querySelector('.hero-content');
  const heroEyebrow    = document.querySelector('.hero-eyebrow');
  const heroTitle      = document.querySelector('.hero-title');
  const heroSubLabel   = document.querySelector('.hero-subtitle-label');
  const heroSeparator  = document.querySelector('.hero-separator');
  const heroQuote      = document.querySelector('.hero-quote');
  const heroCtas       = document.querySelector('.hero-ctas');
  const scrollHint     = document.querySelector('.scroll-hint');

  if (heroRules)     tl.to(heroRules,    { opacity: 1, duration: 1.5, ease: 'power1.out' }, 0);
  if (heroContent)   tl.to(heroContent,  { opacity: 1, duration: 0.01 }, 0);
  if (heroEyebrow)   tl.to(heroEyebrow,  { opacity: 1, y: 0, duration: 1 }, 0.2);
  if (heroTitle)     tl.to(heroTitle,    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6 }, 0.4);
  if (heroSubLabel)  tl.to(heroSubLabel, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
  if (heroSeparator) tl.to(heroSeparator,{ opacity: 1, scaleY: 1, duration: 0.6 }, 1.1);
  if (heroQuote)     tl.to(heroQuote,    { opacity: 1, y: 0, duration: 0.9 }, 1.3);
  if (heroCtas)      tl.to(heroCtas,     { opacity: 1, y: 0, duration: 0.8 }, 1.55);
  if (scrollHint)    tl.to(scrollHint,   { opacity: 1, duration: 0.6 }, 1.8);

  gsap.utils.toArray('.corner-mark').forEach((el, i) => {
    tl.to(el, { opacity: 1, duration: 0.5 }, 1.6 + i * 0.08);
  });
}

/* ——— SCROLL ANIMATIONS ——— */
gsap.utils.toArray('.anim-up').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 44 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.anim-scale').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.92, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.product-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
    delay: (i % 3) * 0.08,
    scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
  });
});

/* ——— PARALLAX ——— */
gsap.to('.hero-content', {
  yPercent: -10, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-rules', {
  yPercent: -5, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});
gsap.to('.about-logo-big', {
  rotation: 5, ease: 'none',
  scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 }
});

/* ——— COUNTER ANIMATION ——— */
function animateCounter(el, target) {
  const proxy = { val: 0 };
  gsap.to(proxy, {
    val: target, duration: 2, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    onUpdate() { el.textContent = Math.round(proxy.val); }
  });
}
document.querySelectorAll('.mini-num').forEach(el => {
  const t = parseInt(el.dataset.count, 10);
  if (!isNaN(t)) animateCounter(el, t);
});

/* ——— NAV ——— */
const navEl = document.getElementById('main-nav');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: self => { if (navEl) navEl.classList.toggle('scrolled', self.scroll() > 60); }
});

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a, .mobile-menu-inner a');
function setActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 3;
  sections.forEach(sec => {
    if (scrollMid >= sec.offsetTop && scrollMid < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + sec.id) a.classList.add('active');
      });
    }
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ——— HAMBURGER ——— */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ——— LANGUAGE ——— */
let lang = 'pt';
const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
    document.querySelectorAll('[data-pt]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val !== null) el.innerHTML = val;
    });
    const waText = document.getElementById('modal-wa-text');
    if (waText) waText.textContent = lang === 'pt' ? 'Pedir pelo WhatsApp' : 'Order on WhatsApp';
  });
}

/* ——— PRODUCT MODAL ——— */
const modal      = document.getElementById('product-modal');
const modalImg   = document.getElementById('modal-img');
const modalName  = document.getElementById('modal-name');
const modalInsp  = document.getElementById('modal-inspired');
const modalDesc  = document.getElementById('modal-desc');
const modalWaTxt = document.getElementById('modal-wa-text');

function openModal(card) {
  if (!modal) return;
  modalImg.src = card.dataset.img || '';
  modalImg.alt = card.dataset.product || '';
  modalName.textContent = card.dataset.product || '';
  modalInsp.textContent = lang === 'pt' ? (card.dataset.inspiredPt || '') : (card.dataset.inspiredEn || '');
  modalDesc.textContent = lang === 'pt' ? (card.dataset.descPt || '') : (card.dataset.descEn || '');
  if (modalWaTxt) modalWaTxt.textContent = lang === 'pt' ? 'Pedir pelo WhatsApp' : 'Order on WhatsApp';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!mobileMenu || !mobileMenu.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', () => openModal(card)));
const modalCloseBtn = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

/* ——— RESIZE ——— */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}, { passive: true });