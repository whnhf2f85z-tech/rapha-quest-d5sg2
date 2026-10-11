import { h, t, invitationCard } from '../ui.js';
import { confetti } from '../fx.js';

// The « Zizou » goal: a lobbed ball into the net, then « BUT ! ». Static SVG,
// animated in CSS (so it simply shows the final picture when motion is reduced).
const GOAL_SVG = `
<svg viewBox="0 0 320 180" aria-hidden="true">
  <defs>
    <pattern id="net" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M0 0L10 10M10 0L0 10" stroke="#c9c2b8" stroke-width="1"/>
    </pattern>
  </defs>
  <rect class="goal-grass" x="0" y="142" width="320" height="38"/>
  <path class="goal-line" d="M0 142H320"/>
  <g class="goal-net"><path d="M205 62L298 74V142H205Z" fill="url(#net)"/></g>
  <g class="goal-ball-x"><g class="goal-ball-y"><g class="goal-ball">
    <circle cx="40" cy="132" r="10" fill="#fffdfa" stroke="#2b2a33" stroke-width="1.5"/>
    <path d="M40 127l4 3-1.5 5h-5L36 130z" fill="#2b2a33"/>
  </g></g></g>
  <path class="goal-posts" d="M205 142V60H300V142"/>
</svg>`;

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

    const shout = h('span', { class: 'goal-shout' }, B.goalShout);
    const goal = h('button', { class: 'goal', type: 'button', 'aria-label': B.goalLabel, title: B.goalReplay }, shout);
    goal.insertAdjacentHTML('afterbegin', GOAL_SVG);
    // Tap to replay: restart every animation in the scene.
    goal.addEventListener('click', () => {
      goal.classList.remove('play');
      void goal.offsetWidth;
      goal.classList.add('play');
      confetti();
    });
    goal.classList.add('play');

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
        goal,
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
