/**
 * Tabela central de recompensas em moedinhas.
 * Toda a interface (badges) e todo o crédito real de moedas devem usar
 * estes valores, para não haver incoerência entre o que é mostrado
 * e o que o usuário realmente recebe.
 */
export const COINS = {
  /** Devocional do dia */
  devocional: 2,
  /** Dedicatória (assistir + ouvir por completo) */
  dedicatoria: 5,

  // Vídeos por categoria
  video: 3,
  genesis: 3,
  jesus: 5,
  filme: 3,
  serie: 3,
  musica: 3,
  louvor: 5,

  // Atividades
  quiz: 5,
  memory: 5,
  coloring: 3,
  jigsaw: 5,
  wordsearch: 5,
  circles: 5,
  connect: 6,
  differences: 5,
  count: 6,
  paint: 6,
  draw: 5,
  crossword: 6,
  spot: 5,

} as const;

export const DEDICATORIA_COINS = COINS.dedicatoria;
export const DEVO_COINS = COINS.devocional;
