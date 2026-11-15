import { person } from '../config/site';

export default function Footer() {
  const words = ['CAPTURING STORIES', 'CREATING PERSPECTIVES', 'PAINTING WITH LIGHT'];
  const row = [...words, ...words, ...words, ...words];
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-10">
      <div className="marquee whitespace-nowrap py-6" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className={`display-xl mx-8 text-4xl md:text-7xl ${i % 2 ? 'stroke-text' : 'text-white/90'}`}>
                {w} <span className="mx-6 text-neon-purple">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-5 py-8 font-mono text-[10px] tracking-[0.25em] text-white/40 md:flex-row md:px-14">
        <span>© {new Date().getFullYear()} {person.name}. ALL RIGHTS RESERVED.</span>
        <span>{person.role} // {person.location.toUpperCase()}</span>
      </div>
    </footer>
  );
}
