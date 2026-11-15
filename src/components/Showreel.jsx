import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { showreel } from '../config/site';
import { gsap } from '../lib/scroll';
import { useInView, useInViewOnce, useReducedMotion } from '../hooks/useEnv';
import PlaceholderArt from './PlaceholderArt';
import SectionHead from './SectionHead';

const pad = (n) => String(Math.floor(n)).padStart(2, '0');
const FPS = 24;
function timecode(sec) {
  const h = sec / 3600;
  const m = (sec % 3600) / 60;
  const s = sec % 60;
  const f = (sec % 1) * FPS;
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/** Original generated placeholder reel: drifting neon scenes, no external footage. */
function GeneratedReel({ playing }) {
  const hues = [
    [190, 280],
    [280, 330],
    [175, 255],
    [340, 270],
    [205, 300],
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((v) => (v + 1) % hues.length), 3200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {hues.map(([a, b], idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0"
          animate={{ opacity: idx === i ? 1 : 0, scale: playing && idx === i ? 1.12 : 1 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, ease: 'linear' } }}
        >
          <PlaceholderArt hue={a} hue2={b} seed={idx + 11} className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

export default function Showreel() {
  const wrap = useRef(null);
  const video = useRef(null);
  const frame = useRef(null);
  const inView = useInView(wrap, '-20% 0px');
  const near = useInViewOnce(wrap, '400px');
  const reduced = useReducedMotion();

  const hasVideo = Boolean(showreel.src);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const tcRef = useRef(0);

  // generated reel timecode ticker
  useEffect(() => {
    if (hasVideo || !playing) return;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      tcRef.current += (now - last) / 1000;
      last = now;
      setTime(tcRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, hasVideo]);

  // autoplay (muted) when visible, pause when away
  useEffect(() => {
    if (reduced) return;
    if (inView) setPlaying(true);
    else setPlaying(false);
  }, [inView, reduced]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing]);

  // scroll-linked frame expand
  useEffect(() => {
    if (reduced || !frame.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { clipPath: 'inset(12% 8% 12% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 85%', end: 'top 15%', scrub: true },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  const toggle = () => setPlaying((p) => !p);
  const fullscreen = () => {
    const el = frame.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };
  const seek = (e) => {
    if (!hasVideo || !video.current || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    video.current.currentTime = ((e.clientX - r.left) / r.width) * dur;
  };

  const progress = hasVideo ? (dur ? time / dur : 0) : (time % 30) / 30;

  return (
    <section id="showreel" ref={wrap} className="relative px-0 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-14">
        <SectionHead index="01" label="THE REEL" title="WATCH THE" outline="SHOWREEL" />
      </div>

      <div ref={frame} className="relative h-[70svh] min-h-[420px] w-full overflow-hidden bg-black md:h-[92vh]">
        {/* media */}
        {hasVideo ? (
          near && (
            <video
              ref={video}
              src={showreel.src}
              poster={showreel.poster || undefined}
              muted={muted}
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            />
          )
        ) : (
          <GeneratedReel playing={playing} />
        )}

        {/* cinematic overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7))]" />

        {/* HUD */}
        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-white/80 md:left-10 md:top-8 md:text-xs">
          <span className={playing ? 'rec-dot' : 'h-2 w-2 rounded-full bg-white/40'} />
          {playing ? 'PLAY' : 'PAUSED'}
        </div>
        <div className="pointer-events-none absolute right-5 top-5 text-right font-mono text-sm tracking-[0.2em] text-neon-cyan neon-cyan md:right-10 md:top-8 md:text-xl">
          {timecode(time)}
          <div className="mt-1 text-[9px] tracking-[0.3em] text-white/45">TC // {FPS}FPS</div>
        </div>
        {!hasVideo && (
          <div className="pointer-events-none absolute bottom-24 left-5 font-mono text-[10px] tracking-[0.25em] text-white/50 md:left-10">
            PLACEHOLDER REEL — SET <span className="text-neon-cyan">showreel.src</span> IN config/site.js
          </div>
        )}

        {/* center play */}
        <button
          onClick={toggle}
          data-magnetic
          aria-label={playing ? 'Pause showreel' : 'Play showreel'}
          className="group absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center md:h-32 md:w-32"
        >
          <span className="absolute inset-0 rounded-full border border-neon-cyan/60 transition group-hover:scale-110 group-hover:border-neon-purple" />
          <span className="absolute inset-3 rounded-full border border-dashed border-white/25 animate-[spin_14s_linear_infinite]" />
          <motion.span
            animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.7 : 1 }}
            className="absolute inset-0 grid place-items-center rounded-full bg-neon-cyan/10 backdrop-blur-sm"
          >
            <Play size={30} fill="#00f0ff" className="ml-1 text-neon-cyan" />
          </motion.span>
          <motion.span
            animate={{ opacity: playing ? 0 : 0 }}
            className="absolute inset-0"
          />
          {playing && <Pause size={26} className="relative text-white/70 opacity-0 transition group-hover:opacity-100" />}
        </button>

        {/* controls */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 md:px-10 md:pb-8">
          <div
            onClick={seek}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            className="relative mb-4 h-[3px] w-full cursor-pointer bg-white/15"
          >
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_#00f0ff]" style={{ width: `${progress * 100}%` }} />
            <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_#fff]" style={{ left: `calc(${progress * 100}% - 6px)` }} />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/70">
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="grid h-9 w-9 place-items-center border border-white/25 transition hover:border-neon-cyan hover:text-neon-cyan" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              {hasVideo && (
                <button onClick={() => setMuted((m) => !m)} className="grid h-9 w-9 place-items-center border border-white/25 transition hover:border-neon-cyan hover:text-neon-cyan" aria-label={muted ? 'Unmute' : 'Mute'}>
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}
              <span className="hidden sm:inline">GUNANIDHI BHOJ // SHOWREEL</span>
            </div>
            <button onClick={fullscreen} className="grid h-9 w-9 place-items-center border border-white/25 transition hover:border-neon-cyan hover:text-neon-cyan" aria-label="Fullscreen">
              <Maximize size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
