export function OrientationPanel({ onOpenLesson }: { onOpenLesson: (id: string) => void }) {
  return (
    <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <article className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-6 shadow-glow">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-200/80">Before the map</p>
        <h3 id="why-this-lab-exists" className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">Why this lab exists</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Rust becomes much less mysterious when you can picture what the computer is doing. This lab helps you build that picture before asking you to memorize rules.</p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Whether you are a student or a developer coming from TypeScript, C#, or another language, start by asking: where is the data, who can access it, and how long can it live?</p>
        <button onClick={() => onOpenLesson('start-here')} className="mt-5 rounded-lg border border-amber-200/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-100 transition hover:bg-amber-200/10">Start with the why →</button>
      </article>
      <aside aria-labelledby="ergonomics-heading" className="rounded-2xl border border-cyan-300/15 bg-panel p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">Language ergonomics</p>
        <h3 id="ergonomics-heading" className="mt-3 text-xl font-semibold tracking-tight text-slate-100">What changes when you learn Rust?</h3>
        <div className="mt-4 space-y-4 text-sm leading-6">
          <p><span className="font-semibold text-slate-200">TypeScript / C#</span><br /><span className="text-slate-400">You can move quickly while the runtime and garbage collector handle much of the memory story for you.</span></p>
          <p><span className="font-semibold text-cyan-200">Rust</span><br /><span className="text-slate-400">You make ownership and access explicit, and the compiler checks those relationships before the program runs.</span></p>
        </div>
      </aside>
    </div>
  );
}
