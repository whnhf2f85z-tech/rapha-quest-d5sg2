// Hashing and encryption helpers (Web Crypto API).
// Shared by the site and by tools/hash.html, so both always normalise the same way.

const enc = new TextEncoder();
const dec = new TextDecoder();
const PBKDF2_ITERATIONS = 150000;

// Lowercase, strip accents, then drop everything that is not a letter or digit
// (spaces, apostrophes, hyphens, punctuation). « L'Étoile d'Or » → « letoiledor ».
export function normalise(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function toBase64(bytes) {
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

function fromBase64(b64) {
  const s = atob(b64);
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

export async function sha256(text) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(text)));
}

// Hash of the normalised answer — this is what goes into content.js.
export async function hashAnswer(text) {
  return sha256(normalise(text));
}

// True if the answer matches one of the stored hashes.
export async function checkAnswer(text, hashes) {
  const h = await hashAnswer(text);
  return hashes.includes(h);
}

async function deriveKey(answer, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(normalise(answer)), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// Encrypts any JSON-able object with a key derived from the answer.
// Output: "salt.iv.ciphertext", all base64.
export async function encryptWithAnswer(obj, answer) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(answer, salt);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj)));
  return [toBase64(salt), toBase64(iv), toBase64(new Uint8Array(data))].join('.');
}

// Returns the decrypted object, or null if the answer is wrong.
export async function decryptWithAnswer(blob, answer) {
  try {
    const [salt, iv, data] = blob.split('.').map(fromBase64);
    const key = await deriveKey(answer, salt);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return JSON.parse(dec.decode(plain));
  } catch {
    return null;
  }
}
