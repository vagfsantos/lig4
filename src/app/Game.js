import { Board } from "./Board";
import { Controller } from "./Controller";
import { MouseAction } from "./MouseAction";

export class Game {
  player = null;
  machine = null;
  board = null;
  controller = null;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.board = new Board({
      ctx: this.ctx,
      width: canvas.width,
      height: canvas.height,
    });
    this.mouseAction = new MouseAction({
      ctx: this.ctx,
      canvas: this.canvas,
    });
    this.controller = new Controller({
      mouseAction: this.mouseAction,
      board: this.board,
    });
  }

  init() {
    window.requestAnimationFrame(() => {
      this.board.renderBoard();
    });
    this.controller.watchMouseEvents();
    this.controller.watchMatchEnd();
    this.controller.watchPlayTurn();
    this.controller.watchPlayAgain();
  }
}
