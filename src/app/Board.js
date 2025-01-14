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
    this.width = height;
    this.columns = Array(COLUMN_COUNT)
      .fill(null)
      .map(() => new Column());
    this.fillColumnsWithSpots();
  }

  fillColumnsWithSpots() {
    console.log(this.columns);

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
  }

  renderSpot() {}
}
