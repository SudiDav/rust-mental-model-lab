import type { WorldRecord } from './types';

const WORLD_SEEDS: Array<[string, string, string, WorldRecord['status']]> = [
  ['foundations', 'World 0 · How Computers Represent Information', 'Bits, bytes, binary, characters, and addresses.', 'published'],
  ['cpu-memory', 'World 1 · CPU and Memory', 'Registers, cache, RAM, storage, and load/store.', 'published'],
  ['program-memory', 'World 2 · Program Memory', 'Processes, address spaces, stacks, heaps, and frames.', 'published'],
  ['stack-heap', 'World 3 · Stack and Heap', 'Allocation, pointers, scopes, and dynamic data.', 'published'],
  ['pointers-references', 'World 4 · Pointers and References', 'Addresses, dereferencing, references, and aliasing.', 'planned'],
  ['memory-bugs', 'World 5 · Memory Bugs', 'Dangling pointers, use-after-free, leaks, and races.', 'planned'],
  ['why-rust', 'World 6 · Why Rust Exists', 'Trade-offs between manual memory, GC, and ownership.', 'planned'],
  ['ownership', 'World 7 · Ownership', 'Moves, Copy, Clone, scope, and Drop.', 'planned'],
  ['borrowing', 'World 8 · Borrowing', 'Shared references as temporary access.', 'planned'],
  ['mutable-borrowing', 'World 9 · Mutable Borrowing', 'Many readers or one exclusive writer.', 'planned'],
  ['borrow-checker', 'World 10 · Borrow Checker', 'Predict compiler decisions from access rules.', 'planned'],
  ['lifetimes', 'World 11 · Lifetimes', 'Relationships between owners and references over time.', 'planned'],
  ['slices', 'World 12 · Slices', 'Views into existing memory.', 'planned'],
  ['smart-pointers', 'World 13 · Smart Pointers', 'Box, Rc, RefCell, Arc, Mutex, and RwLock.', 'planned'],
  ['reference-counting', 'World 14 · Reference Counting', 'Shared ownership, counts, cycles, and Weak.', 'planned'],
  ['concurrency', 'World 15 · Concurrency', 'Threads, races, synchronization, and channels.', 'planned'],
  ['async-rust', 'World 16 · Async Rust', 'Futures, tasks, polling, and executors.', 'planned'],
  ['unsafe-rust', 'World 17 · Unsafe Rust', 'Raw pointers, FFI, invariants, and boundaries.', 'planned'],
];

export const WORLD_RECORDS: WorldRecord[] = WORLD_SEEDS.map(([id, title, description, status], order) => ({
  id,
  title,
  description,
  order,
  status,
}));

export function getWorlds(): WorldRecord[] {
  return WORLD_RECORDS.map((world) => ({ ...world }));
}

export function getWorld(worldId: string): WorldRecord | undefined {
  return WORLD_RECORDS.find((world) => world.id === worldId);
}
