import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from '../lib/scroll';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const C = 2 * Math.PI * 20;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          whileHover={{ y: -4 }}
          onClick={() => scrollToTarget(0, { duration: 2 })}
          data-magnetic
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-[110] grid h-12 w-12 place-items-center md:bottom-8 md:right-8"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="rgba(5,5,7,0.7)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <circle
              cx="24" cy="24" r="20" fill="none" stroke="#00f0ff" strokeWidth="2"
              strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
              style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }}
            />
          </svg>
          <ArrowUp size={16} className="relative text-neon-cyan" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
