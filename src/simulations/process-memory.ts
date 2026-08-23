import type { InspectableEntity, SimulationModel } from '../engine/types';

export type MemorySegment = 'stack' | 'heap' | 'static' | 'code';
export interface ProcessMemoryState { selectedSegment: MemorySegment; }
export type ProcessMemoryEvent = { type: 'select-segment'; segment: MemorySegment };

const segments: Record<MemorySegment, InspectableEntity> = {
  stack: { id: 'stack', label: 'STACK', description: 'Function frames and local variables.', details: [{ label: 'growth', value: 'conceptually downward' }] },
  heap: { id: 'heap', label: 'HEAP', description: 'Dynamic allocations owned by a running program.', details: [{ label: 'growth', value: 'conceptually upward' }] },
  static: { id: 'static', label: 'STATIC / GLOBAL', description: 'Data with a program-wide lifetime.', details: [] },
  code: { id: 'code', label: 'CODE', description: 'Instructions the CPU can execute.', details: [] },
};

export function processMemory(): SimulationModel<ProcessMemoryState, ProcessMemoryEvent> {
  return {
    initialState: { selectedSegment: 'stack' },
    events: [{ type: 'select-segment', segment: 'heap' }],
    reduce(state, event) { return event.type === 'select-segment' ? { selectedSegment: event.segment } : state; },
    describe(state) { return `${segments[state.selectedSegment].label}: ${segments[state.selectedSegment].description}`; },
    inspect(_state, entityId) { return segments[entityId as MemorySegment]; },
  };
}
