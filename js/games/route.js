// Fastest route, travle.earth style. Starting from the Somme, she names the
// départements and cantons the fastest road to Zurich goes through, in order.
// Each guess is drawn on the map: green if it's the right next step, red if
// not (and then the trip starts again from the Somme). The expected steps are
// stored as hashes, so the answer is not readable in the code.

import { h, t, stageHeader, messageLine } from '../ui.js';
import { createMap } from '../map.js';
import { sha256, normalise } from '../crypto.js';

const COLOURS = { start: '#b5656b', end: '#2b2a33', ok: '#3f6b4f', ko: '#a33b3b' };
const OUTLINE = { color: '#b9b2a8', weight: 0.7, fill: false, interactive: false };

// « canton de Zurich », « département de la Marne » → « zurich », « marne »
function stripPrefix(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/^(le |la |les |l')?(canton|departement)( de la| de l'| des| du| de| d')?\s*/, '');
}

export default {
  id: 'route',
  mount(el, ctx) {
    const R = ctx.C.route;
    const X = R.text;
    const saved = ctx.load();
    let path = Array.isArray(saved?.path) ? saved.path : [];
    let done = ctx.readOnly || path.length === R.steps.length;
    let busy = false;

    const mapEl = h('div', { class: 'map map-tall', role: 'application', 'aria-label': X.title });
    const msg = messageLine();
    const trail = h('p', { class: 'trip-trail' });
    const field = h('input', {
      class: 'text-input',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'words',
      spellcheck: 'false',
      placeholder: X.placeholder,
      'aria-label': X.placeholder,
      list: 'route-regions',
    });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, X.add);
    const form = h('form', { class: 'answer-form' }, field, submit);
    const datalist = h('datalist', { id: 'route-regions' });

    el.append(stageHeader(X.title, X.instruction), mapEl, trail, done ? null : form, datalist, msg);

    const map = createMap(mapEl, { lat: 48.6, lng: 5.4, zoom: 6 }, null, { plain: true });
    map.setMinZoom(4);
    map.attributionControl.addAttribution('Contours : france-geojson, Click that ’hood');
    let regions = [];
    const byId = {};
    const layers = {};

    const paint = (id, colour, opacity = 0.55) =>
      layers[id]?.setStyle({ color: colour, weight: 1.5, fill: true, fillColor: colour, fillOpacity: opacity });
    const unpaint = (id) => layers[id]?.setStyle(OUTLINE);

    function find(text) {
      const exact = normalise(text);
      const stripped = normalise(stripPrefix(text));
      const names = (r) => [r.name, ...r.aliases].map(normalise);
      return (
        regions.find((r) => names(r).includes(exact)) ||
        regions.find((r) => names(r).includes(stripped)) ||
        null
      );
    }

    function renderTrail() {
      const ids = [R.start, ...path, done ? R.end : null].filter(Boolean);
      const parts = [
        ...ids.flatMap((id, i) => [
          i ? h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→') : null,
          h('span', {}, byId[id]?.name || ''),
        ]),
        done ? null : h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→ … →'),
        done ? null : h('span', { class: 'muted' }, byId[R.end]?.name || ''),
      ];
      trail.replaceChildren(...parts.filter(Boolean));
    }

    async function guess(text) {
      if (busy || done || !text.trim()) return;
      const region = find(text);
      if (!region) return msg.show(t(X.unknown, { name: text.trim() }), 'error');
      if (region.id === R.start || path.includes(region.id))
        return msg.show(t(X.already, { name: region.name }), 'error');
      field.value = '';
      const ok = (await sha256(`route:${region.id}`)) === R.steps[path.length];
      if (ok) {
        path = [...path, region.id];
        ctx.save({ path });
        paint(region.id, COLOURS.ok);
        ctx.sound('tap');
        if (path.length === R.steps.length) {
          done = true;
          form.remove();
          msg.show(X.won, 'success');
          renderTrail();
          ctx.onSolved();
          return;
        }
        msg.show(t(X.right, { name: region.name }), 'success');
        renderTrail();
        return;
      }
      // Wrong: show it in red, then back to the Somme.
      busy = true;
      submit.disabled = true;
      ctx.sound('wrong');
      paint(region.id, COLOURS.ko, 0.65);
      msg.show(t(X.wrong, { name: region.name }), 'error');
      setTimeout(() => {
        unpaint(region.id);
        path.forEach(unpaint);
        path = [];
        ctx.save({ path });
        busy = false;
        submit.disabled = false;
        renderTrail();
        field.focus();
      }, 1800);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      guess(field.value);
    });

    fetch('assets/data/regions.json')
      .then((r) => r.json())
      .then((data) => {
        regions = data;
        regions.forEach((r) => {
          byId[r.id] = r;
          const latlngs = r.shape.map((P) => P.map((ring) => ring.map(([x, y]) => [y, x])));
          layers[r.id] = L.polygon(latlngs, OUTLINE).addTo(map);
        });
        datalist.replaceChildren(
          ...[...regions]
            .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
            .map((r) => h('option', { value: r.name })),
        );
        paint(R.start, COLOURS.start);
        paint(R.end, COLOURS.end, 0.45);
        path.forEach((id) => paint(id, COLOURS.ok));
        map.fitBounds(layers[R.start].getBounds().extend(layers[R.end].getBounds()), { padding: [20, 20] });
        renderTrail();
        if (done) msg.show(X.won, 'success');
      })
      .catch(() => msg.show(ctx.common.loadError, 'error'));

    return () => map.remove();
  },
};
