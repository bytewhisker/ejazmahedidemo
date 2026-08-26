import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets', 'project');
const publicDir = path.join(root, 'public', 'projects');

const projects = [
  ['A THING ABOUT KASHEM', 'a-thing-about-kashem'],
  ['Al Mouj Golf', 'al-mouj-golf-10-years-of-golf'],
  ['Bank Muscat - Gamer', 'bank-muscat-the-gamer'],
  ['Changan - Magic Hour', 'changan-magic-hour'],
  ['Foreigners Only', 'foreigners-only'],
  ['Golf Links - Nature of Luxury', 'golf-links'],
  ['MAI - Nature\'s New Address', 'mai-natures-new-address'],
  ['Moshari', 'moshari'],
  ['OQGN', 'oqgn-unseen'],
  ['The Azura Within', 'azura-the-azura-within'],
  ['Yamaha Speed girl', 'yamaha-speed-girl'],
  ['Yiti - Dynamic Harmony', 'yiti-dynamic-harmony'],
  ['Last Night In Korea', 'last-night-in-korea']
];

const numericCompare = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

console.log('Copying pristine uncompressed original PNG stills to public/projects...');

for (const [folder, slug] of projects) {
  const srcDir = path.join(assetsDir, folder);
  if (!fs.existsSync(srcDir)) {
    console.warn(`[copy-stills] missing source folder: ${folder}`);
    continue;
  }
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.png$/i.test(f))
    .sort(numericCompare);
  const destDir = path.join(publicDir, slug);
  fs.mkdirSync(destDir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const srcFile = path.join(srcDir, files[i]);
    const out = path.join(destDir, `still-${String(i + 1).padStart(2, '0')}.png`);
    fs.copyFileSync(srcFile, out);
    console.log(`[copy-stills] ${folder}/${files[i]} -> ${path.relative(root, out)}`);
  }

  const setPhotosDir = path.join(srcDir, 'Set Photos');
  if (fs.existsSync(setPhotosDir)) {
    const setFiles = fs
      .readdirSync(setPhotosDir)
      .filter((f) => /\.png$/i.test(f))
      .sort(numericCompare);
    for (let i = 0; i < setFiles.length; i++) {
      const srcFile = path.join(setPhotosDir, setFiles[i]);
      const out = path.join(destDir, `set-${String(i + 1).padStart(2, '0')}.png`);
      fs.copyFileSync(srcFile, out);
      console.log(`[copy-stills] ${folder}/Set Photos/${setFiles[i]} -> ${path.relative(root, out)}`);
    }
  }
}

console.log('All pristine original PNG stills copied successfully!');
