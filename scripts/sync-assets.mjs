import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets');
const publicDir = path.join(root, 'public');
const srcAssetsDir = path.join(root, 'src', 'assets');

const copies = [
  ['web-loading.gif', path.join(publicDir, 'web-loading.gif')],
  ['project-loader.gif', path.join(publicDir, 'project-loader.gif')],
  ['Ejaz+Mehedi.png', path.join(srcAssetsDir, 'ejaz-portrait.png')]
];

for (const [name, dest] of copies) {
  const src = path.join(assetsDir, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[sync-assets] ${name} -> ${path.relative(root, dest)}`);
  } else {
    console.warn(`[sync-assets] missing source: ${name}`);
  }
}

// Copy uncompressed original PNG project stills
const projectAssetsDir = path.join(root, 'assets', 'project');
const projectsPublicDir = path.join(root, 'public', 'projects');

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
  ['Last Night In Korea', 'last-night-in-korea'],
  ['Rooted (Maktoob)', 'maktoob']
];

const numericCompare = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

function safeCopy(src, dest) {
  try {
    if (fs.existsSync(dest)) {
      const sStat = fs.statSync(src);
      const dStat = fs.statSync(dest);
      if (sStat.size === dStat.size) return;
    }
    fs.copyFileSync(src, dest);
  } catch (err) {
    if (err.code !== 'EBUSY') throw err;
  }
}

for (const [folder, slug] of projects) {
  const srcDir = path.join(projectAssetsDir, folder);
  if (!fs.existsSync(srcDir)) continue;

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.png$/i.test(f))
    .sort(numericCompare);

  const destDir = path.join(projectsPublicDir, slug);
  fs.mkdirSync(destDir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const srcFile = path.join(srcDir, files[i]);
    const out = path.join(destDir, `still-${String(i + 1).padStart(2, '0')}.png`);
    safeCopy(srcFile, out);
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
      safeCopy(srcFile, out);
    }
  }
}
console.log('[sync-assets] Original PNG project stills synced without compression.');

// Sync Bio Section assets
const bioSrc = path.join(root, 'assets', 'project', 'Bio - Section');
const bioDest = path.join(root, 'public', 'bio');

if (fs.existsSync(bioSrc)) {
  fs.mkdirSync(path.join(bioDest, 'bangladesh'), { recursive: true });
  fs.mkdirSync(path.join(bioDest, 'oman'), { recursive: true });

  const otherPhotosDir = path.join(bioSrc, 'Other Photos');
  if (fs.existsSync(otherPhotosDir)) {
    const files = fs.readdirSync(otherPhotosDir);
    for (const f of files) {
      let targetName = f.toLowerCase().replace(/\s+/g, '-');
      if (targetName.includes('rob')) targetName = 'rob-reiner.jpg';
      else if (targetName.includes('stand')) targetName = 'stand-by-me.png';
      else if (targetName.includes('morshedul')) targetName = 'morshedul-islam.jpg';
      else if (targetName.includes('dipu')) targetName = 'dipu-number-two.png';

      safeCopy(path.join(otherPhotosDir, f), path.join(bioDest, targetName));
    }
  }

  const bdSrc = path.join(bioSrc, 'Photo slide show', 'Bangladesh Map');
  if (fs.existsSync(bdSrc)) {
    const files = fs.readdirSync(bdSrc).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort();
    files.forEach((f, idx) => {
      const ext = path.extname(f).toLowerCase();
      safeCopy(path.join(bdSrc, f), path.join(bioDest, 'bangladesh', `${idx + 1}${ext}`));
    });
  }

  const omanSrc = path.join(bioSrc, 'Photo slide show', 'Oman Map');
  if (fs.existsSync(omanSrc)) {
    const files = fs.readdirSync(omanSrc).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort();
    files.forEach((f, idx) => {
      const ext = path.extname(f).toLowerCase();
      safeCopy(path.join(omanSrc, f), path.join(bioDest, 'oman', `${idx + 1}${ext}`));
    });
  }
  console.log('[sync-assets] Bio Section photo slideshow assets synced.');
}