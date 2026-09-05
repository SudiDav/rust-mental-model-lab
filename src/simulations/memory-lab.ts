/** A scripted teaching model, not a Rust interpreter or a physical memory layout. */
export const MEMORY_PROGRAM = [
  'fn main() {',
  '    let count = 2;',
  '    let name = String::from("Sudi");',
  '    show(name);',
  '    println!("{count}");',
  '}',
  '',
  'fn show(message: String) {',
  '    println!("{message}");',
  '}',
] as const;

export const MEMORY_STEPS = [
  { title: 'Enter main', line: 1, action: 'Store a number', explanation: 'A function call gets a stack frame: a place for its local values. Start with main, then follow one value through the program.' },
  { title: 'Store a number', line: 2, action: 'Create the String', explanation: 'count holds the number 2 directly in this model of the main frame. No heap allocation is needed for this integer.' },
  { title: 'Allocate the String', line: 3, action: 'Call show(name)', explanation: 'The String descriptor belongs to name. Its pointer leads to the four UTF-8 bytes of “Sudi” on the heap. Length is 4; capacity is at least 4.' },
  { title: 'Move into show', line: 8, action: 'Print the message', explanation: 'show receives ownership as message. A new frame appears above main. The descriptor changes owner, but the heap bytes stay in the same allocation. name can no longer be used.' },
  { title: 'Read the bytes', line: 9, action: 'Return from show', explanation: 'println! reads the String through a temporary borrow. It does not take ownership of message. The output is Sudi, and message still owns the allocation.' },
  { title: 'Drop and return', line: 10, action: 'Continue in main', explanation: 'message goes out of scope as show returns. Rust drops the String and releases its heap allocation. The show frame is removed; main resumes.' },
  { title: 'Resume main', line: 5, action: 'Return from main', explanation: 'count is still available in main. Printing it adds 2 to the output. name remains moved and cannot be used again.' },
  { title: 'Program finished', line: 6, action: 'Finished', explanation: 'main returns and its frame is removed. This example leaves no live String allocation. Rewind to see exactly when the owner and the bytes changed.' },
] as const;

export type MemoryEntityId = 'main' | 'show' | 'count' | 'string' | 'moved-name' | 'heap';
export interface MemoryEntity {
  id: MemoryEntityId;
  label: string;
  value: string;
  region: 'stack' | 'heap';
  kind: 'frame' | 'value' | 'moved' | 'allocation';
  position: [number, number, number];
  explanation: string;
}

export interface MemorySnapshot {
  step: number;
  entities: MemoryEntity[];
  owner: 'name' | 'message' | null;
  allocationAddress: '0xA120' | null;
  output: string[];
}

export function getMemorySnapshot(requestedStep: number): MemorySnapshot {
  const step = Number.isFinite(requestedStep) ? Math.max(0, Math.min(MEMORY_STEPS.length - 1, Math.trunc(requestedStep))) : 0;
  const entities: MemoryEntity[] = [];
  if (step < 7) {
    entities.push({ id: 'main', label: 'main frame', value: 'Caller', kind: 'frame', region: 'stack', position: [-2.6, 0.35, 0], explanation: 'main waits while show runs. Its frame remains until main returns; the most recent function frame returns first.' });
    if (step >= 1) entities.push({ id: 'count', label: 'count', value: '2', kind: 'value', region: 'stack', position: [-3.5, 0.85, 0], explanation: 'A local i32 holding 2. It has no separate heap allocation in this model and remains available while main is running.' });
    if (step >= 3) entities.push({ id: 'moved-name', label: 'name', value: 'moved', kind: 'moved', region: 'stack', position: [-1.9, 0.85, 0], explanation: 'This ghost is a reminder that name was moved. It is not another owner or a live pointer, and it is not a runtime “moved” flag in Rust.' });
  }
  if (step === 3 || step === 4) entities.push({ id: 'show', label: 'show frame', value: 'Current call', kind: 'frame', region: 'stack', position: [-2.6, 2, 0], explanation: 'Calling show adds a frame above main. The parameter message now owns the String. Returning removes this frame first.' });
  const owner = step === 2 ? 'name' : step === 3 || step === 4 ? 'message' : null;
  if (owner) {
    entities.push({ id: 'string', label: owner, value: 'ptr · len · cap', kind: 'value', region: 'stack', position: owner === 'name' ? [-1.9, 0.85, 0] : [-2.6, 2.5, 0], explanation: `${owner} owns the String descriptor: pointer 0xA120, length 4 bytes, capacity at least 4 bytes. The pointer connects it to the heap bytes. Moving the String transfers ownership without cloning those bytes.` });
    entities.push({ id: 'heap', label: 'String bytes', value: 'S u d i', kind: 'allocation', region: 'heap', position: [2.6, 0.7, 0], explanation: 'One allocation at illustrative address 0xA120 contains S, u, d, i (UTF-8: 83, 117, 100, 105). It stays allocated through the move and is released when message is dropped.' });
  }
  return { step, entities, owner, allocationAddress: owner ? '0xA120' : null, output: step >= 6 ? ['Sudi', '2'] : step >= 4 ? ['Sudi'] : [] };
}

export const MEMORY_CHECKPOINTS = [
  {
    id: 'memory-lab:move-v1', beforeStep: 2, title: 'Predict the handoff',
    question: 'When show(name) receives the String, what happens to its heap bytes?',
    options: [
      { id: 'clone', text: 'A second copy is allocated.', feedback: 'A move does not clone the String. Look at the single pointer from name to the heap, then try again.' },
      { id: 'move', text: 'The bytes stay put; message becomes the owner.', feedback: 'Exactly. Watch the descriptor move to show while the same heap allocation stays in place.' },
      { id: 'free', text: 'The bytes are freed immediately.', feedback: 'show still needs those bytes. Ownership transfers to its parameter, so the allocation remains live.' },
    ],
    answer: 'move',
  },
  {
    id: 'memory-lab:drop-v1', beforeStep: 4, title: 'Predict the cleanup',
    question: 'When show returns, what happens to the String allocation?',
    options: [
      { id: 'back', text: 'It moves back to name automatically.', feedback: 'Passing ownership does not lend the value. name stays moved; show does not return a String.' },
      { id: 'drop', text: 'message is dropped and its allocation is released.', feedback: 'You got it. The owner goes out of scope, so its String is dropped before the function finishes returning.' },
      { id: 'gc', text: 'It waits for a garbage collector.', feedback: 'This String is cleaned up when its owner goes out of scope. It does not need a garbage-collection pass.' },
    ],
    answer: 'drop',
  },
] as const;

export const MEMORY_TOUR_EXERCISE = 'memory-lab:execution-v1';

/** All navigation, including the range input, respects unanswered checkpoints. */
export function memoryStepLimit(completedIds: readonly string[]): number {
  return MEMORY_CHECKPOINTS.find((checkpoint) => !completedIds.includes(checkpoint.id))?.beforeStep ?? MEMORY_STEPS.length - 1;
}
