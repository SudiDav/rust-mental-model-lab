import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './theme/ThemeProvider';
import { ThemeMenu } from './components/ThemeMenu';
import { MemoryLabPreview } from './components/memory-lab/MemoryLab';
import './index.css';

// This separate HTML entry is served by Vite during development, not the Pages build.
createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider>
  <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
    <header className="flex items-start justify-between gap-4">
      <div><h1 className="text-xl font-semibold text-slate-100">Rust Mental Model Lab · Preview</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Try the 3D memory journey. Step through the Rust program, inspect its boxes, and predict what happens next. This local preview does not change your saved course progress.</p></div>
      <ThemeMenu />
    </header>
    <MemoryLabPreview />
  </main>
</ThemeProvider></StrictMode>);
