import type { LessonRecord } from '../content/types';
import type { ProgressState } from './progress';

export interface UnlockResult {
  unlocked: boolean;
  missing: string[];
  explanation: string;
}

export function isLessonUnlocked(lesson: LessonRecord, progress: Pick<ProgressState, 'lessons'>): UnlockResult {
  const missing = lesson.prerequisites.filter((id) => progress.lessons[id]?.status !== 'completed');
  return {
    unlocked: missing.length === 0,
    missing,
    explanation: missing.length ? `Complete ${missing.join(', ')} before starting this lesson.` : '',
  };
}
