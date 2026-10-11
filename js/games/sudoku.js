// Classic 9×9 sudoku with a number pad and pencil notes. No red digits while
// she plays; when the grid is full, « J'ai fini » checks it against the hash of
// the solution (so the solution, and the starred digit, never appear in the
// code) and only says right or wrong, never where. The starred cell holds
// « the number » the riddle needs; she has to remember it herself.

import { h, t, stageHeader, replayAnimation } from '../ui.js';
import { sha256 } from '../crypto.js';

const peersOf = (i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const br = r - (r % 3);
  const bc = c - (c % 3);
  const out = new Set();
  for (let k = 0; k < 9; k++) {
    out.add(r * 9 + k);
    out.add(k * 9 + c);
    out.add((br + Math.floor(k / 3)) * 9 + bc + (k % 3));
  }
  out.delete(i);
  return [...out];
};
const PEERS = Array.from({ length: 81 }, (_, i) => peersOf(i));

export default {
  id: 'sudoku',
  mount(el, ctx) {
    const S = ctx.C.sudoku;
    const X = S.text;
    const givens = [...S.puzzle].map(Number);
    const star = (S.highlight.row - 1) * 9 + (S.highlight.col - 1);

    let saved = ctx.load();
    if (!saved || saved.grid?.length !== 81) saved = { grid: givens.slice(), notes: {} };
    let grid = saved.grid;
    let notes = saved.notes || {};
    let selected = givens.findIndex((v) => v === 0);
    let pencil = false;
    let done = ctx.readOnly;

    const persist = () => ctx.save({ grid, notes });
    const full = () => grid.every((v) => v > 0);

    const cells = grid.map((_, i) => {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const classes = ['cell'];
      if (givens[i]) classes.push('given');
      if (i === star) classes.push('star');
      if (c % 3 === 2 && c < 8) classes.push('edge-r');
      if (r % 3 === 2 && r < 8) classes.push('edge-b');
      return h('button', { class: classes.join(' '), onclick: () => select(i) });
    });

    function cellLabel(i) {
      const base = t(X.cellLabel, { r: Math.floor(i / 9) + 1, c: (i % 9) + 1 });
      return `${base}${i === star ? `, ${X.starLabel}` : ''}${grid[i] ? ` : ${grid[i]}` : ''}`;
    }

    function render() {
      cells.forEach((cell, i) => {
        const v = grid[i];
        cell.classList.toggle('selected', i === selected && !done);
        cell.setAttribute('aria-label', cellLabel(i));
        cell.tabIndex = i === selected ? 0 : -1;
        if (v) cell.replaceChildren(h('span', { class: 'cell-value' }, v));
        else if (notes[i]?.length)
          cell.replaceChildren(
            h('span', { class: 'cell-notes' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => h('span', {}, notes[i].includes(n) ? n : ''))),
          );
        else cell.replaceChildren();
        if (i === star) cell.append(h('span', { class: 'star-mark', 'aria-hidden': 'true' }, '★'));
      });
      pencilBtn.setAttribute('aria-pressed', String(pencil));
      pencilBtn.classList.toggle('on', pencil);
      if (!done) finishBtn.hidden = !full();
    }

    function select(i) {
      if (done) return;
      selected = i;
      render();
      cells[i].focus();
    }

    function input(n) {
      if (done || selected < 0 || givens[selected]) return;
      if (n === 0) {
        grid[selected] = 0;
        delete notes[selected];
      } else if (pencil) {
        if (grid[selected]) return;
        const set = new Set(notes[selected] || []);
        set.has(n) ? set.delete(n) : set.add(n);
        notes[selected] = [...set].sort();
      } else {
        grid[selected] = grid[selected] === n ? 0 : n;
        delete notes[selected];
        // Clean this digit out of the notes of neighbouring cells.
        PEERS[selected].forEach((p) => {
          if (notes[p]) notes[p] = notes[p].filter((x) => x !== n);
        });
      }
      ctx.sound('tap');
      message.textContent = '';
      persist();
      render();
    }

    async function finish() {
      if (!full() || done) return;
      finishBtn.disabled = true;
      const ok = (await sha256(grid.join(''))) === S.solutionHash;
      finishBtn.disabled = false;
      if (!ok) {
        ctx.sound('wrong');
        replayAnimation(board, 'shake');
        message.className = 'message error';
        message.textContent = X.notYet;
        return;
      }
      done = true;
      message.className = 'message success';
      persist();
      pad.remove();
      finishBtn.remove();
      board.classList.add('solved');
      render();
      message.textContent = X.filled;
      ctx.onSolved();
    }

    const board = h('div', { class: 'sudoku-board' }, cells);
    board.addEventListener('keydown', (e) => {
      if (done) return;
      if (/^[1-9]$/.test(e.key)) input(Number(e.key));
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') input(0);
      else if (e.key.startsWith('Arrow')) {
        const d = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[e.key];
        const next = selected + d;
        if (next >= 0 && next < 81) select(next);
        e.preventDefault();
      }
    });

    const pencilBtn = h('button', { class: 'pad-btn pad-wide', onclick: () => ((pencil = !pencil), render()) }, X.pencil);
    const pad = h(
      'div',
      { class: 'sudoku-pad' },
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => h('button', { class: 'pad-btn', onclick: () => input(n) }, n)),
      pencilBtn,
      h('button', { class: 'pad-btn pad-wide', onclick: () => input(0) }, X.erase),
    );
    const finishBtn = h('button', { class: 'btn btn-primary', onclick: finish, hidden: true }, X.finish);
    const message = h('p', { class: 'message', role: 'status' }, done ? X.filled : '');

    el.append(
      stageHeader(X.title, X.instruction),
      h('div', { class: 'sudoku-wrap' }, board, done ? null : pad),
      done ? null : h('div', { class: 'actions center' }, finishBtn),
      message,
    );
    if (done) board.classList.add('solved');
    render();
  },
};
