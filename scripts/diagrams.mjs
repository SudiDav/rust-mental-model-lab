import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function verifyStoryRoutes(specification) {
  const edges = new Set((specification.transitions ?? []).map((edge) => `${edge.from}->${edge.to}`));
  for (const chapter of specification.meta?.views ?? []) {
    for (let index = 1; index < chapter.focus.length; index += 1) {
      const edge = `${chapter.focus[index - 1]}->${chapter.focus[index]}`;
      if (!edges.has(edge)) throw new Error(`Chapter ${chapter.id} needs an explicit transition for ${edge}; a decorative rail is not a graph edge.`);
    }
  }
}

export function verifyDiagram({ source, artifact, model, receipt, revision }) {
  if (receipt.generator?.revision !== revision) throw new Error('Archify revision changed; regenerate the diagram.');
  for (const [key, value] of Object.entries({ specification: source, artifact, model })) {
    if (receipt[key]?.sha256 !== sha256(value) || receipt[key]?.bytes !== Buffer.byteLength(value)) {
      throw new Error(`${key} changed; regenerate and review the diagram.`);
    }
  }
  const validation = receipt.validation;
  if (validation?.checksPassed !== 9 || validation.checkCount !== 9 || validation.compositionProfile !== 'showcase' || validation.compositionStatus !== 'pass' || validation.errors !== 0 || validation.warnings !== 0) {
    throw new Error('Diagram is missing a passing Archify showcase receipt.');
  }
}

export async function checkDiagrams() {
  const config = JSON.parse(await readFile(path.join(projectRoot, 'tooling/archify.json'), 'utf8'));
  await readFile(path.join(projectRoot, 'public/diagrams/ARCHIFY-LICENSE.txt'));
  for (const diagram of config.diagrams) {
    const [source, artifact, model, receipt] = await Promise.all([
      readFile(path.join(projectRoot, diagram.source)),
      readFile(path.join(projectRoot, diagram.artifact)),
      readFile(path.join(projectRoot, diagram.model)),
      readFile(path.join(projectRoot, diagram.receipt), 'utf8').then(JSON.parse),
    ]);
    verifyDiagram({ source, artifact, model, receipt, revision: config.revision });
    verifyStoryRoutes(JSON.parse(source.toString('utf8')));
  }
  console.log(`Checked ${config.diagrams.length} diagram(s): source, simulation model, artifact, and validation receipt match.`);
}

async function renderDiagrams(archifyRoot) {
  if (!archifyRoot) throw new Error('Use: npm run diagrams:render -- --archify-root /path/to/archify-checkout');
  const root = path.resolve(archifyRoot);
  const config = JSON.parse(await readFile(path.join(projectRoot, 'tooling/archify.json'), 'utf8'));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  if (git('rev-parse', 'HEAD') !== config.revision) throw new Error(`Use the pinned Archify revision ${config.revision}.`);
  if (git('status', '--porcelain', '--', 'archify', 'LICENSE')) throw new Error('The Archify generator checkout must be clean.');
  const cli = path.join(root, 'archify/bin/archify.mjs');
  for (const diagram of config.diagrams) {
    const source = path.join(projectRoot, diagram.source);
    verifyStoryRoutes(JSON.parse(await readFile(source, 'utf8')));
    const artifact = path.join(projectRoot, diagram.artifact);
    const run = (args) => {
      try {
        return JSON.parse(execFileSync(process.execPath, [cli, ...args], {
          encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1' },
        }));
      } catch (error) {
        if (error.stdout) console.error(String(error.stdout));
        throw error;
      }
    };
    const validation = run(['validate', diagram.type, source, '--quality', 'showcase', '--json']);
    if (!validation.ok) throw new Error(`${diagram.id}: validation failed.`);
    const delivered = run(['deliver', diagram.type, source, artifact, '--quality', 'showcase', '--json']);
    if (!delivered.ok) throw new Error(`${diagram.id}: delivery failed.`);
    const model = await readFile(path.join(projectRoot, diagram.model));
    // Keep portable receipts free of checkout-specific absolute paths.
    const receipt = {
      schemaVersion: 1,
      diagram: diagram.id,
      diagramType: diagram.type,
      generator: { repository: config.repository, revision: config.revision, version: config.version },
      specification: delivered.specification,
      artifact: delivered.artifact,
      model: { sha256: sha256(model), bytes: model.length },
      validation: delivered.validation,
    };
    await writeFile(path.join(projectRoot, diagram.receipt), `${JSON.stringify(receipt, null, 2)}\n`);
    console.log(`Rendered ${diagram.id}: ${delivered.validation.checksPassed}/9 showcase checks passed.`);
  }
  await mkdir(path.join(projectRoot, 'public/diagrams'), { recursive: true });
  await copyFile(path.join(root, 'LICENSE'), path.join(projectRoot, 'public/diagrams/ARCHIFY-LICENSE.txt'));
  await checkDiagrams();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes('--render')) {
      const rootFlag = process.argv.indexOf('--archify-root');
      await renderDiagrams(rootFlag >= 0 ? process.argv[rootFlag + 1] : undefined);
    } else await checkDiagrams();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
