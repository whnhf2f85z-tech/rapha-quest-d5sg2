// Multiple-choice quiz, one question at a time. A wrong answer shakes the
// card; after 3 wrong tries on the same question, its « coup de pouce » shows.

import { h, t, stageHeader, messageLine, replayAnimation } from '../ui.js';

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
            h('li', {}, h('p', { class: 'quiz-recap-q' }, q.question), h('p', { class: 'quiz-recap-a' }, q.options[q.answer]), h('p', { class: 'muted' }, q.fact)),
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

      const options = q.options.map((label, k) =>
        h(
          'button',
          {
            class: 'option',
            onclick: (e) => {
              if (answered) return;
              const btn = e.currentTarget;
              if (k === q.answer) {
                answered = true;
                btn.classList.add('right');
                options.forEach((o) => (o.disabled = o !== btn));
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
              } else {
                saved.wrongs[i] = (saved.wrongs[i] || 0) + 1;
                ctx.save(saved);
                ctx.sound('wrong');
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 700);
                replayAnimation(card, 'shake');
                msg.show(X.wrong[wrongLine++ % X.wrong.length], 'error');
                showNudge();
              }
            },
          },
          label,
        ),
      );

      card.replaceChildren(
        h('p', { class: 'counter' }, t(X.counter, { n: i + 1, total: questions.length })),
        h('h2', { class: 'quiz-question' }, q.question),
        h('div', { class: 'options' }, options),
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
