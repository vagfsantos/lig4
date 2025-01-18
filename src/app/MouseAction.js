export class MouseAction {
  mouseMoveCallbacks = [];
  mouseOutCallbacks = [];
  mouseClickCallbacks = [];

  constructor({ ctx, canvas }) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  watch() {
    this.watchMouseMove();
    this.watchMouseOut();
    this.watchMouseClick();
  }

  onMouseMove(callback) {
    this.mouseMoveCallbacks.push(callback);
  }

  onMouseOut(callback) {
    this.mouseOutCallbacks.push(callback);
  }

  onMouseClick(callback) {
    this.mouseClickCallbacks.push(callback);
  }

  watchMouseMove() {
    this.canvas.addEventListener("mousemove", (event) => {
      const positionX = event.offsetX;
      const positionY = event.offsetY;

      this.mouseMoveCallbacks.forEach((callback) =>
        callback({ positionX, positionY })
      );
    });
  }

  watchMouseOut() {
    this.canvas.addEventListener("mouseout", (event) => {
      this.mouseOutCallbacks.forEach((callback) => callback());
    });
  }

  watchMouseClick() {
    this.canvas.addEventListener("click", (event) => {
      const positionX = event.offsetX;
      const positionY = event.offsetY;

      this.mouseClickCallbacks.forEach((callback) =>
        callback({ positionX, positionY })
      );
    });
  }
}
