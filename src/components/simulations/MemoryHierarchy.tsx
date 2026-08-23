import { useState } from 'react';
import { memoryHierarchy, type MemoryLevel, type MemoryHierarchyState } from '../../simulations/memory-hierarchy';

export function MemoryHierarchy({ scenario: _scenario }: { scenario: string }) {
  const model = memoryHierarchy();
  const [state, setState] = useState<MemoryHierarchyState>(model.initialState);
  const levels: MemoryLevel[] = ['registers', 'cache', 'ram', 'storage'];
  const selected = model.inspect(state, state.selectedLevel);
  return <section role="region" aria-label="memory hierarchy playground" className="rounded-2xl border border-cyan-300/20 bg-[#0b1017] p-5 shadow-glow">
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">World 1 · Memory hierarchy</p><h2 className="mt-2 text-lg font-semibold text-slate-100">Where does the CPU fetch from?</h2>
    <div className="mt-5 grid gap-2">{levels.map((level, index) => <button key={level} aria-label={level} onClick={() => setState(model.reduce(state, { type: 'select-level', level }))} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${state.selectedLevel === level ? 'border-amber-300/40 bg-amber-300/10' : 'border-line bg-panel hover:border-cyan-300/30'}`}><span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-200">{level}</span><span className="font-mono text-[10px] text-slate-600">{index === 0 ? 'closest' : index === 3 ? 'persistent' : 'layer ' + (index + 1)}</span></button>)}</div>
    <div className="mt-5 rounded-xl border border-line bg-panel p-4"><p className="font-mono text-xs text-cyan-100">Selected: {selected?.label}</p><p className="mt-2 text-sm leading-6 text-slate-400">{selected?.description}</p><p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">Relative access: {selected?.details[0]?.value}</p></div>
  </section>;
}
