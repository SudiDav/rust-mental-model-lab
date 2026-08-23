import { describe, expect, it } from 'vitest';
import {
  getLessons,
  getWorlds,
  isLessonRecordValid,
  type LessonRecord,
} from './loader';

describe('curriculum loader', () => {
  it('orders all curriculum worlds from foundations through unsafe Rust', () => {
    expect(getWorlds().map((world) => world.id)).toEqual([
      'foundations',
      'cpu-memory',
      'program-memory',
      'stack-heap',
      'pointers-references',
      'memory-bugs',
      'why-rust',
      'ownership',
      'borrowing',
      'mutable-borrowing',
      'borrow-checker',
      'lifetimes',
      'slices',
      'smart-pointers',
      'reference-counting',
      'concurrency',
      'async-rust',
      'unsafe-rust',
    ]);
  });

  it('exposes published lessons before planned lessons', () => {
    const lessons = getLessons();
    expect(lessons.filter((lesson) => lesson.status === 'published')).toHaveLength(10);
    expect(lessons[0].id).toBe('start-here');
    expect(lessons[0].prerequisites).toEqual([]);
    expect(lessons.some((lesson) => lesson.status === 'planned')).toBe(true);
    expect(lessons.find((lesson) => lesson.id === 'ownership-introduction')?.status).toBe('published');
    expect(lessons.find((lesson) => lesson.id === 'borrowing-introduction')?.status).toBe('published');
  });

  it('rejects a lesson with an unknown prerequisite', () => {
    const invalid: LessonRecord = {
      id: 'broken-lesson',
      slug: 'broken-lesson',
      title: 'Broken lesson',
      world: 'foundations',
      order: 99,
      difficulty: 'beginner',
      estimatedMinutes: 5,
      prerequisites: ['missing-lesson'],
      objectives: ['Test validation'],
      concepts: ['validation'],
      simulation: { type: 'binary', scenario: 'basic' },
      status: 'planned',
    };

    expect(isLessonRecordValid(invalid, getLessons())).toEqual({
      valid: false,
      errors: ['Unknown prerequisite: missing-lesson'],
    });
  });
});
