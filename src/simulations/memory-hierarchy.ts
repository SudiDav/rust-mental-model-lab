import type { InspectableEntity, SimulationModel } from '../engine/types';

export type MemoryLevel = 'registers' | 'cache' | 'ram' | 'storage';
export interface MemoryHierarchyState { selectedLevel: MemoryLevel; }
export type MemoryHierarchyEvent = { type: 'select-level'; level: MemoryLevel };

const levels: Record<MemoryLevel, InspectableEntity> = {
  registers: { id: 'registers', label: 'Registers', description: 'Tiny storage locations inside the CPU.', details: [{ label: 'relative access', value: 'fastest' }] },
  cache: { id: 'cache', label: 'Cache', description: 'Small, fast memory close to the CPU.', details: [{ label: 'relative access', value: 'very fast' }] },
  ram: { id: 'ram', label: 'RAM', description: 'Working memory for active programs.', details: [{ label: 'relative access', value: 'medium' }] },
  storage: { id: 'storage', label: 'Storage', description: 'Persistent, high-capacity storage.', details: [{ label: 'relative access', value: 'slowest' }] },
};

export function memoryHierarchy(): SimulationModel<MemoryHierarchyState, MemoryHierarchyEvent> {
  return {
    initialState: { selectedLevel: 'registers' },
    events: [{ type: 'select-level', level: 'ram' }],
    reduce(state, event) { return event.type === 'select-level' ? { selectedLevel: event.level } : state; },
    describe(state) { return `${levels[state.selectedLevel].label}: ${levels[state.selectedLevel].description}`; },
    inspect(_state, entityId) { return levels[entityId as MemoryLevel]; },
  };
}
