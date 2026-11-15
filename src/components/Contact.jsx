import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clapperboard, Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';
import { contactForm, person, socials } from '../config/site';
import { blip } from '../lib/ambient';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

const icons = { instagram: Instagram, youtube: Youtube, vimeo: Clapperboard, linkedin: Linkedin };

function Row({ icon: Icon, label, value, href }) {
  const body = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center border border-neon-cyan/40 text-neon-cyan transition group-hover:bg-neon-cyan group-hover:text-void">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[9px] tracking-[0.3em] text-white/40">{label}</span>
        <span className="mt-1 block break-words text-base text-white/90 md:text-lg">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} data-magnetic className="group flex items-center gap-5 border-b border-white/10 py-5 transition hover:pl-2">
      {body}
    </a>
  ) : (
    <div className="flex items-center gap-5 border-b border-white/10 py-5">{body}</div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [pct, setPct] = useState(0);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    blip(880);
    setStatus('sending');
    setPct(0);

    // animated transmission
    const start = performance.now();
    const dur = 2200;
    const anim = new Promise((res) => {
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        setPct(Math.round(p * 100));
        p < 1 ? requestAnimationFrame(tick) : res();
      };
      requestAnimationFrame(tick);
    });

    try {
      if (contactForm.endpoint) {
        const [resp] = await Promise.all([
          fetch(contactForm.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(form),
          }),
          anim,
        ]);
        if (!resp.ok) throw new Error('bad response');
      } else {
        await anim;
        const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
        window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-5 py-24 md:px-14 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neon-purple/15 to-transparent" />
      <div className="mx-auto max-w-[1600px]">
        <SectionHead index="07" label="OPEN CHANNEL" title="LET'S CREATE" outline="SOMETHING CINEMATIC." />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Info */}
          <div>
            <Reveal>
              <Row icon={Phone} label="PHONE — CLICK TO CALL" value={person.phone} href={person.phoneHref} />
              <Row icon={Mail} label="EMAIL — CLICK TO SEND" value={person.email} href={`mailto:${person.email}`} />
              <Row icon={MapPin} label="LOCATION" value={person.location} />
            </Reveal>

            <Reveal className="mt-10">
              <div className="mb-4 font-mono text-[10px] tracking-[0.3em] text-neon-purple">// SOCIAL CHANNELS</div>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => {
                  const Icon = icons[s.id] || Clapperboard;
                  const live = Boolean(s.url);
                  const cls = `flex items-center gap-2 border px-4 py-3 font-mono text-[10px] tracking-[0.25em] transition ${
                    live ? 'border-white/25 hover:border-neon-cyan hover:text-neon-cyan' : 'border-dashed border-white/15 text-white/35'
                  }`;
                  return live ? (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" data-magnetic className={cls}>
                      <Icon size={14} /> {s.label.toUpperCase()}
                    </a>
                  ) : (
                    <span key={s.id} className={cls} title="Add this link in src/config/site.js">
                      <Icon size={14} /> {s.label.toUpperCase()} · SOON
                    </span>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal>
            <form onSubmit={submit} className="hud-panel brackets relative p-6 md:p-10" noValidate={false}>
              <div className="mb-8 flex items-center justify-between font-mono text-[10px] tracking-[0.3em]">
                <span className="text-neon-cyan">// NEW TRANSMISSION</span>
                <span className="flex items-center gap-2 text-white/40"><span className="rec-dot" /> CHANNEL OPEN</span>
              </div>

              <div className="space-y-6">
                <label className="block">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/45">NAME</span>
                  <input className="field" required value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/45">EMAIL</span>
                  <input className="field" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
                </label>
                <label className="block">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/45">MESSAGE</span>
                  <textarea className="field resize-none" rows={5} required value={form.message} onChange={set('message')} placeholder="Tell me about your project…" />
                </label>
              </div>

              <button type="submit" data-magnetic className="btn-neon mt-8 w-full justify-center" disabled={status === 'sending'}>
                {status === 'sending' ? 'TRANSMITTING…' : 'SEND TRANSMISSION'} <Send size={14} />
              </button>

              {status === 'error' && (
                <p className="mt-4 font-mono text-[11px] text-neon-red" role="alert">
                  TRANSMISSION FAILED — PLEASE EMAIL {person.email} DIRECTLY.
                </p>
              )}

              {/* transmission overlay */}
              <AnimatePresence>
                {(status === 'sending' || status === 'sent') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-void/92 p-8 text-center backdrop-blur-md"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="relative mb-8 h-24 w-full max-w-xs overflow-hidden">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <motion.span
                              key={i}
                              className="absolute top-1/2 h-1 w-6 bg-neon-cyan shadow-[0_0_10px_#00f0ff]"
                              style={{ marginTop: (i % 5) * 8 - 16 }}
                              initial={{ x: -40, opacity: 0 }}
                              animate={{ x: 320, opacity: [0, 1, 0] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.09, ease: 'linear' }}
                            />
                          ))}
                        </div>
                        <p className="font-mono text-xs tracking-[0.35em] text-neon-cyan">TRANSMITTING DATA</p>
                        <div className="mt-5 h-[2px] w-full max-w-xs bg-white/10">
                          <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-2 font-mono text-[10px] text-white/50">{String(pct).padStart(3, '0')}%</p>
                      </>
                    ) : (
                      <>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-neon-cyan text-neon-cyan" style={{ boxShadow: '0 0 30px #00f0ff55' }}>
                          <Send size={24} />
                        </motion.div>
                        <p className="font-display text-lg font-black tracking-wider text-neon-cyan neon-cyan">TRANSMISSION COMPLETE</p>
                        <p className="mt-3 max-w-xs text-sm text-white/55">
                          Your mail app should have opened with the message ready to send. If not, write to {person.email}.
                        </p>
                        <button type="button" onClick={() => setStatus('idle')} className="btn-neon btn-ghost mt-8 !py-3">
                          NEW MESSAGE
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
