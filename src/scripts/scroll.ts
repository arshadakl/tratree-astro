import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// LoconativeScroll is loaded as a browser global from /js/loconative-scroll.min.js
declare const LoconativeScroll: any;

export let scroll: any = null;
let lenisInstance: InstanceType<typeof Lenis> | null = null;
let lenisTicker: ((time: number) => void) | null = null;

/** Initialise LoconativeScroll on the [data-scroll-container] element. */
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
  // Remove previous ticker before creating new instance to prevent accumulation
  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  lenisInstance = new (Lenis as any)({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });

  (lenisInstance as any).on('scroll', ScrollTrigger.update);

  lenisTicker = (time: number) => {
    (lenisInstance as any).raf(time * 1000);
  };
  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);
}

export function destroyScroll(): void {
  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
  if (scroll) {
    scroll.destroy();
    scroll = null;
  }
}
