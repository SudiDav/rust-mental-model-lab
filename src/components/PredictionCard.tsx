import { useState } from 'react';
import { useLearning } from '../learning/LearningProvider';

interface Props { lessonId: string; exerciseId: string; question: string; options: string[]; answer: string; }

export function PredictionCard({ lessonId, exerciseId, question, options, answer }: Props) {
  const { progress, completeExercise } = useLearning();
  const alreadyPassed = progress.lessons[lessonId]?.completedExercises.includes(exerciseId) ?? false;
  const [selected, setSelected] = useState<string | null>(alreadyPassed ? answer : null);
  const answered = selected !== null;
  return (
    <section className="my-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5" aria-labelledby="prediction-heading">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">Prediction checkpoint</p>
      <h3 id="prediction-heading" className="mt-2 text-base font-semibold text-slate-100">{question}</h3>
      <div className="mt-4 grid gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = answered && option === answer;
          return <button key={option} onClick={() => { setSelected(option); if (option === answer) completeExercise(lessonId, exerciseId); }} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${isCorrect ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200' : isSelected ? 'border-rose-300/40 bg-rose-300/10 text-rose-200' : 'border-line bg-panel text-slate-300 hover:border-cyan-300/30'}`} aria-pressed={isSelected}>{option}</button>;
        })}
      </div>
      {answered && <p className={`mt-4 text-sm ${selected === answer ? 'text-emerald-300' : 'text-amber-200'}`}>{selected === answer ? 'Correct. Now connect that prediction to the model.' : `Not quite. The model says: ${answer}.`}</p>}
    </section>
  );
}
