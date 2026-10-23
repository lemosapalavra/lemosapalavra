/** Choose only a clearly identified feminine Portuguese voice; never silently fall back to a masculine voice. */
export function getLiaFeminineVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const feminine = /maria|francisca|luciana|helena|fernanda|camila|vit[oó]ria|female|feminina|mulher|joana|ines|in[eê]s|raquel|brenda|mariana|isabela|samantha|alice|sofia|sophia|google portugu[eê]s do brasil/i;
  const masculine = /male|masculin|homem|daniel|ricardo|felipe|paulo|jo[aã]o|antonio|ant[oô]nio|carlos|pedro/i;
  const pt = voices.filter(v => /^pt(-|$)/i.test(v.lang));
  return pt.find(v => feminine.test(v.name) && !masculine.test(v.name)) || null;
}
