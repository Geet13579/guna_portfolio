import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutPanels, aboutText, aboutTimeline, person, stats } from '../config/site';
import { gsap } from '../lib/scroll';
import { useInViewOnce, useReducedMotion } from '../hooks/useEnv';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const seen = useInViewOnce(ref, '0px');
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!seen || reduced) return;
    const o = { n: 0 };
    const tw = gsap.to(o, { n: to, duration: 2, ease: 'power2.out', onUpdate: () => setV(Math.round(o.n)) });
    return () => tw.kill();
  }, [seen, to, reduced]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

function Portrait() {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  };
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} data-hover>
      <div ref={ref} className="relative aspect-[4/5] w-full transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        <div className="hud-panel brackets absolute inset-0 overflow-hidden">
          {/* Portrait placeholder — replace with <img src="/media/portrait.jpg" /> */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 35%, rgba(160,32,255,0.45), transparent 60%), linear-gradient(160deg, #0a0a14, #050507)' }}
          />
          <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full opacity-80">
            <circle cx="100" cy="95" r="36" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3 4" />
            <path d="M30 250 C 30 170, 170 170, 170 250" fill="none" stroke="#a020ff" strokeWidth="1.2" />
            <circle cx="100" cy="95" r="52" fill="none" stroke="rgba(255,255,255,0.12)" />
          </svg>
          <div className="absolute inset-x-0 top-0 h-px animate-scan bg-neon-cyan shadow-[0_0_14px_#00f0ff]" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] tracking-[0.25em]">
            <div>
              <div className="text-neon-cyan">PORTRAIT_PLACEHOLDER</div>
              <div className="mt-1 text-white/50">{person.name}</div>
            </div>
            <div className="text-white/40">GB-01</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const tl = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !tl.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-tl-line]',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: tl.current, start: 'top 75%', end: 'bottom 60%', scrub: true } }
      );
      gsap.from('[data-tl-item]', {
        x: -30, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: tl.current, start: 'top 80%', once: true },
      });
    }, tl);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="about" className="relative overflow-hidden px-5 py-24 md:px-14 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-neon-purple/20 blur-[140px]" />
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="02" label="PROFILE // 01" title="BEHIND" outline="THE LENS." />

        <div className="grid gap-14 lg:grid-cols-12">
          {/* Portrait + panels */}
          <div className="relative lg:col-span-5">
            <Portrait />
            {aboutPanels.map((p, i) => (
              <motion.div
                key={p.tag}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                className={`hud-panel absolute hidden w-52 p-4 md:block ${
                  i === 0 ? '-right-8 top-10' : i === 1 ? '-left-10 top-1/2' : '-right-6 bottom-8'
                } ${reduced ? '!animate-none' : ''}`}
              >
                <div className="font-mono text-[9px] tracking-[0.3em] text-neon-cyan">{p.tag}</div>
                <div className="mt-1 font-display text-xs font-bold tracking-wider">{p.title}</div>
                <p className="mt-2 text-[11px] leading-snug text-white/55">{p.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal split as="p" className="text-xl font-light leading-relaxed text-white/90 md:text-3xl md:leading-snug">
              {aboutText[0]}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-8 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
              {aboutText[1]}
            </Reveal>

            {/* Mobile info panels */}
            <div className="mt-8 grid gap-3 md:hidden">
              {aboutPanels.map((p) => (
                <div key={p.tag} className="hud-panel p-4">
                  <div className="font-mono text-[9px] tracking-[0.3em] text-neon-cyan">{p.tag}</div>
                  <div className="mt-1 font-display text-xs font-bold tracking-wider">{p.title}</div>
                  <p className="mt-2 text-xs text-white/55">{p.body}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="group bg-void p-5 transition-colors hover:bg-neon-cyan/5 md:p-6">
                  <div className="display-xl text-3xl text-neon-cyan neon-cyan md:text-4xl">
                    {s.value !== undefined ? <Counter to={s.value} suffix={s.suffix} /> : s.text}
                  </div>
                  <div className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.25em] text-white/55 md:text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div ref={tl} className="relative mt-16 pl-8">
              <div className="mb-6 font-mono text-[10px] tracking-[0.35em] text-neon-purple">// TIMELINE</div>
              <span className="absolute bottom-0 left-[5px] top-10 w-px bg-white/10" />
              <span data-tl-line className="absolute bottom-0 left-[5px] top-10 w-px bg-gradient-to-b from-neon-cyan to-neon-purple shadow-[0_0_8px_#00f0ff]" />
              <ul className="space-y-7">
                {aboutTimeline.map((t) => (
                  <li key={t.year} data-tl-item className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-[11px] w-[11px] rotate-45 border border-neon-cyan bg-void" />
                    <div className="font-mono text-xs tracking-[0.3em] text-neon-cyan">{t.year}</div>
                    <div className="mt-1 text-sm text-white/70 md:text-base">{t.label}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
