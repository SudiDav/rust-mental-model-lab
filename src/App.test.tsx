import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => {
  window.location.hash = '';
});

describe('application shell', () => {
  it('shows the learning map and planned worlds', () => {
    window.location.hash = '#/';
    render(<App />);
    expect(screen.getByRole('heading', { name: /rust mental model lab/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /why this lab exists/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start with the why/i })).toBeInTheDocument();
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
  });

  it('renders an MDX lesson and its simulation workspace', () => {
    window.location.hash = '#/lesson/bits-and-bytes';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Bits and Bytes' })).toBeInTheDocument();
    expect(screen.getByText(/same eight bits/i)).toBeInTheDocument();
    expect(screen.getAllByRole('region', { name: /binary playground/i }).length).toBeGreaterThan(0);
  });
});
