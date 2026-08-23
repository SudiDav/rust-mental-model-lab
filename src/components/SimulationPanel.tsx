import { useEffect, useState } from 'react';
import { getSimulation } from '../simulations/registry';

interface Props { type: string; scenario: string; }

export function SimulationPanel({ type, scenario }: Props) {
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [type, scenario]);
  let model: ReturnType<typeof getSimulation> | null = null;
  let error = '';
  try { model = getSimulation(type, scenario); } catch (caught) { error = caught instanceof Error ? caught.message : 'Simulation unavailable'; }
  return <section role="region" aria-label={`${type} playground`} className="rounded-2xl border border-line bg-[#0b1017] p-5 shadow-glow">
    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Interactive model</p><h2 className="mt-2 text-lg font-semibold text-slate-100">{type.replace(/-/g, ' ')}</h2></div><span className="font-mono text-[10px] text-slate-600">step {step}</span></div>
    {error ? <p className="mt-5 rounded-xl border border-rose-300/20 p-4 text-sm text-rose-200">{error}</p> : <><p className="mt-4 text-sm leading-6 text-slate-400">{model?.describe(model.initialState)}</p><div className="mt-5 flex gap-2"><button onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-lg border border-line px-3 py-2 font-mono text-xs text-slate-300">Back</button><button onClick={() => setStep((value) => Math.min(model?.events.length ?? 0, value + 1))} className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-xs text-cyan-200">Step forward</button><button onClick={() => setStep(0)} className="rounded-lg border border-line px-3 py-2 font-mono text-xs text-slate-300">Reset</button></div></>}
  </section>;
}
