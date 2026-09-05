import { describe, expect, it } from 'vitest';
import { getMemorySnapshot, MEMORY_CHECKPOINTS, memoryStepLimit } from './memory-lab';

describe('memory lab execution model', () => {
  it('moves the owner into a new frame without cloning or changing the heap allocation', () => {
    const allocated = getMemorySnapshot(2);
    const moved = getMemorySnapshot(3);
    expect(allocated.owner).toBe('name');
    expect(moved.owner).toBe('message');
    expect(moved.allocationAddress).toBe(allocated.allocationAddress);
    expect(moved.entities.filter((entity) => entity.kind === 'allocation')).toEqual(allocated.entities.filter((entity) => entity.kind === 'allocation'));
    expect(moved.entities.filter((entity) => entity.kind === 'frame').map((entity) => entity.id)).toEqual(['main', 'show']);
    expect(moved.entities.find((entity) => entity.id === 'moved-name')?.kind).toBe('moved');
  });

  it('keeps the owner during printing, then drops only the callee frame and its allocation', () => {
    expect(getMemorySnapshot(4).owner).toBe('message');
    expect(getMemorySnapshot(4).output).toEqual(['Sudi']);
    const returned = getMemorySnapshot(5);
    expect(returned.owner).toBeNull();
    expect(returned.allocationAddress).toBeNull();
    expect(returned.entities.map((entity) => entity.id)).toEqual(['main', 'count', 'moved-name']);
    expect(getMemorySnapshot(7).entities).toEqual([]);
    expect(getMemorySnapshot(7).output).toEqual(['Sudi', '2']);
  });

  it('reconstructs earlier states independently when rewinding', () => {
    const first = getMemorySnapshot(2);
    getMemorySnapshot(7);
    const replay = getMemorySnapshot(2);
    expect(replay).toEqual(first);
    replay.entities.pop();
    expect(getMemorySnapshot(2)).toEqual(first);
    expect(getMemorySnapshot(-4).step).toBe(0);
    expect(getMemorySnapshot(500).step).toBe(7);
    expect(getMemorySnapshot(NaN).step).toBe(0);
  });

  it('blocks timeline skipping until each prediction passes', () => {
    expect(memoryStepLimit([])).toBe(2);
    expect(memoryStepLimit(['unrelated'])).toBe(2);
    expect(memoryStepLimit([MEMORY_CHECKPOINTS[0].id])).toBe(4);
    expect(memoryStepLimit(MEMORY_CHECKPOINTS.map((checkpoint) => checkpoint.id))).toBe(7);
  });
});
