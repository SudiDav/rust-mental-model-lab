export interface InspectableEntity {
  id: string;
  label: string;
  description: string;
  details: Array<{ label: string; value: string }>;
}

export interface SimulationModel<State, Event> {
  initialState: State;
  events: readonly Event[];
  reduce(state: State, event: Event): State;
  describe(state: State): string;
  inspect(state: State, entityId: string): InspectableEntity | undefined;
  select?(state: State, entityId: string): State;
}

export interface SimulationController<State, Event> {
  readonly state: State;
  readonly eventIndex: number;
  stepForward(): State;
  stepBackward(): State;
  reset(): State;
  select(entityId: string): State;
}
