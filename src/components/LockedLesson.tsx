export function LockedLesson({ explanation }: { explanation: string }) {
  return <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.04] p-6 text-sm leading-7 text-slate-300"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-200">Prerequisite gate</p><p className="mt-2">{explanation}</p></div>;
}
