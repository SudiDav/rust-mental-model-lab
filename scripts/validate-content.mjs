import { access } from 'node:fs/promises';

try {
  await access('content');
  console.log('Content validation will run once lesson metadata is present.');
} catch {
  console.log('No content directory found; content validation is deferred.');
}
