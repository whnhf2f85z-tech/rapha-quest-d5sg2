// Leaflet + OpenStreetMap helpers (Leaflet is loaded as a global script in index.html).

export function haversine(a, b) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversine(
      { lat: points[i - 1][0], lng: points[i - 1][1] },
      { lat: points[i][0], lng: points[i][1] },
    );
  }
  return total;
}

// `fit` (optional): bounds to fit once the container has its final size.
// `plain: true` draws no background map at all (only what the game adds),
// like travle.earth: no place names to give the answer away.
export function createMap(el, { lat, lng, zoom = 13 }, fit = null, { plain = false } = {}) {
  const map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25 }).setView([lat, lng], zoom);
  if (plain) el.classList.add('map-plain');
  else
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  // The stage fades in, so the container size settles a moment later.
  const settle = () => {
    map.invalidateSize();
    const bounds = typeof fit === 'function' ? fit() : fit;
    if (bounds) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
  };
  settle();
  setTimeout(settle, 400);
  return map;
}

// An elegant pin made with CSS instead of Leaflet's default image.
export function pinIcon(kind = '') {
  return L.divIcon({
    className: '',
    html: `<span class="pin ${kind}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

export function labelIcon(text, kind = '') {
  const span = document.createElement('span');
  span.className = `map-label ${kind}`;
  span.textContent = text;
  return L.divIcon({ className: '', html: span.outerHTML, iconSize: null, iconAnchor: [0, 0] });
}

// A pin she can drag to fine-tune, and remove with a right-click or the small
// bin on its side (phones have no right-click). Calls onRemove once removed.
export function editablePin(map, latlng, { deleteLabel, onRemove }) {
  const marker = L.marker(latlng, {
    icon: L.divIcon({
      className: '',
      html: `<span class="pin-wrap"><span class="pin"></span><button type="button" class="pin-delete" aria-label="${deleteLabel}" title="${deleteLabel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    }),
    keyboard: false,
    draggable: true,
  }).addTo(map);
  const remove = () => {
    marker.remove();
    onRemove();
  };
  marker.on('contextmenu', (e) => {
    L.DomEvent.preventDefault(e.originalEvent);
    remove();
  });
  marker.on('click', (e) => {
    if (e.originalEvent.target.closest('.pin-delete')) remove();
  });
  // Once the answer is found, the pin stays put.
  marker.lock = () => {
    marker.dragging?.disable();
    marker.off('contextmenu').off('click');
    marker.getElement()?.querySelector('.pin-delete')?.remove();
  };
  return marker;
}
