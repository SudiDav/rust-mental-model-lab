import { useMemo } from 'react';
import type { LessonRecord, WorldRecord } from '../content/types';
import type { ProgressState } from '../learning/progress';
import { WorldCard } from './WorldCard';

interface Props { worlds: WorldRecord[]; lessons: LessonRecord[]; progress: ProgressState; onOpenLesson: (id: string) => void; focusWorldId?: string; }

export function WorldMap({ worlds, lessons, progress, onOpenLesson, focusWorldId }: Props) {
  const visibleWorlds = useMemo(() => focusWorldId ? worlds.filter((world) => world.id === focusWorldId) : worlds, [focusWorldId, worlds]);
  return (
    <section aria-labelledby="learning-map-heading" className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300/90">Curriculum / execution graph</p>
        <h1 className="sr-only">Rust Mental Model Lab</h1>
        <h2 id="learning-map-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">Build the mental simulator one world at a time.</h2>
        <p className="mt-4 text-base leading-7 text-slate-400">Start with the physical ingredients of a computer, then follow data into processes, stacks, heaps, ownership, borrowing, lifetimes, and concurrency.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleWorlds.map((world) => <WorldCard key={world.id} world={world} lessons={lessons} progress={progress} onOpenLesson={onOpenLesson} />)}
      </div>
    </section>
  );
}
