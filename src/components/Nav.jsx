import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { navLinks, person } from '../config/site';
import { scrollToTarget } from '../lib/scroll';
import { setAmbient, blip } from '../lib/ambient';

export default function Nav({ visible }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const [sound, setSound] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [visible]);

  const go = (id) => {
    setOpen(false);
    blip(660);
    // wait a tick so the mobile menu closing doesn't fight the scroll
    setTimeout(() => scrollToTarget(`#${id}`), open ? 250 : 0);
  };

  const toggleSound = async () => {
    const next = !sound;
    setSound(next);
    await setAmbient(next);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed inset-x-0 top-0 z-[120] transition-colors duration-500 ${
          solid ? 'bg-black/55 backdrop-blur-md border-b border-white/5' : ''
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <button onClick={() => go('hero')} data-magnetic className="flex items-center gap-3 text-left" aria-label="Home">
            <span className="grid h-9 w-9 place-items-center border border-neon-cyan/60 font-display text-[11px] font-black text-neon-cyan">
              GB
            </span>
            <span className="hidden font-display text-[11px] font-bold tracking-[0.3em] sm:block">
              {person.name}
            </span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.slice(1).map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative font-mono text-[11px] tracking-[0.25em] transition-colors ${
                  active === l.id ? 'text-neon-cyan' : 'text-white/60 hover:text-white'
                }`}
              >
                {active === l.id && (
                  <motion.span layoutId="nav-dot" className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f0ff]" />
                )}
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              data-magnetic
              aria-pressed={sound}
              aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
              className="flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-white/70 transition hover:border-neon-cyan hover:text-neon-cyan"
            >
              {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">SOUND {sound ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center border border-white/15 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-[150] flex flex-col bg-void/97 px-6 py-5 backdrop-blur-xl"
            style={{ background: 'radial-gradient(circle at 80% 10%, rgba(160,32,255,0.25), #050507 60%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="section-label">// NAVIGATION</span>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center border border-white/20" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <nav className="mt-10 flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
              {navLinks.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => go(l.id)}
                  className="flex items-baseline gap-4 py-2 text-left"
                >
                  <span className="font-mono text-xs text-neon-cyan">0{i + 1}</span>
                  <span className={`font-display text-3xl font-black tracking-tight ${active === l.id ? 'text-neon-cyan neon-cyan' : ''}`}>
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40">{person.location.toUpperCase()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
