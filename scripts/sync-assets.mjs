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