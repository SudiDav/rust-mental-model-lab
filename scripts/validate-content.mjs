import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.resolve('content');
const expectedPublished = new Set(['bits-and-bytes', 'cpu-and-memory', 'program-memory', 'stack-and-heap']);
const plannedIds = new Set([
  'pointers-references', 'memory-bugs', 'why-rust', 'ownership-introduction', 'borrowing-introduction',
  'mutable-borrowing', 'borrow-checker', 'lifetimes-introduction', 'slices', 'smart-pointers',
  'reference-counting', 'concurrency', 'async-rust', 'unsafe-rust',
]);
const worldIds = new Set([
  'foundations', 'cpu-memory', 'program-memory', 'stack-heap', 'pointers-references', 'memory-bugs',
  'why-rust', 'ownership', 'borrowing', 'mutable-borrowing', 'borrow-checker', 'lifetimes', 'slices',
  'smart-pointers', 'reference-counting', 'concurrency', 'async-rust', 'unsafe-rust',
]);
const registeredSimulations = new Set(['binary', 'memory-hierarchy', 'process-memory', 'stack-heap']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.name.endsWith('.mdx')) files.push(fullPath);
  }
  return files;
}

const files = await walk(root);
const documents = await Promise.all(files.map(async (file) => ({ file, data: matter(await readFile(file, 'utf8')).data })));
const errors = [];
const seen = new Set();

for (const { file, data } of documents) {
  const label = path.relative(process.cwd(), file);
  for (const field of ['id', 'title', 'world', 'order', 'difficulty', 'estimatedMinutes', 'prerequisites', 'objectives', 'concepts', 'simulation', 'status']) {
    if (data[field] === undefined) errors.push(`${label}: missing frontmatter field ${field}`);
  }
  if (seen.has(data.id)) errors.push(`${label}: duplicate lesson ID ${data.id}`);
  seen.add(data.id);
  if (!worldIds.has(data.world)) errors.push(`${label}: unknown world ${data.world}`);
  for (const prerequisite of data.prerequisites ?? []) {
    if (!seen.has(prerequisite) && !plannedIds.has(prerequisite) && !expectedPublished.has(prerequisite)) {
      errors.push(`${label}: unknown prerequisite ${prerequisite}`);
    }
  }
  if (data.status === 'published' && !registeredSimulations.has(data.simulation?.type)) {
    errors.push(`${label}: unregistered simulation ${data.simulation?.type}`);
  }
}

for (const id of expectedPublished) {
  if (!seen.has(id)) errors.push(`Missing published lesson file for ${id}`);
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${documents.length} MDX lesson(s); ${expectedPublished.size} published.`);
