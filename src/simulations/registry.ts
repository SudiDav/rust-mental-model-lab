import type { SimulationModel } from '../engine/types';
import { binaryPlayground } from './binary';
import { memoryHierarchy } from './memory-hierarchy';
import { processMemory } from './process-memory';
import { stackHeap } from './stack-heap';

const registry = {
  binary: { basic: binaryPlayground },
  'memory-hierarchy': { latency: memoryHierarchy },
  'process-memory': { 'address-space': processMemory },
  'stack-heap': { 'string-allocation': stackHeap },
} as const;

export function getSimulation(type: string, scenario: string): SimulationModel<unknown, unknown> {
  const byType = registry[type as keyof typeof registry];
  const factory = byType?.[scenario as never] as (() => SimulationModel<unknown, unknown>) | undefined;
  if (!factory) throw new Error(`Simulation not registered: ${type}/${scenario}`);
  return factory();
}

export function hasSimulation(type: string, scenario: string): boolean {
  try { getSimulation(type, scenario); return true; } catch { return false; }
}
