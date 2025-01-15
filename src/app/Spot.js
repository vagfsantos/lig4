export class Spot {
  state = SpotStates.EMPTY;

  getState() {
    return this.state;
  }

  getColor() {
    return SpotStatesColor[this.state];
  }

  preActivate() {
    this.state = SpotStates.PLAYER_PREACTIVE;
  }

  inactivate() {
    this.state = SpotStates.EMPTY;
  }
}

export const SpotStates = {
  EMPTY: "empty",
  PLAYER: "player",
  MACHINE: "machine",
  PLAYER_PREACTIVE: "player_preactive",
  MACHINE_PREACTIVE: "machine_preactive",
};

export const SpotStatesColor = {
  [SpotStates.EMPTY]: "#c3c3c3",
  [SpotStates.PLAYER]: "#FF9F1C",
  [SpotStates.MACHINE]: "#E71D36",
  [SpotStates.PLAYER_PREACTIVE]: "#FFD192",
  [SpotStates.MACHINE_PREACTIVE]: "#FF94A1",
};
