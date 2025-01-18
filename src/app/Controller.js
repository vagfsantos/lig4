import { PLAYERS } from "./constants";

export class Controller {
  constructor({ mouseAction, board }) {
    this.mouseAction = mouseAction;
    this.board = board;
  }

  watchMouseEvents() {
    this.mouseAction.watch();
    this.mouseAction.onMouseMove((...args) => this.onMouseMove(...args));
    this.mouseAction.onMouseOut((...args) => this.onMouseOut(...args));
    this.mouseAction.onMouseClick((...args) => this.onMousClick(...args));
  }

  onMouseMove({ positionX, positionY }) {
    this.board.setColumnActive({ positionX });
  }

  onMouseOut() {
    this.board.setAllColumnsInactive();
  }

  onMousClick({ positionX, positionY }) {
    if (this.board.getPlayTurn() === PLAYERS.USER) {
      this.board.play({
        whichPlayer: PLAYERS.USER,
        columnIndex: this.board.getColumnIndexByPositionX(positionX),
      });
    }
  }
}
