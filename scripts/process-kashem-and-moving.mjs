import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets', 'project');
const publicDir = path.join(root, 'public', 'projects');

// 1. Process A Thing About Kashem
const kashemSrc = path.join(assetsDir, 'A Thing About Kashem');
const kashemDest = path.join(publicDir, 'a-thing-about-kashem');
fs.mkdirSync(kashemDest, { recursive: true });

// Copy 1.jpg and 2.jpg
if (fs.existsSync(path.join(kashemSrc, '1.jpg'))) {
  fs.copyFileSync(path.join(kashemSrc, '1.jpg'), path.join(kashemDest, '1.jpg'));
  console.log('Copied Kashem 1.jpg -> public/projects/a-thing-about-kashem/1.jpg');
}
if (fs.existsSync(path.join(kashemSrc, '2.jpg'))) {
  fs.copyFileSync(path.join(kashemSrc, '2.jpg'), path.join(kashemDest, '2.jpg'));
  console.log('Copied Kashem 2.jpg -> public/projects/a-thing-about-kashem/2.jpg');
}

// Copy Set Photos for Kashem
const kashemSetSrc = path.join(kashemSrc, 'Set Photos');
const kashemSetStills = [];
if (fs.existsSync(kashemSetSrc)) {
  const files = fs.readdirSync(kashemSetSrc).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  files.forEach((file, idx) => {
    const ext = path.extname(file).toLowerCase();
    const destName = `set-${String(idx + 1).padStart(2, '0')}${ext}`;
    fs.copyFileSync(path.join(kashemSetSrc, file), path.join(kashemDest, destName));
    kashemSetStills.push(`/projects/a-thing-about-kashem/${destName}`);
  });
  console.log(`Copied ${kashemSetStills.length} set photos for Kashem.`);
}

// 2. Process Moving Bangladesh
const movingSrc = path.join(assetsDir, 'Moving Bangladesh');
const movingDest = path.join(publicDir, 'moving-bangladesh');
fs.mkdirSync(movingDest, { recursive: true });

// Copy 1 Poster.png
if (fs.existsSync(path.join(movingSrc, '1 Poster.png'))) {
  fs.copyFileSync(path.join(movingSrc, '1 Poster.png'), path.join(movingDest, 'poster.png'));
  console.log('Copied Moving Bangladesh 1 Poster.png -> public/projects/moving-bangladesh/poster.png');
}

// Copy Screenshot 2026-08-25 at 1.08.01 PM.png
const screenshotFiles = fs.readdirSync(movingSrc).filter(f => f.toLowerCase().includes('screenshot'));
if (screenshotFiles.length > 0) {
  fs.copyFileSync(path.join(movingSrc, screenshotFiles[0]), path.join(movingDest, 'wide-stills.png'));
  console.log(`Copied ${screenshotFiles[0]} -> public/projects/moving-bangladesh/wide-stills.png`);
}

// Copy Set Stills 2.JPG, 3.JPG, 4.JPG
const movingSetFiles = fs.readdirSync(movingSrc).filter(f => /^[2345]\.(jpg|jpeg|png)$/i.test(f)).sort();
const movingSetStills = [];
movingSetFiles.forEach((file, idx) => {
  const ext = path.extname(file).toLowerCase();
  const destName = `set-${String(idx + 1).padStart(2, '0')}${ext}`;
  fs.copyFileSync(path.join(movingSrc, file), path.join(movingDest, destName));
  movingSetStills.push(`/projects/moving-bangladesh/${destName}`);
  console.log(`Copied Moving Bangladesh set still ${file} -> /projects/moving-bangladesh/${destName}`);
});

console.log('Kashem Set Stills Array:', JSON.stringify(kashemSetStills, null, 2));
console.log('Moving Set Stills Array:', JSON.stringify(movingSetStills, null, 2));
