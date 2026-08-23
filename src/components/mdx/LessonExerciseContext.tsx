import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useLearning } from '../../learning/LearningProvider';

interface LessonExerciseContextValue {
  registerExercise: (exerciseId: string) => void;
  isComplete: boolean;
  missingExerciseIds: string[];
}

const LessonExerciseContext = createContext<LessonExerciseContextValue | null>(null);

export function LessonExerciseProvider({ lessonId, children }: PropsWithChildren<{ lessonId: string }>) {
  const { progress } = useLearning();
  const [requiredExerciseIds, setRequiredExerciseIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const registerExercise = useCallback((exerciseId: string) => {
    setRequiredExerciseIds((current) => current.includes(exerciseId) ? current : [...current, exerciseId]);
  }, []);
  useEffect(() => { setReady(true); }, []);
  const completedExerciseIds = progress.lessons[lessonId]?.completedExercises ?? [];
  const missingExerciseIds = requiredExerciseIds.filter((exerciseId) => !completedExerciseIds.includes(exerciseId));
  const value = useMemo(() => ({ registerExercise, isComplete: ready && missingExerciseIds.length === 0, missingExerciseIds }), [missingExerciseIds, ready, registerExercise]);
  return <LessonExerciseContext.Provider value={value}>{children}</LessonExerciseContext.Provider>;
}

export function useLessonExercise(exerciseId: string): boolean {
  const { registerExercise, missingExerciseIds } = useLessonExercises();
  useEffect(() => { registerExercise(exerciseId); }, [registerExercise, exerciseId]);
  return !missingExerciseIds.includes(exerciseId);
}

export function useLessonExercises(): LessonExerciseContextValue {
  const value = useContext(LessonExerciseContext);
  if (!value) throw new Error('useLessonExercises must be used inside LessonExerciseProvider');
  return value;
}
