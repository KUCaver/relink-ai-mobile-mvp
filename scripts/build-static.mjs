import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, 'dist');

const staticFiles = [
  'index.html',
  'Re-Link AI Mobile MVP.html',
  'Re-Link AI Mobile MVP.source.html',
  'api-client.jsx',
  'app.jsx',
  'data.jsx',
  'garden.jsx',
  'ios-frame.jsx',
  'mascot.jsx',
  'primitives.jsx',
  'room.jsx',
  'screens-home.jsx',
  'screens-other.jsx',
  'screens-shop.jsx',
  'screens-wiki.jsx'
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of staticFiles) {
  await copyFile(join(projectRoot, file), join(distDir, file));
}

console.log(`Copied ${staticFiles.length} static MVP files to dist/`);
