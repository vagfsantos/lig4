export class Controller {
  constructor({ mouseAction, board }) {
    this.mouseAction = mouseAction;
    this.board = board;
  }

  watchMouseEvents() {
    this.mouseAction.watch();
    this.mouseAction.onMouseMove((...args) => this.onMouseMove(...args));
    this.mouseAction.onMouseOut((...args) => this.onMouseOut(...args));
  }

  onMouseMove({ positionX, positionY }) {
    this.board.setColumnActive({ positionX });
  }

  onMouseOut() {
    this.board.setAllColumnsInactive();
  }
}
