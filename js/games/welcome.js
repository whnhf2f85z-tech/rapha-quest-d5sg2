import { h, t } from '../ui.js';

export default {
  id: 'welcome',
  mount(el, ctx) {
    const W = ctx.C.welcome;
    const resuming = ctx.state().reached > 0;
    el.append(
      h(
        'section',
        { class: 'welcome' },
        h('p', { class: 'kicker' }, W.kicker),
        h('h1', { class: 'welcome-title', tabindex: '-1' }, t(W.title, { name: ctx.C.playerName })),
        h('p', { class: 'welcome-subtitle' }, W.subtitle),
        h('div', { class: 'ornament', 'aria-hidden': 'true' }, '✦'),
        h('p', { class: 'welcome-rules' }, W.rules),
        h('p', { class: 'welcome-details' }, W.details),
        h(
          'button',
          {
            class: 'btn btn-primary btn-large',
            onclick: () => {
              if (resuming) ctx.goCurrent();
              else {
                ctx.onSolved({ footer: false, celebrate: false });
                ctx.goNext();
              }
            },
          },
          resuming ? W.resume : W.start,
        ),
      ),
    );
  },
};
