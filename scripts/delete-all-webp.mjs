import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function removeWebpFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeWebpFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.webp')) {
      fs.unlinkSync(fullPath);
      console.log(`[deleted] ${path.relative(root, fullPath)}`);
    }
  }
}

console.log('Deleting all .webp files across workspace...');
removeWebpFiles(path.join(root, 'public'));
removeWebpFiles(path.join(root, 'src'));
removeWebpFiles(path.join(root, 'dist'));
removeWebpFiles(path.join(root, 'scripts'));
console.log('All .webp files deleted successfully!');
