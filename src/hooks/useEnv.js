import { useEffect, useState } from 'react';

/** Detects WebGL support once. */
export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function useMedia(query, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useIsMobile = () => useMedia('(max-width: 767px)');
export const useCoarsePointer = () => useMedia('(pointer: coarse)');

export function useWebGL() {
  const [ok] = useState(() => (typeof window === 'undefined' ? false : detectWebGL()));
  return ok;
}

/** True once the element has scrolled near the viewport (stays true). */
export function useInViewOnce(ref, rootMargin = '200px') {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin, seen]);
  return seen;
}

/** True only while the element is on screen. */
export function useInView(ref, rootMargin = '0px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
