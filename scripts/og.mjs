// Una tantum: node scripts/og.mjs -> public/og.png (1200x630). Usa sharp (gia' in node_modules).
// libvips non legge .woff: lo scompatto in .ttf (temp) con zlib, senza dipendenze.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { tmpdir } from "node:os";
import { join } from "node:path";

const cfg = readFileSync("src/config.ts", "utf8");
const pick = (k) => cfg.match(new RegExp(`^ *${k}: "(.*?)",`, "m"))[1];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function woffToTtf(path) {
  const w = readFileSync(path), n = w.readUInt16BE(12);
  const out = [Buffer.alloc(12 + n * 16)];
  out[0].writeUInt32BE(w.readUInt32BE(4), 0);
  out[0].writeUInt16BE(n, 4);
  let off = out[0].length;
  for (let i = 0; i < n; i++) {
    const e = 44 + i * 20, o = w.readUInt32BE(e + 4), c = w.readUInt32BE(e + 8), l = w.readUInt32BE(e + 12);
    const data = c < l ? inflateSync(w.subarray(o, o + c)) : w.subarray(o, o + l);
    const d = 12 + i * 16;
    w.copy(out[0], d, e, e + 4);
    out[0].writeUInt32BE(w.readUInt32BE(e + 16), d + 4);
    out[0].writeUInt32BE(off, d + 8);
    out[0].writeUInt32BE(l, d + 12);
    const pad = Buffer.alloc((4 - (l % 4)) % 4);
    out.push(data, pad);
    off += l + pad.length;
  }
  const ttf = join(tmpdir(), path.split("/").pop().replace(".woff", ".ttf"));
  writeFileSync(ttf, Buffer.concat(out));
  return ttf;
}

const testo = (text, woff, font, color) =>
  sharp({ text: { text: `<span foreground="${color}">${esc(text)}</span>`, font, fontfile: woffToTtf(`node_modules/@fontsource/${woff}.woff`), width: 1040, dpi: 72, rgba: true } })
    .png().toBuffer();

const nome = await testo(pick("nome"), "newsreader/files/newsreader-latin-500-normal", "Newsreader Medium 64", "#F7F5EF");
const desc = await testo(pick("descrizione"), "ibm-plex-sans/files/ibm-plex-sans-latin-400-normal", "IBM Plex Sans 32", "#CFDDD5");
const [hn, hd] = await Promise.all([nome, desc].map(async (b) => (await sharp(b).metadata()).height));
const top = Math.round((630 - (hn + 24 + hd)) / 2);

await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#1F5F4A" } })
  .composite([{ input: nome, left: 80, top }, { input: desc, left: 80, top: top + hn + 24 }])
  .png().toFile("public/og.png");
