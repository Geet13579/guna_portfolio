import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { projects } from '../config/site';
import { lockScroll } from '../lib/scroll';
import PlaceholderArt from './PlaceholderArt';

/** Full-screen project presentation. Arrow keys navigate, Esc closes. */
export default function ProjectModal({ index, onClose, onStep }) {
  const p = projects[index];

  useEffect(() => {
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onStep]);

  const info = [
    ['CLIENT / ORGANIZATION', p.client],
    ['CATEGORY', p.category],
    ['DATE', p.date],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[250] overflow-y-auto bg-void"
      initial={{ clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      exit={{ clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      data-lenis-prevent
    >
      <div className="relative flex min-h-full flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-void/70 px-5 py-4 backdrop-blur-md md:px-10">
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-white/60">
            <span className="text-neon-cyan">{String(index + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-white/20" />
            <span>{String(projects.length).padStart(2, '0')} PROJECTS</span>
          </div>
          <button
            onClick={onClose}
            data-magnetic
            className="flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[10px] tracking-[0.3em] transition hover:border-neon-red hover:text-neon-red"
            aria-label="Close project"
          >
            CLOSE <X size={14} />
          </button>
        </div>

        {/* Media stage */}
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[52svh] w-full overflow-hidden bg-black md:h-[68svh]"
        >
          {p.video ? (
            <video src={p.video} poster={p.thumbnail || undefined} autoPlay muted loop playsInline controls className="h-full w-full object-cover" />
          ) : p.thumbnail ? (
            <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
          ) : (
            <PlaceholderArt hue={p.hue} hue2={p.hue2} seed={index + 3} label={p.title} className="h-full w-full" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-black/50" />
          {!p.video && !p.thumbnail && (
            <div className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.25em] text-white/50 md:left-10">
              PLACEHOLDER VISUAL — ADD VIDEO / THUMBNAIL IN config/site.js
            </div>
          )}

          <button
            onClick={() => onStep(-1)}
            data-magnetic
            aria-label="Previous project"
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/25 bg-black/40 backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan md:left-8"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => onStep(1)}
            data-magnetic
            aria-label="Next project"
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/25 bg-black/40 backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan md:right-8"
          >
            <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Details */}
        <motion.div
          key={`${p.id}-info`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="relative mx-auto w-full max-w-[1400px] px-5 py-12 md:px-14 md:py-16"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-neon-purple md:text-xs">
            {p.category.toUpperCase()} // {p.year}
          </p>
          <h2 className="display-xl mt-4 text-[clamp(1.8rem,6vw,5rem)]">{p.title}</h2>

          <dl className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3">
            {info.map(([k, v]) => (
              <div key={k} className="bg-void p-5">
                <dt className="font-mono text-[9px] tracking-[0.3em] text-neon-cyan">{k}</dt>
                <dd className="mt-2 text-sm text-white/85 md:text-base">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </motion.div>
  );
}
