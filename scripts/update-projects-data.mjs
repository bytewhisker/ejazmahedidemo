import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'png-mapping.json'), 'utf8'));
const file = path.join(root, 'src', 'data', 'projectsData.js');

let content = fs.readFileSync(file, 'utf8');

// Replace .webp extension with .png for all local project images
content = content.replace(/\/projects\/([a-zA-Z0-9-]+)\/still-(\d+)\.webp/g, '/projects/$1/still-$2.png');

// Update screengrabs for each project based on mapping
Object.keys(mapping).forEach(slug => {
  const pngs = mapping[slug];
  const slugRegex = new RegExp(`(slug:\\s*"${slug}",[\\s\\S]*?screengrabs:\\s*\\[)[^\\]]*(\\])`);
  if (slugRegex.test(content)) {
    const formattedPngs = '\n' + pngs.map(p => `      "${p}"`).join(',\n') + '\n    ';
    content = content.replace(slugRegex, `$1${formattedPngs}$2`);
  }
});

// Update Azura category to Commercial
content = content.replace(
  /id:\s*"azura-luxury-villas",\s*slug:\s*"azura-the-azura-within",\s*title:\s*"Azura - The Azura Within",\s*category:\s*"Films"/,
  'id: "azura-luxury-villas",\n    slug: "azura-the-azura-within",\n    title: "Azura - The Azura Within",\n    category: "Commercial"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('projectsData.js successfully updated with PNG paths!');
