import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = ["public", "src/assets"];
const ignored = new Set(["node_modules", ".git", "dist", "build"]);
const quality = Math.max(1, Math.min(100, Number(process.env.WEBP_QUALITY || 90)));
const apply = process.argv.includes("--apply");
const replace = process.argv.includes("--update-references");
const originals = [];

async function walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch (err) { if (err.code === "ENOENT") return; throw err; }
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) originals.push(file);
  }
}
for (const root of roots) await walk(root);
let converted = 0, skipped = 0, saved = 0;
for (const file of originals) {
  const dest = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const stat = await fs.stat(file);
  try {
    const existing = await fs.stat(dest).catch(() => null);
    if (existing && existing.mtimeMs >= stat.mtimeMs) { skipped++; continue; }
    if (!apply) { console.log("[PREVIEW]", file, "->", dest); continue; }
    const output = await sharp(file, { animated: false }).webp({ quality, effort: 5 }).toBuffer();
    if (output.length >= stat.size) { console.log("[SKIP: not smaller]", file); skipped++; continue; }
    await fs.writeFile(dest, output);
    converted++; saved += stat.size - output.length;
    console.log("[OK]", dest, (output.length / 1024).toFixed(0) + " KB");
  } catch (error) { console.error("[ERROR]", file, error.message); process.exitCode = 1; }
}
if (replace) {
  console.error("Reference replacement is intentionally disabled: imports, CSS URLs and dynamically built paths need individual validation.");
  process.exitCode = 1;
}
console.log(JSON.stringify({ mode: apply ? "convert" : "preview", candidates: originals.length, converted, skipped, savedMB: +(saved / 1048576).toFixed(2) }, null, 2));
