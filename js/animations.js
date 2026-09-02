/**
 * animations.js — Lenis smooth scrolling + GSAP scroll-triggered reveals.
 *
 * Every effect is optional: if GSAP/Lenis fail to load, or the visitor prefers
 * reduced motion, the page still renders fully (elements are visible by default
 * and only hidden once we know we can animate them back in).
 */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

/** Starts Lenis and syncs it with GSAP's ScrollTrigger. Returns a scrollTo fn. */
export function initSmoothScroll() {
  if (!window.Lenis || prefersReducedMotion()) {
    return { scrollTo: (target) => target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' }) };
  }

  lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  return {
    lenis,
    scrollTo: (target) => lenis.scrollTo(target, { offset: -12, duration: 1.2 }),
    stop: () => lenis.stop(),
    start: () => lenis.start(),
  };
}

/** Hero intro: staggered rise of the headline block. */
export function animateHero() {
  if (!window.gsap || prefersReducedMotion()) return;
  const targets = document.querySelectorAll('[data-hero]');
  window.gsap.set(targets, { opacity: 0, y: 26 });
  window.gsap.to(targets, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.15 });
}

/**
 * Registers reveal animations for `.reveal` elements and section headers.
 * Safe to call repeatedly — already-registered nodes are skipped.
 */
export function initScrollAnimations() {
  const gsap = window.gsap;
  if (!gsap || !window.ScrollTrigger || prefersReducedMotion()) {
    document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-revealed'));
    return;
  }
  gsap.registerPlugin(window.ScrollTrigger);

  document.querySelectorAll('.reveal:not([data-revealed])').forEach((node) => {
    node.dataset.revealed = '1';
    node.classList.add('is-revealed');
    gsap.fromTo(node,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
      }
    );
  });

  document.querySelectorAll('.section__header:not([data-revealed])').forEach((node) => {
    node.dataset.revealed = '1';
    gsap.fromTo(node.children,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: node, start: 'top 85%', once: true },
      }
    );
  });

  // Slow parallax drift on the hero backdrop.
  const glow = document.querySelector('.hero__glow');
  if (glow) {
    gsap.to(glow, {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  window.ScrollTrigger.refresh();
}

/** Recomputes trigger positions after async content changes the page height. */
export function refreshScrollTriggers() {
  window.ScrollTrigger?.refresh();
}

/** Card hover tilt/lift — pointer-driven, desktop only. */
export function initCardHover(root = document) {
  if (!window.gsap || prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
  const gsap = window.gsap;

  root.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card:not(.card--skeleton)');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, { rotateY: px * 6, rotateX: -py * 6, duration: 0.5, ease: 'power2.out', transformPerspective: 900 });
    card.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
    card.style.setProperty('--my', `${(py + 0.5) * 100}%`);
  });

  root.addEventListener('pointerleave', (e) => {
    const card = e.target.closest?.('.card');
    if (card) gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
  }, true);
}

/** Modal open/close transition. */
export function animateModalOpen() {
  if (!window.gsap || prefersReducedMotion()) return;
  const panel = document.querySelector('.modal__panel');
  if (panel) window.gsap.fromTo(panel, { opacity: 0, y: 40, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
}
