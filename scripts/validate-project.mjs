import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const viteConfig = await readFile('vite.config.ts', 'utf8');

for (const script of ['dev', 'build', 'test', 'test:run', 'validate:content', 'check']) {
  if (!packageJson.scripts?.[script]) throw new Error(`Missing script: ${script}`);
}

if (!viteConfig.includes("base: '/rust-mental-model-lab/'")) {
  throw new Error('GitHub Pages base path is missing');
}

console.log('Project configuration is valid');
