/**
 * Leitura em voz alta com uma voz mais suave e calma (pt-BR).
 * Centraliza a escolha da voz e o ritmo usado em todo o site.
 */

const PREFERRED = [
  "daniel", "felipe", "ricardo", "antonio", "joão", "joao", "male", "homem",
  "google português do brasil", "microsoft daniel",
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

/** Aplica voz masculina suave, ritmo calmo e tom acolhedor a um utterance. */
export function applySoftVoice(u: SpeechSynthesisUtterance) {
  u.lang = "pt-BR";
  u.rate = 0.88;   // dicção mais pausada e articulada
  u.pitch = 0.72;  // voz masculina mais grave e aprofundada
  u.volume = 0.9;  // presença sem estridência
  const v = pickSoftVoice();
  if (v) u.voice = v;
  return u;
}

/** Divide o texto em trechos respeitando a pontuação (., !, ?, ;, :, ,). */
export function splitByPunctuation(text: string): { text: string; start: number; pause: number }[] {
  const parts: { text: string; start: number; pause: number }[] = [];
  const re = /[^.!?;:,\n]+[.!?;:,\n]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const chunk = m[0];
    if (!chunk.trim()) continue;
    // Sem pausas extras na pontuação — leitura contínua
    parts.push({ text: chunk, start: m.index, pause: 0 });
  }
  return parts.length ? parts : [{ text, start: 0, pause: 0 }];
}

/**
 * Fala o texto em trechos, com pausas naturais na pontuação.
 * onProgress recebe o índice absoluto do caractere atual.
 */
export function speakSoftly(
  text: string,
  opts: { from?: number; onProgress?: (charIndex: number) => void; onEnd?: () => void; onError?: () => void } = {}
) {
  const synth = window.speechSynthesis;
  if (!synth) { opts.onError?.(); return () => {}; }
  const from = Math.max(0, opts.from ?? 0);
  const chunks = splitByPunctuation(text).filter((c) => c.start + c.text.length > from);
  let cancelled = false;
  let i = 0;

  const next = () => {
    if (cancelled) return;
    if (i >= chunks.length) { opts.onEnd?.(); return; }
    const c = chunks[i++];
    const offset = Math.max(0, from - c.start);
    const piece = c.text.slice(offset);
    if (!piece.trim()) { next(); return; }
    // Sem considerar a pontuação: substitui por espaço (mesmo tamanho, índices preservados)
    const spoken = piece.replace(/[.,;:!?\u2026\u2014\u2013]/g, " ");
    const u = new SpeechSynthesisUtterance(spoken);
    applySoftVoice(u);
    u.onboundary = (e) => opts.onProgress?.(c.start + offset + (e.charIndex || 0));
    u.onend = () => { if (!cancelled) setTimeout(next, c.pause); };
    u.onerror = () => { if (!cancelled) opts.onError?.(); };
    synth.speak(u);
  };

  ensureVoicesLoaded(() => { synth.cancel(); next(); });
  return () => { cancelled = true; try { synth.cancel(); } catch {} };
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
