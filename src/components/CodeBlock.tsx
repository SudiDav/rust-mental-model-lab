export function CodeBlock({ children, language = 'rust' }: { children: React.ReactNode; language?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-line bg-[#0a0d13]">
      <div className="border-b border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">{language}</div>
      <pre className="overflow-x-auto p-4 text-sm leading-7 text-cyan-100"><code>{children}</code></pre>
    </div>
  );
}
