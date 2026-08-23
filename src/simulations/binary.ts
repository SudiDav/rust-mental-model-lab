import type { InspectableEntity, SimulationModel } from '../engine/types';

export interface BinaryState {
  binary: string;
  decimal: number;
  hex: string;
  ascii: string;
  selectedIndex: number | null;
}

export type BinaryEvent = { type: 'toggle-bit'; index: number };

function stateFor(binary: string, selectedIndex: number | null): BinaryState {
  const decimal = Number.parseInt(binary, 2);
  const ascii = decimal >= 32 && decimal <= 126 ? String.fromCharCode(decimal) : '·';
  return { binary, decimal, hex: decimal.toString(16).toUpperCase().padStart(2, '0'), ascii, selectedIndex };
}

export function binaryPlayground(): SimulationModel<BinaryState, BinaryEvent> {
  const initialState = stateFor('01010011', null);
  return {
    initialState,
    events: [{ type: 'toggle-bit', index: 0 }],
    reduce(state, event) {
      if (event.type !== 'toggle-bit' || event.index < 0 || event.index >= state.binary.length) return state;
      const bits = state.binary.split('');
      bits[event.index] = bits[event.index] === '0' ? '1' : '0';
      return stateFor(bits.join(''), event.index);
    },
    describe(state) {
      return `${state.binary} is ${state.decimal} decimal, 0x${state.hex} hexadecimal, and ${state.ascii} as a display character.`;
    },
    inspect(_state, entityId): InspectableEntity | undefined {
      if (entityId !== 'byte') return undefined;
      return { id: 'byte', label: 'One byte', description: 'Eight bits interpreted together.', details: [] };
    },
  };
}
