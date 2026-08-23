import { BinaryPlayground } from './simulations/BinaryPlayground';
import { MemoryHierarchy } from './simulations/MemoryHierarchy';
import { ProcessMemory } from './simulations/ProcessMemory';
import { StackHeapExplorer } from './simulations/StackHeapExplorer';

interface Props { type: string; scenario: string; }

export function SimulationPanel({ type, scenario }: Props) {
  if (type === 'none') return <section role="region" aria-label="orientation" className="rounded-2xl border border-amber-300/15 bg-[#0b1017] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">Orientation</p><p className="mt-3 text-sm leading-6 text-slate-400">This first lesson gives you the human context for the lab. The interactive models begin with bits and bytes in World 0.</p></section>;
  if (type === 'binary') return <BinaryPlayground scenario={scenario} />;
  if (type === 'memory-hierarchy') return <MemoryHierarchy scenario={scenario} />;
  if (type === 'process-memory') return <ProcessMemory scenario={scenario} />;
  if (type === 'stack-heap') return <StackHeapExplorer scenario={scenario} />;
  return <section role="region" aria-label={`${type} playground`} className="rounded-2xl border border-line bg-[#0b1017] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-200">Simulation planned</p><p className="mt-3 text-sm leading-6 text-slate-400">The {type.replace(/-/g, ' ')} model is registered in the curriculum and will be added in a later world.</p></section>;
}
