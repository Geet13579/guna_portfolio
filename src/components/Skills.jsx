import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { skillGroups, skills } from '../config/site';
import { useReducedMotion } from '../hooks/useEnv';
import { blip } from '../lib/ambient';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

// Ring order (inner → outer) and spin settings
const RINGS = [
  { group: 'light', r: 17, dur: 46, dir: 1 },
  { group: 'lead', r: 27, dur: 62, dir: -1 },
  { group: 'craft', r: 37, dur: 80, dir: 1 },
  { group: 'post', r: 47, dur: 100, dir: -1 },
];

function Orbit({ active, setActive, reduced }) {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[760px] md:block" aria-label="Skill orbits">
      {/* core */}
      <div className="absolute left-1/2 top-1/2 z-10 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neon-cyan/40 bg-void/80 p-3 text-center backdrop-blur"
        style={{ boxShadow: '0 0 60px rgba(160,32,255,0.35), inset 0 0 30px rgba(0,240,255,0.15)' }}>
        <div>
          <div className="font-mono text-[9px] tracking-[0.3em] text-white/40">{active ? 'SELECTED' : 'HOVER AN ORB'}</div>
          <motion.div key={active || 'idle'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-display text-[11px] font-black leading-tight text-neon-cyan lg:text-sm">
            {active || 'SKILLS'}
          </motion.div>
        </div>
      </div>

      {RINGS.map((ring) => {
        const list = skills.filter((s) => s.group === ring.group);
        const color = skillGroups[ring.group].color;
        const size = ring.r * 2;
        return (
          <div
            key={ring.group}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
            style={{ width: `${size}%`, height: `${size}%`, borderColor: `${color}40` }}
          >
            <div
              className="absolute inset-0"
              style={reduced ? undefined : { animation: `spin ${ring.dur}s linear infinite ${ring.dir < 0 ? 'reverse' : ''}` }}
            >
              {list.map((s, i) => {
                const angle = (i / list.length) * 360 + (ring.group === 'craft' ? 20 : ring.group === 'post' ? 10 : 0);
                const on = active === s.name;
                return (
                  <div key={s.name} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                    <button
                      onMouseEnter={() => { setActive(s.name); blip(500 + i * 60); }}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(s.name)}
                      onBlur={() => setActive(null)}
                      aria-label={s.name}
                      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                    >
                      <span
                        className="block rounded-full transition-all duration-300"
                        style={{
                          width: on ? 30 : 18,
                          height: on ? 30 : 18,
                          background: `radial-gradient(circle at 35% 30%, #fff, ${color} 45%, #0a0a14 100%)`,
                          boxShadow: `0 0 ${on ? 34 : 16}px ${color}`,
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(null);
  const reduced = useReducedMotion();
  const grouped = useMemo(
    () => Object.entries(skillGroups).map(([key, g]) => ({ key, ...g, items: skills.filter((s) => s.group === key) })),
    []
  );

  return (
    <section id="skills" className="relative overflow-hidden px-5 py-24 md:px-14 md:py-36">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[520px] w-[520px] rounded-full bg-neon-purple/15 blur-[150px]" />
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="05" label="CREATIVE EXPERTISE" title="SKILLS &" outline="EXPERTISE" />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Orbit active={active} setActive={setActive} reduced={reduced} />

          <div className="grid gap-4 sm:grid-cols-2">
            {grouped.map((g, gi) => (
              <Reveal key={g.key} delay={gi * 0.08} className="hud-panel p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: g.color, boxShadow: `0 0 12px ${g.color}` }} />
                  <h3 className="font-mono text-[10px] tracking-[0.3em]" style={{ color: g.color }}>{g.label}</h3>
                </div>
                <ul className="space-y-1">
                  {g.items.map((s) => {
                    const on = active === s.name;
                    return (
                      <li key={s.name}>
                        <button
                          onMouseEnter={() => setActive(s.name)}
                          onMouseLeave={() => setActive(null)}
                          className={`group flex w-full items-center gap-3 py-1.5 text-left text-sm transition-colors ${on ? 'text-white' : 'text-white/65 hover:text-white'}`}
                        >
                          <span className="relative h-px flex-1 max-w-[18px] bg-white/25 transition-all group-hover:max-w-[30px]" style={on ? { background: g.color, maxWidth: 30 } : undefined} />
                          <span className="flex-1">{s.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
