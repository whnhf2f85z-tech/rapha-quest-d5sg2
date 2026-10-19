// Pick one or more half-days, confirm, send them to Léa. With a Formspree form
// they are sent automatically; without one (or if sending fails) a
// ready-written e-mail opens instead, and she can still continue.

import { h, t, stageHeader, capitalise, joinList } from '../ui.js';

export default {
  id: 'halfday',
  mount(el, ctx) {
    const D = ctx.C.halfDay;
    const X = D.text;
    const PARTS = [
      { key: 'matin', label: X.morning, long: X.morningLong },
      { key: 'apres-midi', label: X.afternoon, long: X.afternoonLong },
    ];
    // The days start tomorrow (from her device's date), for D.daysCount days.
    // « 1 novembre » → « 1er novembre »
    const fmt = (opts) => ({ format: (d) => new Intl.DateTimeFormat('fr-FR', opts).format(d).replace(/(^|\s)1(?=\s|$)/, '$11er') });
    const pad = (n) => String(n).padStart(2, '0');
    const days = Array.from({ length: D.daysCount || 7 }, (_, k) => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + 1 + k);
      return {
        id: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        short: capitalise(fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(d)),
        long: fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d),
        plain: fmt({ day: 'numeric', month: 'long' }).format(d),
        dayOnly: fmt({ day: 'numeric' }).format(d),
        month: d.getMonth(),
      };
    });
    // « entre le 20 et le 26 octobre », or « entre le 28 octobre et le 3 novembre »
    const first = days[0].month === days.at(-1).month ? days[0].dayOnly : days[0].plain;

    const area = h('div', { class: 'halfday-area' });
    el.append(stageHeader(X.title, t(X.instruction, { first, last: days.at(-1).plain })), area);

    // « mercredi 21 octobre, l'après-midi et jeudi 22 octobre, le matin »
    const describe = (slots) => joinList(slots.map((s) => `${s.day}, ${s.part}`), X.and);

    const chosen = ctx.state().slots;
    if (chosen?.length) {
      area.append(h('p', { class: 'locked-choice' }, t(X.locked, { when: describe(chosen) })));
      if (!ctx.readOnly) ctx.onSolved({ celebrate: false });
      return;
    }

    const slotFor = (day, part) => ({ id: `${day.id}-${part.key}`, date: day.id, day: day.long, part: part.long });
    const order = days.flatMap((day) => PARTS.map((part) => slotFor(day, part).id));
    let picked = [];

    function renderPicker() {
      const validate = h(
        'button',
        { class: 'btn btn-primary', disabled: !picked.length, onclick: renderConfirm },
        picked.length ? t(picked.length > 1 ? X.validateMany : X.validateOne, { n: picked.length }) : X.validateNone,
      );
      area.replaceChildren(
        h(
          'div',
          { class: 'days' },
          days.map((day) =>
            h(
              'div',
              { class: 'day-card' },
              h('p', { class: 'day-name' }, day.short),
              PARTS.map((part) => {
                const slot = slotFor(day, part);
                const off = D.disabled.includes(slot.id);
                const on = picked.some((p) => p.id === slot.id);
                return h(
                  'button',
                  {
                    class: `slot${off ? ' slot-off' : ''}${on ? ' picked' : ''}`,
                    disabled: off,
                    'aria-pressed': off ? null : String(on),
                    'aria-label': `${day.short} ${off ? X.taken : part.label}`,
                    onclick: () => {
                      ctx.sound('tap');
                      picked = on
                        ? picked.filter((p) => p.id !== slot.id)
                        : [...picked, slot].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                      renderPicker();
                    },
                  },
                  part.label,
                  off ? h('span', { class: 'slot-taken' }, X.taken) : null,
                );
              }),
            ),
          ),
        ),
        h('div', { class: 'actions center halfday-validate' }, validate),
      );
    }

    const mailHref = (slots) =>
      `mailto:${D.leaEmail}?subject=${encodeURIComponent(D.emailSubject)}&body=${encodeURIComponent(
        t(X.mailBody, { when: describe(slots) }),
      )}`;

    function lockAndContinue(slots) {
      ctx.update({ slots: slots.map(({ id, day, part }) => ({ id, day, part })) });
      area.replaceChildren(h('p', { class: 'locked-choice' }, t(X.locked, { when: describe(slots) })));
      ctx.onSolved();
    }

    function renderConfirm() {
      const slots = picked;
      ctx.sound('tap');
      const actions = h('div', { class: 'actions' });
      // Without a Formspree form, go straight to the e-mail: no failed attempt first.
      const primary = D.formspreeEndpoint
        ? h('button', { class: 'btn btn-primary', onclick: () => send(slots, primary) }, X.send)
        : h(
            'a',
            {
              class: 'btn btn-primary',
              href: mailHref(slots),
              onclick: () =>
                setTimeout(
                  () =>
                    actions.replaceChildren(
                      h('button', { class: 'btn btn-primary', onclick: () => lockAndContinue(slots) }, X.continueAnyway),
                      h('a', { class: 'btn btn-ghost', href: mailHref(slots) }, X.mailAgain),
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
          h('p', { class: 'confirm-text' }, t(X.confirm, { When: capitalise(describe(slots)) })),
          D.formspreeEndpoint ? null : h('p', { class: 'muted' }, X.mailIntro),
          actions,
        ),
      );
      primary.focus();
    }

    async function send(slots, btn) {
      btn.disabled = true;
      btn.textContent = X.sending;
      const payload = {
        _subject: D.emailSubject,
        choix: describe(slots),
        creneaux: slots.map((s) => s.id).join(', '),
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
        ctx.update({ slots: slots.map(({ id, day, part }) => ({ id, day, part })) });
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
            h('a', { class: 'btn btn-primary', href: mailHref(slots) }, X.mailButton),
            h('button', { class: 'btn btn-ghost', onclick: () => lockAndContinue(slots) }, X.continueAnyway),
          ),
        ),
      );
    }

    renderPicker();
  },
};
