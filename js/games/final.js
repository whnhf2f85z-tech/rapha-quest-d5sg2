// Grand final. Lock 1: pin within N m of the shop (hot/cold only).
// Lock 2: the shop's name, checked by hash; it also decrypts the pickup card.

import { h, t, stageHeader, messageLine, renderNudges, replayAnimation, invitationCard } from '../ui.js';
import { createMap, haversine, editablePin } from '../map.js';
import { hashAnswer, decryptWithAnswer } from '../crypto.js';

export default {
  id: 'final',
  mount(el, ctx) {
    const F = ctx.C.final;
    const X = F.text;
    const saved = ctx.load() || { lock1: false, last: null, wrongs: 0 };
    let map = null;

    el.append(stageHeader(X.title, X.instruction));
    const area = h('div', { class: 'final-area' });
    el.append(area);

    const st = ctx.state();
    if (st.card) showCard(st.card);
    else if (!saved.lock1) lock1();
    else lock2();

    function cleanup() {
      if (map) map.remove();
      map = null;
    }

    // ------------------------------------------------------------ lock 1
    function lock1() {
      const mapEl = h('div', { class: 'map map-tall', role: 'application', 'aria-label': X.lock1Title });
      const msg = messageLine();
      let pin = null;
      const submit = h('button', { class: 'btn btn-primary', onclick: check }, ctx.common.validate);

      area.replaceChildren(
        h(
          'div',
          { class: 'final-grid' },
          h(
            'section',
            { class: 'final-main' },
            h('h2', { class: 'lock-title' }, X.lock1Title),
            h('p', { class: 'muted' }, X.lock1Instruction),
            mapEl,
            h('div', { class: 'actions' }, submit),
            msg,
          ),
          h('aside', { class: 'final-notebook' }, h('h2', {}, ctx.common.notebookTitle), ctx.renderClues()),
        ),
      );

      map = createMap(mapEl, F.map);
      map.on('click', (e) => {
        if (pin) pin.setLatLng(e.latlng);
        else pin = editablePin(map, e.latlng, { deleteLabel: ctx.common.removePin, onRemove: () => (pin = null) });
        ctx.sound('tap');
      });

      function check() {
        if (!pin) return msg.show(X.noPin, 'error');
        const d = haversine(pin.getLatLng(), F.shop);
        if (d <= F.radiusMeters) {
          saved.lock1 = true;
          ctx.save(saved);
          ctx.sound('win');
          msg.show(X.lock1Done, 'success');
          submit.disabled = true;
          pin.lock();
          setTimeout(() => {
            cleanup();
            lock2();
          }, 1200);
          return;
        }
        ctx.sound('wrong');
        // No distance here, on purpose: only warmer / colder.
        const trend = saved.last == null ? X.miss : d < saved.last ? X.hotter : X.colder;
        saved.last = d;
        ctx.save(saved);
        msg.show(trend, 'error');
      }
    }

    // ------------------------------------------------------------ lock 2
    function lock2() {
      const msg = messageLine();
      const nudgeBox = h('div', { class: 'nudges' });
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
        submit.textContent = X.checking;
        const hash = await hashAnswer(field.value);
        const match = F.accepted.find((a) => a.hash === hash);
        const card = match ? await decryptWithAnswer(match.card, field.value) : null;
        submit.disabled = false;
        submit.textContent = ctx.common.validate;
        if (card) {
          ctx.update({ card });
          ctx.onSolved({ footer: false });
          showCard(card);
          return;
        }
        saved.wrongs++;
        ctx.save(saved);
        ctx.sound('wrong');
        replayAnimation(form, 'shake');
        msg.show(X.wrong[(saved.wrongs - 1) % X.wrong.length], 'error');
        renderNudges(nudgeBox, F.nudges, saved.wrongs, ctx.common.nudgeTitle);
        field.select();
      });

      area.replaceChildren(
        h(
          'div',
          { class: 'final-grid' },
          h(
            'section',
            { class: 'final-main' },
            h('h2', { class: 'lock-title' }, X.lock2Title),
            h('p', { class: 'muted' }, X.lock2Instruction),
            form,
            msg,
            nudgeBox,
          ),
          h('aside', { class: 'final-notebook' }, h('h2', {}, ctx.common.notebookTitle), ctx.renderClues()),
        ),
      );
      renderNudges(nudgeBox, F.nudges, saved.wrongs, ctx.common.nudgeTitle);
      field.focus();
    }

    // ------------------------------------------------------------ reveal
    function showCard(card) {
      const next = h('button', { class: 'btn btn-primary btn-large', onclick: () => ctx.goNext() }, X.next);
      area.replaceChildren(invitationCard(card, ctx.state().slot, X), h('div', { class: 'actions center' }, next));
      setTimeout(() => next.focus({ preventScroll: true }), 50);
    }

    return cleanup;
  },
};
