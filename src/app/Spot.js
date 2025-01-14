export class Spot {
  state = SpotStates.EMPTY;

  getState() {
    return this.state;
  }

  getColor() {
    return SpotStatesColor[this.state];
  }
}

export const SpotStates = {
  EMPTY: "empty",
  PLAYER: "player",
  MACHINE: "machine",
};

export const SpotStatesColor = {
  [SpotStates.EMPTY]: "#c3c3c3",
  [SpotStates.PLAYER]: "#FF9F1C",
  [SpotStates.MACHINE]: "#E71D36",
};
