/**
 * Leitura em voz alta com uma voz mais suave e calma (pt-BR).
 * Centraliza a escolha da voz e o ritmo usado em todo o site.
 */

const PREFERRED = [
  "luciana", "francisca", "maria", "helena", "fernanda", "camila", "joana",
  "google português do brasil", "microsoft maria", "female",
];

export function pickSoftVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    const pt = voices.filter((v) => /pt(-|_)?BR/i.test(v.lang) || /^pt/i.test(v.lang));
    const pool = pt.length ? pt : voices;
    for (const name of PREFERRED) {
      const hit = pool.find((v) => v.name.toLowerCase().includes(name));
      if (hit) return hit;
    }
    return pool[0] ?? null;
  } catch {
    return null;
  }
}

/** Aplica voz suave, ritmo calmo e tom acolhedor a um utterance. */
export function applySoftVoice(u: SpeechSynthesisUtterance) {
  u.lang = "pt-BR";
  u.rate = 0.82;   // mais devagar e calmo
  u.pitch = 1.08;  // tom levemente mais doce
  u.volume = 0.95;
  const v = pickSoftVoice();
  if (v) u.voice = v;
  return u;
}

/** Garante que a lista de vozes já foi carregada antes de falar. */
export function ensureVoicesLoaded(cb: () => void) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) { cb(); return; }
    if (synth.getVoices().length) { cb(); return; }
    const handler = () => { synth.removeEventListener("voiceschanged", handler); cb(); };
    synth.addEventListener("voiceschanged", handler);
    setTimeout(() => { synth.removeEventListener("voiceschanged", handler); cb(); }, 700);
  } catch { cb(); }
}
