export const PROGRESS_STORAGE_KEY = 'rust-lab-progress';
export const CURRENT_PROGRESS_SCHEMA = 1;

export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type LessonProgressStatus = 'not-started' | 'learning' | 'completed';

export interface LessonProgress {
  status: LessonProgressStatus;
  quizScore: number | null;
  completedChallenges: string[];
  completedExercises: string[];
  reviewConcepts: string[];
}

export interface ProgressState {
  schemaVersion: number;
  lessons: Record<string, LessonProgress>;
  lastUpdated: string;
}

export function emptyProgress(): ProgressState {
  return { schemaVersion: CURRENT_PROGRESS_SCHEMA, lessons: {}, lastUpdated: new Date(0).toISOString() };
}

function normalizeLessonProgress(value: unknown): LessonProgress {
  const candidate = (value && typeof value === 'object' ? value : {}) as Partial<LessonProgress>;
  const status = candidate.status === 'learning' || candidate.status === 'completed' ? candidate.status : 'not-started';
  return {
    status,
    quizScore: typeof candidate.quizScore === 'number' ? candidate.quizScore : null,
    completedChallenges: Array.isArray(candidate.completedChallenges) ? candidate.completedChallenges.filter((id): id is string => typeof id === 'string') : [],
    completedExercises: Array.isArray(candidate.completedExercises) ? candidate.completedExercises.filter((id): id is string => typeof id === 'string') : [],
    reviewConcepts: Array.isArray(candidate.reviewConcepts) ? candidate.reviewConcepts.filter((concept): concept is string => typeof concept === 'string') : [],
  };
}

export function migrateProgress(input: unknown): ProgressState {
  if (!input || typeof input !== 'object') return emptyProgress();
  const candidate = input as { schemaVersion?: unknown; lessons?: unknown; completed?: unknown };
  const lessons: Record<string, LessonProgress> = {};
  if (candidate.schemaVersion === CURRENT_PROGRESS_SCHEMA && candidate.lessons && typeof candidate.lessons === 'object') {
    for (const [id, value] of Object.entries(candidate.lessons)) lessons[id] = normalizeLessonProgress(value);
  } else if (Array.isArray(candidate.completed)) {
    for (const id of candidate.completed.filter((value): value is string => typeof value === 'string')) {
      lessons[id] = { status: 'completed', quizScore: null, completedChallenges: [], completedExercises: [], reviewConcepts: [] };
    }
  }
  return { schemaVersion: CURRENT_PROGRESS_SCHEMA, lessons, lastUpdated: typeof (candidate as { lastUpdated?: unknown }).lastUpdated === 'string' ? (candidate as { lastUpdated: string }).lastUpdated : new Date().toISOString() };
}

export function loadProgress(storage: ProgressStorage): ProgressState {
  try {
    const stored = storage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? migrateProgress(JSON.parse(stored)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(storage: ProgressStorage, state: ProgressState): void {
  storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: CURRENT_PROGRESS_SCHEMA, lastUpdated: new Date().toISOString() }));
}
