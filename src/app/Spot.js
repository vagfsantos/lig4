import { PLAYERS } from "./constants";

export class Spot {
  state = SpotStates.EMPTY;
  isMatched = false;

  getState() {
    return this.state;
  }

  getIsMatched() {
    return this.isMatched;
  }

  getColor() {
    return SpotStatesColor[this.state];
  }

  preActivate() {
    this.state = SpotStates.PLAYER_PREACTIVE;
  }

  inactivate() {
    this.state = SpotStates.EMPTY;
    this.isMatched = false;
  }

  setAsMatched() {
    this.isMatched = true;
  }

  setOwnedBy(whichPlayer) {
    this.state = whichPlayer;
  }

  hasOwner() {
    return (
      this.state === SpotStates.PLAYER || this.state === SpotStates.MACHINE
    );
  }

  isPlayerOwner() {
    return this.getState() === SpotStates.PLAYER;
  }
}

export const SpotStates = {
  EMPTY: "empty",
  PLAYER: PLAYERS.USER,
  MACHINE: PLAYERS.MACHINE,
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
