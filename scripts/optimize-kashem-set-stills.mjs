import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kashemSetSrc = path.join(root, 'assets', 'project', 'A Thing About Kashem', 'Set Photos');
const kashemDest = path.join(root, 'public', 'projects', 'a-thing-about-kashem');

fs.mkdirSync(kashemDest, { recursive: true });

async function processSetStills() {
  if (!fs.existsSync(kashemSetSrc)) {
    console.error('Source set photos folder not found:', kashemSetSrc);
    return;
  }

  const files = fs
    .readdirSync(kashemSetSrc)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  console.log(`Optimizing ${files.length} Kashem set stills for ultra-fast, smooth performance...`);

  for (let i = 0; i < files.length; i++) {
    const srcFile = path.join(kashemSetSrc, files[i]);
    const destName = `set-${String(i + 1).padStart(2, '0')}.jpg`;
    const destFile = path.join(kashemDest, destName);

    const statsBefore = fs.statSync(srcFile);

    // 1600px width max at 83% quality with mozjpeg compression
    await sharp(srcFile)
      .resize(1600, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 83, progressive: true, mozjpeg: true })
      .toFile(destFile);

    const statsAfter = fs.statSync(destFile);
    console.log(`[${i + 1}/${files.length}] ${destName}: ${(statsAfter.size / 1024).toFixed(0)} KB (Original: ${(statsBefore.size / 1024 / 1024).toFixed(2)} MB)`);
  }

  console.log('Kashem set stills optimized for silky smooth 60fps performance!');
}

processSetStills().catch((err) => {
  console.error('Error optimizing Kashem set stills:', err);
  process.exit(1);
});
