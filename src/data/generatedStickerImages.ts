// Imagens geradas por IA, mapeadas por (categoria, índice 0-based).
// Quando presente, sobrescreve a arte padrão para que o desenho combine com o nome.
const modules = import.meta.glob("@/assets/album/generated/*.png.asset.json", {
  eager: true,
}) as Record<string, { default: { url: string } }>;

const map: Record<string, string> = {};
for (const [path, mod] of Object.entries(modules)) {
  // e.g. .../generated/criacao-1.png.asset.json
  const m = path.match(/\/generated\/([a-z]+)-(\d+)\.png\.asset\.json$/);
  if (!m) continue;
  const cat = m[1];
  const idx = parseInt(m[2], 10) - 1;
  map[`${cat}:${idx}`] = mod.default.url;
}

export function generatedStickerImage(categoryKey: string, index: number): string | undefined {
  return map[`${categoryKey}:${index}`];
}
