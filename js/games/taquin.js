// Sliding puzzle. tiles[pos] = the piece sitting at position pos; the last
// piece (n*n-1) is the empty slot. Solved when tiles[i] === i everywhere.

import { h, t, stageHeader } from '../ui.js';

function neighbours(pos, n) {
  const r = Math.floor(pos / n);
  const c = pos % n;
  const out = [];
  if (r > 0) out.push(pos - n);
  if (r < n - 1) out.push(pos + n);
  if (c > 0) out.push(pos - 1);
  if (c < n - 1) out.push(pos + 1);
  return out;
}

// Random valid moves from the solved state, so the puzzle is always solvable.
function shuffle(n) {
  const tiles = [...Array(n * n).keys()];
  let blank = n * n - 1;
  let prev = -1;
  const steps = n * n * 25;
  for (let i = 0; i < steps || isSolved(tiles); i++) {
    const options = neighbours(blank, n).filter((p) => p !== prev);
    const pick = options[Math.floor(Math.random() * options.length)];
    [tiles[blank], tiles[pick]] = [tiles[pick], tiles[blank]];
    prev = blank;
    blank = pick;
  }
  return tiles;
}

const isSolved = (tiles) => tiles.every((v, i) => v === i);

export default {
  id: 'taquin',
  mount(el, ctx) {
    const T = ctx.C.taquin;
    const X = T.text;
    const n = T.size === 4 ? 4 : 3;
    const blankPiece = n * n - 1;

    let saved = ctx.load();
    if (!saved || saved.tiles?.length !== n * n) {
      saved = { tiles: shuffle(n), moves: 0 };
      if (!ctx.readOnly) ctx.save(saved);
    }
    let { tiles, moves } = saved;
    let done = ctx.readOnly;

    const counter = h('p', { class: 'counter' }, t(moves > 1 ? X.moves : X.movesOne, { n: moves }));
    const board = h('div', { class: `taquin-board${done ? ' solved' : ''}`, style: { '--n': n } });
    const full = h('img', { class: 'taquin-full', src: T.image, alt: '' });
    board.append(full);

    const pieces = [];
    for (let piece = 0; piece < n * n - 1; piece++) {
      const x = (piece % n) / (n - 1);
      const y = Math.floor(piece / n) / (n - 1);
      const btn = h('button', {
        class: 'taquin-tile',
        style: {
          backgroundImage: `url("${T.image}")`,
          backgroundSize: `${n * 100}% ${n * 100}%`,
          backgroundPosition: `${x * 100}% ${y * 100}%`,
        },
        onclick: () => {
          if (swiped) return (swiped = false);
          move(tiles.indexOf(piece));
        },
      });
      pieces[piece] = btn;
      board.append(btn);
    }

    function layout() {
      const blank = tiles.indexOf(blankPiece);
      tiles.forEach((piece, pos) => {
        if (piece === blankPiece) return;
        const btn = pieces[piece];
        btn.style.transform = `translate(${(pos % n) * 100}%, ${Math.floor(pos / n) * 100}%)`;
        const movable = !done && neighbours(blank, n).includes(pos);
        btn.disabled = done;
        btn.classList.toggle('movable', movable);
        btn.setAttribute('aria-label', `${piece + 1}`);
      });
      counter.textContent = t(moves > 1 ? X.moves : X.movesOne, { n: moves });
    }

    function move(pos) {
      if (done) return;
      const blank = tiles.indexOf(blankPiece);
      if (!neighbours(blank, n).includes(pos)) return;
      [tiles[blank], tiles[pos]] = [tiles[pos], tiles[blank]];
      moves++;
      ctx.sound('tap');
      ctx.save({ tiles, moves });
      layout();
      if (isSolved(tiles)) win();
    }

    function win() {
      done = true;
      layout();
      board.classList.add('solved');
      setTimeout(() => {
        message.textContent = X.solved;
        ctx.onSolved();
      }, 700);
    }

    // Swipe: the piece next to the gap slides in the swipe direction.
    let start = null;
    let swiped = false;
    board.addEventListener('pointerdown', (e) => (start = { x: e.clientX, y: e.clientY }));
    board.addEventListener('pointerup', (e) => {
      if (!start || done) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      const blank = tiles.indexOf(blankPiece);
      const r = Math.floor(blank / n);
      const c = blank % n;
      let from = -1;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0 && c < n - 1) from = blank + 1;
        if (dx > 0 && c > 0) from = blank - 1;
      } else {
        if (dy < 0 && r < n - 1) from = blank + n;
        if (dy > 0 && r > 0) from = blank - n;
      }
      if (from >= 0) {
        swiped = true;
        setTimeout(() => (swiped = false), 0);
        move(from);
      }
    });

    const message = h('p', { class: 'message success', role: 'status' }, done ? X.solved : '');

    el.append(
      stageHeader(X.title, X.instruction),
      h(
        'div',
        { class: 'taquin-wrap' },
        board,
        h(
          'aside',
          { class: 'taquin-side' },
          h('figure', { class: 'taquin-ref' }, h('img', { src: T.image, alt: '' }), h('figcaption', {}, X.reference)),
          counter,
        ),
      ),
      message,
    );
    layout();
    if (!done && isSolved(tiles)) win();
  },
};
