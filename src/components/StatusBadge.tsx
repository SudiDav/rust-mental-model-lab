export function StatusBadge({ status }: { status: 'available' | 'planned' | 'completed' | 'learning' | 'locked' }) {
  const styles = {
    available: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
    planned: 'border-slate-600 bg-slate-800/60 text-slate-400',
    completed: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-300',
    learning: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
    locked: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
  } as const;
  return <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${styles[status]}`}>{status}</span>;
}
