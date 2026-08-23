import { useState } from 'react';
import { binaryPlayground, type BinaryState } from '../../simulations/binary';

export function BinaryPlayground({ scenario: _scenario }: { scenario: string }) {
  const model = binaryPlayground();
  const [state, setState] = useState<BinaryState>(model.initialState);
  return <section role="region" aria-label="binary playground" className="rounded-2xl border border-cyan-300/20 bg-[#0b1017] p-5 shadow-glow">
    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">World 0 · Binary playground</p><h2 className="mt-2 text-lg font-semibold text-slate-100">Interpret the same byte</h2></div><span className="font-mono text-[10px] text-slate-600">8 bits</span></div>
    <div className="mt-6 grid grid-cols-8 gap-1.5">{state.binary.split('').map((bit, index) => <button key={index} aria-label={`Bit ${index}: ${bit}`} onClick={() => setState((current) => model.reduce(current, { type: 'toggle-bit', index }))} className={`rounded-lg border py-3 font-mono text-sm transition ${state.selectedIndex === index ? 'border-amber-300 bg-amber-300/15 text-amber-100' : 'border-line bg-panel text-cyan-100 hover:border-cyan-300/40'}`}>{bit}</button>)}</div>
    <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">{[['Binary', state.binary], ['Decimal', String(state.decimal)], ['Hex', `0x${state.hex}`], ['ASCII', state.ascii]].map(([label, value]) => <div key={label} className="rounded-xl border border-line bg-panel px-3 py-3"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600">{label}:</p><p className="mt-2 font-mono text-cyan-100">{value}</p></div>)}</div>
    <p className="mt-5 text-sm leading-6 text-slate-400">Toggle a switch and watch every interpretation update while the underlying eight bits remain the source data.</p>
    <button onClick={() => setState(model.initialState)} className="mt-4 rounded-lg border border-line px-3 py-2 font-mono text-xs text-slate-300">Reset byte</button>
  </section>;
}
