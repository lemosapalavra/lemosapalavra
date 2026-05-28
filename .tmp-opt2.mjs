import sharp from "sharp";
import fs from "fs";
import path from "path";

async function optimizeDir(dir, maxW, quality) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let saved = 0;
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { await optimizeDir(p, maxW, quality); continue; }
    if (!/\.(png|jpg|jpeg|webp)$/i.test(e.name)) continue;
    const stat = fs.statSync(p);
    if (stat.size < 200 * 1024) continue;
    try {
      const ext = path.extname(e.name).toLowerCase();
      let pipeline = sharp(p).resize({ width: maxW, withoutEnlargement: true });
      const buf = ext === ".jpg" || ext === ".jpeg"
        ? await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
        : ext === ".webp"
          ? await pipeline.webp({ quality }).toBuffer()
          : await pipeline.png({ quality, compressionLevel: 9, palette: true }).toBuffer();
      if (buf.length < stat.size * 0.9) {
        fs.writeFileSync(p, buf);
        saved += stat.size - buf.length;
        console.log(`${p}: ${(stat.size/1024).toFixed(0)} -> ${(buf.length/1024).toFixed(0)} KB`);
      }
    } catch (e) { console.warn("skip", p, e.message); }
  }
  return saved;
}

const a = await optimizeDir("src/assets", 1100, 78) || 0;
const b = await optimizeDir("src/assets/album", 900, 78) || 0;
console.log("done");
