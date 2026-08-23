const STEPS = [
  { label: 'Observe', detail: 'Name the objects and relationships.' },
  { label: 'Predict', detail: 'Commit to what happens next.' },
  { label: 'Simulate', detail: 'Trace the state change.' },
  { label: 'Explain', detail: 'Say why the result makes sense.' },
];

export function LearningLoop() {
  return (
    <section role="region" aria-label="learning loop animation" className="my-8 rounded-2xl border border-cyan-300/15 bg-[#0b1017] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">The learning loop</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">Build the habit, not just the answer.</h3>
        </div>
        <span aria-hidden="true" className="text-xl text-cyan-300/70">↻</span>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.label} className="learning-loop-step rounded-xl border border-line bg-panel p-4" style={{ animationDelay: `${index * 1.4}s` }}>
            <span className="font-mono text-[10px] text-slate-600">0{index + 1}</span>
            <strong className="mt-2 block text-sm text-cyan-100">{step.label}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{step.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
