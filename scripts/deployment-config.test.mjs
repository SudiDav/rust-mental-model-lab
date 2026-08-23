import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('deployment configuration', () => {
  it('documents the sudidav GitHub Pages deployment', async () => {
    const workflow = await readFile('.github/workflows/deploy-pages.yml', 'utf8');
    const readme = await readFile('README.md', 'utf8');
    expect(workflow).toContain('actions/upload-pages-artifact');
    expect(workflow).toContain('actions/deploy-pages');
    expect(workflow).toContain('npm run check');
    expect(readme).toContain('sudidav/rust-mental-model-lab');
  });
});
