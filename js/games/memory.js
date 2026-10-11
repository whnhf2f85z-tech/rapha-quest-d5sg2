// Memory: 8 pairs in a 4×4 grid. Saved: deck order, matched cards, moves.

import { h, t, stageHeader, prefersReducedMotion } from '../ui.js';

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default {
  id: 'memory',
  mount(el, ctx) {
    const M = ctx.C.memory;
    const X = M.text;
    const pairs = M.images.length;

    let saved = ctx.load();
    if (!saved || saved.deck?.length !== pairs * 2) {
      saved = { deck: shuffled([...Array(pairs).keys(), ...Array(pairs).keys()]), matched: [], moves: 0 };
      if (!ctx.readOnly) ctx.save(saved);
    }
    let { deck } = saved;
    let matched = ctx.readOnly ? deck.map((_, i) => i) : saved.matched;
    let moves = saved.moves;
    // Above maxMoves without finishing, every card turns back and is reshuffled.
    const maxMoves = M.maxMoves || 0;
    const tooMany = () => maxMoves && moves >= maxMoves && matched.length !== deck.length;
    const newDeck = () => shuffled([...Array(pairs).keys(), ...Array(pairs).keys()]);
    if (!ctx.readOnly && tooMany()) {
      deck = newDeck();
      matched = [];
      moves = 0;
      ctx.save({ deck, matched, moves });
    }
    let open = [];
    let busy = false;

    const movesEl = h('span', {});
    const pairsEl = h('span', {});
    const message = h('p', { class: 'message success', role: 'status' });

    const cards = deck.map((img, i) =>
      h(
        'button',
        { class: 'card', 'aria-label': t(X.cardLabel, { n: i + 1 }), onclick: () => flip(i) },
        h(
          'span',
          { class: 'card-inner' },
          h('span', { class: 'card-face card-back', 'aria-hidden': 'true' }, h('span', {}, ctx.C.playerName.charAt(0))),
          h('span', { class: 'card-face card-front' }, h('img', { src: M.images[img], alt: '' })),
        ),
      ),
    );

    function render() {
      cards.forEach((c, i) => {
        const up = matched.includes(i) || open.includes(i);
        c.classList.toggle('flipped', up);
        c.classList.toggle('matched', matched.includes(i));
        c.setAttribute('aria-pressed', String(up));
        c.disabled = matched.includes(i);
      });
      movesEl.textContent = maxMoves
        ? t(X.movesOf, { n: moves, max: maxMoves })
        : t(moves > 1 ? X.moves : X.movesOne, { n: moves });
      pairsEl.textContent = t(X.pairs, { n: matched.length / 2 });
    }

    function flip(i) {
      if (busy || ctx.readOnly || open.includes(i) || matched.includes(i)) return;
      ctx.sound('tap');
      open.push(i);
      if (open.length === 2) {
        moves++;
        const [a, b] = open;
        if (deck[a] === deck[b]) {
          matched = [...matched, a, b];
          open = [];
          ctx.save({ deck, matched, moves });
          if (matched.length === deck.length) setTimeout(win, prefersReducedMotion() ? 0 : 500);
          else if (tooMany()) {
            busy = true;
            setTimeout(reshuffle, 900);
          }
        } else {
          busy = true;
          ctx.save({ deck, matched, moves });
          setTimeout(() => {
            open = [];
            if (tooMany()) return reshuffle();
            busy = false;
            render();
          }, 900);
        }
      }
      render();
    }

    function reshuffle() {
      ctx.sound('wrong');
      message.className = 'message error';
      message.textContent = t(X.tooMany, { max: maxMoves });
      open = [];
      matched = [];
      render(); // every card turns face down
      setTimeout(
        () => {
          deck = newDeck();
          cards.forEach((c, i) => (c.querySelector('.card-front img').src = M.images[deck[i]]));
          moves = 0;
          ctx.save({ deck, matched, moves });
          busy = false;
          render();
        },
        prefersReducedMotion() ? 0 : 600,
      );
    }

    function win() {
      message.className = 'message success';
      const msg = M.endMessages.find((m) => moves <= m.maxMoves) || M.endMessages.at(-1);
      message.textContent = msg?.text || '';
      ctx.onSolved();
    }

    el.append(
      stageHeader(X.title, t(X.instruction, { max: maxMoves })),
      h('p', { class: 'counter counter-row' }, movesEl, h('span', { 'aria-hidden': 'true' }, '·'), pairsEl),
      h('div', { class: 'memory-grid' }, cards),
      message,
    );
    render();
    // Reloaded right after the last pair: finish the job.
    if (!ctx.readOnly && matched.length === deck.length) win();
  },
};
