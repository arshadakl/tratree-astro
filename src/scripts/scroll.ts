import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// LoconativeScroll is loaded as a browser global from /js/loconative-scroll.min.js
declare const LoconativeScroll: any;

export let scroll: any = null;
let lenisInstance: InstanceType<typeof Lenis> | null = null;

/** Initialise LoconativeScroll on the [data-scroll-container] inside `container`. */
export function initSmoothScroll(container: HTMLElement): void {
  const el = container.querySelector<HTMLElement>('[data-scroll-container]');
  if (!el) return;

  scroll = new LoconativeScroll({
    el,
    scrollToEasing: (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
    smooth: true,
    duration: 1,
    smartphone: { smooth: true, duration: 0.5 },
    tablet: { smooth: true },
  });

  ScrollTrigger.refresh();
}

/** Initialise Lenis and connect it to the GSAP ticker for ScrollTrigger sync. */
export function initLenis(): void {
  if (lenisInstance) lenisInstance.destroy();

  lenisInstance = new (Lenis as any)({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });

  (lenisInstance as any).on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    (lenisInstance as any).raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

export function destroyScroll(): void {
  if (scroll) {
    scroll.destroy();
    scroll = null;
  }
}
