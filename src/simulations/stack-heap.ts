import type { InspectableEntity, SimulationModel } from '../engine/types';

export type StackHeapPhase = 'empty' | 'allocated';
export interface StackHeapState { phase: StackHeapPhase; selectedEntity: string | null; }
export type StackHeapEvent = { type: 'allocate-string' } | { type: 'select-entity'; entity: string };

const nameEntity: InspectableEntity = {
  id: 'name', label: 'name', description: 'A stack descriptor pointing to a heap allocation.',
  details: [
    { label: 'ptr', value: '0xA120' },
    { label: 'len', value: '4' },
    { label: 'capacity', value: '4' },
    { label: 'bytes', value: 'S U D I' },
  ],
};

export function stackHeap(): SimulationModel<StackHeapState, StackHeapEvent> {
  return {
    initialState: { phase: 'empty', selectedEntity: null },
    events: [{ type: 'allocate-string' }, { type: 'select-entity', entity: 'name' }],
    reduce(state, event) {
      if (event.type === 'allocate-string') return { phase: 'allocated', selectedEntity: null };
      return state.phase === 'allocated' ? { ...state, selectedEntity: event.entity } : state;
    },
    describe(state) {
      return state.phase === 'empty' ? 'No allocation exists yet.' : 'name stores ptr = 0xA120, len = 4, capacity = 4; the bytes live in the heap.';
    },
    inspect(state, entityId) { return state.phase === 'allocated' && entityId === 'name' ? nameEntity : undefined; },
    select(state, entityId) { return state.phase === 'allocated' ? { ...state, selectedEntity: entityId } : state; },
  };
}
