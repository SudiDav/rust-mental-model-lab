import { useEffect } from 'react';
import type { LessonRecord } from '../content/types';
import { useLearning } from '../learning/LearningProvider';
import { isLessonUnlocked } from '../learning/prerequisites';
import { routeTo } from '../app/routes';
import { LockedLesson } from './LockedLesson';
import { SimulationPanel } from './SimulationPanel';
import { LessonMDXProvider } from './mdx/MDXProvider';

export function LessonWorkspace({ lesson, nextLesson, previousLesson, lessonIndex, totalLessons, onOpenLesson, onBack, onLessonComplete }: { lesson: LessonRecord; nextLesson?: LessonRecord; previousLesson?: LessonRecord; lessonIndex: number; totalLessons: number; onOpenLesson: (id: string) => void; onBack: () => void; onLessonComplete: () => void }) {
  const { progress, markLearning } = useLearning();
  const unlocked = isLessonUnlocked(lesson, progress);
  const isCompleted = progress.lessons[lesson.id]?.status === 'completed';
  const curriculumPercent = Math.round(((lessonIndex + (isCompleted ? 1 : 0)) / totalLessons) * 100);
  const Content = lesson.component;
  useEffect(() => { if (unlocked.unlocked) markLearning(lesson.id); }, [lesson.id, unlocked.unlocked]);
  return <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-12">
    <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition hover:text-cyan-200">← Back to learning map</button>
    <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-panel/70 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">Learning path</p><p className="mt-1 text-sm font-medium text-slate-200">Lesson {lessonIndex + 1} of {totalLessons}</p></div>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{isCompleted ? 'Completed' : 'In progress'}</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-950/50" aria-label={`${curriculumPercent}% of the curriculum complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={curriculumPercent}><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-[width] duration-500" style={{ width: `${curriculumPercent}%` }} /></div>
    </div>
    <div className="mt-7 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
      <article className="lesson-content lesson-enter min-w-0 rounded-2xl border border-line bg-panel/60 p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500"><span>{lesson.world}</span><span>·</span><span>{lesson.estimatedMinutes} min</span><span>·</span><span>{lesson.difficulty}</span></div>
        {!unlocked.unlocked ? <LockedLesson explanation={unlocked.explanation} /> : Content ? <LessonMDXProvider lessonId={lesson.id} nextLessonTitle={nextLesson?.title} onComplete={onLessonComplete}><Content /></LessonMDXProvider> : <p className="mt-6 text-slate-400">This lesson is being prepared.</p>}
      </article>
      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <SimulationPanel type={lesson.simulation.type} scenario={lesson.simulation.scenario} />
        <div className="rounded-2xl border border-line bg-panel p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Lesson intent</p><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{lesson.objectives.map((objective) => <li key={objective} className="flex gap-3"><span className="text-cyan-300">→</span><span>{objective}</span></li>)}</ul></div>
      </aside>
    </div>
    <nav aria-label="Lesson navigation" className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-panel p-4">
      <button disabled={!previousLesson} onClick={() => previousLesson && onOpenLesson(previousLesson.id)} className="rounded-lg border border-line px-4 py-2.5 text-left transition hover:border-cyan-300/35 disabled:cursor-not-allowed disabled:opacity-40"><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Previous</span><span className="mt-1 block text-sm text-slate-200">{previousLesson ? `← ${previousLesson.title}` : 'Start of the path'}</span></button>
      <button aria-label={nextLesson ? `Next lesson: ${nextLesson.title}` : 'Next lesson'} disabled={!nextLesson || !isCompleted} onClick={() => nextLesson && isCompleted && onOpenLesson(nextLesson.id)} className="rounded-lg border border-cyan-300/25 px-4 py-2.5 text-right transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300/80">Next lesson</span><span className="mt-1 block text-sm text-slate-200">{nextLesson ? `${nextLesson.title} →` : 'You reached the end'}</span></button>
    </nav>
    <a className="sr-only" href={routeTo('home')}>Return home</a>
  </section>;
}
