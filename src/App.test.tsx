import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { MEMORY_CHECKPOINTS, MEMORY_TOUR_EXERCISE } from './simulations/memory-lab';

vi.mock('./components/memory-lab/memory-scene', () => ({ createMemoryScene: () => ({ update: () => {}, dispose: () => {}, resetCamera: () => {} }) }));

beforeEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeMode;
});

afterEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeMode;
});

describe('application shell', () => {
  it('starts the next lesson with only its own exercise requirements after the memory lab', async () => {
    const progress = { status: 'completed', quizScore: null, completedChallenges: [], completedExercises: [], reviewConcepts: [] };
    localStorage.setItem('rust-lab-progress', JSON.stringify({ schemaVersion: 1, lessons: {
      'program-memory': progress,
      'stack-and-heap': { ...progress, status: 'learning', completedExercises: [...MEMORY_CHECKPOINTS.map((checkpoint) => checkpoint.id), MEMORY_TOUR_EXERCISE, 'challenge:stack-and-heap-01'] },
    } }));
    window.location.hash = '#/lesson/stack-and-heap';
    render(<App />);
    expect(screen.getAllByRole('region', { name: 'A String’s journey' })).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'The life of a String' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Complete lesson' }));
    await waitFor(() => expect(window.location.hash).toBe('#/lesson/pointers-references'), { timeout: 2000 });
    await screen.findByRole('heading', { name: 'Pointers and References' });
    fireEvent.click(screen.getByRole('button', { name: 'Complete lesson' }));
    expect(screen.getByText('Complete the remaining exercises before continuing (2 left).')).toBeInTheDocument();
  });

  it('shows the learning map and planned worlds', () => {
    window.location.hash = '#/';
    render(<App />);
    expect(screen.getByRole('heading', { name: /rust mental model lab/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /why this lab exists/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start with the why/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/first principles → ownership → confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/World 17/i)).toBeInTheDocument();
    expect(screen.getAllByText(/planned/i).length).toBeGreaterThan(0);
  });

  it('renders the human introduction before the first-principles lesson', () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);
    expect(screen.getByRole('heading', { name: /why build a mental model/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /rust compared with typescript and c#/i })).toBeInTheDocument();
    expect(screen.getByText(/compiler checks ownership, borrowing, and lifetimes/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /text-first lesson/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /learning loop animation/i })).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('csharp')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /how typescript, c#, and rust divide memory responsibility/i })).toBeInTheDocument();
  });

  it('renders an MDX lesson and its simulation workspace', () => {
    window.location.hash = '#/lesson/bits-and-bytes';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Bits and Bytes' })).toBeInTheDocument();
    expect(screen.getByText(/same eight bits/i)).toBeInTheDocument();
    expect(screen.getAllByRole('region', { name: /binary playground/i }).length).toBeGreaterThan(0);
  });

  it('shows a continue learning card when a learner has started a lesson', () => {
    window.localStorage.setItem('rust-lab-progress', JSON.stringify({
      schemaVersion: 1,
      lessons: { 'start-here': { status: 'learning', quizScore: null, completedChallenges: [], completedExercises: [], reviewConcepts: [] } },
      lastUpdated: new Date().toISOString(),
    }));
    window.location.hash = '#/';
    render(<App />);

    expect(screen.getByRole('region', { name: /continue learning/i })).toBeInTheDocument();
    expect(screen.getByText(/why build a mental model/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resume lesson/i })).toBeInTheDocument();
  });

  it('shows lesson position and keeps the next lesson gated until completion', () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);

    expect(screen.getByRole('navigation', { name: /lesson navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/lesson 1 of 10/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next lesson: bits and bytes/i })).toBeDisabled();
  });

  it('keeps the learner on the lesson until its exercises are passed', async () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /to memorize rust syntax/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /reflection for start-here-01/i }), { target: { value: 'The model shows why the prediction is wrong.' } });
    fireEvent.click(screen.getByRole('button', { name: /mark challenge complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /complete lesson/i }));

    expect(window.location.hash).toBe('#/lesson/start-here');
    expect(screen.getByText(/complete the remaining exercises before continuing/i)).toBeInTheDocument();
    expect(screen.queryByText(/challenge complete/i)).not.toBeInTheDocument();
  });

  it('opens the next published lesson after all exercises are passed', async () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /to predict what the computer and compiler are doing/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /reflection for start-here-01/i }), { target: { value: 'The model makes the compiler behavior predictable.' } });
    fireEvent.click(screen.getByRole('button', { name: /mark challenge complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /complete lesson/i }));

    await waitFor(() => expect(window.location.hash).toBe('#/lesson/bits-and-bytes'), { timeout: 2000 });
    expect(screen.getByRole('heading', { name: 'Bits and Bytes' })).toBeInTheDocument();
  });

  it('celebrates after the learner passes every exercise', () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /to predict what the computer and compiler are doing/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /reflection for start-here-01/i }), { target: { value: 'The model makes the compiler behavior predictable.' } });
    fireEvent.click(screen.getByRole('button', { name: /mark challenge complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /complete lesson/i }));

    expect(screen.getByText(/challenge complete/i)).toBeInTheDocument();
  });

  it('requires a written reflection before recording a challenge', () => {
    window.location.hash = '#/lesson/start-here';
    render(<App />);

    const challengeButton = screen.getByRole('button', { name: /mark challenge complete/i });
    expect(challengeButton).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox', { name: /reflection for start-here-01/i }), { target: { value: 'The mental model connects data, access, and lifetime.' } });

    expect(challengeButton).toBeEnabled();
    fireEvent.click(challengeButton);
    expect(screen.getByRole('button', { name: 'Recorded' })).toBeInTheDocument();
  });

  it('persists the selected theme from the navigation menu', () => {
    window.location.hash = '#/';
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /theme: system/i }));
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'System' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Light' }));

    expect(window.localStorage.getItem('rust-lab-theme')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /theme: light/i })).toBeInTheDocument();
  });
});
