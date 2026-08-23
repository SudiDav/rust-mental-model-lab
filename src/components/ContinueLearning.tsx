import type { LessonRecord } from '../content/types';
import type { ProgressState } from '../learning/progress';

interface Props { lessons: LessonRecord[]; progress: ProgressState; onOpenLesson: (id: string) => void; }

export function ContinueLearning({ lessons, progress, onOpenLesson }: Props) {
  const publishedLessons = lessons.filter((lesson) => lesson.status === 'published');
  if (!publishedLessons.length) return null;

  const currentLesson = publishedLessons.find((lesson) => progress.lessons[lesson.id]?.status === 'learning')
    ?? publishedLessons.find((lesson) => progress.lessons[lesson.id]?.status !== 'completed')
    ?? publishedLessons[publishedLessons.length - 1];
  const completedLessons = publishedLessons.filter((lesson) => progress.lessons[lesson.id]?.status === 'completed').length;
  const curriculumPercent = Math.round((completedLessons / publishedLessons.length) * 100);
  const status = progress.lessons[currentLesson.id]?.status;
  const action = status === 'completed' ? 'Review lesson' : status === 'learning' ? 'Resume lesson' : 'Start lesson';

  return <section aria-label="Continue learning" className="mt-8 overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5 shadow-glow md:p-6">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">Your learning path</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-100">Continue learning</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{currentLesson.title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{completedLessons} of {publishedLessons.length} lessons complete · {curriculumPercent}% of the path</p>
      </div>
      <button onClick={() => onOpenLesson(currentLesson.id)} className="rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100 transition hover:bg-cyan-300/20">{action} →</button>
    </div>
    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-950/50" aria-label={`${curriculumPercent}% of the published learning path complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={curriculumPercent}>
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 transition-[width] duration-500" style={{ width: `${curriculumPercent}%` }} />
    </div>
  </section>;
}
