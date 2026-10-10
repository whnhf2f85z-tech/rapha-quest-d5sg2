// Router, progress, notebook. One stage on screen at a time, in a fixed order.
// There is no URL routing on purpose: the only way forward is solving.

import C from '../content.js';
import * as store from './storage.js';
import { h } from './ui.js';
import { confetti, stamp, setSound, sound } from './fx.js';

import welcome from './games/welcome.js';
import taquin from './games/taquin.js';
import memory from './games/memory.js';
import quiz from './games/quiz.js';
import sudoku from './games/sudoku.js';
import riddle from './games/riddle.js';
import route from './games/route.js';
import place from './games/place.js';
import halfday from './games/halfday.js';
import final from './games/final.js';
import birthday from './games/birthday.js';

const STAGES = [welcome, taquin, memory, quiz, sudoku, riddle, route, place, halfday, final, birthday];
// Which notebook clue each stage unlocks (the sudoku gives none).
const CLUE_FOR = { taquin: 0, memory: 1, quiz: 2, riddle: 3, route: 4, place: 5 };

const app = document.getElementById('app');
const stageEl = document.getElementById('stage');
const progressEl = document.getElementById('progress');
const notebookBtn = document.getElementById('notebook-btn');
const soundBtn = document.getElementById('sound-btn');
const dialog = document.getElementById('notebook');
const toastEl = document.getElementById('toast');

let view = 0; // stage currently displayed
let cleanup = null;

// ------------------------------------------------------------------ boot
const params = new URLSearchParams(location.search);
store.load();
if (params.has('reset')) {
  store.reset();
  history.replaceState(null, '', location.pathname);
  setTimeout(() => toast(C.common.resetDone), 400);
}
const S = store.get();
view = S.reached;
setSound(S.sound);
document.title = C.common.pageTitle;

notebookBtn.querySelector('span').textContent = C.common.notebookButton;
notebookBtn.addEventListener('click', openNotebook);
soundBtn.addEventListener('click', () => {
  store.update({ sound: !store.get().sound });
  renderSoundButton();
  sound('tap');
});
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

renderSoundButton();
show(view, { first: true });

// ------------------------------------------------------------------ stages
function show(index, { first = false } = {}) {
  const state = store.get();
  if (index > state.reached) return; // never further than earned
  view = index;
  if (cleanup) cleanup();
  cleanup = null;

  const stage = STAGES[index];
  const readOnly = index < state.reached && stage.id !== 'birthday';
  app.dataset.stage = stage.id;
  notebookBtn.hidden = index === 0;

  stageEl.replaceChildren();
  stageEl.classList.remove('enter');
  void stageEl.offsetWidth;
  stageEl.classList.add('enter');

  const body = h('div', { class: 'stage-body' });
  stageEl.append(body);

  const ctx = makeContext(stage, index, readOnly, body);
  cleanup = stage.mount(body, ctx) || null;

  if (readOnly && stage.id !== 'welcome') body.append(readOnlyFooter(stage));

  renderProgress();
  if (!first) {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    (stageEl.querySelector('h1') || stageEl).focus({ preventScroll: true });
  }
}

function makeContext(stage, index, readOnly, body) {
  return {
    C,
    readOnly,
    common: C.common,
    state: () => store.get(),
    load: () => store.gameState(stage.id),
    save: (value) => store.setGameState(stage.id, value),
    update: (patch) => store.update(patch),
    goNext: () => show(Math.min(index + 1, STAGES.length - 1)),
    goCurrent: () => show(store.get().reached),
    openNotebook,
    renderClues,
    toast,
    sound,
    celebrate,
    // Called by a game when it is won.
    onSolved: ({ footer = true, celebrate: party = true } = {}) => {
      const st = store.get();
      if (index === st.reached && index < STAGES.length - 1) {
        const clue = CLUE_FOR[stage.id];
        const clues = clue != null && !st.clues.includes(clue) ? [...st.clues, clue] : st.clues;
        store.update({ reached: index + 1, clues, started: true });
      }
      renderProgress();
      if (party) celebrate();
      if (footer) body.append(solvedFooter(stage, index));
    },
  };
}

function solvedFooter(stage, index) {
  const clue = CLUE_FOR[stage.id];
  const btn = h('button', { class: 'btn btn-primary', onclick: () => show(index + 1) }, C.common.next);
  setTimeout(() => btn.focus({ preventScroll: true }), 50);
  return h(
    'div',
    { class: 'stage-footer reveal' },
    clue != null
      ? h(
          'div',
          { class: 'clue-won' },
          h('p', { class: 'clue-won-label' }, C.common.clueUnlocked),
          h('p', { class: 'clue-won-text' }, C.clues[clue]),
        )
      : null,
    btn,
  );
}

function readOnlyFooter(stage) {
  const clue = CLUE_FOR[stage.id];
  return h(
    'div',
    { class: 'stage-footer' },
    h('p', { class: 'readonly-note' }, C.common.readOnlyNote),
    clue != null
      ? h('div', { class: 'clue-won' }, h('p', { class: 'clue-won-text' }, C.clues[clue]))
      : null,
    h('button', { class: 'btn btn-primary', onclick: () => show(store.get().reached) }, C.common.back),
  );
}

function celebrate() {
  stamp(C.common.solvedStamp);
  confetti();
  sound('win');
}

// ------------------------------------------------------------------ progress bar
function renderProgress() {
  const { reached } = store.get();
  progressEl.setAttribute('aria-label', C.common.progressLabel);
  progressEl.replaceChildren(
    ...STAGES.map((s, i) => {
      const status = i < reached ? 'done' : i === reached ? 'current' : 'locked';
      const name = C.stageNames[i];
      return h(
        'li',
        {},
        h(
          'button',
          {
            class: `step ${status}${i === view ? ' viewing' : ''}`,
            disabled: status === 'locked',
            'aria-current': i === view ? 'step' : null,
            'aria-label': status === 'locked' ? `${i + 1}. ${name} — ${C.common.lockedStage}` : `${i + 1}. ${name}`,
            title: status === 'locked' ? C.common.lockedStage : name,
            onclick: () => show(i),
          },
          h('span', { class: 'step-bar' }),
        ),
      );
    }),
  );
}

// ------------------------------------------------------------------ notebook
function renderClues() {
  const st = store.get();
  return h(
    'div',
    { class: 'clue-list' },
    h(
      'ol',
      {},
      C.clues.map((c, i) =>
        st.clues.includes(i)
          ? h('li', { class: 'clue' }, c)
          : h('li', { class: 'clue locked' }, C.common.notebookLocked),
      ),
    ),
  );
}

function openNotebook() {
  dialog.replaceChildren(
    h(
      'div',
      { class: 'notebook-inner' },
      h('h2', {}, C.common.notebookTitle),
      h('p', { class: 'muted' }, C.common.notebookIntro),
      renderClues(),
      h('button', { class: 'btn btn-ghost', onclick: () => dialog.close() }, C.common.close),
    ),
  );
  dialog.showModal();
  sound('tap');
}

// ------------------------------------------------------------------ misc
function renderSoundButton() {
  const on = store.get().sound;
  setSound(on);
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.setAttribute('aria-label', on ? C.common.soundOn : C.common.soundOff);
  soundBtn.title = on ? C.common.soundOn : C.common.soundOff;
  soundBtn.classList.toggle('on', on);
}

let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

