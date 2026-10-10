// Small localStorage wrapper. Every access is guarded: in a private window or
// with storage blocked, the game still works (it just won't remember).

const KEY = 'rapha-quest-v1';

const fresh = () => ({
  reached: 0, // highest stage index unlocked (0 = Accueil)
  started: false,
  clues: [], // indexes of unlocked clues (0–5)
  games: {}, // per-game saved state, keyed by game id
  slot: null, // chosen half-day { id, day, part }
  card: null, // decrypted pickup card, once solved
  sound: false,
});

let state = fresh();

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...fresh(), ...JSON.parse(raw) };
  } catch {
    state = fresh();
  }
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep playing in memory */
  }
}

export function reset() {
  state = fresh();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function get() {
  return state;
}

export function update(patch) {
  Object.assign(state, patch);
  save();
}

// Per-game state helpers
export function gameState(id) {
  return state.games[id];
}

export function setGameState(id, value) {
  state.games[id] = value;
  save();
}
