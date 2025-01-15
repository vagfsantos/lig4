import { Column } from "./Column";
import {
  COLUMN_COUNT,
  SPOT_HALF_RADIUS,
  SPOT_MARGIN,
  SPOT_RADIUS,
  SPOTS_PER_COLUMNS_COUNT,
} from "./constants";
import { Spot, SpotStates } from "./Spot";

export class Board {
  width = null;
  height = null;
  columns = [];

  constructor({ ctx, width, height }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.columns = Array(COLUMN_COUNT)
      .fill(null)
      .map(() => new Column());
    this.fillColumnsWithSpots();
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
    const columnActiveIndex = Math.floor(
      positionX / (this.width / COLUMN_COUNT)
    );

    this.columns.forEach((column, index) => {
      if (index === columnActiveIndex) {
        return column.setSpotsActive();
      }

      column.setColumnInactive();
    });
  }

  setAllColumnsInactive() {
    this.columns.forEach((column) => {
      column.setColumnInactive();
    });
  }

  renderSpot() {}
}
