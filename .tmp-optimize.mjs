import sharp from "sharp";
import fs from "fs";
import path from "path";

const DIR = "src/assets";
const files = fs.readdirSync(DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

const ICON_PATTERNS = /^(icon-|avatar-|lemos-play-logo|logo-central|louvor-|aleluia-cover|palavra-eterna|ser-fiel)/i;
const HERO_PATTERNS = /^(album-capa|dedicatoria-bg|pergaminho|pack-|historia-|grupo-|historia-nova)/i;

let savedTotal = 0;
for (const f of files) {
  const src = path.join(DIR, f);
  const stat = fs.statSync(src);
  if (stat.size < 250 * 1024) continue; // skip already small
  const isHero = HERO_PATTERNS.test(f);
  const maxW = isHero ? 1200 : 400;
  const quality = isHero ? 78 : 80;
  try {
    const buf = await sharp(src)
      .resize({ width: maxW, withoutEnlargement: true })
      .png({ quality, compressionLevel: 9, palette: !isHero })
      .toBuffer();
    if (buf.length < stat.size * 0.9) {
      fs.writeFileSync(src, buf);
      const saved = stat.size - buf.length;
      savedTotal += saved;
      console.log(`${f}: ${(stat.size/1024).toFixed(0)}KB -> ${(buf.length/1024).toFixed(0)}KB`);
    }
  } catch (e) {
    console.warn(`skip ${f}: ${e.message}`);
  }
}
console.log(`\nTotal saved: ${(savedTotal/1024/1024).toFixed(1)} MB`);
