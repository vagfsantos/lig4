import { GameCanvas } from "@game-engine/GameCanvas";
import { GameController } from "@game-engine/GameController";
import { GAME_OBJECT_TYPES, GameObject } from "@game-engine/GameObject";
import { BOARD_SETTINGS, SPOT_STATUSES } from "@lig4/constants/gameSettings";
import { SpotObject } from "@lig4/objects/SpotObject";

class ColumnEventObject extends GameObject {
  debugMode = false;
  type = GAME_OBJECT_TYPES.STATIC;

  render({ gameCanvas }) {
    if (this.debugMode) {
      const ctx = gameCanvas.getCanvasContext();
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}

export class Lig4Controller {
  canvas = new GameCanvas();
  controller = null;
  boardSpotsByColumn = null;
  columnEventPlaceholders = [];

  init() {
    this._setupCanvas();
    this._setupSpotsOnBoard();
    this._createColumnEvents();
    this._setupEvents();
  }

  _setupEvents() {
    this._setupColumnEventsMouseOver();
  }

  _setupColumnEventsMouseOver() {
    this.columnEventPlaceholders.forEach((column, columnIndex) => {
      const theSpots = this.boardSpotsByColumn[columnIndex];

      column.onEvent({
        name: "mousemove",
        callback: ({ isInsideGameObjectArea }) => {
          if (isInsideGameObjectArea) {
            theSpots.forEach((spot) => {
              spot.setStatus(SPOT_STATUSES.PRE_SELECTED);
            });
          } else {
            theSpots.forEach((spot) => {
              spot.setStatus(SPOT_STATUSES.DEFAULT);
            });
          }
        },
      });

      column.watchForEvents({ DOMElement: this.canvas.getCanvas() });
    });
  }

  _createColumnEvents() {
    const spotExample = this.boardSpotsByColumn[0][0];
    const { height: canvasHeight } = this.canvas.getCanvasSize();

    this.boardSpotsByColumn.forEach((_, columnIndex) => {
      const columnGameObject = new ColumnEventObject({
        name: `column-${columnIndex}`,
      });

      columnGameObject.y = 0;
      columnGameObject.height = canvasHeight;

      columnGameObject.x =
        columnIndex * (spotExample.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X);
      columnGameObject.width = spotExample.diameterSize;
      this.columnEventPlaceholders.push(columnGameObject);

      this.controller.addGameObject({ gameObject: columnGameObject });
    });
  }

  _setupSpotsOnBoard() {
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
