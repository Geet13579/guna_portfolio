import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let tickerFn = null;

export function initScroll(reduced) {
  if (lenis) return lenis;
  if (reduced) {
    // Native scrolling when the user prefers reduced motion.
    return null;
  }
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroyScroll() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  lenis?.destroy();
  lenis = null;
  tickerFn = null;
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  else document.body.style.overflow = locked ? 'hidden' : '';
}

export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.6, ...opts });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (typeof target === 'number') window.scrollTo({ top: target });
    else el?.scrollIntoView({ behavior: 'auto' });
  }
}

export function getScrollY() {
  return lenis ? lenis.scroll : window.scrollY;
}

export { gsap, ScrollTrigger };
