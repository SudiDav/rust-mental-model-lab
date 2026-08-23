import type { SimulationController, SimulationModel } from './types';

export function createSimulationController<State, Event>(model: SimulationModel<State, Event>): SimulationController<State, Event> {
  let currentState = model.initialState;
  let currentIndex = -1;

  const replay = (lastEventIndex: number): State => {
    let state = model.initialState;
    for (let index = 0; index <= lastEventIndex; index += 1) {
      state = model.reduce(state, model.events[index]);
    }
    return state;
  };

  return {
    get state() {
      return currentState;
    },
    get eventIndex() {
      return currentIndex;
    },
    stepForward() {
      if (currentIndex < model.events.length - 1) {
        currentIndex += 1;
        currentState = model.reduce(currentState, model.events[currentIndex]);
      }
      return currentState;
    },
    stepBackward() {
      if (currentIndex >= 0) {
        currentIndex -= 1;
        currentState = replay(currentIndex);
      }
      return currentState;
    },
    reset() {
      currentIndex = -1;
      currentState = model.initialState;
      return currentState;
    },
    select(entityId: string) {
      if (model.select) currentState = model.select(currentState, entityId);
      return currentState;
    },
  };
}
