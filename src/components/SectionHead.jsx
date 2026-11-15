import Reveal from './Reveal';

export default function SectionHead({ index, label, title, outline, align = 'left' }) {
  return (
    <div className={`mb-14 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}>
      <Reveal>
        <div className={`mb-5 flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="font-mono text-xs text-neon-purple">/{index}</span>
          <span className="h-px w-14 bg-gradient-to-r from-neon-cyan to-transparent" />
          <span className="section-label">{label}</span>
        </div>
      </Reveal>
      <h2 className="display-xl text-[clamp(2.4rem,8vw,7rem)]">
        <Reveal split as="span" className="block">{title}</Reveal>
        {outline && <Reveal split as="span" className="stroke-text block" delay={0.15}>{outline}</Reveal>}
      </h2>
    </div>
  );
}
