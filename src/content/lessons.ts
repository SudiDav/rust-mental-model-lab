import type { LessonRecord } from './types';

const publishedLessons: LessonRecord[] = [
  {
    id: 'start-here', slug: 'start-here', title: 'Why Build a Mental Model?', world: 'foundations', order: 0,
    difficulty: 'beginner', estimatedMinutes: 12, prerequisites: [],
    objectives: ['Understand why memory and execution models make Rust easier to reason about.', 'Compare the ergonomics and trade-offs of Rust, C#, and TypeScript.', 'Adopt an observe-predict-explain loop for the lessons ahead.'],
    concepts: ['mental model', 'language ergonomics', 'garbage collection', 'ownership', 'borrowing'], simulation: { type: 'none', scenario: 'orientation' }, status: 'published',
  },
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
  {
    id: 'pointers-references', slug: 'pointers-references', title: 'Pointers and References', world: 'pointers-references', order: 1,
    difficulty: 'beginner', estimatedMinutes: 20, prerequisites: ['stack-and-heap'],
    objectives: ['Distinguish an address, a pointer, a reference, and the value being referenced.', 'Explain why access through a reference does not transfer ownership.'],
    concepts: ['address', 'pointer', 'reference', 'dereference', 'aliasing'], simulation: { type: 'none', scenario: 'text-first' }, status: 'published',
  },
  {
    id: 'memory-bugs', slug: 'memory-bugs', title: 'Memory Bugs', world: 'memory-bugs', order: 1,
    difficulty: 'beginner', estimatedMinutes: 22, prerequisites: ['pointers-references'],
    objectives: ['Recognize dangling pointers, use-after-free, double-free, leaks, and data races.', 'Connect each bug to the broken relationship in the memory model.'],
    concepts: ['dangling pointer', 'use-after-free', 'double-free', 'leak', 'data race'], simulation: { type: 'none', scenario: 'text-first' }, status: 'published',
  },
  {
    id: 'why-rust', slug: 'why-rust', title: 'Why Rust Exists', world: 'why-rust', order: 1,
    difficulty: 'beginner', estimatedMinutes: 24, prerequisites: ['memory-bugs'],
    objectives: ['Compare manual memory management, garbage collection, and Rust ownership.', 'Describe the trade-off Rust makes between control, safety, and upfront precision.'],
    concepts: ['memory safety', 'garbage collection', 'ownership', 'deterministic cleanup', 'zero-cost abstractions'], simulation: { type: 'none', scenario: 'text-first' }, status: 'published',
  },
  {
    id: 'ownership-introduction', slug: 'ownership-introduction', title: 'Understanding Ownership', world: 'ownership', order: 1,
    difficulty: 'beginner', estimatedMinutes: 28, prerequisites: ['why-rust'],
    objectives: ['Use the owner, value, scope, and cleanup model to explain moves.', 'Predict which variable remains valid after a value is transferred.'],
    concepts: ['owner', 'move', 'scope', 'drop', 'Copy', 'Clone'], simulation: { type: 'none', scenario: 'text-first' }, status: 'published',
  },
  {
    id: 'borrowing-introduction', slug: 'borrowing-introduction', title: 'Borrowing', world: 'borrowing', order: 1,
    difficulty: 'beginner', estimatedMinutes: 28, prerequisites: ['ownership-introduction'],
    objectives: ['Distinguish borrowing from moving and cloning.', 'Explain why a reference must never outlive the value it observes.'],
    concepts: ['shared borrow', 'mutable borrow', 'aliasing', 'reference validity'], simulation: { type: 'none', scenario: 'text-first' }, status: 'published',
  },
];

const plannedSeeds: Array<[string, string, string, string]> = [
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
