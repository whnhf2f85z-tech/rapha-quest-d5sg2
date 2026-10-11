// Riddle with a small box where the sudoku number goes: she brings the digit
// from her own grid, and the box turns green when it's right (checked by hash,
// so the digit never appears in the code). The answer itself is a free text
// below, also checked by hash.

import { h, stageHeader, messageLine, renderNudges, replayAnimation } from '../ui.js';
import { checkAnswer } from '../crypto.js';

export default {
  id: 'riddle',
  mount(el, ctx) {
    const R = ctx.C.riddle;
    const X = R.text;
    const saved = ctx.load() || { wrongs: 0, answer: '' };
    const blanks = [];
    const makeBlank = () => {
      const box = h('input', {
        class: `blank-input${saved.number ? ' right' : ''}`,
        type: 'text',
        inputmode: 'text',
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false',
        maxlength: '6',
        'aria-label': X.blankLabel,
        disabled: !!saved.number || ctx.readOnly,
      });
      box.value = saved.number || '';
      box.addEventListener('input', async () => {
        const value = box.value;
        if (!(await checkAnswer(value, R.numberAnswers)) || box.value !== value) return box.classList.remove('right');
        saved.number = value.trim();
        ctx.save(saved);
        ctx.sound('tap');
        blanks.forEach((b) => {
          b.value = saved.number;
          b.classList.add('right');
          b.disabled = true;
        });
        field?.focus();
      });
      blanks.push(box);
      return box;
    };
    const question = h(
      'blockquote',
      { class: 'riddle' },
      R.question.split('{N}').map((part, i) => [i ? makeBlank() : null, part]),
    );
    let field = null;
    const msg = messageLine();
    const nudgeBox = h('div', { class: 'nudges' });

    el.append(stageHeader(X.title, X.instruction), question);

    if (ctx.readOnly) {
      el.append(h('p', { class: 'answer-recap' }, saved.answer));
      return;
    }

    field = h('input', {
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
