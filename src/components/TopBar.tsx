import { routeTo } from '../app/routes';
import { BrandMark } from './BrandMark';
import { ThemeMenu } from './ThemeMenu';

export function TopBar() {
  return (
    <header className="border-b border-line bg-ink/90 px-5 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <a href={routeTo('home')} className="group flex items-center gap-3 no-underline">
          <BrandMark className="size-10 shrink-0 transition-transform duration-300 group-hover:-rotate-3" decorative />
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/80">Rust Mental Model Lab</span>
            <span className="mt-1 block text-sm font-medium text-slate-200">See the machine. Predict the compiler.</span>
          </span>
        </a>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1 text-emerald-300">static lab</span>
            <span>local progress</span>
          </div>
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
