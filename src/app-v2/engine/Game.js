export class GameRenderEngine {
  render() {
    this.render();
  }
}

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

export class GameObject {}

export class GameController {
  constructor() {}

  init() {
    // window.requestAnimationFrame(() => {
    //   this.renderEngine.render();
    // });
  }
}
