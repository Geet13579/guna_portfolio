import { useEffect, useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import { experience, person } from '../config/site';
import { gsap } from '../lib/scroll';
import { useReducedMotion } from '../hooks/useEnv';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function Experience() {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !wrap.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-exp-line]',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top 70%', end: 'bottom 70%', scrub: true } }
      );
      gsap.from('[data-resp]', {
        x: 40, opacity: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-resp-list]', start: 'top 80%', once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="experience" className="relative px-5 py-24 md:px-14 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="06" label="CAREER LOG" title="EXPERIENCE" outline="TIMELINE" />

        <div ref={wrap} className="relative grid gap-10 md:grid-cols-[180px_1fr] md:gap-16">
          {/* Date rail */}
          <div className="relative md:text-right">
            <div className="font-display text-2xl font-black text-neon-cyan neon-cyan md:text-3xl">2021</div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-white/50">AUGUST</div>
            <div className="mt-6 hidden items-center justify-end gap-2 font-mono text-[10px] tracking-[0.3em] text-neon-red md:flex">
              <span className="rec-dot" /> PRESENT
            </div>
          </div>

          <div className="relative border-l border-white/10 pl-8 md:pl-14">
            <span data-exp-line className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-red shadow-[0_0_10px_#a020ff]" />
            <span className="absolute -left-[7px] top-2 h-[13px] w-[13px] rotate-45 border border-neon-cyan bg-void shadow-[0_0_14px_#00f0ff]" />

            <Reveal>
              <p className="font-mono text-[10px] tracking-[0.3em] text-neon-purple">{experience.period.toUpperCase()}</p>
              <h3 className="display-xl mt-3 text-[clamp(2rem,6vw,5rem)]">{experience.company}</h3>
              <p className="mt-4 max-w-2xl font-display text-xs font-bold leading-relaxed tracking-[0.2em] text-neon-cyan md:text-sm">
                {experience.position.toUpperCase()}
              </p>
            </Reveal>

            <ul data-resp-list className="mt-12 space-y-3">
              {experience.responsibilities.map((r, i) => (
                <li key={r} data-resp className="hud-panel flex gap-5 p-5 transition-colors hover:border-neon-cyan/60">
                  <span className="font-mono text-xs text-neon-cyan">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-white/80 md:text-base">{r}</span>
                </li>
              ))}
            </ul>

            <Reveal className="mt-12 border-l-2 border-neon-purple pl-6">
              <div className="font-mono text-[10px] tracking-[0.3em] text-neon-purple">ADDITIONAL GOVERNMENT &amp; ADVERTISING WORK</div>
              <p className="mt-3 max-w-3xl text-white/65">{experience.additional}</p>
            </Reveal>

            <Reveal className="mt-10 flex items-center gap-4 text-white/60">
              <GraduationCap size={20} className="text-neon-cyan" />
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">EDUCATION</div>
                <div className="text-sm md:text-base">{person.education}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
