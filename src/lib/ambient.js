/**
 * Original, procedurally generated ambient drone (Web Audio API).
 * No audio files, no licensing concerns. OFF by default — only starts
 * after the visitor clicks the sound toggle (browsers require a gesture).
 */
let ctx = null;
let master = null;
let nodes = [];

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  filter.Q.value = 6;
  filter.connect(master);

  // Slow filter sweep
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  nodes.push(lfo);

  // Detuned pad: low root + fifth + octave
  [
    [55, 'sawtooth', 0.22],
    [55.35, 'sawtooth', 0.22],
    [82.4, 'triangle', 0.16],
    [110, 'sine', 0.12],
    [164.8, 'sine', 0.05],
  ].forEach(([f, type, g]) => {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = type;
    o.frequency.value = f;
    og.gain.value = g;
    o.connect(og);
    og.connect(filter);
    o.start();
    nodes.push(o);
  });
  return true;
}

export async function setAmbient(on) {
  if (on) {
    if (!ctx && !build()) return false;
    await ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2.5);
    return true;
  }
  if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => ctx && ctx.suspend(), 900);
  }
  return false;
}

/** Short UI blip, only when sound is on. */
export function blip(freq = 880) {
  if (!ctx || ctx.state !== 'running' || master.gain.value < 0.01) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = freq;
  g.gain.value = 0.02;
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.12);
}
