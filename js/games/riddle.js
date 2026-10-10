// Riddle with a blank where the sudoku number goes: she must bring the digit
// from her own grid. Free-text answer, checked by hash.

import { h, stageHeader, messageLine, renderNudges, replayAnimation } from '../ui.js';
import { checkAnswer } from '../crypto.js';

export default {
  id: 'riddle',
  mount(el, ctx) {
    const R = ctx.C.riddle;
    const X = R.text;
    const saved = ctx.load() || { wrongs: 0, answer: '' };
    const question = h(
      'blockquote',
      { class: 'riddle' },
      R.question
        .split('{N}')
        .map((part, i) => [i ? h('span', { class: 'blank', role: 'img', 'aria-label': X.blankLabel }) : null, part]),
    );
    const msg = messageLine();
    const nudgeBox = h('div', { class: 'nudges' });

    el.append(stageHeader(X.title, X.instruction), question);

    if (ctx.readOnly) {
      el.append(h('p', { class: 'answer-recap' }, saved.answer));
      return;
    }

    const field = h('input', {
      class: 'text-input',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      placeholder: X.placeholder,
      'aria-label': X.placeholder,
    });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, ctx.common.validate);
    const form = h('form', { class: 'answer-form' }, field, submit);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!field.value.trim()) return field.focus();
      submit.disabled = true;
      const ok = await checkAnswer(field.value, R.answers);
      submit.disabled = false;
      if (ok) {
        ctx.save({ ...saved, answer: field.value.trim() });
        field.disabled = true;
        submit.disabled = true;
        msg.show('');
        ctx.onSolved();
      } else {
        saved.wrongs++;
        ctx.save(saved);
        ctx.sound('wrong');
        replayAnimation(form, 'shake');
        msg.show(X.wrong[(saved.wrongs - 1) % X.wrong.length], 'error');
        renderNudges(nudgeBox, R.nudges, saved.wrongs, ctx.common.nudgeTitle);
        field.select();
      }
    });

    el.append(form, msg, nudgeBox);
    renderNudges(nudgeBox, R.nudges, saved.wrongs, ctx.common.nudgeTitle);
  },
};
