import { useEffect, useState } from 'react';
import { initScroll, destroyScroll, lockScroll } from './lib/scroll';
import { useReducedMotion } from './hooks/useEnv';
import Intro from './components/Intro';
import Cursor from './components/Cursor';
import Overlays from './components/Overlays';
import Nav from './components/Nav';
import BackToTop from './components/BackToTop';
import Hero from './components/Hero';
import Showreel from './components/Showreel';
import About from './components/About';
import Projects from './components/Projects';
import Equipment from './components/Equipment';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollTrigger } from './lib/scroll';

export default function App() {
  const reduced = useReducedMotion();
  // Show the intro once per session; returning visitors in the same tab skip it.
  const [introDone, setIntroDone] = useState(() => {
    try {
      return sessionStorage.getItem('gb-intro') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    initScroll(reduced);
    return () => destroyScroll();
  }, [reduced]);

  useEffect(() => {
    lockScroll(!introDone);
  }, [introDone]);

  const finishIntro = () => {
    try {
      sessionStorage.setItem('gb-intro', '1');
    } catch {
      /* private mode — ignore */
    }
    setIntroDone(true);
    // layout is stable now — recalc scroll triggers
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <>
      <Cursor />
      <Overlays />
      {!introDone && <Intro onDone={finishIntro} />}
      <Nav visible={introDone} />
      <main>
        <Hero ready={introDone} />
        <Showreel />
        <About />
        <Projects />
        <Equipment />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
