import { routeTo } from '../app/routes';
import { BrandMark } from './BrandMark';

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink/80 px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="size-10 shrink-0" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">Rust Mental Model Lab</p>
            <p className="mt-1 text-sm text-slate-400">See the machine. Predict the compiler.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a href={routeTo('home')} className="font-mono text-xs text-slate-300 transition hover:text-cyan-200">Return to the learning map →</a>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">First principles → ownership → confidence</p>
        </div>
      </div>
    </footer>
  );
}
