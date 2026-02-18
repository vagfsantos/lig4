import { BOARD_SETTINGS } from "./constants/gameSettings";
import { GameCanvas } from "./engine/Game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = new GameCanvas();
  canvas.setCanvasSize(
    BOARD_SETTINGS.CANVAS_WIDTH,
    BOARD_SETTINGS.CANVAS_HEIGHT,
  );

  document.querySelector("#canvas-placeholder").appendChild(canvas.getCanvas());
});
