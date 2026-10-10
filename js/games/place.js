// « Où est-ce ? »: drop a pin where the photo was taken, within 1 km.

import { h, t, stageHeader, messageLine, formatNumber } from '../ui.js';
import { createMap, haversine, pinIcon } from '../map.js';

export default {
  id: 'place',
  mount(el, ctx) {
    const P = ctx.C.place;
    const X = P.text;
    const target = { lat: P.lat, lng: P.lng };
    const saved = ctx.load() || { last: null, pin: null };
    let done = ctx.readOnly;
    let pin = null;

    const mapEl = h('div', { class: 'map', role: 'application', 'aria-label': X.title });
    const msg = messageLine();
    const submit = h('button', { class: 'btn btn-primary', onclick: check }, ctx.common.validate);

    el.append(
      stageHeader(X.title, X.instruction),
      h('figure', { class: 'place-photo' }, h('img', { src: P.image, alt: P.imageAlt })),
      mapEl,
      done ? null : h('div', { class: 'actions' }, submit),
      msg,
    );

    const map = createMap(mapEl, P.map);
    // The photo can be anywhere in the world: allow zooming out to the globe,
    // and zooming with the mouse wheel (it's a long way from planet to street).
    map.setMinZoom(2);
    map.scrollWheelZoom.enable();
    map.on('click', (e) => {
      if (done) return;
      setPin(e.latlng);
      ctx.sound('tap');
    });

    function setPin(latlng) {
      if (pin) pin.setLatLng(latlng);
      else pin = L.marker(latlng, { icon: pinIcon(), keyboard: false }).addTo(map);
    }

    function reveal(guess) {
      const real = L.marker([target.lat, target.lng], { icon: pinIcon('pin-true'), keyboard: false }).addTo(map);
      if (guess) {
        L.polyline([guess, [target.lat, target.lng]], { color: '#2b2a33', weight: 2, dashArray: '4 6' }).addTo(map);
        map.fitBounds(L.latLngBounds([guess, real.getLatLng()]), { padding: [60, 60], maxZoom: 16 });
      } else map.setView([target.lat, target.lng], 15);
    }

    function check() {
      if (done) return;
      if (!pin) return msg.show(X.noPin, 'error');
      const guess = pin.getLatLng().wrap();
      const d = haversine(guess, target);
      if (d <= P.radiusMeters) {
        done = true;
        submit.disabled = true;
        ctx.save({ ...saved, pin: [guess.lat, guess.lng] });
        reveal([guess.lat, guess.lng]);
        msg.show(t(X.right, { meters: formatNumber(Math.round(d)) }), 'success');
        ctx.onSolved();
        return;
      }
      ctx.sound('wrong');
      let trend = '';
      if (saved.last != null) trend = d < saved.last ? X.hotter : d > saved.last ? X.colder : X.same;
      saved.last = d;
      ctx.save(saved);
      msg.show(`${t(X.distance, { km: formatNumber(d / 1000, d < 10000 ? 1 : 0) })} ${trend}`.trim(), 'error');
    }

    if (done) {
      const g = saved.pin;
      if (g) setPin({ lat: g[0], lng: g[1] });
      reveal(g);
    }
    return () => map.remove();
  },
};
