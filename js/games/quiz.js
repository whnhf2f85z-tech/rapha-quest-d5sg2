// Quiz, one question at a time. Two kinds of questions:
// - multiple choice (default): 4 options, one right answer;
// - ranking (type: 'ranking'): she types the items in order, no options shown.
// A wrong answer shakes the card; after 3 wrong tries on the same question,
// its « coup de pouce » shows.

import { h, t, stageHeader, messageLine, replayAnimation } from '../ui.js';
import { normalise } from '../crypto.js';

const answerText = (q) => (q.type === 'ranking' ? q.answer.map((a, i) => `${i + 1}. ${a}`).join(' · ') : q.options[q.answer]);

export default {
  id: 'quiz',
  mount(el, ctx) {
    const Q = ctx.C.quiz;
    const X = Q.text;
    const questions = Q.questions;

    el.append(stageHeader(X.title, X.instruction));

    if (ctx.readOnly) {
      el.append(
        h(
          'ol',
          { class: 'quiz-recap' },
          questions.map((q) =>
            h(
              'li',
              {},
              h('p', { class: 'quiz-recap-q' }, q.question),
              h('p', { class: 'quiz-recap-a' }, answerText(q)),
              h('p', { class: 'muted' }, q.fact),
            ),
          ),
        ),
      );
      return;
    }

    let saved = ctx.load() || { index: 0, wrongs: {} };
    let wrongLine = 0;
    const card = h('div', { class: 'quiz-card' });
    el.append(card);

    function renderQuestion() {
      const i = saved.index;
      const q = questions[i];
      const msg = messageLine();
      const nudgeBox = h('div', { class: 'nudges' });
      const after = h('div', { class: 'quiz-after' });
      let answered = false;

      const showNudge = () => {
        if ((saved.wrongs[i] || 0) >= 3 && q.nudge) {
          nudgeBox.replaceChildren(h('div', { class: 'nudge' }, h('strong', {}, ctx.common.nudgeTitle), ' ', q.nudge));
        }
      };

      function right() {
        answered = true;
        msg.show(X.right, 'success');
        ctx.sound('tap');
        const last = i === questions.length - 1;
        after.replaceChildren(
          h('p', { class: 'fact' }, q.fact),
          h(
            'button',
            {
              class: 'btn btn-primary',
              onclick: () => {
                saved = { ...saved, index: i + 1 };
                ctx.save(saved);
                if (last) {
                  card.replaceChildren();
                  ctx.onSolved();
                } else renderQuestion();
              },
            },
            last ? X.finish : X.nextQuestion,
          ),
        );
        after.querySelector('button').focus();
      }

      function wrong(extra = '') {
        saved.wrongs[i] = (saved.wrongs[i] || 0) + 1;
        ctx.save(saved);
        ctx.sound('wrong');
        replayAnimation(card, 'shake');
        msg.show(`${X.wrong[wrongLine++ % X.wrong.length]}${extra ? ` ${extra}` : ''}`, 'error');
        showNudge();
      }

      let body;
      if (q.type === 'ranking') {
        const fields = q.answer.map((_, k) =>
          h('input', {
            class: 'text-input',
            type: 'text',
            autocomplete: 'off',
            autocapitalize: 'words',
            spellcheck: 'false',
            placeholder: X.rankingPlaceholder,
            'aria-label': t(X.rankingLabel, { n: k + 1 }),
          }),
        );
        // Editing a field clears its colour from the previous try.
        fields.forEach((f) => f.addEventListener('input', () => f.classList.remove('rank-ok', 'rank-near')));
        const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, ctx.common.validate);
        const legend = h(
          'p',
          { class: 'rank-legend' },
          h('span', { class: 'rank-key rank-ok' }),
          X.rankingRight,
          h('span', { class: 'rank-key rank-near' }),
          X.rankingNear,
        );
        body = h(
          'form',
          { class: 'ranking' },
          h(
            'ol',
            {},
            fields.map((f) => h('li', {}, f)),
          ),
          legend,
          submit,
        );
        body.addEventListener('submit', (e) => {
          e.preventDefault();
          if (answered) return;
          if (fields.some((f) => !normalise(f.value))) return fields.find((f) => !normalise(f.value)).focus();
          // Which place of the real ranking each answer matches (-1 = not in it).
          const spellings = q.answer.map((a, k) => [a, ...(q.accepted?.[k] || [])].map(normalise));
          const places = fields.map((f) => spellings.findIndex((s) => s.includes(normalise(f.value))));
          places.forEach((p, k) => {
            fields[k].classList.toggle('rank-ok', p === k);
            fields[k].classList.toggle('rank-near', p >= 0 && p !== k);
          });
          if (places.every((p, k) => p === k)) {
            fields.forEach((f) => (f.disabled = true));
            submit.disabled = true;
            right();
          } else wrong();
        });
      } else {
        const options = q.options.map((label, k) =>
          h(
            'button',
            {
              class: 'option',
              onclick: (e) => {
                if (answered) return;
                const btn = e.currentTarget;
                if (k === q.answer) {
                  btn.classList.add('right');
                  options.forEach((o) => (o.disabled = o !== btn));
                  right();
                } else {
                  btn.classList.add('wrong');
                  setTimeout(() => btn.classList.remove('wrong'), 700);
                  wrong();
                }
              },
            },
            label,
          ),
        );
        body = h('div', { class: 'options' }, options);
      }

      card.replaceChildren(
        h('p', { class: 'counter' }, t(X.counter, { n: i + 1, total: questions.length })),
        h('h2', { class: 'quiz-question' }, q.question),
        body,
        msg,
        nudgeBox,
        after,
      );
      showNudge();
    }

    if (saved.index >= questions.length) ctx.onSolved({ celebrate: false });
    else renderQuestion();
  },
};
