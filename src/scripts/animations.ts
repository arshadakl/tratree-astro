import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scroll } from './scroll';

gsap.registerPlugin(ScrollTrigger);

// SplitText is loaded as a browser global from /js/SplitText.min.js
declare const SplitText: any;

// ── Page enter animation ─────────────────────────────────────

export function pageTransitionOut(): void {
  const main = document.querySelector<HTMLElement>('main');
  if (!main) return;

  const tl = gsap.timeline();

  tl.set(main, { filter: 'blur(5px)', opacity: 0 });
  tl.set('.single-char', { yPercent: 100, filter: 'blur(5px)', opacity: 0 });
  tl.set('.header-visuals', { filter: 'blur(50px)', scale: 1.2, opacity: 0 });

  if (document.querySelector('.parallax-layers')) {
    tl.set('.parallax-layers', { opacity: 0 });
  }

  tl.to(main, { opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'expo.out', delay: 0.5 });
  tl.to('.header-visuals', { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 3, ease: 'expo.out' }, '<');
  tl.to('.single-char', { opacity: 1, yPercent: 0, duration: 2, ease: 'expo.out', stagger: 0.04 }, '< 0.5');
  tl.to('.single-char', { filter: 'blur(0px)', duration: 1.5, ease: 'expo.out', stagger: 0.04 }, '< 0.25');

  if (document.querySelector('.parallax-layers')) {
    tl.to('.parallax-layers', { opacity: 1, duration: 0.5, ease: 'expo.out' }, '< 1.5');
  }

  tl.call(() => { if (scroll) scroll.stop(); }, [], 0);
  tl.call(() => { if (scroll) scroll.start(); }, [], 2.75);
}

// ── Page exit animation ──────────────────────────────────────

export function pageTransitionIn(): void {
  const tl = gsap.timeline();
  tl.to('main', { opacity: 0, filter: 'blur(5px)', duration: 0.8, ease: 'power1.in' });
  tl.to('.loading-screen', { autoAlpha: 1, duration: 0.8, ease: 'power1.in' }, '<');
  tl.to('.loading-screen', { autoAlpha: 0, duration: 0.25, ease: 'power1.out', delay: 0.025 }, '< 0.8');
}

// ── Initial loader (first page load) ────────────────────────

export function initLoader(): void {
  const tl = gsap.timeline();
  tl.to('.loading-screen', { autoAlpha: 0, duration: 0.25, ease: 'power1.out', delay: 0.25 });
  tl.call(() => { if (scroll) scroll.stop(); }, [], 0);
  tl.call(() => { pageTransitionOut(); }, [], 0);
}

// ── SplitText ────────────────────────────────────────────────

export function initSplitText(): void {
  if (typeof SplitText === 'undefined') return;
  new SplitText('.split-words', {
    type: 'words, chars',
    charsClass: 'single-char',
    wordsClass: 'single-word',
  });
}

// ── Scroll-triggered section fade-ins ───────────────────────

export function initTratreeSectionFades(): void {
  const scrollContainer = document.querySelector<HTMLElement>('[data-scroll-container]');

  [
    '.section-wonders .container',
    '.section-experience .container',
    '.section-vacation .container',
  ].forEach((selector) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          scroller: scrollContainer,
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });
}

// ── Magnetic buttons ─────────────────────────────────────────

export function initMagneticButtons(): void {
  if (window.innerWidth <= 1024) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic-target]').forEach((magnet) => {
    magnet.addEventListener('mousemove', (e: MouseEvent) => {
      const b = magnet.getBoundingClientRect();
      const strength      = Number(magnet.dataset.magneticStrength ?? 30);
      const strengthInner = Number(magnet.dataset.magneticStrengthInner ?? 15);

      gsap.to(magnet, {
        duration: 2,
        x: ((e.clientX - b.left) / magnet.offsetWidth  - 0.5) * strength,
        y: ((e.clientY - b.top)  / magnet.offsetHeight - 0.5) * strength,
        rotate: '0.001deg',
        ease: 'power4.out',
      });

      const inner = magnet.querySelector<HTMLElement>('[data-magnetic-target-inner]');
      if (inner) {
        gsap.to(inner, {
          duration: 2,
          x: ((e.clientX - b.left) / magnet.offsetWidth  - 0.5) * strengthInner,
          y: ((e.clientY - b.top)  / magnet.offsetHeight - 0.5) * strengthInner,
          rotate: '0.001deg',
          ease: 'power4.out',
        });
      }
    });

    magnet.addEventListener('mouseleave', () => {
      gsap.to(magnet, { duration: 2, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
      const inner = magnet.querySelector<HTMLElement>('[data-magnetic-target-inner]');
      if (inner) gsap.to(inner, { duration: 2, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

// ── Bidirectional marquee ────────────────────────────────────

export function initMarqueeScroll(): void {
  const scrollContainer = document.querySelector<HTMLElement>('[data-scroll-container]');

  document.querySelectorAll<HTMLElement>('.marquee-group').forEach((group) => {
    const firstContent = group.querySelector<HTMLElement>('.marquee-content');
    if (!firstContent) return;

    const speedAttr = group.querySelector<HTMLElement>('[data-marquee-speed]');
    let speed = Number(speedAttr?.dataset.marqueeSpeed ?? 10) *
                (firstContent.offsetWidth / window.innerWidth);
    if (window.innerWidth <= 600) speed *= 0.5;

    let direction = 1;
    const left  = roll(group.querySelectorAll<HTMLElement>("[data-marquee-direction='left'] .marquee-content"),  { duration: speed });
    const right = roll(group.querySelectorAll<HTMLElement>("[data-marquee-direction='right'] .marquee-content"), { duration: speed }, true);

    ScrollTrigger.create({
      trigger: scrollContainer,
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          gsap.to([left, right], { timeScale: direction, overwrite: true });
        }
        group.querySelectorAll<HTMLElement>('[data-marquee-status]').forEach((el) => {
          el.dataset.marqueeStatus = self.direction === -1 ? 'normal' : 'inverted';
        });
      },
    });
  });
}

function roll(
  targets: NodeListOf<HTMLElement>,
  vars: gsap.TweenVars,
  reverse = false,
): gsap.core.Timeline {
  const v = { ease: 'none', ...vars };
  const tl = gsap.timeline({
    repeat: -1,
    onReverseComplete() {
      (this as gsap.core.Timeline).totalTime(
        (this as gsap.core.Timeline).rawTime() +
        (this as gsap.core.Timeline).duration() * 10,
      );
    },
  });

  const els    = Array.from(targets);
  const clones = els.map((el) => {
    const clone = el.cloneNode(true) as HTMLElement;
    el.parentNode!.appendChild(clone);
    return clone;
  });

  const place = () => {
    els.forEach((el, i) => {
      gsap.set(clones[i], {
        position: 'absolute',
        overwrite: false,
        top: el.offsetTop,
        left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
      });
    });
  };

  place();
  els.forEach((el, i) => tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...v }, 0));
  window.addEventListener('resize', () => { const t = tl.totalTime(); tl.totalTime(0); place(); tl.totalTime(t); });

  return tl;
}
