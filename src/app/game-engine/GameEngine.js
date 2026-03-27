export class GameRenderEngine {
  clean({ gameCanvas }) {
    gameCanvas
      .getCanvasContext()
      .clearRect(
        0,
        0,
        gameCanvas.getCanvas().width,
        gameCanvas.getCanvas().height,
      );
  }

  update({ gameCanvas, gameObjectsList }) {
    gameObjectsList.forEach((gameObject) => {
      gameObject.update({ gameCanvas });
    });
  }

  render({ gameCanvas, gameObjectsList }) {
    this.clean({ gameCanvas });
    this.update({ gameCanvas, gameObjectsList });

    gameObjectsList.forEach((gameObject) => {
      gameObject.render({ gameCanvas });
    });

    window.requestAnimationFrame(() => {
      this.render({
        gameCanvas,
        gameObjectsList,
      });
    });
  }
}
