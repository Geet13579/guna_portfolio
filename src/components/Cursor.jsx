import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCoarsePointer } from '../hooks/useEnv';

/**
 * Custom animated cursor with magnetic interactions.
 * Any element with [data-magnetic] gently pulls toward the pointer,
 * and the ring expands over interactive elements.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (coarse) return;
    document.body.classList.add('has-cursor');

    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' });
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' });

    let magnet = null;

    const move = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        gsap.to(magnet, { x: (e.clientX - cx) * 0.28, y: (e.clientY - cy) * 0.28, duration: 0.3, ease: 'power3.out' });
      }
    };

    const over = (e) => {
      const t = e.target.closest?.('a, button, [data-magnetic], input, textarea, [data-hover]');
      if (t) {
        gsap.to(ring.current, { scale: 1.9, borderColor: '#a020ff', duration: 0.3 });
        gsap.to(dot.current, { scale: 0.4, duration: 0.3 });
        if (t.hasAttribute('data-magnetic')) magnet = t;
      }
    };
    const out = (e) => {
      const t = e.target.closest?.('a, button, [data-magnetic], input, textarea, [data-hover]');
      if (t) {
        gsap.to(ring.current, { scale: 1, borderColor: '#00f0ff', duration: 0.3 });
        gsap.to(dot.current, { scale: 1, duration: 0.3 });
        if (magnet === t) {
          gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
          magnet = null;
        }
      }
    };
    const down = () => gsap.to(ring.current, { scale: 0.7, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.2 });

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [coarse]);

  if (coarse) return null;

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-5 -mt-5 h-10 w-10 rounded-full border border-neon-cyan"
        style={{ mixBlendMode: 'difference' }}
      >
        <span className="absolute left-1/2 top-[-5px] h-[5px] w-px bg-neon-cyan" />
        <span className="absolute left-1/2 bottom-[-5px] h-[5px] w-px bg-neon-cyan" />
        <span className="absolute top-1/2 left-[-5px] h-px w-[5px] bg-neon-cyan" />
        <span className="absolute top-1/2 right-[-5px] h-px w-[5px] bg-neon-cyan" />
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[201] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-neon-cyan shadow-[0_0_12px_#00f0ff]"
      />
    </>
  );
}
