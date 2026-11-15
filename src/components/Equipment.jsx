import { lazy, Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Move3d } from 'lucide-react';
import { equipment } from '../config/site';
import { useInView, useInViewOnce, useReducedMotion, useWebGL } from '../hooks/useEnv';
import ErrorBoundary from './ErrorBoundary';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

const EquipmentScene = lazy(() => import('./three/EquipmentScene'));

function Flat({ hue, name }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{ background: `radial-gradient(circle at 50% 50%, hsla(${hue},100%,55%,0.18), transparent 65%)` }}
    >
      <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed" style={{ borderColor: `hsl(${hue},100%,60%)` }}>
        <span className="font-display text-xs font-black">{name.split(' ').pop()}</span>
      </div>
    </div>
  );
}

function Card({ item, i }) {
  const ref = useRef(null);
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const near = useInViewOnce(ref, '300px');
  const visible = useInView(ref, '0px');
  const [hover, setHover] = useState(false);
  const color = `hsl(${item.hue},100%,60%)`;

  return (
    <Reveal delay={(i % 3) * 0.08}>
      <motion.article
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="hud-panel group relative h-full transition-[box-shadow,border-color] duration-500"
        style={{
          borderColor: hover ? color : undefined,
          boxShadow: hover ? `0 0 38px -6px ${color}, inset 0 0 40px -22px ${color}` : 'none',
        }}
      >
        {/* 3D viewport */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" data-hover>
          {item.image ? (
            <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
          ) : near && webgl ? (
            <ErrorBoundary fallback={<Flat hue={item.hue} name={item.name} />}>
              <Suspense fallback={<Flat hue={item.hue} name={item.name} />}>
                <EquipmentScene kind={item.kind} hue={item.hue} active={visible} reduced={reduced} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <Flat hue={item.hue} name={item.name} />
          )}
          <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] tracking-[0.3em]" style={{ color }}>
            {String(i + 1).padStart(2, '0')} // {item.group}
          </div>
          <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-white/45">
            <Move3d size={12} /> DRAG TO ROTATE
          </div>
        </div>

        {/* Info panel */}
        <div className="relative border-t border-white/10 p-5">
          <h3 className="font-display text-xl font-black tracking-tight md:text-2xl">{item.name}</h3>
          <dl className="mt-4 space-y-2 font-mono text-[10px] tracking-[0.2em]">
            <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-white/40">CLASS</dt>
              <dd className="text-right" style={{ color }}>{item.group}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
              <dt className="text-white/40">TYPE</dt>
              <dd className="text-right text-white/80">{item.note.toUpperCase()}</dd>
            </div>
            {item.info.length > 0 ? (
              item.info.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="text-white/40">{k}</dt>
                  <dd className="text-right text-white/80">{v}</dd>
                </div>
              ))
            ) : (
              <div className="flex justify-between gap-4">
                <dt className="text-white/40">SPECS</dt>
                <dd className="text-right text-white/35">— ADD VERIFIED DETAILS IN CONFIG</dd>
              </div>
            )}
          </dl>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Equipment() {
  const groups = [...new Set(equipment.map((e) => e.group))];
  let counter = -1;
  return (
    <section id="equipment" className="relative overflow-hidden px-5 py-24 md:px-14 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-neon-cyan/10 blur-[140px]" />
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="04" label="EQUIPMENT LAB" title="THE" outline="EQUIPMENT LAB" />

        {groups.map((g) => {
          const items = equipment.filter((e) => e.group === g);
          return (
            <div key={g} className="mb-16 last:mb-0">
              <div className="mb-6 flex items-center gap-4">
                <span className="section-label !text-neon-purple">{g}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <div className={`grid gap-5 ${items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                {items.map((it) => {
                  counter += 1;
                  return <Card key={it.id} item={it} i={counter} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
