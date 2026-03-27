import { GameCanvas } from "@game-engine/GameCanvas";
import { GameController } from "@game-engine/GameController";
import { GameObject } from "@game-engine/GameObject";

import { BOARD_SETTINGS } from "@lig4/constants/gameSettings";

class Rect extends GameObject {
  update() {
    this.x += 1;
    this.y += 1;
  }

  render({ gameCanvas }) {
    gameCanvas.getCanvasContext().fillStyle = "black";
    gameCanvas.getCanvasContext().fillRect(this.x, this.y, 100, 100);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = new GameCanvas();

  canvas.setCanvasSize(
    BOARD_SETTINGS.CANVAS_WIDTH,
    BOARD_SETTINGS.CANVAS_HEIGHT,
  );

  const gameController = new GameController({
    gameCanvas: canvas,
  });

  gameController.addGameObject({
    gameObject: new Rect({ name: "rect" }),
  });

  gameController.startGame();

  document.querySelector("#canvas-placeholder").appendChild(canvas.getCanvas());
});
