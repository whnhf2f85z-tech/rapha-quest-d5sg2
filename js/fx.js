// Celebrations: a short confetti burst and an animated « Validé » stamp,
// plus optional soft sounds (Web Audio, no files). Respects reduced motion.

import { prefersReducedMotion } from './ui.js';

const COLOURS = ['#c08a8f', '#d9b382', '#2b2a33', '#efe3d3', '#9a6b70'];

export function confetti({ count = 90, duration = 1600 } = {}) {
  if (prefersReducedMotion()) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = window.innerWidth * dpr);
  const hgt = (canvas.height = window.innerHeight * dpr);

  const parts = Array.from({ length: count }, () => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.3,
    y: hgt * 0.35,
    vx: (Math.random() - 0.5) * 14 * dpr,
    vy: (-Math.random() * 14 - 4) * dpr,
    size: (Math.random() * 6 + 4) * dpr,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
  }));

  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, hgt);
    ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
    for (const p of parts) {
      p.vy += 0.45 * dpr;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (elapsed < duration) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}

export function stamp(label) {
  const el = document.createElement('div');
  el.className = 'stamp';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = label;
  document.body.append(el);
  setTimeout(() => el.remove(), 1500);
}

// ---------------------------------------------------------------- sound
let audio = null;
let enabled = false;

export function setSound(on) {
  enabled = on;
}

function tone(freq, start, length, type = 'sine', gain = 0.06) {
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audio.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(g).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
}

export function sound(kind) {
  if (!enabled) return;
  try {
    if (kind === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.4));
    else if (kind === 'wrong') tone(196, 0, 0.25, 'triangle', 0.05);
    else tone(880, 0, 0.08, 'sine', 0.03);
  } catch {
    /* audio unavailable */
  }
}
