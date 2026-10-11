// Pick a half-day, confirm, send it to Léa. With a Formspree form it is sent
// automatically; without one (or if sending fails) a ready-written e-mail opens
// instead, and she can still continue.

import { h, t, stageHeader, capitalise } from '../ui.js';

export default {
  id: 'halfday',
  mount(el, ctx) {
    const D = ctx.C.halfDay;
    const X = D.text;
    const PARTS = [
      { key: 'matin', label: X.morning, long: X.morningLong },
      { key: 'apres-midi', label: X.afternoon, long: X.afternoonLong },
    ];
    const area = h('div', { class: 'halfday-area' });
    el.append(stageHeader(X.title, X.instruction), area);

    const chosen = ctx.state().slot;
    if (chosen) {
      area.append(h('p', { class: 'locked-choice' }, t(X.locked, { day: chosen.day, part: chosen.part })));
      if (!ctx.readOnly) ctx.onSolved({ celebrate: false });
      return;
    }

    function slotFor(day, part) {
      return { id: `${day.id}-${part.key}`, date: day.id, day: day.long, part: part.long };
    }

    function renderPicker() {
      area.replaceChildren(
        h(
          'div',
          { class: 'days' },
          D.days.map((day) =>
            h(
              'div',
              { class: 'day-card' },
              h('p', { class: 'day-name' }, day.short),
              PARTS.map((part) => {
                const slot = slotFor(day, part);
                const off = D.disabled.includes(slot.id);
                return h(
                  'button',
                  {
                    class: `slot${off ? ' slot-off' : ''}`,
                    disabled: off,
                    'aria-label': `${day.short} ${off ? X.taken : part.label}`,
                    onclick: () => renderConfirm(slot),
                  },
                  part.label,
                  off ? h('span', { class: 'slot-taken' }, X.taken) : null,
                );
              }),
            ),
          ),
        ),
      );
    }

    const mailHref = (slot) =>
      `mailto:${D.leaEmail}?subject=${encodeURIComponent(D.emailSubject)}&body=${encodeURIComponent(
        t(X.mailBody, { day: slot.day, part: slot.part }),
      )}`;

    function lockAndContinue(slot) {
      ctx.update({ slot: { id: slot.id, day: slot.day, part: slot.part } });
      area.replaceChildren(h('p', { class: 'locked-choice' }, t(X.locked, { day: slot.day, part: slot.part })));
      ctx.onSolved();
    }

    function renderConfirm(slot) {
      ctx.sound('tap');
      const actions = h('div', { class: 'actions' });
      // Without a Formspree form, go straight to the e-mail: no failed attempt first.
      const primary = D.formspreeEndpoint
        ? h('button', { class: 'btn btn-primary', onclick: () => send(slot, primary) }, X.send)
        : h(
            'a',
            {
              class: 'btn btn-primary',
              href: mailHref(slot),
              onclick: () =>
                setTimeout(
                  () =>
                    actions.replaceChildren(
                      h('button', { class: 'btn btn-primary', onclick: () => lockAndContinue(slot) }, X.continueAnyway),
                      h('a', { class: 'btn btn-ghost', href: mailHref(slot) }, X.mailAgain),
                    ),
                  300,
                ),
            },
            X.mailButton,
          );
      actions.append(primary, h('button', { class: 'btn btn-ghost', onclick: renderPicker }, X.change));
      area.replaceChildren(
        h(
          'div',
          { class: 'confirm-card' },
          h('p', { class: 'confirm-text' }, t(X.confirm, { Day: capitalise(slot.day), day: slot.day, part: slot.part })),
          D.formspreeEndpoint ? null : h('p', { class: 'muted' }, X.mailIntro),
          actions,
        ),
      );
      primary.focus();
    }

    async function send(slot, btn) {
      btn.disabled = true;
      btn.textContent = X.sending;
      const payload = {
        _subject: D.emailSubject,
        jour: slot.day,
        date: slot.date,
        moment: slot.part,
        creneau: slot.id,
        envoye_le: new Date().toISOString(),
      };
      let ok = false;
      try {
        const res = await fetch(D.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      if (ok) {
        ctx.update({ slot: { id: slot.id, day: slot.day, part: slot.part } });
        area.replaceChildren(h('p', { class: 'message success' }, X.sent));
        ctx.onSolved();
        return;
      }
      area.replaceChildren(
        h(
          'div',
          { class: 'confirm-card' },
          h('p', { class: 'message error' }, X.failed),
          h(
            'div',
            { class: 'actions' },
            h('a', { class: 'btn btn-primary', href: mailHref(slot) }, X.mailButton),
            h('button', { class: 'btn btn-ghost', onclick: () => lockAndContinue(slot) }, X.continueAnyway),
          ),
        ),
      );
    }

    renderPicker();
  },
};
