import type { ComponentType } from 'react';
import { LESSON_RECORDS } from './lessons';
import { getWorlds } from './worlds';
import type { LessonRecord, ValidationResult } from './types';

type MdxModule = {
  default: ComponentType<Record<string, unknown>>;
  frontmatter?: Record<string, unknown>;
};

const contentModules = import.meta.glob('/content/**/*.mdx', { eager: true }) as Record<string, MdxModule>;

function attachContent(lesson: LessonRecord): LessonRecord {
  const entry = Object.entries(contentModules).find(([path]) => path.endsWith(`/${lesson.slug}.mdx`));
  return entry ? { ...lesson, component: entry[1].default } : { ...lesson };
}

export function getLessons(): LessonRecord[] {
  const worldOrder = new Map(getWorlds().map((world) => [world.id, world.order]));
  return LESSON_RECORDS
    .map(attachContent)
    .sort((a, b) => (worldOrder.get(a.world) ?? 99) - (worldOrder.get(b.world) ?? 99) || a.order - b.order);
}

export function getLesson(id: string): LessonRecord | undefined {
  return getLessons().find((lesson) => lesson.id === id);
}

export function isLessonRecordValid(lesson: LessonRecord, lessons: LessonRecord[]): ValidationResult {
  const errors: string[] = [];
  const lessonIds = new Set(lessons.map((candidate) => candidate.id));
  for (const prerequisite of lesson.prerequisites) {
    if (!lessonIds.has(prerequisite)) errors.push(`Unknown prerequisite: ${prerequisite}`);
  }
  if (!lesson.id) errors.push('Lesson ID is required');
  if (!lesson.title) errors.push('Lesson title is required');
  if (!lesson.world) errors.push('Lesson world is required');
  return { valid: errors.length === 0, errors };
}

export { getWorlds };
export type { LessonRecord };
