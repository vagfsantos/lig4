import { Column } from "./Column";
import {
  COLUMN_COUNT,
  PLAYERS,
  SPOT_MARGIN,
  SPOT_RADIUS,
  SPOTS_PER_COLUMNS_COUNT,
} from "./constants";
import { Spot } from "./Spot";

export class Board {
  width = null;
  height = null;
  columns = [];
  playTurn = PLAYERS.USER;

  constructor({ ctx, width, height }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.columns = Array(COLUMN_COUNT)
      .fill(null)
      .map(() => new Column());
    this.fillColumnsWithSpots();
  }

  getPlayTurn() {
    return this.playTurn;
  }

  fillColumnsWithSpots() {
    this.columns.forEach((col) => {
      col.addSpots(
        Array(SPOTS_PER_COLUMNS_COUNT)
          .fill(null)
          .map(() => new Spot())
      );
    });
  }

  getSpotPosition(index) {
    return (
      index * SPOT_RADIUS * 2 +
      SPOT_RADIUS +
      (index === 0 ? 0 : SPOT_MARGIN * index)
    );
  }

  getColumnIndexByPositionX(positionX) {
    const columnActiveIndex = Math.floor(
      positionX / (this.width / COLUMN_COUNT)
    );

    return columnActiveIndex;
  }

  renderBoard() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.columns.forEach((col, columnIndex) => {
      const currentSpots = col.getSpots();

      currentSpots.forEach((spot, spotIndex) => {
        this.ctx.beginPath();
        this.ctx.arc(
          this.getSpotPosition(columnIndex),
          this.getSpotPosition(spotIndex),
          SPOT_RADIUS,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = spot.getColor();
        this.ctx.fill();
        this.ctx.closePath();
      });
    });

    window.requestAnimationFrame(() => this.renderBoard());
  }

  setColumnActive({ positionX }) {
    const columnActiveIndex = this.getColumnIndexByPositionX(positionX);
    this.columns.forEach((column, index) => {
      return column.getSpots().forEach((spot) => {
        if (
          index === columnActiveIndex &&
          !spot.hasOwner() &&
          this.getPlayTurn() === PLAYERS.USER
        ) {
          return spot.preActivate();
        }

        if (!spot.hasOwner()) {
          spot.inactivate();
        }
      });
    });
  }

  setAllColumnsInactive() {
    this.columns.forEach((column) => {
      column.getSpots().forEach((spot) => {
        if (!spot.hasOwner()) {
          spot.inactivate();
        }
      });
    });
  }

  setNextPlayerTurn({ currentPlayer }) {
    this.playTurn =
      currentPlayer === PLAYERS.USER ? PLAYERS.MACHINE : PLAYERS.USER;
  }

  play({ whichPlayer, columnIndex }) {
    const availableSpot = this.columns[columnIndex]
      .getSpots()
      .findLast((spot) => !spot.hasOwner());

    if (!availableSpot) {
      throw Error("Cannot play in this column.");
    }

    availableSpot.setOwnedBy(whichPlayer);
    this.setNextPlayerTurn({ currentPlayer: whichPlayer });
    this.maybeMachinePlay();
  }

  getColumnIndexesPossibleToPlay() {
    return this.columns.reduce((availableIndexes, column, index) => {
      const available = column.hasAvailableSpot() ? [index] : [];
      return [...availableIndexes, ...available];
    }, []);
  }

  maybeMachinePlay() {
    if (this.getPlayTurn() === PLAYERS.MACHINE) {
      const columnIndexesAvailable = this.getColumnIndexesPossibleToPlay();

      const randomPosition =
        columnIndexesAvailable[
          Math.round(Math.random() * (columnIndexesAvailable.length - 1))
        ];

      this.play({
        whichPlayer: PLAYERS.MACHINE,
        columnIndex: randomPosition,
      });
    }
  }
}
