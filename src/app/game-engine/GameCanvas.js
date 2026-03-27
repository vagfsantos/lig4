export class GameCanvas {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  getCanvas() {
    return this.canvas;
  }

  getCanvasContext() {
    return this.ctx;
  }

  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
