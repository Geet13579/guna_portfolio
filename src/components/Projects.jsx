import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../config/site';
import { blip } from '../lib/ambient';
import PlaceholderArt from './PlaceholderArt';
import ProjectModal from './ProjectModal';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

// Editorial, deliberately irregular column spans (12-col grid on desktop)
const SPANS = [
  'md:col-span-7', 'md:col-span-5',
  'md:col-span-4', 'md:col-span-4', 'md:col-span-4',
  'md:col-span-5', 'md:col-span-7',
  'md:col-span-6', 'md:col-span-6',
  'md:col-span-12',
];

function Card({ p, i, onOpen }) {
  const [hover, setHover] = useState(false);
  const wide = i === 9;
  return (
    <Reveal className={`${SPANS[i % SPANS.length]}`} y={60} delay={(i % 3) * 0.06}>
      <motion.button
        data-hover
        onClick={() => { blip(600); onOpen(i); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group relative block w-full overflow-hidden border border-white/10 text-left"
        whileTap={{ scale: 0.99 }}
        aria-label={`Open project: ${p.title}`}
      >
        <div className={`relative w-full overflow-hidden ${wide ? 'aspect-[21/9]' : i % 5 === 0 || i % 5 === 1 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hover ? 1.09 : 1 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {p.thumbnail ? (
              <img src={p.thumbnail} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <PlaceholderArt hue={p.hue} hue2={p.hue2} seed={i + 3} label={p.title} className="h-full w-full" />
            )}
            {p.video && hover && (
              <video src={p.video} autoPlay muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
            )}
          </motion.div>

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neon-cyan/25 via-transparent to-neon-purple/35 mix-blend-screen"
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="absolute inset-x-0 h-px bg-neon-cyan shadow-[0_0_16px_#00f0ff]"
            initial={false}
            animate={hover ? { top: ['0%', '100%'], opacity: [1, 1, 0] } : { top: '0%', opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />

          {/* corners */}
          <motion.span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-neon-cyan" animate={{ opacity: hover ? 1 : 0.35, x: hover ? 0 : 4, y: hover ? 0 : 4 }} />
          <motion.span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-neon-cyan" animate={{ opacity: hover ? 1 : 0.35, x: hover ? 0 : -4, y: hover ? 0 : -4 }} />

          {/* top meta */}
          <div className="absolute left-5 top-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-white/70">
            <span className="text-neon-cyan">{String(i + 1).padStart(2, '0')}</span>
            <span>{p.year}</span>
          </div>
          <motion.div
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-neon-cyan bg-black/40 text-neon-cyan backdrop-blur"
            animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6, rotate: hover ? 0 : -45 }}
          >
            <ArrowUpRight size={18} />
          </motion.div>

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-neon-purple">{p.category.toUpperCase()}</p>
            <h3 className="font-display text-lg font-black leading-tight tracking-tight md:text-2xl">{p.title}</h3>
            <motion.p
              className="mt-2 text-xs text-white/60 md:text-sm"
              animate={{ opacity: hover ? 1 : 0.75 }}
            >
              {p.client} · {p.date}
            </motion.p>
          </div>
        </div>
      </motion.button>
    </Reveal>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((dir) => setOpen((o) => (o === null ? o : (o + dir + projects.length) % projects.length)), []);

  return (
    <section id="projects" className="relative px-5 py-24 md:px-14 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="03" label="SELECTED WORK" title="SELECTED" outline="PROJECTS" />
        <Reveal className="-mt-8 mb-12 max-w-xl text-white/55 md:-mt-12">
          Ten productions across government campaigns, national dialogues, state festivals and youth outreach. Select any frame to open the full presentation.
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {projects.map((p, i) => (
            <Card key={p.id} p={p} i={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && <ProjectModal key="modal" index={open} onClose={close} onStep={go} />}
      </AnimatePresence>
    </section>
  );
}
