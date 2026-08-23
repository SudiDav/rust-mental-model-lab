import type { LessonRecord } from './types';

const publishedLessons: LessonRecord[] = [
  {
    id: 'bits-and-bytes', slug: 'bits-and-bytes', title: 'Bits and Bytes', world: 'foundations', order: 1,
    difficulty: 'beginner', estimatedMinutes: 15, prerequisites: [],
    objectives: ['Toggle bits and translate the same pattern into multiple representations.'],
    concepts: ['bits', 'bytes', 'binary', 'ASCII', 'hexadecimal'], simulation: { type: 'binary', scenario: 'basic' }, status: 'published',
  },
  {
    id: 'cpu-and-memory', slug: 'cpu-and-memory', title: 'CPU and Memory', world: 'cpu-memory', order: 1,
    difficulty: 'beginner', estimatedMinutes: 15, prerequisites: ['bits-and-bytes'],
    objectives: ['Compare the conceptual roles of registers, cache, RAM, and storage.'],
    concepts: ['CPU', 'registers', 'cache', 'RAM', 'storage'], simulation: { type: 'memory-hierarchy', scenario: 'latency' }, status: 'published',
  },
  {
    id: 'program-memory', slug: 'program-memory', title: 'Program Memory', world: 'program-memory', order: 1,
    difficulty: 'beginner', estimatedMinutes: 20, prerequisites: ['cpu-and-memory'],
    objectives: ['Locate code, static data, stack frames, and heap allocations in a process model.'],
    concepts: ['process', 'address space', 'stack', 'heap', 'stack frame'], simulation: { type: 'process-memory', scenario: 'address-space' }, status: 'published',
  },
  {
    id: 'stack-and-heap', slug: 'stack-and-heap', title: 'Stack and Heap', world: 'stack-heap', order: 1,
    difficulty: 'beginner', estimatedMinutes: 25, prerequisites: ['program-memory'],
    objectives: ['Follow a stack value through a pointer to bytes in a conceptual heap allocation.'],
    concepts: ['allocation', 'pointer', 'length', 'capacity', 'scope'], simulation: { type: 'stack-heap', scenario: 'string-allocation' }, status: 'published',
  },
];

const plannedSeeds: Array<[string, string, string, string]> = [
  ['pointers-references', 'Pointers and References', 'pointers-references', 'stack-and-heap'],
  ['memory-bugs', 'Memory Bugs', 'memory-bugs', 'pointers-references'],
  ['why-rust', 'Why Rust Exists', 'why-rust', 'memory-bugs'],
  ['ownership-introduction', 'Understanding Ownership', 'ownership', 'why-rust'],
  ['borrowing-introduction', 'Borrowing', 'borrowing', 'ownership-introduction'],
  ['mutable-borrowing', 'Mutable Borrowing', 'mutable-borrowing', 'borrowing-introduction'],
  ['borrow-checker', 'Borrow Checker', 'borrow-checker', 'mutable-borrowing'],
  ['lifetimes-introduction', 'Lifetimes', 'lifetimes', 'borrow-checker'],
  ['slices', 'Slices', 'slices', 'lifetimes-introduction'],
  ['smart-pointers', 'Smart Pointers', 'smart-pointers', 'slices'],
  ['reference-counting', 'Reference Counting', 'reference-counting', 'smart-pointers'],
  ['concurrency', 'Concurrency', 'concurrency', 'reference-counting'],
  ['async-rust', 'Async Rust', 'async-rust', 'concurrency'],
  ['unsafe-rust', 'Unsafe Rust', 'unsafe-rust', 'async-rust'],
];

const plannedLessons: LessonRecord[] = plannedSeeds.map(([id, title, world, prerequisite], index) => ({
  id, slug: id, title, world, order: 1,
  difficulty: index >= 9 ? 'advanced' : index >= 3 ? 'intermediate' : 'beginner',
  estimatedMinutes: 20 + index * 2, prerequisites: [prerequisite],
  objectives: [`Build a reliable mental model for ${title.toLowerCase()}.`],
  concepts: [title.toLowerCase()], simulation: { type: 'planned', scenario: world }, status: 'planned',
}));

export const LESSON_RECORDS: LessonRecord[] = [...publishedLessons, ...plannedLessons];
