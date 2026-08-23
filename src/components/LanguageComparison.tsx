const rows = [
  ['TypeScript', 'Build application behavior quickly with objects and references.', 'The JavaScript runtime and garbage collector manage object memory.', 'Types, module boundaries, async behavior, and runtime limits.'],
  ['C#', 'Express rich application and domain code with a large standard library.', 'The .NET runtime and garbage collector manage most object memory.', 'Types, allocations, async behavior, and explicit resource patterns such as using.'],
  ['Rust', 'Write code with direct control and strong compile-time guarantees.', 'The compiler checks ownership, borrowing, and lifetimes; values are cleaned up deterministically.', 'Where data lives, who owns it, who may access it, and how long it is valid.'],
];

export function LanguageComparison() {
  return <div role="region" aria-label="Language ergonomics comparison" className="my-6 overflow-x-auto rounded-2xl border border-line bg-panel">
    <table className="min-w-[720px] w-full border-collapse text-left text-sm">
      <caption className="sr-only">How TypeScript, C#, and Rust divide memory responsibility</caption>
      <thead className="border-b border-line bg-slate-950/30 text-xs uppercase tracking-[0.12em] text-cyan-200">
        <tr><th className="p-4 font-mono font-medium">Language</th><th className="p-4 font-mono font-medium">Feels easy at first</th><th className="p-4 font-mono font-medium">Runtime or compiler handles</th><th className="p-4 font-mono font-medium">You learn to reason about</th></tr>
      </thead>
      <tbody>{rows.map(([language, easy, handles, reason]) => <tr key={language} className="border-b border-line last:border-0 align-top text-slate-300"><th scope="row" className="p-4 font-semibold text-slate-100">{language}</th><td className="p-4 leading-6">{easy}</td><td className="p-4 leading-6">{handles}</td><td className="p-4 leading-6">{reason}</td></tr>)}</tbody>
    </table>
  </div>;
}
