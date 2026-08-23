import { useEffect, useRef, type CSSProperties } from 'react';

const CELEBRATION_DURATION_MS = 1100;

const pieces = [
  { x: -230, y: 130, rotate: -32, delay: 0, color: '#22d3ee' },
  { x: -190, y: 190, rotate: 24, delay: 35, color: '#fbbf24' },
  { x: -150, y: 80, rotate: 52, delay: 70, color: '#34d399' },
  { x: -110, y: 210, rotate: -18, delay: 20, color: '#fb7185' },
  { x: -70, y: 140, rotate: 40, delay: 90, color: '#a78bfa' },
  { x: -35, y: 220, rotate: -46, delay: 45, color: '#22d3ee' },
  { x: 35, y: 220, rotate: 46, delay: 30, color: '#fbbf24' },
  { x: 70, y: 140, rotate: -40, delay: 80, color: '#34d399' },
  { x: 110, y: 210, rotate: 18, delay: 10, color: '#fb7185' },
  { x: 150, y: 80, rotate: -52, delay: 60, color: '#a78bfa' },
  { x: 190, y: 190, rotate: -24, delay: 25, color: '#22d3ee' },
  { x: 230, y: 130, rotate: 32, delay: 50, color: '#fbbf24' },
];

export function playSuccessChime(): void {
  if (typeof window === 'undefined') return;
  const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  const AudioContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(659.25, now);
    oscillator.frequency.setValueAtTime(783.99, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.55);
    oscillator.addEventListener('ended', () => { void context.close(); }, { once: true });
  } catch {
    // A missing or blocked audio device should never interrupt lesson progress.
  }
}

export function Celebration({ onFinished }: { onFinished?: () => void }) {
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    const timer = window.setTimeout(() => onFinishedRef.current?.(), CELEBRATION_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return <>
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {pieces.map((piece, index) => <span
        key={`${piece.x}-${piece.y}`}
        className="celebration-confetti"
        style={{
          '--confetti-x': `${piece.x}px`,
          '--confetti-y': `${piece.y}px`,
          '--confetti-rotate': `${piece.rotate}deg`,
          '--confetti-delay': `${piece.delay}ms`,
          backgroundColor: piece.color,
        } as CSSProperties}
        data-piece={index}
      />)}
    </div>
    <div role="status" aria-live="polite" className="celebration-status relative z-20 mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 font-mono text-xs text-emerald-200 shadow-glow">
      <span aria-hidden="true" className="text-base">🎉</span>
      <span>Challenge complete!</span>
    </div>
  </>;
}
