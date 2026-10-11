// Fastest route, free style. She taps anywhere on the map (the whole world) to
// add stop cities, in order. Each tap is named with OpenStreetMap's geocoder
// (Nominatim). The real fastest driving route comes from the public OSRM
// router (real roads, real speeds). Both are free and need no key.
// Won when she has at least minStops cities, all within corridorKm of that
// fastest route, in the right order. Nobody has to write the answer down.

import { h, t, stageHeader, messageLine, formatNumber } from '../ui.js';
import { createMap, labelIcon } from '../map.js';

const GEOCODER = 'https://nominatim.openstreetmap.org/reverse';
const ROUTER = 'https://router.project-osrm.org/route/v1/driving/';

function formatDuration(min) {
  const total = Math.round(min);
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return hours ? `${hours} h ${String(rest).padStart(2, '0')}` : `${rest} min`;
}

// Nominatim asks for at most one request per second: queue them.
let lastLookup = 0;
let queue = Promise.resolve();
function cityAt(lat, lng) {
  const job = queue.then(async () => {
    const wait = Math.max(0, lastLookup + 1100 - Date.now());
    if (wait) await new Promise((r) => setTimeout(r, wait));
    lastLookup = Date.now();
    const url = `${GEOCODER}?format=jsonv2&zoom=10&accept-language=fr&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('geocoder');
    const d = await res.json();
    if (d.error) return null;
    const a = d.address || {};
    return a.city || a.town || a.village || a.municipality || a.hamlet || d.name || a.county || a.state || null;
  });
  queue = job.catch(() => {});
  return job;
}

async function fastestRoute(from, to) {
  const coords = [from, to].map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
  const res = await fetch(`${ROUTER}${coords}?overview=simplified&geometries=geojson`);
  const d = await res.json();
  if (d.code !== 'Ok' || !d.routes?.length) throw new Error('router');
  const r = d.routes[0];
  return {
    km: r.distance / 1000,
    min: r.duration / 60,
    line: r.geometry.coordinates.map(([lng, lat]) => [+lat.toFixed(4), +lng.toFixed(4)]),
  };
}

// Distance (km) from a point to the route, and how far along the route it sits.
function placeOnRoute(p, line) {
  const kx = 111.32 * Math.cos((p.lat * Math.PI) / 180);
  const ky = 110.57;
  let best = { km: Infinity, at: 0 };
  for (let i = 1; i < line.length; i++) {
    const ax = (line[i - 1][1] - p.lng) * kx;
    const ay = (line[i - 1][0] - p.lat) * ky;
    const bx = (line[i][1] - p.lng) * kx;
    const by = (line[i][0] - p.lat) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1e-9;
    const u = Math.min(1, Math.max(0, -(ax * dx + ay * dy) / len2));
    const km = Math.hypot(ax + u * dx, ay + u * dy);
    if (km < best.km) best = { km, at: i - 1 + u };
  }
  return best;
}

export default {
  id: 'route',
  mount(el, ctx) {
    const R = ctx.C.route;
    const X = R.text;
    const saved = ctx.load() || {};
    let stops = saved.stops || [];
    let best = saved.best || null;
    let done = ctx.readOnly || !!saved.won;
    let busy = false;

    const mapEl = h('div', {
      class: 'map map-tall',
      role: 'application',
      'aria-label': X.title,
    });
    const msg = messageLine();
    const panel = h('div', { class: 'trip-panel' });
    el.append(
      stageHeader(
        X.title,
        t(X.instruction, {
          start: R.start.name,
          end: R.end.name,
          n: R.minStops,
        }),
      ),
      mapEl,
      panel,
      msg,
    );

    const ends = L.latLngBounds([
      [R.start.lat, R.start.lng],
      [R.end.lat, R.end.lng],
    ]);
    const map = createMap(mapEl, { lat: R.start.lat, lng: R.start.lng, zoom: 6 }, ends.pad(0.3));
    map.setMinZoom(2);

    for (const [p, label] of [
      [R.start, X.startLabel],
      [R.end, X.endLabel],
    ]) {
      L.marker([p.lat, p.lng], {
        icon: labelIcon(`${label} · ${p.name}`, 'town-label is-here'),
        keyboard: false,
        interactive: false,
        zIndexOffset: 3000,
      }).addTo(map);
    }

    const layer = L.layerGroup().addTo(map);
    const persist = () => ctx.save({ stops, best, won: done && !ctx.readOnly ? true : saved.won });

    function draw() {
      layer.clearLayers();
      // No line while she plays (a straight line would hint at the way);
      // the real fastest route is drawn once she has found it.
      if (done && best) {
        L.polyline(best.line, {
          color: '#94474e',
          weight: 5,
          opacity: 0.9,
        }).addTo(layer);
      }
      stops.forEach((s, i) => {
        L.marker([s.lat, s.lng], {
          icon: labelIcon(`${i + 1}. ${s.name}`, 'town-label is-visited'),
          keyboard: false,
          interactive: false,
          zIndexOffset: 2000,
        }).addTo(layer);
      });
    }

    function render() {
      draw();
      panel.replaceChildren(
        h(
          'div',
          { class: 'trip-panel-inner' },
          h(
            'p',
            { class: 'trip-trail' },
            h('span', { class: 'trip-trail-label' }, t(X.stopsLabel, { n: stops.length, min: R.minStops })),
            [R.start, ...stops, R.end].map((p, i) => [
              i ? h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→') : null,
              h('span', {}, p.name),
            ]),
          ),
          stops.length
            ? h(
                'ol',
                { class: 'stop-list' },
                stops.map((s, i) =>
                  h(
                    'li',
                    {},
                    h('span', {}, s.name),
                    done
                      ? null
                      : h(
                          'button',
                          {
                            class: 'stop-remove',
                            'aria-label': t(X.remove, { city: s.name }),
                            onclick: () => removeAt(i),
                          },
                          '×',
                        ),
                  ),
                ),
              )
            : h('p', { class: 'muted' }, X.noStops),
          done
            ? null
            : h(
                'div',
                { class: 'actions' },
                h(
                  'button',
                  {
                    class: 'btn btn-primary',
                    onclick: validate,
                    disabled: busy,
                  },
                  X.validate,
                ),
                stops.length
                  ? h(
                      'button',
                      {
                        class: 'btn btn-ghost',
                        onclick: () => removeAt(stops.length - 1),
                      },
                      X.undo,
                    )
                  : null,
                stops.length ? h('button', { class: 'btn btn-ghost', onclick: restart }, X.restart) : null,
              ),
        ),
      );
    }

    function changed() {
      persist();
      render();
    }

    function removeAt(i) {
      stops = stops.filter((_, k) => k !== i);
      msg.show('');
      changed();
    }

    function restart() {
      stops = [];
      msg.show('');
      changed();
    }

    map.on('click', async (e) => {
      if (done) return;
      if (stops.length >= R.maxStops) return msg.show(t(X.tooManyStops, { n: R.maxStops }), 'error');
      const { lat, lng } = e.latlng.wrap();
      msg.show(X.looking);
      let name;
      try {
        name = await cityAt(lat, lng);
      } catch {
        return msg.show(X.offline, 'error');
      }
      if (!name) return msg.show(X.noCity, 'error');
      if (stops.some((s) => s.name === name)) return msg.show(t(X.duplicate, { city: name }), 'error');
      stops = [...stops, { name, lat: +lat.toFixed(4), lng: +lng.toFixed(4) }];
      ctx.sound('tap');
      msg.show('');
      changed();
    });

    async function validate() {
      if (busy || done) return;
      if (stops.length < R.minStops) return msg.show(t(X.tooFewStops, { n: R.minStops }), 'error');
      busy = true;
      render();
      msg.show(X.computing);
      try {
        best ||= await fastestRoute(R.start, R.end);
      } catch {
        busy = false;
        render();
        return msg.show(X.offline, 'error');
      }
      busy = false;
      const places = stops.map((s) => placeOnRoute(s, best.line));
      const off = places.filter((p) => p.km > R.corridorKm).length;
      const ordered = places.every((p, i) => i === 0 || p.at > places[i - 1].at);

      if (!off && ordered) {
        done = true;
        persist();
        render();
        msg.show(
          t(X.right, {
            km: formatNumber(Math.round(best.km)),
            time: formatDuration(best.min),
          }),
          'success',
        );
        ctx.onSolved();
        return;
      }
      persist();
      render();
      ctx.sound('wrong');
      if (off) msg.show(off === 1 ? X.offOne : t(X.offMany, { n: off }), 'error');
      else msg.show(X.disorder, 'error');
    }

    render();
    if (done && best) {
      setTimeout(() => map.fitBounds(L.latLngBounds(best.line), { padding: [60, 60] }), 450);
      msg.show(
        t(X.right, {
          km: formatNumber(Math.round(best.km)),
          time: formatDuration(best.min),
        }),
        'success',
      );
    }
    return () => map.remove();
  },
};
