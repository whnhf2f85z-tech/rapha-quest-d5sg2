import { h, t, invitationCard } from '../ui.js';
import { confetti } from '../fx.js';

export default {
  id: 'birthday',
  mount(el, ctx) {
    const B = ctx.C.birthday;
    const st = ctx.state();

    const media = B.video
      ? h('video', { class: 'birthday-media', src: B.video, controls: true, playsinline: true, preload: 'metadata' })
      : B.photo
        ? h('img', { class: 'birthday-media', src: B.photo, alt: '' })
        : null;

    const dialog = h('dialog', { class: 'sheet' });
    dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());

    function openCard() {
      dialog.replaceChildren(
        h(
          'div',
          { class: 'notebook-inner' },
          invitationCard(st.card, st.slots, ctx.C.final.text),
          h('button', { class: 'btn btn-ghost', onclick: () => dialog.close() }, ctx.common.close),
        ),
      );
      dialog.showModal();
    }

    el.append(
      h(
        'section',
        { class: 'birthday' },
        h('h1', { class: 'birthday-title', tabindex: '-1' }, t(B.title, { name: ctx.C.playerName })),
        media,
        h('p', { class: 'birthday-message' }, B.message),
        h('p', { class: 'birthday-signature' }, B.signature),
        st.card ? h('button', { class: 'link-btn', onclick: openCard }, B.reopenCard) : null,
      ),
      dialog,
    );

    confetti({ count: 140, duration: 2200 });
    ctx.sound('win');
    const again = setTimeout(() => confetti({ count: 120, duration: 2200 }), 1300);
    return () => clearTimeout(again);
  },
};
