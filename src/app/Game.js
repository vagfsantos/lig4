export class Game {
  player = null;
  machine = null;
  board = [];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  init() {
    this.ctx.beginPath();
    this.ctx.arc(100, 50, 100, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
