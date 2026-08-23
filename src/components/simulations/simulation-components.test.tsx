import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BinaryPlayground } from './BinaryPlayground';
import { MemoryHierarchy } from './MemoryHierarchy';
import { ProcessMemory } from './ProcessMemory';
import { StackHeapExplorer } from './StackHeapExplorer';

describe('World 0–3 simulation panels', () => {
  it('lets the learner toggle a bit with an accessible button', async () => {
    const user = userEvent.setup();
    render(<BinaryPlayground scenario="basic" />);
    await user.click(screen.getByRole('button', { name: /bit 0/i }));
    expect(screen.getByText('211')).toBeInTheDocument();
  });

  it('lets the learner inspect a memory hierarchy level', async () => {
    const user = userEvent.setup();
    render(<MemoryHierarchy scenario="latency" />);
    await user.click(screen.getByRole('button', { name: /RAM/i }));
    expect(screen.getByText(/Selected: RAM/i)).toBeInTheDocument();
  });

  it('lets the learner inspect a process memory segment', async () => {
    const user = userEvent.setup();
    render(<ProcessMemory scenario="address-space" />);
    await user.click(screen.getByRole('button', { name: /HEAP/i }));
    expect(screen.getByText(/HEAP: Dynamic allocations/i)).toBeInTheDocument();
  });

  it('steps through stack and heap allocation details and resets', async () => {
    const user = userEvent.setup();
    render(<StackHeapExplorer scenario="string-allocation" />);
    await user.click(screen.getByRole('button', { name: /step forward/i }));
    await user.click(screen.getByRole('button', { name: /step forward/i }));
    expect(screen.getAllByText(/0xA120/i).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByText(/No allocation exists yet/i)).toBeInTheDocument();
  });
});
