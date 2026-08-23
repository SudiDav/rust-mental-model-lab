import { useState } from 'react';
import { processMemory, type MemorySegment, type ProcessMemoryState } from '../../simulations/process-memory';

export function ProcessMemory({ scenario: _scenario }: { scenario: string }) {
  const model = processMemory();
  const [state, setState] = useState<ProcessMemoryState>(model.initialState);
  const segments: MemorySegment[] = ['stack', 'heap', 'static', 'code'];
  const selected = model.inspect(state, state.selectedSegment);
  return <section role="region" aria-label="process memory playground" className="rounded-2xl border border-cyan-300/20 bg-[#0b1017] p-5 shadow-glow">
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">World 2 · Process memory</p><h2 className="mt-2 text-lg font-semibold text-slate-100">Inspect an address space</h2>
    <div className="mt-5 overflow-hidden rounded-xl border border-line">{segments.map((segment) => <button key={segment} aria-label={segment.toUpperCase()} onClick={() => setState(model.reduce(state, { type: 'select-segment', segment }))} className={`flex w-full items-center justify-between border-b border-line px-4 py-4 text-left last:border-b-0 ${state.selectedSegment === segment ? 'bg-cyan-300/10' : 'bg-panel hover:bg-slate-800/60'}`}><span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-200">{segment}</span><span className="text-xs text-slate-600">{segment === 'stack' ? 'frames' : segment === 'heap' ? 'allocations' : segment === 'static' ? 'globals' : 'instructions'}</span></button>)}</div>
    <div className="mt-5 rounded-xl border border-line bg-panel p-4"><p className="font-mono text-xs text-cyan-100">{selected?.label}: {selected?.description}</p><p className="mt-3 text-sm leading-6 text-slate-400">Click each region to connect the label to a responsibility.</p></div>
  </section>;
}
