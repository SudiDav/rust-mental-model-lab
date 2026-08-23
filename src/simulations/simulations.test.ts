import { describe, expect, it } from 'vitest';
import { binaryPlayground } from './binary';
import { memoryHierarchy } from './memory-hierarchy';
import { processMemory } from './process-memory';
import { stackHeap } from './stack-heap';

describe('memory simulations', () => {
  it('toggles a bit and recalculates numeric representations', () => {
    const model = binaryPlayground();
    const next = model.reduce(model.initialState, { type: 'toggle-bit', index: 0 });
    expect(next.binary).toBe('11010011');
    expect(next.decimal).toBe(211);
    expect(next.hex).toBe('D3');
  });

  it('selects a memory hierarchy level', () => {
    const model = memoryHierarchy();
    const next = model.reduce(model.initialState, { type: 'select-level', level: 'ram' });
    expect(next.selectedLevel).toBe('ram');
    expect(model.inspect(next, 'ram')?.label).toBe('RAM');
  });

  it('selects conceptual process memory segments', () => {
    const model = processMemory();
    const next = model.reduce(model.initialState, { type: 'select-segment', segment: 'heap' });
    expect(next.selectedSegment).toBe('heap');
    expect(model.inspect(next, 'heap')?.label).toBe('HEAP');
  });

  it('moves through a stack and heap string allocation story', () => {
    const model = stackHeap();
    const created = model.reduce(model.initialState, model.events[0]);
    const inspected = model.reduce(created, model.events[1]);
    expect(created.phase).toBe('allocated');
    expect(inspected.selectedEntity).toBe('name');
    expect(model.describe(inspected)).toContain('0xA120');
  });
});
