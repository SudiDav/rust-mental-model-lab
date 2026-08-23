import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import type { ThemeMode } from '../theme/theme';

const options: Array<{ mode: ThemeMode; label: string; hint: string }> = [
  { mode: 'dark', label: 'Dark', hint: 'Deep focus' },
  { mode: 'light', label: 'Light', hint: 'Bright canvas' },
  { mode: 'system', label: 'System', hint: 'Follow device' },
];

function ThemeIcon({ mode, resolvedTheme }: { mode: ThemeMode; resolvedTheme: 'dark' | 'light' }) {
  if (mode === 'system') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  if (resolvedTheme === 'dark') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

export function ThemeMenu() {
  const { mode, resolvedTheme, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentLabel = options.find((option) => option.mode === mode)?.label ?? 'System';

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return <div ref={menuRef} className="relative">
    <button ref={buttonRef} type="button" aria-label={`Theme: ${currentLabel}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="grid size-9 place-items-center rounded-lg border border-line bg-panel text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200">
      <ThemeIcon mode={mode} resolvedTheme={resolvedTheme} />
    </button>
    {open && <div role="menu" aria-label="Theme options" className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-line bg-panel p-1.5 shadow-xl">
      {options.map((option) => <button key={option.mode} type="button" role="menuitemradio" aria-label={option.label} aria-checked={mode === option.mode} onClick={() => { setMode(option.mode); setOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-cyan-300/10">
        <span className={`grid size-7 place-items-center rounded-md ${mode === option.mode ? 'bg-cyan-300/15 text-cyan-200' : 'bg-slate-800/60 text-slate-400'}`}><ThemeIcon mode={option.mode} resolvedTheme={option.mode === 'system' ? resolvedTheme : option.mode} /></span>
        <span className="min-w-0"><span className="block text-sm text-slate-200">{option.label}</span><span className="block text-[10px] text-slate-500">{option.hint}</span></span>
        {mode === option.mode && <span className="ml-auto text-cyan-300" aria-hidden="true">✓</span>}
      </button>)}
    </div>}
  </div>;
}
