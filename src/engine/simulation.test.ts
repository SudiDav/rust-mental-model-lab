import { describe, expect, it } from 'vitest';
import { createSimulationController } from './simulation';
import { binaryPlayground } from '../simulations/binary';

describe('simulation controller', () => {
  it('steps forward, steps backward, and resets a deterministic model', () => {
    const model = binaryPlayground();
    const controller = createSimulationController(model);

    expect(controller.state.binary).toBe('01010011');
    controller.stepForward();
    expect(controller.state.binary).toBe('11010011');
    controller.stepBackward();
    expect(controller.state.binary).toBe('01010011');
    controller.stepForward();
    controller.reset();
    expect(controller.state.binary).toBe('01010011');
  });
});
