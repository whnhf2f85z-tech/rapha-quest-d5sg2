// Tiny DOM helpers shared by every stage.

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object')
      for (const [prop, val] of Object.entries(v)) {
        if (prop.startsWith('--')) el.style.setProperty(prop, val);
        else el.style[prop] = val;
      }
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : String(c));
  }
  return el;
}

// Fills {placeholders} in a content string.
export function t(str, vars = {}) {
  return String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function capitalise(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function formatNumber(n, digits = 0) {
  return Number(n).toLocaleString('fr-CH', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Standard header of a game screen: title + one-line witty instruction.
export function stageHeader(title, instruction) {
  return h(
    'header',
    { class: 'stage-head' },
    h('h1', { class: 'stage-title', tabindex: '-1' }, title),
    instruction ? h('p', { class: 'stage-instruction' }, instruction) : null,
  );
}

// A message line that announces itself to screen readers.
export function messageLine() {
  const el = h('p', { class: 'message', role: 'status', 'aria-live': 'polite' });
  el.show = (text, tone = '') => {
    el.textContent = text;
    el.className = `message ${tone}`;
  };
  return el;
}

// Restarts a CSS animation class (e.g. shake on a wrong answer).
export function replayAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// Shows the nudges unlocked so far: one per 3 wrong tries, up to the list length.
export function renderNudges(box, nudges, wrongs, title) {
  const count = Math.min(nudges.length, Math.floor(wrongs / 3));
  box.replaceChildren(
    ...nudges.slice(0, count).map((n) => h('div', { class: 'nudge' }, h('strong', {}, title), ' ', n)),
  );
}

// The pickup invitation card (used in the final stage and on the birthday screen).
export function invitationCard(card, slot, text) {
  return h(
    'article',
    { class: 'invitation' },
    h('p', { class: 'invitation-kicker' }, text.cardKicker),
    h('h2', { class: 'invitation-title' }, text.cardTitle),
    h('p', { class: 'invitation-shop' }, card.name),
    h('p', { class: 'invitation-address' }, card.address),
    card.mapsUrl
      ? h('a', { class: 'btn btn-ghost', href: card.mapsUrl, target: '_blank', rel: 'noopener' }, text.openMaps)
      : null,
    slot ? h('p', { class: 'invitation-when' }, t(text.rendezvous, { day: slot.day, part: slot.part })) : null,
    card.hours
      ? h('div', { class: 'invitation-row' }, h('span', {}, text.hoursLabel), h('p', {}, card.hours))
      : null,
    card.counter
      ? h('div', { class: 'invitation-row' }, h('span', {}, text.counterLabel), h('p', {}, card.counter))
      : null,
    card.signoff ? h('p', { class: 'invitation-signoff' }, card.signoff) : null,
  );
}
