import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha256, verifyDiagram, verifyStoryRoutes } from './diagrams.mjs';

const hash = (text) => ({ sha256: sha256(text), bytes: Buffer.byteLength(text) });
function fixture() {
  return {
    source: '{"diagram":"String"}', artifact: '<html>String</html>', model: 'String execution', revision: 'pinned',
    receipt: {
      generator: { revision: 'pinned' },
      specification: hash('{"diagram":"String"}'), artifact: hash('<html>String</html>'), model: hash('String execution'),
      validation: { checksPassed: 9, checkCount: 9, compositionProfile: 'showcase', compositionStatus: 'pass', errors: 0, warnings: 0 },
    },
  };
}
test('accepts the checked source, model, and exact delivered HTML together', () => assert.doesNotThrow(() => verifyDiagram(fixture())));
for (const key of ['source', 'artifact', 'model']) {
  test(`rejects stale ${key} instead of publishing a mismatched diagram`, () => {
    assert.throws(() => verifyDiagram({ ...fixture(), [key]: 'changed' }), /changed; regenerate/);
  });
}
test('rejects changed generator revisions and incomplete validation receipts', () => {
  assert.throws(() => verifyDiagram({ ...fixture(), revision: 'different' }), /revision changed/);
  const candidate = fixture();
  candidate.receipt.validation.checksPassed = 4;
  assert.throws(() => verifyDiagram(candidate), /passing Archify showcase receipt/);
});

test('guided stories require explicit directed transitions, not just a visual rail', () => {
  const story = { meta: { views: [{ id: 'journey', focus: ['create', 'move', 'drop'] }] }, transitions: [{ from: 'create', to: 'move' }] };
  assert.throws(() => verifyStoryRoutes(story), /explicit transition for move->drop/);
  story.transitions.push({ from: 'move', to: 'drop' });
  assert.doesNotThrow(() => verifyStoryRoutes(story));
});
