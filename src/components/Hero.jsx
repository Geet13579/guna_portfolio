import { lazy, Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Play } from 'lucide-react';
import { person } from '../config/site';
import { scrollToTarget } from '../lib/scroll';
import { useInView, useIsMobile, useReducedMotion, useWebGL } from '../hooks/useEnv';
import ErrorBoundary from './ErrorBoundary';
import LensFallback from './LensFallback';
import { blip } from '../lib/ambient';

const HeroScene = lazy(() => import('./three/HeroScene'));

const rise = (delay) => ({
  initial: { y: 60, opacity: 0, filter: 'blur(12px)' },
  animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
  transition: { delay, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] },
});

export default function Hero({ ready }) {
  const ref = useRef(null);
  const webgl = useWebGL();
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const inView = useInView(ref, '100px');

  return (
    <section id="hero" ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* 3D world */}
      <div className="absolute inset-0">
        {webgl ? (
          <ErrorBoundary fallback={<LensFallback />}>
            <Suspense fallback={<LensFallback />}>
              <HeroScene reduced={reduced} mobile={mobile} active={ready && inView} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <LensFallback />
        )}
      </div>

      {/* readability gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-void/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-transparent md:from-void/70" />

      {/* HUD frame */}
      <div className="pointer-events-none absolute inset-4 hidden md:block md:inset-6">
        <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-neon-cyan/70" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-neon-cyan/70" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-neon-cyan/70" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-neon-cyan/70" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-30">
          <span className="absolute left-1/2 top-0 h-2 w-px bg-white" />
          <span className="absolute bottom-0 left-1/2 h-2 w-px bg-white" />
          <span className="absolute left-0 top-1/2 h-px w-2 bg-white" />
          <span className="absolute right-0 top-1/2 h-px w-2 bg-white" />
        </div>
      </div>
      <div className="pointer-events-none absolute right-8 top-24 hidden text-right font-mono text-[10px] tracking-[0.3em] text-white/45 md:block">
        <div className="flex items-center justify-end gap-2"><span className="rec-dot" /> REC STANDBY</div>
        <div className="mt-2">{person.location.split(',')[0].toUpperCase()} // IN</div>
      </div>

      {/* Copy */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 pt-28 md:px-14 md:pb-28">
        <motion.p
          initial={rise(0).initial}
          animate={ready ? rise(0).animate : rise(0).initial}
          transition={rise(0.1).transition}
          className="mb-5 flex items-center gap-4 font-mono text-[10px] tracking-[0.35em] text-neon-cyan md:text-xs"
        >
          <span className="h-px w-10 bg-neon-cyan" />
          {person.titles.join('  //  ').toUpperCase()}
        </motion.p>

        <h1 className="display-xl text-[clamp(2.6rem,11.5vw,11rem)]">
          <motion.span
            initial={rise(0).initial}
            animate={ready ? rise(0).animate : rise(0).initial}
            transition={rise(0.25).transition}
            className="block"
          >
            <span className="glitch neon-cyan" data-text={person.first}>{person.first}</span>
          </motion.span>
          <motion.span
            initial={rise(0).initial}
            animate={ready ? rise(0).animate : rise(0).initial}
            transition={rise(0.4).transition}
            className="block"
          >
            <span className="glitch stroke-text" data-text={person.last}>{person.last}</span>
          </motion.span>
        </h1>

        <motion.h2
          initial={rise(0).initial}
          animate={ready ? rise(0).animate : rise(0).initial}
          transition={rise(0.6).transition}
          className="mt-6 font-display text-xs font-bold tracking-[0.5em] text-neon-purple neon-purple md:text-base"
        >
          {person.role}
        </motion.h2>

        <motion.p
          initial={rise(0).initial}
          animate={ready ? rise(0).animate : rise(0).initial}
          transition={rise(0.75).transition}
          className="mt-5 max-w-xl text-base font-light italic text-white/75 md:text-xl"
        >
          “{person.tagline}”
        </motion.p>

        <motion.div
          initial={rise(0).initial}
          animate={ready ? rise(0).animate : rise(0).initial}
          transition={rise(0.9).transition}
          className="mt-9 flex flex-wrap gap-4"
        >
          <button
            data-magnetic
            className="btn-neon"
            onClick={() => { blip(520); scrollToTarget('#projects'); }}
          >
            EXPLORE MY WORK <ArrowDownRight size={16} />
          </button>
          <button
            data-magnetic
            className="btn-neon btn-ghost"
            onClick={() => { blip(740); scrollToTarget('#showreel'); }}
          >
            <Play size={14} fill="currentColor" /> WATCH SHOWREEL
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.4em] text-white/50">SCROLL</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute left-0 top-0 h-5 w-px bg-neon-cyan shadow-[0_0_8px_#00f0ff]"
            animate={{ y: [-20, 56] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
