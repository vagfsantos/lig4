import { GameCanvas } from "@game-engine/GameCanvas";
import { GameController } from "@game-engine/GameController";
import { BOARD_SETTINGS } from "@lig4/constants/gameSettings";
import { SpotObject } from "@lig4/objects/SpotObject";

export class Lig4Controller {
  canvas = new GameCanvas();
  controller = null;

  init() {
    this._setupCanvas();
    this._setupBoard();
  }

  _setupBoard() {
    const columns = new Array(BOARD_SETTINGS.COLUMNS).fill(null);
    const spotsPerColumn = new Array(BOARD_SETTINGS.SPOTS_PER_COLUMN).fill(
      null,
    );

    const { height: canvasHeight } = this.canvas.getCanvasSize();

    const boardSpotsByColumn = columns.map((_, columnIndex) => {
      return spotsPerColumn.map((_, spotIndex) => {
        const spot = new SpotObject({
          name: `spot-col-${columnIndex}-num-${spotIndex}`,
        });

        const x =
          columnIndex * (spot.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X);
        const yOffset =
          spot.diameterSize + (spotIndex && BOARD_SETTINGS.SPOT_MARGIN_Y);
        const y = canvasHeight - yOffset * (spotIndex + 1); // y-offset columns are placed bottom to up

        spot.setCoordinates({ x, y });
        this.controller.addGameObject({ gameObject: spot });

        return spot;
      });
    });

    this.boardSpotsByColumn = boardSpotsByColumn;

    console.log({ boardSpotsByColumn });
  }

  _setupCanvas() {
    this.canvas.setCanvasSize(
      BOARD_SETTINGS.CANVAS_WIDTH,
      BOARD_SETTINGS.CANVAS_HEIGHT,
    );

    this.controller = new GameController({
      gameCanvas: this.canvas,
    });

    this.controller.startGame();
  }
}
