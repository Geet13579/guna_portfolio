import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { useReducedMotion } from '../hooks/useEnv';

/**
 * Scroll-triggered reveal. Split mode animates words (cinematic text reveal),
 * otherwise the whole block fades/rises in.
 */
export default function Reveal({ children, as: Tag = 'div', className = '', split = false, delay = 0, y = 40, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const targets = split ? el.querySelectorAll('[data-word]') : el;
      gsap.fromTo(
        targets,
        { y, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 0.9, delay, ease: 'power3.out',
          stagger: split ? 0.035 : 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, split, delay, y]);

  if (split && typeof children === 'string') {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {children.split(' ').map((w, i) => (
          <span key={i} className="inline-block overflow-visible">
            <span data-word className="inline-block">{w}</span>
            {' '}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
