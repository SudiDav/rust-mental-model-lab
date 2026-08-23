import { useState, type ReactNode } from 'react';
import { useLearning } from '../../learning/LearningProvider';
import { PredictionCard } from '../PredictionCard';
import { SimulationPanel } from '../SimulationPanel';
import { useLessonExercise, useLessonExercises } from './LessonExerciseContext';

export function Concept({ children }: { children: ReactNode }) { return <aside className="my-6 rounded-xl border-l-2 border-cyan-300 bg-cyan-300/[0.06] px-5 py-4 text-sm leading-7 text-cyan-50"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">Concept</span><div className="mt-1">{children}</div></aside>; }
export function MentalModel({ children }: { children: ReactNode }) { return <aside className="my-6 rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.05] p-5 text-sm leading-7 text-indigo-50"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-300">Mental model</span><div className="mt-2">{children}</div></aside>; }
export function UnderTheHood({ children }: { children: ReactNode }) { return <details className="my-6 rounded-xl border border-line bg-panel p-5 text-sm leading-7 text-slate-300"><summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.16em] text-slate-300">Under the hood</summary><div className="mt-3">{children}</div></details>; }
export function Reveal({ children }: { children: ReactNode }) { return <details className="my-6 rounded-xl border border-line p-5 text-sm text-slate-300"><summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.16em] text-slate-400">Reveal explanation</summary><div className="mt-3 leading-7">{children}</div></details>; }
export function Simulation({ type, scenario }: { type: string; scenario: string }) { return <SimulationPanel type={type} scenario={scenario} />; }
export function Predict({ lessonId, question, options, answer }: { lessonId: string; question: string; options: string[]; answer: string }) {
  const exerciseId = `prediction:${question}`;
  useLessonExercise(exerciseId);
  return <PredictionCard lessonId={lessonId} exerciseId={exerciseId} question={question} options={options} answer={answer} />;
}

export function Challenge({ lessonId, id }: { lessonId: string; id: string }) {
  const { completeChallenge } = useLearning();
  const completed = useLessonExercise(`challenge:${id}`);
  const [done, setDone] = useState(completed);
  return <section className="my-6 rounded-xl border border-line p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Challenge {id}</p><p className="mt-2 text-sm text-slate-300">Explain the visual model in your own words before moving on.</p><button onClick={() => { completeChallenge(lessonId, id); setDone(true); }} className="mt-4 rounded-lg border border-amber-300/30 px-3 py-2 font-mono text-xs text-amber-200">{done || completed ? 'Recorded' : 'Mark challenge complete'}</button></section>;
}

export function MasteryCheck({ lessonId, nextLessonTitle, onComplete }: { lessonId?: string; nextLessonTitle?: string; onComplete?: () => void }) {
  const { completeLesson } = useLearning();
  const { isComplete, missingExerciseIds } = useLessonExercises();
  const [message, setMessage] = useState('');
  const handleComplete = () => {
    if (!lessonId) return;
    if (!isComplete) {
      setMessage(`Complete the remaining exercises before continuing (${missingExerciseIds.length} left).`);
      return;
    }
    completeLesson(lessonId);
    setMessage(nextLessonTitle ? `Lesson complete. Opening ${nextLessonTitle} next.` : 'Lesson complete. You have finished the published learning path.');
    onComplete?.();
  };
  return <section className="my-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">Mastery check</p><p className="mt-2 text-sm leading-6 text-slate-300">Can you predict the next state before pressing the control?</p><button onClick={handleComplete} className="mt-4 rounded-lg border border-emerald-300/30 px-3 py-2 font-mono text-xs text-emerald-200">Complete lesson</button>{message && <p role="status" className="mt-3 text-sm text-amber-200">{message}</p>}</section>;
}
