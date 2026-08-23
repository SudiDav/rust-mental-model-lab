import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function AppPlaceholder() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Rust Mental Model Lab</p>
      <h1 className="mt-4 text-4xl font-semibold">Build a mental simulator.</h1>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppPlaceholder />
  </StrictMode>,
);
