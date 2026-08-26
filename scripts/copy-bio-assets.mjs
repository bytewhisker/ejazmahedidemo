import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bioSrc = path.join(root, 'assets', 'project', 'Bio - Section');
const bioDest = path.join(root, 'public', 'bio');

fs.mkdirSync(path.join(bioDest, 'bangladesh'), { recursive: true });
fs.mkdirSync(path.join(bioDest, 'oman'), { recursive: true });

// Copy Other Photos
const otherPhotosDir = path.join(bioSrc, 'Other Photos');
if (fs.existsSync(otherPhotosDir)) {
  const files = fs.readdirSync(otherPhotosDir);
  for (const f of files) {
    let targetName = f.toLowerCase().replace(/\s+/g, '-');
    if (targetName.includes('rob')) targetName = 'rob-reiner.jpg';
    else if (targetName.includes('stand')) targetName = 'stand-by-me.png';
    else if (targetName.includes('morshedul')) targetName = 'morshedul-islam.jpg';
    else if (targetName.includes('dipu')) targetName = 'dipu-number-two.png';

    fs.copyFileSync(path.join(otherPhotosDir, f), path.join(bioDest, targetName));
    console.log(`Copied Bio Photo: ${f} -> public/bio/${targetName}`);
  }
}

// Copy Bangladesh Map Slideshow Photos
const bdSrc = path.join(bioSrc, 'Photo slide show', 'Bangladesh Map');
if (fs.existsSync(bdSrc)) {
  const files = fs.readdirSync(bdSrc).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort();
  files.forEach((f, idx) => {
    const ext = path.extname(f).toLowerCase();
    const dest = path.join(bioDest, 'bangladesh', `${idx + 1}${ext}`);
    fs.copyFileSync(path.join(bdSrc, f), dest);
    console.log(`Copied BD Photo: ${f} -> public/bio/bangladesh/${idx + 1}${ext}`);
  });
}

// Copy Oman Map Slideshow Photos
const omanSrc = path.join(bioSrc, 'Photo slide show', 'Oman Map');
if (fs.existsSync(omanSrc)) {
  const files = fs.readdirSync(omanSrc).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort();
  files.forEach((f, idx) => {
    const ext = path.extname(f).toLowerCase();
    const dest = path.join(bioDest, 'oman', `${idx + 1}${ext}`);
    fs.copyFileSync(path.join(omanSrc, f), dest);
    console.log(`Copied Oman Photo: ${f} -> public/bio/oman/${idx + 1}${ext}`);
  });
}

console.log('Bio assets copy finished!');
