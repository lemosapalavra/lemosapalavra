// Imagens geradas por IA, mapeadas por (categoria, índice 0-based).
// Aceita tanto assets externalizados (*.png.asset.json) quanto PNGs locais gerados agora.
const assetJsonModules = import.meta.glob("@/assets/album/generated/*.png.asset.json", {
  eager: true,
}) as Record<string, { default: { url: string } }>;

const pngModules = import.meta.glob("@/assets/album/generated/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const map: Record<string, string> = {};

// Local PNGs are a fallback for categories that don't have a CDN-hosted artwork yet.
for (const [path, url] of Object.entries(pngModules)) {
  const m = path.match(/\/generated\/([a-z]+)-(\d+)\.png$/);
  if (!m) continue;
  const cat = m[1];
  const idx = parseInt(m[2], 10) - 1;
  map[`${cat}:${idx}`] = url;
}

// CDN .asset.json pointers (curated Pixar artworks) take priority over local placeholders.
for (const [path, mod] of Object.entries(assetJsonModules)) {
  const m = path.match(/\/generated\/([a-z]+)-(\d+)\.png\.asset\.json$/);
  if (!m) continue;
  const cat = m[1];
  const idx = parseInt(m[2], 10) - 1;
  map[`${cat}:${idx}`] = mod.default.url;
}

export function generatedStickerImage(categoryKey: string, index: number): string | undefined {
  return map[`${categoryKey}:${index}`];
}

