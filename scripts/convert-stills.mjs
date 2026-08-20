import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets', 'project');
const publicDir = path.join(root, 'public', 'projects');

const projects = [
  ['Bank Muscat - Gamer', 'bank-muscat-the-gamer'],
  ['Foreigners Only', 'foreigners-only'],
  ['Golf Links - Nature of Luxury', 'golf-links'],
  ['Yamaha Speed girl', 'yamaha-speed-girl'],
  ['Yiti - Dynamic Harmony', 'yiti-dynamic-harmony']
];

const numericCompare = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

for (const [folder, slug] of projects) {
  const srcDir = path.join(assetsDir, folder);
  if (!fs.existsSync(srcDir)) {
    console.warn(`[convert-stills] missing source folder: ${folder}`);
    continue;
  }
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.png$/i.test(f))
    .sort(numericCompare);
  const destDir = path.join(publicDir, slug);
  fs.mkdirSync(destDir, { recursive: true });
  const existing = fs.existsSync(destDir)
    ? fs.readdirSync(destDir).filter((f) => f.startsWith('still-') && f.endsWith('.webp'))
    : [];
  for (const f of existing) fs.rmSync(path.join(destDir, f));
  for (let i = 0; i < files.length; i++) {
    const out = path.join(destDir, `still-${String(i + 1).padStart(2, '0')}.webp`);
    await sharp(path.join(srcDir, files[i]))
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    console.log(`[convert-stills] ${folder}/${files[i]} -> ${path.relative(root, out)}`);
  }
}