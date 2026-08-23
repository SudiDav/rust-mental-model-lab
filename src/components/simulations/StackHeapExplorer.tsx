import { useState } from 'react';
import { stackHeap, type StackHeapState } from '../../simulations/stack-heap';

export function StackHeapExplorer({ scenario: _scenario }: { scenario: string }) {
  const model = stackHeap();
  const [state, setState] = useState<StackHeapState>(model.initialState);
  const [eventIndex, setEventIndex] = useState(-1);
  const stepForward = () => { if (eventIndex < model.events.length - 1) { const nextIndex = eventIndex + 1; setEventIndex(nextIndex); setState((current) => model.reduce(current, model.events[nextIndex])); } };
  const reset = () => { setEventIndex(-1); setState(model.initialState); };
  const selected = state.selectedEntity ? model.inspect(state, state.selectedEntity) : undefined;
  return <section role="region" aria-label="stack and heap playground" className="rounded-2xl border border-cyan-300/20 bg-[#0b1017] p-5 shadow-glow">
    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">World 3 · Stack and heap</p><h2 className="mt-2 text-lg font-semibold text-slate-100">Follow the pointer</h2></div><span className="font-mono text-[10px] text-slate-600">event {Math.max(eventIndex + 1, 0)}/{model.events.length}</span></div>
    <div className="mt-5 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-line bg-panel p-4"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">Stack</p><div className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-3 font-mono text-sm text-cyan-100">{state.phase === 'allocated' ? 'name → 0xA120' : 'empty frame'}</div></div><div className="rounded-xl border border-line bg-panel p-4"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">Heap</p><div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/[0.04] p-3 font-mono text-sm text-amber-100">{state.phase === 'allocated' ? '0xA120 → S U D I' : 'no allocation'}</div></div></div>
    <p className="mt-5 text-sm leading-6 text-slate-400">{model.describe(state)}</p>{selected && <div className="mt-4 rounded-xl border border-line bg-panel p-4">{selected.details.map((detail) => <div key={detail.label} className="flex justify-between border-b border-line py-2 font-mono text-xs last:border-0"><span className="text-slate-500">{detail.label}</span><span className="text-cyan-100">{detail.value}</span></div>)}</div>}
    <div className="mt-5 flex flex-wrap gap-2"><button onClick={stepForward} disabled={eventIndex >= model.events.length - 1} className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-xs text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">Step forward</button><button onClick={reset} className="rounded-lg border border-line px-3 py-2 font-mono text-xs text-slate-300">Reset</button></div>
  </section>;
}
