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
  matchResult = null;

  constructor({ ctx, width, height }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.onMatchEndCallbacks = [];
    this.onPlayTurnChangeCallbacks = [];
    this.columns = Array(COLUMN_COUNT)
      .fill(null)
      .map(() => new Column());
    this.fillColumnsWithSpots();
  }

  getPlayTurn() {
    return this.playTurn;
  }

  onPlayTurnChange(callback) {
    this.onPlayTurnChangeCallbacks.push(callback);
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
          this.getPlayTurn() === PLAYERS.USER &&
          !this.matchResult
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

    this.onPlayTurnChangeCallbacks.forEach((callback) =>
      callback({ currentTurn: this.playTurn })
    );
  }

  play({ whichPlayer, columnIndex }) {
    if (this.matchResult) return;

    const availableSpot = this.columns[columnIndex]
      .getSpots()
      .findLast((spot) => !spot.hasOwner());

    if (!availableSpot) {
      throw Error("Cannot play in this column.");
    }

    availableSpot.setOwnedBy(whichPlayer);
    this.findWinnerMatch();
    this.setNextPlayerTurn({ currentPlayer: whichPlayer });
    window.setTimeout(() => this.maybeMachinePlay(), 1500);
  }

  getColumnIndexesPossibleToPlay() {
    return this.columns.reduce((availableIndexes, column, index) => {
      const available = column.hasAvailableSpot() ? [index] : [];
      return [...availableIndexes, ...available];
    }, []);
  }

  maybeMachinePlay() {
    if (this.getPlayTurn() === PLAYERS.MACHINE && !this.matchResult) {
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

  findWinnerMatch() {
    const columns = [];
    const rows = [];
    const diagonalColumns = [];
    const diagonalRows = [];

    this.columns.forEach((column) => {
      const spotsForColumn = column.getSpots();
      columns.push(spotsForColumn);

      spotsForColumn.forEach((spot, spotIndex) => {
        if (Array.isArray(rows[spotIndex])) {
          return rows[spotIndex].push(spot);
        }
        rows[spotIndex] = [spot];
      });
    });

    columns.forEach((column, columnIndex) => {
      column.forEach((spot, spotIndex) => {
        if (Array.isArray(diagonalColumns[spotIndex + columnIndex])) {
          return diagonalColumns[spotIndex + columnIndex].push(spot);
        } else if (diagonalColumns[spotIndex + columnIndex] == undefined) {
          diagonalColumns[spotIndex + columnIndex] = [spot];
        }
      });
    });

    columns.reverse().forEach((row, rowIndex) => {
      row.forEach((spot, spotIndex) => {
        if (Array.isArray(diagonalRows[spotIndex + rowIndex])) {
          return diagonalRows[spotIndex + rowIndex].push(spot);
        } else if (diagonalRows[spotIndex + rowIndex] == undefined) {
          diagonalRows[spotIndex + rowIndex] = [spot];
        }
      });
    });

    this.alertWinner(columns);
    this.alertWinner(rows);
    this.alertWinner(diagonalColumns);
    this.alertWinner(diagonalRows);
  }

  alertWinner(list) {
    if (this.matchResult) return;

    const sequence = {
      [PLAYERS.USER]: 0,
      [PLAYERS.MACHINE]: 0,
    };

    list.forEach((spots) => {
      spots.forEach((spot) => {
        if (spot.getState() === PLAYERS.USER) {
          sequence[PLAYERS.USER]++;
          sequence[PLAYERS.MACHINE] = 0;
        } else if (spot.getState() === PLAYERS.MACHINE) {
          sequence[PLAYERS.MACHINE]++;
          sequence[PLAYERS.USER] = 0;
        } else {
          sequence[PLAYERS.MACHINE] = 0;
          sequence[PLAYERS.USER] = 0;
        }

        Object.entries(sequence).forEach(([key, value]) => {
          if (value >= 4) {
            this.setMatchEnd({ result: key });
          }
        });
      });

      sequence[PLAYERS.USER] = 0;
      sequence[PLAYERS.MACHINE] = 0;
    });
  }

  onMatchEnd(callback) {
    this.onMatchEndCallbacks.push(callback);
  }

  setMatchEnd({ result }) {
    this.matchResult = result;
    this.onMatchEndCallbacks.forEach((callback) => callback({ result }));
  }
}
