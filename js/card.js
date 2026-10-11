// The pickup invitation, decrypted again from content.js each time it is shown,
// so a later change to its text shows up even for someone who already solved
// the final. Falls back to the copy saved when she found the name.

import { hashAnswer, decryptWithAnswer } from './crypto.js';

export async function currentCard(C, st) {
  // The name she typed; older saves only have the card, whose shop name works too.
  for (const key of [st.cardKey, st.card?.name].filter(Boolean)) {
    const hash = await hashAnswer(key);
    const match = C.final.accepted.find((a) => a.hash === hash);
    const card = match && (await decryptWithAnswer(match.card, key));
    if (card) return card;
  }
  return st.card;
}
