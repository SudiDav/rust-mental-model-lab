import type { LessonRecord, WorldRecord } from '../content/types';
import type { ProgressState } from '../learning/progress';
import { StatusBadge } from './StatusBadge';

interface Props { world: WorldRecord; lessons: LessonRecord[]; progress: ProgressState; onOpenLesson: (id: string) => void; }

export function WorldCard({ world, lessons, progress, onOpenLesson }: Props) {
  const worldLessons = lessons.filter((lesson) => lesson.world === world.id);
  const firstLesson = worldLessons[0];
  const completed = worldLessons.filter((lesson) => progress.lessons[lesson.id]?.status === 'completed').length;
  const status = world.status === 'planned' ? 'planned' : completed === worldLessons.length && worldLessons.length ? 'completed' : 'available';
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-glow transition hover:-translate-y-0.5 hover:border-cyan-300/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">World {world.order}</p>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-slate-100">{world.title.replace(/^World \d+ · /, '')}</h3>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 min-h-10 text-sm leading-6 text-slate-400">{world.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">{worldLessons.length ? `${completed}/${worldLessons.length} lessons` : 'curriculum node'}</span>
        {firstLesson && world.status === 'published' ? (
          <button onClick={() => onOpenLesson(firstLesson.id)} className="rounded-lg border border-cyan-300/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-200 transition hover:bg-cyan-300/10">Open world</button>
        ) : <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600">Coming later</span>}
      </div>
    </article>
  );
}
