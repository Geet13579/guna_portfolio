import { useEffect, useRef } from 'react';

/**
 * 2D fallback used when WebGL isn't available (or fails).
 * A neon lens drawn in SVG with light mouse parallax.
 */
export default function LensFallback({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `translate(${x * 14}px, ${y * 10}px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className={`absolute inset-0 grid place-items-center overflow-hidden ${className}`} style={{ perspective: 900 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(160,32,255,0.35), transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(0,240,255,0.22), transparent 50%), #030306',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(160,32,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(160,32,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(62deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />
      <div ref={ref} className="relative transition-transform duration-200 ease-out">
        <svg viewBox="-200 -200 400 400" className="h-[min(80vw,520px)] w-[min(80vw,520px)] animate-floaty">
          <defs>
            <radialGradient id="lg">
              <stop offset="0%" stopColor="#8a5cff" />
              <stop offset="40%" stopColor="#1a0b3a" />
              <stop offset="100%" stopColor="#04101c" />
            </radialGradient>
          </defs>
          <circle r="180" fill="#07070c" stroke="#00f0ff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 14px #00f0ff)' }} />
          <circle r="150" fill="none" stroke="#a020ff" strokeWidth="3" strokeDasharray="4 8" />
          <circle r="120" fill="#0b0b12" stroke="rgba(255,255,255,0.15)" />
          <circle r="90" fill="url(#lg)" stroke="#00f0ff" strokeWidth="1.5" />
          <circle r="55" fill="none" stroke="#a020ff" strokeWidth="1.5" />
          <circle r="22" fill="#8a5cff" opacity="0.9" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="-182" x2="0" y2="-166" stroke="#00f0ff" strokeWidth="2" transform={`rotate(${i * 30})`} />
          ))}
        </svg>
      </div>
    </div>
  );
}
