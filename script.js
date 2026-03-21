/* ============================================
   BREATHWORK & ICE BATH WORKSHOP — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== STATE ====================
  let currentLang = 'he'; // Default Hebrew
  let animationsEnabled = true;

  // ==================== HEADER SCROLL ====================
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scroll;
  }, { passive: true });

  // ==================== FAQ ACCORDION ====================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  // ==================== Q&A ACCORDION ====================
  document.querySelectorAll('.qa-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.qa-item');
      const isOpen = item.classList.contains('open');
      // Close all Q&A items
      document.querySelectorAll('.qa-item.open').forEach(el => el.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        // Scroll into view so it feels like it opens downward
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      }
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  // Open first Q&A item by default
  const firstQa = document.querySelector('.qa-item');
  if (firstQa) {
    firstQa.classList.add('open');
    firstQa.querySelector('.qa-question')?.setAttribute('aria-expanded', 'true');
  }

  // ==================== LANGUAGE SWITCHER (removed) ====================

  // ==================== ACCESSIBILITY ====================
  const a11yToggle = document.getElementById('a11yToggle');
  const a11yPanel = document.getElementById('a11yPanel');
  let fontScale = 1;

  a11yToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    a11yPanel.classList.toggle('open');
  });

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (!a11yPanel.contains(e.target) && e.target !== a11yToggle) {
      a11yPanel.classList.remove('open');
    }
  });

  const fontValueEl = document.getElementById('a11yFontValue');
  const contrastToggle = document.getElementById('a11yContrast');
  const animToggle = document.getElementById('a11yAnimations');

  function updateFontDisplay() {
    fontValueEl.textContent = Math.round(fontScale * 100) + '%';
  }

  document.getElementById('a11yFontUp').addEventListener('click', () => {
    fontScale = Math.min(fontScale + 0.1, 1.5);
    document.documentElement.style.setProperty('--font-scale', fontScale);
    updateFontDisplay();
  });

  document.getElementById('a11yFontDown').addEventListener('click', () => {
    fontScale = Math.max(fontScale - 0.1, 0.8);
    document.documentElement.style.setProperty('--font-scale', fontScale);
    updateFontDisplay();
  });

  contrastToggle.addEventListener('click', () => {
    const on = document.body.classList.toggle('high-contrast');
    contrastToggle.setAttribute('aria-checked', on);
  });

  animToggle.addEventListener('click', () => {
    animationsEnabled = !animationsEnabled;
    document.body.classList.toggle('reduce-motion', !animationsEnabled);
    animToggle.setAttribute('aria-checked', !animationsEnabled);
  });

  document.getElementById('a11yReset').addEventListener('click', () => {
    fontScale = 1;
    document.documentElement.style.setProperty('--font-scale', 1);
    document.body.classList.remove('high-contrast', 'reduce-motion');
    animationsEnabled = true;
    updateFontDisplay();
    contrastToggle.setAttribute('aria-checked', 'false');
    animToggle.setAttribute('aria-checked', 'false');
  });

  // ==================== SCROLL REVEAL ====================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==================== TESTIMONIALS CAROUSEL ====================
  const tCards = document.querySelectorAll('.testimonial-card');
  const tStage = document.getElementById('testimonialsStage');
  const tDotsContainer = document.getElementById('testimonialDots');
  const tRightBtn = document.getElementById('testimonialsRight');
  const tLeftBtn = document.getElementById('testimonialsLeft');
  const tLen = tCards.length;
  let tActive = 1; // center card index

  // Build dots
  for (let i = 0; i < tLen; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === tActive ? ' active' : '');
    dot.addEventListener('click', () => setTActive(i));
    tDotsContainer.appendChild(dot);
  }
  const tDots = tDotsContainer.querySelectorAll('.dot');

  function setTActive(index) {
    if (index < 0) index = tLen - 1;
    if (index >= tLen) index = 0;
    tActive = index;
    layoutTestimonials();
  }

  function layoutTestimonials() {
    const isMobile = window.innerWidth <= 768;
    const stageWidth = tStage.offsetWidth;
    const gap = isMobile ? 0 : 20;
    const cardWidth = isMobile ? stageWidth : (stageWidth - gap * 2) / 3;

    // Measure tallest card to set uniform height
    let maxH = 0;
    tCards.forEach(card => {
      card.style.width = `${cardWidth}px`;
      card.style.height = 'auto';
    });
    tCards.forEach(card => {
      const h = card.scrollHeight;
      if (h > maxH) maxH = h;
    });
    tCards.forEach(card => {
      card.style.height = `${maxH}px`;
    });
    tStage.style.height = `${maxH}px`;

    tCards.forEach((card, i) => {
      // Signed offset with wrapping (infinite)
      let off = i - tActive;
      if (off > tLen / 2) off -= tLen;
      if (off < -tLen / 2) off += tLen;
      const abs = Math.abs(off);

      if (isMobile) {
        // Mobile: show only active card
        if (off === 0) {
          card.style.transform = 'translateX(0)';
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
          card.classList.add('t-active');
          card.classList.remove('t-side');
        } else {
          card.style.transform = `translateX(${off > 0 ? 300 : -300}px)`;
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.classList.remove('t-active', 't-side');
        }
      } else {
        // Desktop: show 3 cards (center + 2 sides), hide rest
        if (abs > 1) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = `translateX(${off > 0 ? 500 : -500}px)`;
          card.classList.remove('t-active', 't-side');
          return;
        }

        const x = off * (cardWidth + gap);
        card.style.transform = `translateX(${x}px)`;
        card.style.opacity = off === 0 ? '1' : '0.55';
        card.style.pointerEvents = 'auto';
        card.classList.toggle('t-active', off === 0);
        card.classList.toggle('t-side', off !== 0);
      }
    });

    tDots.forEach((dot, i) => dot.classList.toggle('active', i === tActive));
  }

  layoutTestimonials();

  // Arrow buttons — right arrow: show card from right, dot moves right
  tRightBtn.addEventListener('click', () => setTActive(tActive - 1));
  tLeftBtn.addEventListener('click', () => setTActive(tActive + 1));

  // Keyboard
  tStage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setTActive(tActive + 1);
    if (e.key === 'ArrowLeft') setTActive(tActive - 1);
  });

  // Touch swipe
  let tTouchStartX = 0;
  let tTouchStartY = 0;
  let tSwipeLocked = false;

  tStage.addEventListener('touchstart', (e) => {
    tTouchStartX = e.changedTouches[0].screenX;
    tTouchStartY = e.changedTouches[0].screenY;
    tSwipeLocked = false;
  }, { passive: true });

  tStage.addEventListener('touchmove', (e) => {
    const dx = Math.abs(e.changedTouches[0].screenX - tTouchStartX);
    const dy = Math.abs(e.changedTouches[0].screenY - tTouchStartY);
    if (!tSwipeLocked && dx > 10 && dx > dy) tSwipeLocked = true;
    if (tSwipeLocked) e.preventDefault();
  }, { passive: false });

  tStage.addEventListener('touchend', (e) => {
    const diff = tTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      // Swipe left (diff>0) → dot moves right; swipe right (diff<0) → dot moves left
      if (diff > 0) {
        setTActive(tActive - 1);
      } else {
        setTActive(tActive + 1);
      }
    }
    tSwipeLocked = false;
  }, { passive: true });

  window.addEventListener('resize', layoutTestimonials);

  // ==================== DEVICE DETECTION ====================
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobileWidth = () => window.innerWidth <= 768;

  // ==================== SNOW PARTICLES ====================
  const snowCanvas = document.getElementById('snowCanvas');
  const snowCtx = snowCanvas.getContext('2d');
  let snowParticles = [];

  function resizeSnowCanvas() {
    const hero = document.getElementById('hero');
    snowCanvas.width = hero.offsetWidth;
    snowCanvas.height = hero.offsetHeight;
  }

  resizeSnowCanvas();
  window.addEventListener('resize', resizeSnowCanvas);

  class SnowParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * snowCanvas.width;
      this.y = Math.random() * snowCanvas.height;
      this.size = Math.random() * 3.5 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.opacity = Math.random() * 0.5 + 0.12;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.3 + this.speedX;

      if (this.y > snowCanvas.height) {
        this.y = -10;
        this.x = Math.random() * snowCanvas.width;
      }
      if (this.x > snowCanvas.width) this.x = 0;
      if (this.x < 0) this.x = snowCanvas.width;
    }

    draw() {
      snowCtx.beginPath();
      snowCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      snowCtx.fillStyle = `rgba(186, 230, 253, ${this.opacity})`;
      snowCtx.fill();
    }
  }

  // Reduce particles on mobile for performance
  const maxParticles = isMobileWidth() ? 40 : 130;
  const particleCount = Math.min(maxParticles, Math.floor(window.innerWidth / 10));
  for (let i = 0; i < particleCount; i++) {
    snowParticles.push(new SnowParticle());
  }

  function animateSnow() {
    if (!animationsEnabled) {
      requestAnimationFrame(animateSnow);
      return;
    }
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    snowParticles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateSnow);
  }

  animateSnow();

  // ==================== ICE TRAIL EFFECT ====================
  // Disable ice trail on touch devices for performance
  const iceCanvas = document.getElementById('iceTrailCanvas');

  if (!isTouchDevice) {
    const iceCtx = iceCanvas.getContext('2d');
    let iceCubes = [];
    let mouseX = -100;
    let mouseY = -100;

    function resizeIceCanvas() {
      iceCanvas.width = window.innerWidth;
      iceCanvas.height = window.innerHeight;
    }

    resizeIceCanvas();
    window.addEventListener('resize', resizeIceCanvas);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!animationsEnabled) return;

      // Spawn ice cube
      if (Math.random() > 0.5) {
        iceCubes.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          size: Math.random() * 8 + 4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          opacity: 0.7,
          velocityX: (Math.random() - 0.5) * 1,
          velocityY: Math.random() * 0.5 + 0.3,
          life: 1
        });
      }
    });

    function drawIceCube(cube) {
      iceCtx.save();
      iceCtx.translate(cube.x, cube.y);
      iceCtx.rotate(cube.rotation);
      iceCtx.globalAlpha = cube.opacity * cube.life;

      const s = cube.size;

      // Ice cube body
      iceCtx.fillStyle = `rgba(186, 230, 253, 0.5)`;
      iceCtx.fillRect(-s / 2, -s / 2, s, s);

      // Light edge
      iceCtx.strokeStyle = `rgba(224, 242, 254, 0.8)`;
      iceCtx.lineWidth = 1;
      iceCtx.strokeRect(-s / 2, -s / 2, s, s);

      // Highlight
      iceCtx.fillStyle = `rgba(255, 255, 255, 0.4)`;
      iceCtx.fillRect(-s / 2, -s / 2, s * 0.4, s * 0.4);

      iceCtx.restore();
    }

    function animateIceTrail() {
      iceCtx.clearRect(0, 0, iceCanvas.width, iceCanvas.height);

      iceCubes.forEach(cube => {
        cube.x += cube.velocityX;
        cube.y += cube.velocityY;
        cube.rotation += cube.rotationSpeed;
        cube.life -= 0.015;
        cube.opacity = cube.life * 0.7;
        drawIceCube(cube);
      });

      // Remove dead cubes
      iceCubes = iceCubes.filter(c => c.life > 0);

      requestAnimationFrame(animateIceTrail);
    }

    animateIceTrail();
  } else {
    // Hide canvas on touch devices
    iceCanvas.style.display = 'none';
  }

  // ==================== LIGHTBOX POPUP ====================
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==================== PARALLAX EFFECT ====================
  // Disable parallax on touch/mobile devices for smooth scrolling
  if (!isTouchDevice) {
    window.addEventListener('scroll', () => {
      if (!animationsEnabled) return;
      const scrolled = window.scrollY;

      // Subtle parallax on ice cube
      const iceCube = document.querySelector('.hero-ice-cube-wrapper');
      if (iceCube) {
        iceCube.style.transform = `translateY(${scrolled * 0.15}px)`;
      }

      // Hero content parallax
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.7);
      }
    }, { passive: true });
  }

  // ==================== CARD STACK GALLERY ====================
  const stackCards = document.querySelectorAll('.stack-card');
  const stackStage = document.getElementById('cardStackStage');
  const stackDotsContainer = document.getElementById('cardStackDots');
  const stackRightBtn = document.getElementById('stackRight');
  const stackLeftBtn = document.getElementById('stackLeft');
  const stackLen = stackCards.length;
  let stackActive = 1; // Start at 1 so we see 0,1,2

  // Build dots
  for (let i = 0; i < stackLen; i++) {
    const dot = document.createElement('button');
    dot.className = 'stack-dot' + (i === stackActive ? ' active' : '');
    dot.addEventListener('click', () => setStackActive(i));
    stackDotsContainer.appendChild(dot);
  }
  const stackDots = stackDotsContainer.querySelectorAll('.stack-dot');

  function setStackActive(index) {
    if (index < 0) index = stackLen - 1;
    if (index >= stackLen) index = 0;
    stackActive = index;
    layoutStack();
  }

  function layoutStack() {
    const isMobile = window.innerWidth <= 768;

    stackCards.forEach((card, i) => {
      // Signed offset with wrapping
      let off = i - stackActive;
      if (off > stackLen / 2) off -= stackLen;
      if (off < -stackLen / 2) off += stackLen;
      const abs = Math.abs(off);

      // On mobile: show only 1 card (the active one)
      if (isMobile) {
        if (off !== 0) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = `translateX(${off > 0 ? 300 : -300}px) scale(0.8)`;
          card.classList.remove('active', 'side');
          return;
        }
        card.style.transform = 'translateX(0) scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '10';
        card.style.pointerEvents = 'auto';
        card.classList.add('active');
        card.classList.remove('side');
        return;
      }

      // Desktop: show 3 cards (center + 2 sides)
      if (abs > 1) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = `translateX(${off > 0 ? 400 : -400}px) scale(0.8)`;
        card.classList.remove('active', 'side');
        return;
      }

      const spacing = 340;
      const x = off * spacing;
      const scale = off === 0 ? 1.08 : 0.92;
      const opacity = off === 0 ? 1 : 0.6;
      const zIndex = off === 0 ? 10 : 5;
      const rotateY = off * -8;

      card.style.transform = `translateX(${x}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.pointerEvents = 'auto';

      card.classList.toggle('active', off === 0);
      card.classList.toggle('side', off !== 0);
    });

    stackDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === stackActive);
    });
  }

  // Initialize
  layoutStack();

  // Click side cards to navigate
  stackCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== stackActive) setStackActive(i);
    });
  });

  // Arrow buttons: right arrow moves gallery right, left arrow moves left
  stackRightBtn.addEventListener('click', () => {
    setStackActive(stackActive - 1);
  });
  stackLeftBtn.addEventListener('click', () => {
    setStackActive(stackActive + 1);
  });

  // Keyboard matches visual direction
  stackStage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setStackActive(stackActive - 1);
    if (e.key === 'ArrowLeft') setStackActive(stackActive + 1);
  });

  // Touch swipe (mobile)
  let stackTouchStartX = 0;
  let stackTouchStartY = 0;
  let stackSwipeLocked = false; // true = horizontal swipe in progress

  stackStage.addEventListener('touchstart', (e) => {
    stackTouchStartX = e.changedTouches[0].screenX;
    stackTouchStartY = e.changedTouches[0].screenY;
    stackSwipeLocked = false;
  }, { passive: true });

  stackStage.addEventListener('touchmove', (e) => {
    const dx = Math.abs(e.changedTouches[0].screenX - stackTouchStartX);
    const dy = Math.abs(e.changedTouches[0].screenY - stackTouchStartY);
    // Once we detect horizontal intent, lock it and block vertical scroll
    if (!stackSwipeLocked && dx > 10 && dx > dy) {
      stackSwipeLocked = true;
    }
    if (stackSwipeLocked) {
      e.preventDefault();
    }
  }, { passive: false });

  stackStage.addEventListener('touchend', (e) => {
    const diff = stackTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setStackActive(stackActive - 1);
      } else {
        setStackActive(stackActive + 1);
      }
    }
    stackSwipeLocked = false;
  }, { passive: true });

  // Recalculate on resize
  window.addEventListener('resize', layoutStack);

});
