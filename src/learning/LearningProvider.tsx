import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { loadProgress, PROGRESS_STORAGE_KEY, saveProgress, type ProgressState } from './progress';

interface LearningContextValue {
  progress: ProgressState;
  markLearning: (lessonId: string) => void;
  completeLesson: (lessonId: string, quizScore?: number) => void;
  recordQuizScore: (lessonId: string, quizScore: number) => void;
  completeExercise: (lessonId: string, exerciseId: string) => void;
  toggleReviewConcept: (lessonId: string, concept: string) => void;
  completeChallenge: (lessonId: string, challengeId: string) => void;
  resetProgress: () => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

function browserStorage() {
  return typeof window === 'undefined' ? null : window.localStorage;
}

export function LearningProvider({ children }: PropsWithChildren) {
  const storage = browserStorage();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress(storage ?? { getItem: () => null, setItem: () => undefined }));

  useEffect(() => {
    if (storage) saveProgress(storage, progress);
  }, [progress, storage]);

  const updateLesson = useCallback((lessonId: string, updater: (current: ProgressState['lessons'][string]) => ProgressState['lessons'][string]) => {
    setProgress((current) => ({
      ...current,
      lessons: { ...current.lessons, [lessonId]: updater(current.lessons[lessonId] ?? { status: 'not-started', quizScore: null, completedChallenges: [], completedExercises: [], reviewConcepts: [] }) },
    }));
  }, []);

  const value = useMemo<LearningContextValue>(() => ({
    progress,
    markLearning: (lessonId) => updateLesson(lessonId, (lesson) => ({ ...lesson, status: lesson.status === 'completed' ? 'completed' : 'learning' })),
    completeLesson: (lessonId, quizScore) => updateLesson(lessonId, (lesson) => ({ ...lesson, status: 'completed', quizScore: quizScore ?? lesson.quizScore })),
    recordQuizScore: (lessonId, quizScore) => updateLesson(lessonId, (lesson) => ({ ...lesson, quizScore })),
    completeExercise: (lessonId, exerciseId) => updateLesson(lessonId, (lesson) => ({ ...lesson, completedExercises: lesson.completedExercises.includes(exerciseId) ? lesson.completedExercises : [...lesson.completedExercises, exerciseId] })),
    toggleReviewConcept: (lessonId, concept) => updateLesson(lessonId, (lesson) => ({ ...lesson, reviewConcepts: lesson.reviewConcepts.includes(concept) ? lesson.reviewConcepts.filter((item) => item !== concept) : [...lesson.reviewConcepts, concept] })),
    completeChallenge: (lessonId, challengeId) => updateLesson(lessonId, (lesson) => ({
      ...lesson,
      completedChallenges: lesson.completedChallenges.includes(challengeId) ? lesson.completedChallenges : [...lesson.completedChallenges, challengeId],
      completedExercises: lesson.completedExercises.includes(`challenge:${challengeId}`) ? lesson.completedExercises : [...lesson.completedExercises, `challenge:${challengeId}`],
    })),
    resetProgress: () => setProgress(loadProgress({ getItem: () => null, setItem: () => undefined })),
  }), [progress, updateLesson]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): LearningContextValue {
  const value = useContext(LearningContext);
  if (!value) throw new Error(`${PROGRESS_STORAGE_KEY} must be used inside LearningProvider`);
  return value;
}
