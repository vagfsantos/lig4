import { Board } from "./Board";

export class Game {
  player = null;
  machine = null;
  board = null;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.board = new Board({
      ctx: this.ctx,
      width: canvas.width,
      height: canvas.height,
    });
  }

  init() {
    this.board.renderBoard(this.ctx);
  }
}
