import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('keyboard accessibility foundation', () => {
  it('provides a skip link and a named main landmark', () => {
    window.location.hash = '#/';
    render(<App />);
    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
