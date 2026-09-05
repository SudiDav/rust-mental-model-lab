import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ThemeMenu } from './ThemeMenu';
import { LessonDiagram } from './LessonDiagram';

function renderDiagram() {
  return render(<ThemeProvider><ThemeMenu /><LessonDiagram diagram="life-of-a-string" /></ThemeProvider>);
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeMode;
});

describe('lesson diagram integration', () => {
  it('provides the story as text and a base-path-aware link without loading the viewer', () => {
    renderDiagram();
    expect(screen.getByRole('list', { name: 'String lifecycle summary' }).children).toHaveLength(4);
    expect(screen.getByText(/descriptor changes owner, but the heap bytes stay/)).toBeInTheDocument();
    expect(screen.queryByTitle('The life of a String interactive lifecycle diagram')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open full diagram ↗' })).toHaveAttribute('href', expect.stringMatching(/^\/rust-mental-model-lab\/diagrams\/life-of-a-string\.html\?theme=(light|dark)#view=whole-story$/));
  });

  it('loads a sandboxed viewer on demand, changes chapters, and unloads it when closed', async () => {
    const user = userEvent.setup();
    localStorage.setItem('rust-lab-progress', 'unchanged');
    renderDiagram();
    await user.click(screen.getByText('Explore the interactive diagram'));
    const iframe = await screen.findByTitle('The life of a String interactive lifecycle diagram');
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-downloads');
    await user.click(screen.getByRole('button', { name: 'Understand the move' }));
    expect(screen.getByTitle('The life of a String interactive lifecycle diagram')).toHaveAttribute('src', expect.stringContaining('#view=ownership-handoff'));
    await user.click(screen.getByText('Explore the interactive diagram'));
    await waitFor(() => expect(screen.queryByTitle('The life of a String interactive lifecycle diagram')).not.toBeInTheDocument());
    expect(localStorage.getItem('rust-lab-progress')).toBe('unchanged');
  });

  it('restarts a chapter even when it was the last outer selection', async () => {
    const user = userEvent.setup();
    renderDiagram();
    await user.click(screen.getByText('Explore the interactive diagram'));
    const original = await screen.findByTitle('The life of a String interactive lifecycle diagram');
    const jump = screen.getByRole('button', { name: 'Follow the String' });
    await user.click(jump);
    expect(original).not.toBeInTheDocument();
    expect(screen.getByTitle('The life of a String interactive lifecycle diagram')).toHaveAttribute('src', expect.stringContaining('#view=whole-story'));
    // The iframe can navigate independently; outer actions must not claim current state.
    expect(jump).not.toHaveAttribute('aria-pressed');
  });

  it('follows the lesson theme while retaining the selected chapter', async () => {
    const user = userEvent.setup();
    renderDiagram();
    await user.click(screen.getByText('Explore the interactive diagram'));
    await screen.findByTitle('The life of a String interactive lifecycle diagram');
    await user.click(screen.getByRole('button', { name: 'Watch the cleanup' }));
    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }));
    expect(screen.getByTitle('The life of a String interactive lifecycle diagram')).toHaveAttribute('src', expect.stringContaining('?theme=dark#view=scope-cleanup'));
    await user.click(screen.getByRole('button', { name: 'Theme: Dark' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Light' }));
    expect(screen.getByTitle('The life of a String interactive lifecycle diagram')).toHaveAttribute('src', expect.stringContaining('?theme=light#view=scope-cleanup'));
  });
});
