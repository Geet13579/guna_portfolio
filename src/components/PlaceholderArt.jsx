import { useId } from 'react';

/**
 * Original generated cinematic placeholder (no external assets).
 * Used for any project without a `thumbnail` in config/site.js.
 * A letterboxed neon skyline with a lens flare, tinted by hue/hue2.
 */
export default function PlaceholderArt({ hue = 190, hue2 = 280, seed = 1, label = '', className = '' }) {
  const id = useId().replace(/:/g, '');
  const c1 = `hsl(${hue} 100% 55%)`;
  const c2 = `hsl(${hue2} 100% 55%)`;

  // deterministic skyline
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const buildings = Array.from({ length: 22 }, (_, i) => ({
    x: i * 40 - 20 + rnd() * 10,
    w: 24 + rnd() * 26,
    h: 40 + rnd() * 150,
  }));
  const flareX = 180 + rnd() * 440;

  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ? `${label} placeholder visual` : 'Placeholder visual'}
    >
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04030a" />
          <stop offset="55%" stopColor={`hsl(${hue2} 70% 14%)`} />
          <stop offset="100%" stopColor={`hsl(${hue} 80% 18%)`} />
        </linearGradient>
        <radialGradient id={`flare${id}`}>
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="25%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glow${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c1} stopOpacity="0" />
          <stop offset="50%" stopColor={c2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#sky${id})`} />
      {/* sun / flare */}
      <circle cx={flareX} cy="230" r="150" fill={`url(#flare${id})`} />
      {/* skyline */}
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={380 - b.h} width={b.w} height={b.h + 80} fill="#05050b" stroke={i % 3 ? c1 : c2} strokeOpacity="0.28" />
          <rect x={b.x + 3} y={380 - b.h + 6} width={b.w - 6} height="2" fill={i % 2 ? c1 : c2} opacity="0.9" />
        </g>
      ))}
      {/* anamorphic streak */}
      <rect x="0" y="228" width="800" height="3" fill={`url(#glow${id})`} />
      {/* wet floor reflection */}
      <rect x="0" y="380" width="800" height="70" fill="#03030a" />
      <rect x="0" y="380" width="800" height="1.5" fill={c1} opacity="0.6" />
      {/* letterbox bars */}
      <rect width="800" height="34" fill="#000" />
      <rect y="416" width="800" height="34" fill="#000" />
      {/* HUD ticks */}
      <g stroke={c1} strokeOpacity="0.7" fill="none">
        <path d="M22 60 v-14 h14" />
        <path d="M778 60 v-14 h-14" />
        <path d="M22 392 v14 h14" />
        <path d="M778 392 v14 h-14" />
      </g>
    </svg>
  );
}
