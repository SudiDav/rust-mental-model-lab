import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { LearningProvider } from '../../learning/LearningProvider';
import { PROGRESS_STORAGE_KEY } from '../../learning/progress';
import { MEMORY_CHECKPOINTS, MEMORY_TOUR_EXERCISE } from '../../simulations/memory-lab';
import { LessonExerciseProvider } from '../mdx/LessonExerciseContext';
import { Challenge, MasteryCheck } from '../mdx/EducationalComponents';
import { MemoryLab, MemoryLabPreview } from './MemoryLab';
import { createMemoryScene } from './memory-scene';

vi.mock('./memory-scene', () => ({ createMemoryScene: vi.fn() }));

const scene = { update: vi.fn(), resetCamera: vi.fn(), dispose: vi.fn() };
const completed = () => JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)!).lessons['stack-and-heap']?.completedExercises ?? [];

function renderLab() {
  return render(<LearningProvider><LessonExerciseProvider lessonId="stack-and-heap"><MemoryLab lessonId="stack-and-heap" /><Challenge lessonId="stack-and-heap" id="stack-and-heap-01" /><MasteryCheck lessonId="stack-and-heap" /></LessonExerciseProvider></LearningProvider>);
}
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const toMove = () => { click('Store a number →'); click('Create the String →'); };
const passMove = () => click('The bytes stay put; message becomes the owner.');
const toDrop = () => { click('Call show(name) →'); click('Print the message →'); };
const passDrop = () => click('message is dropped and its allocation is released.');

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.mocked(createMemoryScene).mockImplementation(() => scene);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
});

afterEach(() => vi.unstubAllGlobals());

describe('interactive memory lab', () => {
  it('runs the standalone preview without reading or changing saved course progress', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ saved: 'untouched' }));
    const original = localStorage.getItem(PROGRESS_STORAGE_KEY);
    render(<MemoryLabPreview />);
    await waitFor(() => expect(createMemoryScene).toHaveBeenCalledOnce());
    toMove(); passMove(); toDrop(); passDrop();
    click('Return from show →'); click('Continue in main →'); click('Return from main →');
    expect(screen.getByText('You followed the whole journey.')).toBeInTheDocument();
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe(original);
  });

  it('blocks wrong predictions and timeline skipping, then persists a correct answer', async () => {
    renderLab();
    await waitFor(() => expect(scene.update).toHaveBeenCalled());
    toMove();
    click('A second copy is allocated.');
    expect(screen.getByText(/A move does not clone the String/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Call show(name) →' })).toBeDisabled();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } });
    expect(screen.getByRole('slider')).toHaveValue('2');
    expect(completed()).not.toContain(MEMORY_CHECKPOINTS[0].id);
    passMove();
    expect(screen.getByRole('button', { name: 'Call show(name) →' })).toBeEnabled();
    expect(completed()).toContain(MEMORY_CHECKPOINTS[0].id);
    click('Call show(name) →');
    const inspector = screen.getByRole('group', { name: 'Inspect memory objects' });
    fireEvent.click(within(inspector).getByRole('button', { name: 'message' }));
    expect(screen.getByText(/message owns the String descriptor/)).toBeInTheDocument();
    expect(scene.update).toHaveBeenLastCalledWith(expect.objectContaining({ owner: 'message', allocationAddress: '0xA120' }), 'string');
    click('← Back');
    expect(scene.update).toHaveBeenLastCalledWith(expect.objectContaining({ owner: 'name' }), null);
  });

  it('requires both predictions, the complete execution, and reflection before completing the lesson', async () => {
    renderLab();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'The owner moves, and its allocation is freed when the function returns.' } });
    click('Mark challenge complete');
    click('Complete lesson');
    expect(screen.getByText(/remaining exercises.*3 left/)).toBeInTheDocument();
    toMove(); passMove(); toDrop(); passDrop();
    click('Complete lesson');
    expect(screen.getByText(/remaining exercises.*1 left/)).toBeInTheDocument();
    expect(completed()).not.toContain(MEMORY_TOUR_EXERCISE);
    click('Return from show →'); click('Continue in main →'); click('Return from main →');
    expect(completed()).toContain(MEMORY_TOUR_EXERCISE);
    expect(screen.getByText('You followed the whole journey.')).toBeInTheDocument();
    click('Complete lesson');
    await waitFor(() => expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)!).lessons['stack-and-heap'].status).toBe('completed'), { timeout: 2000 });
  });

  it('preserves answers across view changes, restart, and remount', async () => {
    const first = renderLab();
    await waitFor(() => expect(createMemoryScene).toHaveBeenCalledOnce());
    toMove(); passMove(); toDrop(); passDrop();
    click('2D view');
    expect(scene.dispose).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('2D memory diagram')).toBeInTheDocument();
    click('Restart');
    expect(screen.getByRole('slider')).toHaveValue('0');
    expect(completed()).toEqual(expect.arrayContaining(MEMORY_CHECKPOINTS.map((checkpoint) => checkpoint.id)));
    first.unmount();
    renderLab();
    await waitFor(() => expect(createMemoryScene).toHaveBeenCalledTimes(2));
    fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } });
    expect(screen.getByRole('slider')).toHaveValue('4');
    expect(screen.getByRole('button', { name: 'Return from show →' })).toBeEnabled();
  });

  it('falls back to an interactive 2D view when renderer creation fails', async () => {
    vi.mocked(createMemoryScene).mockImplementation(() => { throw new Error('WebGL unavailable'); });
    renderLab();
    await screen.findByText(/3D is unavailable in this browser/);
    expect(screen.getByRole('button', { name: '3D view' })).toBeDisabled();
    toMove();
    click('Inspect String bytes');
    expect(screen.getByText(/One allocation at illustrative address/)).toBeInTheDocument();
    passMove();
    expect(screen.getByRole('button', { name: 'Call show(name) →' })).toBeEnabled();
  });

  it('starts in 2D on small screens or with reduced motion without loading the renderer', () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    renderLab();
    expect(screen.getByRole('button', { name: '2D view' })).toHaveAttribute('aria-pressed', 'true');
    expect(createMemoryScene).not.toHaveBeenCalled();
    toMove();
    expect(screen.getByRole('button', { name: 'Inspect String bytes' })).toBeInTheDocument();
  });
});
