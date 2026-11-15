import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SkipForward } from 'lucide-react';
import { person } from '../config/site';
import { useReducedMotion } from '../hooks/useEnv';

const BOOT_LINES = [
  'CAMERA SYSTEM .......... ONLINE',
  'SENSOR ARRAY ........... CALIBRATED',
  'LIGHT ENGINE ........... READY',
  'LENS MOUNT ............. LOCKED',
];

/** Cinematic lens aperture drawn in SVG. `open` goes 0 → 1. */
function Aperture({ open }) {
  const blades = Array.from({ length: 8 });
  const hole = 6 + open * 130;
  return (
    <svg viewBox="-200 -200 400 400" className="h-[min(70vw,420px)] w-[min(70vw,420px)]">
      <defs>
        <mask id="iris">
          <rect x="-200" y="-200" width="400" height="400" fill="white" />
          <circle r={hole} fill="black" />
        </mask>
        <radialGradient id="irisglow">
          <stop offset="60%" stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle r="190" fill="none" stroke="rgba(0,240,255,0.35)" strokeWidth="1" strokeDasharray="2 6" />
      <circle r="170" fill="none" stroke="rgba(160,32,255,0.6)" strokeWidth="2" />
      <g mask="url(#iris)">
        <circle r="168" fill="#07070c" />
        {blades.map((_, i) => (
          <polygon
            key={i}
            points="0,0 170,-70 170,70"
            fill={i % 2 ? '#0d0d16' : '#11111c'}
            stroke="rgba(0,240,255,0.25)"
            strokeWidth="1"
            transform={`rotate(${i * 45 + open * 40})`}
          />
        ))}
      </g>
      <circle r={hole} fill="url(#irisglow)" opacity={Math.min(1, open * 1.4)} />
      <circle r={hole} fill="none" stroke="#00f0ff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="0" y1="-196" x2="0" y2="-178" stroke="#00f0ff" strokeWidth="2" transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}

export default function Intro({ onDone }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0 black, 1 boot, 2 aperture, 3 name, 4 exit
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState(0);
  const [open, setOpen] = useState(0);
  const [typed, setTyped] = useState('');
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase(4);
    setTimeout(onDone, reduced ? 200 : 900);
  };

  // Phase timeline
  useEffect(() => {
    const k = reduced ? 0.35 : 1;
    const t = [
      setTimeout(() => setPhase(1), 500 * k),
      setTimeout(() => setPhase(2), 3300 * k),
      setTimeout(() => setPhase(3), 5200 * k),
      setTimeout(finish, 8000 * k),
    ];
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typed system text + progress + boot lines
  useEffect(() => {
    if (phase !== 1) return;
    const text = 'INITIALIZING VISUAL SYSTEM';
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(typer);
    }, reduced ? 10 : 55);
    const start = performance.now();
    const dur = reduced ? 900 : 2600;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(Math.round(p * 100));
      setLines(Math.floor(p * (BOOT_LINES.length + 0.99)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(typer);
      cancelAnimationFrame(raf);
    };
  }, [phase, reduced]);

  // Aperture opening
  useEffect(() => {
    if (phase < 2) return;
    const start = performance.now();
    const dur = reduced ? 400 : 1700;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setOpen(e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced]);

  // Keyboard skip
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-hidden bg-black"
      animate={phase === 4 ? { clipPath: 'inset(0 0 100% 0)' } : { clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.77, 0, 0.18, 1] }}
      role="dialog"
      aria-label="Intro"
    >
      {/* corner brackets */}
      {phase >= 1 && (
        <>
          {['left-4 top-4 border-l border-t', 'right-4 top-4 border-r border-t', 'left-4 bottom-4 border-l border-b', 'right-4 bottom-4 border-r border-b'].map((c) => (
            <motion.span key={c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute h-8 w-8 border-neon-cyan ${c}`} />
          ))}
          <div className="absolute left-8 top-7 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/60">
            <span className="rec-dot" /> REC STANDBY
          </div>
          <div className="absolute right-8 top-7 font-mono text-[10px] tracking-[0.3em] text-white/40">SYS // GB-01</div>
        </>
      )}

      {/* Boot UI */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="boot"
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <p className="font-mono text-xs tracking-[0.35em] text-neon-cyan md:text-sm">
              {typed}
              <span className="animate-blink">_</span>
            </p>
            <div className="mt-8 h-[2px] w-[min(80vw,420px)] bg-white/10">
              <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_12px_#00f0ff]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex w-[min(80vw,420px)] justify-between font-mono text-[10px] text-white/50">
              <span>LOADING</span>
              <span>{String(progress).padStart(3, '0')}%</span>
            </div>
            <ul className="mt-8 space-y-1 font-mono text-[10px] tracking-[0.2em] text-white/45">
              {BOOT_LINES.slice(0, lines).map((l) => (
                <li key={l}>
                  <span className="text-neon-purple">&gt;</span> {l}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aperture + streaks + name */}
      {phase >= 2 && phase < 4 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={phase === 3 ? { scale: 6, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: [0.5, 0, 0.2, 1] }}
            className="absolute"
          >
            <Aperture open={open} />
          </motion.div>

          {/* light streaks */}
          {!reduced &&
            [18, 42, 63, 81].map((top, i) => (
              <motion.span
                key={top}
                initial={{ x: i % 2 ? '120%' : '-120%', opacity: 0 }}
                animate={{ x: i % 2 ? '-120%' : '120%', opacity: [0, 1, 0] }}
                transition={{ duration: 1.6, delay: 0.4 + i * 0.25, ease: 'easeInOut' }}
                className="absolute h-px w-2/3"
                style={{
                  top: `${top}%`,
                  background: `linear-gradient(90deg, transparent, ${i % 2 ? '#a020ff' : '#00f0ff'}, transparent)`,
                  boxShadow: `0 0 18px ${i % 2 ? '#a020ff' : '#00f0ff'}`,
                }}
              />
            ))}

          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative z-10 px-4 text-center"
            >
              <h1 className="display-xl text-[clamp(2rem,9vw,7rem)] tracking-tight">
                <span className="glitch neon-cyan" data-text={person.first}>{person.first}</span>
                <br />
                <span className="glitch stroke-text" data-text={person.last}>{person.last}</span>
              </h1>
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.55em' }}
                transition={{ delay: 0.6, duration: 1.4 }}
                className="mt-6 font-mono text-[10px] text-neon-purple md:text-sm"
              >
                {person.role}
              </motion.p>
            </motion.div>
          )}
        </div>
      )}

      <button
        onClick={finish}
        className="absolute bottom-7 right-7 z-20 flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-white/70 transition hover:border-neon-cyan hover:text-neon-cyan"
      >
        SKIP INTRO <SkipForward size={12} />
      </button>
    </motion.div>
  );
}
