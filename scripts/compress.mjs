/**
 * compress.mjs — compress PNG/JPG in public/images/ before build
 * uses a manifest to skip already-processed files
 */
import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join, extname, relative } from 'path';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR  = join(__dirname, '..', 'public', 'images');
const MANIFEST    = join(__dirname, '..', '.compress-manifest.json');
const PNG_QUALITY = 85;
const JPG_QUALITY = 85;

async function walk(dir) {
  let files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files = files.concat(await walk(full));
    else files.push(full);
  }
  return files;
}

async function main() {
  let manifest = {};
  try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch {}

  const all     = await walk(PUBLIC_DIR);
  const targets = all.filter(f => /\.(png|jpe?g)$/i.test(f));

  let compressed = 0, skipped = 0, savedBytes = 0;

  for (const file of targets) {
    const key   = relative(PUBLIC_DIR, file);
    const info  = await stat(file);
    const mtime = String(info.mtimeMs);

    if (manifest[key] === mtime) { skipped++; continue; }

    const ext = extname(file).toLowerCase();
    try {
      let pipeline = sharp(file);
      if (ext === '.png') pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
      else                pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });

      const buf = await pipeline.toBuffer();
      if (buf.length < info.size) {
        await writeFile(file, buf);
        savedBytes += info.size - buf.length;
        compressed++;
        console.log(`  OK ${key}: ${(info.size/1024).toFixed(0)}KB -> ${(buf.length/1024).toFixed(0)}KB`);
      } else {
        skipped++;
      }
      manifest[key] = String((await stat(file)).mtimeMs);
    } catch (e) {
      console.warn(`  skip ${key}: ${e.message}`);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nDone: ${compressed} compressed, ${skipped} skipped, ${(savedBytes/1024).toFixed(0)}KB saved`);
}

main().catch(e => { console.error(e); process.exit(1); });
