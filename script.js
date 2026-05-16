/* ============================================================
   LE PARFRAGANCY — script.js (FIXED)
   ============================================================ */
'use strict';

/* ——————————————————————————————————————
   FIX #1: PRELOADER
   Safe: checks readyState before addListener
—————————————————————————————————————— */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill      = preloader ? preloader.querySelector('.pre-fill') : null;
  if (!preloader || !fill) return;

  let progress = 0;
  document.body.style.overflow = 'hidden';

  const interval = setInterval(() => {
    progress += Math.random() * 16 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    fill.style.width = progress + '%';
  }, 75);

  function hidePreloader() {
    clearInterval(interval);
    fill.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      startHeroAnimation();
    }, 550);
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1200);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 700));
  }
})();

/* ——————————————————————————————————————
   SCROLL PROGRESS BAR
—————————————————————————————————————— */
const scrollProgressEl = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgressEl) scrollProgressEl.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ——————————————————————————————————————
   CUSTOM CURSOR
—————————————————————————————————————— */
const cursorEl   = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const cursorDot  = cursorEl ? cursorEl.querySelector('.cursor-dot') : null;

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorEl && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  function setCursorHover() {
    cursorEl.style.width  = '20px';
    cursorEl.style.height = '20px';
    if (cursorDot) {
      cursorDot.style.background = 'transparent';
      cursorDot.style.border     = '1px solid var(--gold)';
    }
    cursorRing.style.width  = '60px';
    cursorRing.style.height = '60px';
  }
  function setCursorDefault() {
    cursorEl.style.width  = '12px';
    cursorEl.style.height = '12px';
    if (cursorDot) {
      cursorDot.style.background = 'var(--gold)';
      cursorDot.style.border     = 'none';
    }
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
  }

  document.querySelectorAll('a, button, .product-card, .sensory-word').forEach(el => {
    el.addEventListener('mouseenter', setCursorHover);
    el.addEventListener('mouseleave', setCursorDefault);
  });
}

/* ——————————————————————————————————————
   MAGNETIC BUTTONS
   FIX: reset uses empty string, not transform:none
   (prevents fighting with GSAP)
—————————————————————————————————————— */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
    const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ——————————————————————————————————————
   PARTICLE CANVAS
—————————————————————————————————————— */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * canvas.width;
      this.y       = canvas.height + 20;
      this.size    = Math.random() * 2.1 + 0.4;
      this.speedY  = -(Math.random() * 0.52 + 0.18);
      this.speedX  = (Math.random() - 0.5) * 0.24;
      this.opacity = Math.random() * 0.32 + 0.08;
      this.life    = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.hue     = Math.random() * 18 + 36;
    }
    update() {
      this.x += this.speedX + Math.sin(this.life * 0.018) * 0.17;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -20) this.reset();
    }
    draw() {
      const fade = this.life < 40
        ? this.life / 40
        : this.life > this.maxLife - 55
          ? (this.maxLife - this.life) / 55
          : 1;
      ctx.globalAlpha = this.opacity * fade;
      ctx.fillStyle   = `hsl(${this.hue},55%,68%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 110; i++) {
    const p = new Particle();
    p.y    = Math.random() * canvas.height;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  (function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animParticles);
  })();
}

/* ——————————————————————————————————————
   GSAP SETUP
—————————————————————————————————————— */
gsap.registerPlugin(ScrollTrigger);

/* ——————————————————————————————————————
   HERO ANIMATION
   FIX: hero-title y reset uses duration:0,
   title chars animated individually after parent reset
—————————————————————————————————————— */
function startHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-tagline-top',   { opacity:1, y:0, duration:1 })
    .to('.hero-title',         { opacity:1, y:0, filter:'blur(0px)', duration:1.5 }, '-=0.5')
    .to('.hero-subtitle-small',{ opacity:1, y:0, duration:0.75 }, '-=0.7')
    .to('.hero-line-wrap',     { opacity:1, duration:0.4 }, '-=0.55')
    .to('.hero-line',          { scaleX:1, duration:1.1, ease:'power3.inOut' }, '-=0.35')
    .to('.hero-subtitle',      { opacity:1, y:0, duration:0.85 }, '-=0.85')
    .to('.hero-ctas',          { opacity:1, y:0, duration:0.75 }, '-=0.6')
    .to('.scroll-hint',        { opacity:1, duration:0.55 }, '-=0.35')
    .to('.corner-mark',        { opacity:1, duration:0.5, stagger:0.08 }, '-=0.5');
}

/* ——————————————————————————————————————
   SCROLL — GENERIC ANIMATIONS
   FIX #3: anim-up runs for everything
   anim-scale runs for about-visual only
   product-cards handled by dedicated block below
—————————————————————————————————————— */
gsap.utils.toArray('.anim-up').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, y:48 },
    {
      opacity:1, y:0, duration:1.05, ease:'power3.out',
      scrollTrigger:{
        trigger:el, start:'top 87%',
        toggleActions:'play none none none'
      }
    }
  );
});

// Only about-visual uses anim-scale now
gsap.utils.toArray('.anim-scale').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, scale:0.87, y:24 },
    {
      opacity:1, scale:1, y:0, duration:1.05, ease:'power3.out',
      scrollTrigger:{
        trigger:el, start:'top 88%',
        toggleActions:'play none none none'
      }
    }
  );
});

/* ——————————————————————————————————————
   PRODUCT CARDS — dedicated stagger
   FIX #3: only this block handles cards (no anim-scale conflict)
—————————————————————————————————————— */
gsap.utils.toArray('.product-card').forEach((card, i) => {
  gsap.to(card, {
    opacity:1, y:0, scale:1,
    duration:0.9, ease:'power3.out',
    delay: (i % 3) * 0.1,
    scrollTrigger:{
      trigger: card, start:'top 92%',
      toggleActions:'play none none none'
    }
  });
});

/* ——————————————————————————————————————
   PARALLAX
—————————————————————————————————————— */
gsap.to('.hero-content', {
  yPercent:-12, ease:'none',
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
});
gsap.to('.hero-fog', {
  yPercent:-22, ease:'none',
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
});
gsap.to('.hero-orb-1', {
  yPercent:-14, xPercent:4, ease:'none',
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.5 }
});
gsap.to('.about-logo-big', {
  rotation:6, ease:'none',
  scrollTrigger:{ trigger:'#about', start:'top bottom', end:'bottom top', scrub:1 }
});

/* ——————————————————————————————————————
   SENSORY WORDS stagger
—————————————————————————————————————— */
let sensoryReady = false;

gsap.utils.toArray('.sensory-word').forEach((w, i) => {
  gsap.fromTo(w,
    { opacity:0, y:16 },
    {
      opacity:0.14, y:0, duration:0.65, delay:i * 0.075,
      scrollTrigger:{
        trigger:'#sensory', start:'top 74%',
        toggleActions:'play none none none',
        onEnter: () => { sensoryReady = true; }
      }
    }
  );
});

/* ——————————————————————————————————————
   FIX #5: SENSORY PULSE
   Only pulses AFTER words have scrolled into view
—————————————————————————————————————— */
setInterval(() => {
  if (!sensoryReady) return; // guard
  const words  = document.querySelectorAll('.sensory-word');
  const word   = words[Math.floor(Math.random() * words.length)];
  if (!word) return;
  gsap.to(word, {
    opacity:0.75, scale:1.05, duration:0.45, ease:'power2.inOut',
    yoyo:true, repeat:1,
    onComplete: () => gsap.set(word, { opacity:0.14, scale:1 })
  });
}, 2000);

/* ——————————————————————————————————————
   FIX #2: COUNTER ANIMATION
   Uses proxy object — GSAP cannot tween textContent directly
—————————————————————————————————————— */
function animateCounter(el, target) {
  const proxy = { val: 0 };
  gsap.to(proxy, {
    val: target,
    duration: 2.2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
    onUpdate() {
      el.textContent = Math.round(proxy.val);
    }
  });
}
document.querySelectorAll('.stat-num, .mini-num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  if (!isNaN(target)) animateCounter(el, target);
});

/* ——————————————————————————————————————
   NAV — scroll class + active link
—————————————————————————————————————— */
const navEl = document.getElementById('main-nav');

ScrollTrigger.create({
  start: 'top -50',
  onUpdate: self => {
    if (navEl) navEl.classList.toggle('scrolled', self.progress > 0);
  }
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

/* ——————————————————————————————————————
   HAMBURGER / MOBILE MENU
—————————————————————————————————————— */
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

/* ——————————————————————————————————————
   LANGUAGE TOGGLE
—————————————————————————————————————— */
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
    // Also update modal wa text if open
    const waText = document.getElementById('modal-wa-text');
    if (waText) waText.textContent = lang === 'pt' ? 'Pedir pelo WhatsApp' : 'Order on WhatsApp';
  });
}

/* ——————————————————————————————————————
   PRODUCT MODAL
   FIX: dataset camelCase mapping is correct:
   data-inspired-pt → dataset.inspiredPt ✓
   data-desc-pt     → dataset.descPt     ✓
—————————————————————————————————————— */
const modal       = document.getElementById('product-modal');
const modalImg    = document.getElementById('modal-img');
const modalName   = document.getElementById('modal-name');
const modalInsp   = document.getElementById('modal-inspired');
const modalDesc   = document.getElementById('modal-desc');
const modalWaTxt  = document.getElementById('modal-wa-text');

function openModal(card) {
  if (!modal) return;
  modalImg.src         = card.dataset.img || '';
  modalImg.alt         = card.dataset.product || '';
  modalName.textContent  = card.dataset.product || '';
  modalInsp.textContent  = lang === 'pt'
    ? (card.dataset.inspiredPt || '')
    : (card.dataset.inspiredEn || '');
  modalDesc.textContent  = lang === 'pt'
    ? (card.dataset.descPt || '')
    : (card.dataset.descEn || '');
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

document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

const modalCloseBtn = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
});

/* ——————————————————————————————————————
   RESIZE — debounced ScrollTrigger refresh
—————————————————————————————————————— */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
}, { passive: true });
