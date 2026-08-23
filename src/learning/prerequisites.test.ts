import { describe, expect, it } from 'vitest';
import { isLessonUnlocked } from './prerequisites';
import type { LessonRecord } from '../content/types';

const lesson = (id: string, prerequisites: string[]): LessonRecord => ({
  id, slug: id, title: id, world: 'foundations', order: 1, difficulty: 'beginner', estimatedMinutes: 5,
  prerequisites, objectives: [], concepts: [], simulation: { type: 'planned', scenario: id }, status: 'planned',
});

describe('lesson prerequisites', () => {
  it('explains which prerequisite is missing', () => {
    const result = isLessonUnlocked(lesson('cpu-and-memory', ['bits-and-bytes']), { lessons: {} });
    expect(result.unlocked).toBe(false);
    expect(result.missing).toEqual(['bits-and-bytes']);
    expect(result.explanation).toContain('bits-and-bytes');
  });

  it('unlocks a lesson after all prerequisites are completed', () => {
    const result = isLessonUnlocked(lesson('cpu-and-memory', ['bits-and-bytes']), {
      lessons: { 'bits-and-bytes': { status: 'completed', quizScore: 1, completedChallenges: [], completedExercises: [], reviewConcepts: [] } },
    });
    expect(result).toEqual({ unlocked: true, missing: [], explanation: '' });
  });
});
