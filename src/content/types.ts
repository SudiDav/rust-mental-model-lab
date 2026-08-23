import type { ComponentType } from 'react';

export type WorldStatus = 'published' | 'planned';
export type LessonStatus = 'published' | 'planned';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface WorldRecord {
  id: string;
  title: string;
  description: string;
  order: number;
  status: WorldStatus;
}

export interface SimulationRef {
  type: string;
  scenario: string;
}

export interface LessonRecord {
  id: string;
  slug: string;
  title: string;
  world: string;
  order: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  objectives: string[];
  concepts: string[];
  simulation: SimulationRef;
  status: LessonStatus;
  component?: ComponentType<Record<string, unknown>>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
