import gsap from 'gsap';

export function initCustomCursor(): void {
  const cursorEl = document.querySelector<HTMLElement>('.custom-cursor');
  if (!cursorEl) return;

  const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mousePos  = { x: cursorPos.x, y: cursorPos.y };
  const speed = 0.15;

  const xSet = gsap.quickSetter(cursorEl, 'x', 'px');
  const ySet = gsap.quickSetter(cursorEl, 'y', 'px');

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.x;
    mousePos.y = e.y;
  });

  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
    cursorPos.x += (mousePos.x - cursorPos.x) * dt;
    cursorPos.y += (mousePos.y - cursorPos.y) * dt;
    xSet(cursorPos.x);
    ySet(cursorPos.y);
  });

  // Show cursor on first mouse move
  document.addEventListener(
    'mousemove',
    () => {
      const el = document.querySelector<HTMLElement>('[data-cursor-init]');
      if (el) el.dataset.cursorInit = 'true';
    },
    { once: true },
  );

  // Bubble text on [data-cursor-bubble-text] hover
  document.querySelectorAll<HTMLElement>('[data-cursor-bubble-text]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const bubble = document.querySelector<HTMLElement>('[data-cursor-bubble]');
      if (bubble) bubble.dataset.cursorBubble = 'active';
    });
    el.addEventListener('mouseleave', () => {
      const bubble = document.querySelector<HTMLElement>('[data-cursor-bubble]');
      if (bubble) bubble.dataset.cursorBubble = 'not-active';
    });
  });
}
