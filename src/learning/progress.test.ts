import { describe, expect, it } from 'vitest';
import { loadProgress, migrateProgress, saveProgress, type ProgressStorage } from './progress';

class MemoryStorage implements ProgressStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('progress persistence', () => {
  it('falls back to empty progress when stored JSON is malformed', () => {
    const storage = new MemoryStorage();
    storage.setItem('rust-lab-progress', '{bad json');
    expect(loadProgress(storage).lessons).toEqual({});
  });

  it('saves and loads lesson completion state', () => {
    const storage = new MemoryStorage();
    const progress = loadProgress(storage);
    progress.lessons['bits-and-bytes'] = { status: 'completed', quizScore: 1, completedChallenges: [], completedExercises: [], reviewConcepts: [] };
    saveProgress(storage, progress);
    expect(loadProgress(storage).lessons['bits-and-bytes'].status).toBe('completed');
  });

  it('migrates the original completed lesson list into the current shape', () => {
    const migrated = migrateProgress({ schemaVersion: 0, completed: ['bits-and-bytes'] });
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.lessons['bits-and-bytes'].status).toBe('completed');
  });
});
