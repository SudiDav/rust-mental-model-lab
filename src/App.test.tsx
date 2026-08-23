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
    expect(screen.getByText(/World 17/i)).toBeInTheDocument();
    expect(screen.getAllByText(/planned/i).length).toBeGreaterThan(0);
  });

  it('renders an MDX lesson and its simulation workspace', () => {
    window.location.hash = '#/lesson/bits-and-bytes';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Bits and Bytes' })).toBeInTheDocument();
    expect(screen.getByText(/same eight bits/i)).toBeInTheDocument();
    expect(screen.getAllByRole('region', { name: /binary playground/i }).length).toBeGreaterThan(0);
  });
});
