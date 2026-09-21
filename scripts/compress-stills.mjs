import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsPublicDir = path.join(root, 'public', 'projects');

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const stat = fs.statSync(fullPath);
      // If file size is > 1.5MB (1,500,000 bytes)
      if (stat.size > 1500000) {
        console.log(`[compress] Optimizing ${path.relative(root, fullPath)} (${(stat.size / 1024 / 1024).toFixed(1)}MB)...`);
        try {
          const tempPath = `${fullPath}.tmp`;
          const isPng = /\.png$/i.test(entry.name);
          
          let pipeline = sharp(fullPath)
            .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true });

          if (isPng && entry.name.startsWith('still-')) {
            // Keep PNG for main frame stills or convert to sharp PNG
            await pipeline
              .png({ compressionLevel: 8, palette: true })
              .toFile(tempPath);
          } else {
            // Convert set stills / huge photos to high quality JPEG (85% quality)
            await pipeline
              .jpeg({ quality: 85, progressive: true, mozjpeg: true })
              .toFile(tempPath);
          }

          const newStat = fs.statSync(tempPath);
          // Only overwrite if temp file is smaller
          if (newStat.size < stat.size) {
            fs.unlinkSync(fullPath);
            fs.renameSync(tempPath, fullPath);
            console.log(`  -> Compressed to ${(newStat.size / 1024 / 1024).toFixed(2)}MB`);
          } else {
            fs.unlinkSync(tempPath);
          }
        } catch (err) {
          console.error(`  -> Error compressing ${entry.name}:`, err.message);
        }
      }
    }
  }
}

async function run() {
  console.log('[compress] Starting image optimization scan across public/projects...');
  await optimizeDirectory(projectsPublicDir);
  console.log('[compress] Optimization complete!');
}

run();
