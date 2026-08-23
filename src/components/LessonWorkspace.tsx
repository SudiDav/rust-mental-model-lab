import { useEffect } from 'react';
import type { LessonRecord } from '../content/types';
import { useLearning } from '../learning/LearningProvider';
import { isLessonUnlocked } from '../learning/prerequisites';
import { routeTo } from '../app/routes';
import { LockedLesson } from './LockedLesson';
import { SimulationPanel } from './SimulationPanel';
import { LessonMDXProvider } from './mdx/MDXProvider';

export function LessonWorkspace({ lesson, onBack }: { lesson: LessonRecord; onBack: () => void }) {
  const { progress, markLearning } = useLearning();
  const unlocked = isLessonUnlocked(lesson, progress);
  const Content = lesson.component;
  useEffect(() => { if (unlocked.unlocked) markLearning(lesson.id); }, [lesson.id, unlocked.unlocked]);
  return <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-12">
    <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition hover:text-cyan-200">← Back to learning map</button>
    <div className="mt-7 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
      <article className="min-w-0 rounded-2xl border border-line bg-panel/60 p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500"><span>{lesson.world}</span><span>·</span><span>{lesson.estimatedMinutes} min</span><span>·</span><span>{lesson.difficulty}</span></div>
        {!unlocked.unlocked ? <LockedLesson explanation={unlocked.explanation} /> : Content ? <LessonMDXProvider lessonId={lesson.id}><Content /></LessonMDXProvider> : <p className="mt-6 text-slate-400">This lesson is being prepared.</p>}
      </article>
      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <SimulationPanel type={lesson.simulation.type} scenario={lesson.simulation.scenario} />
        <div className="rounded-2xl border border-line bg-panel p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Lesson intent</p><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{lesson.objectives.map((objective) => <li key={objective} className="flex gap-3"><span className="text-cyan-300">→</span><span>{objective}</span></li>)}</ul></div>
      </aside>
    </div>
    <a className="sr-only" href={routeTo('home')}>Return home</a>
  </section>;
}
