import { SPOTS_PER_COLUMNS_COUNT } from "./constants";

export class Column {
  spots = [];

  addSpots(spots) {
    if (spots.length === SPOTS_PER_COLUMNS_COUNT) {
      this.spots = spots;
      return;
    }

    throw new Error(
      `Spots should be equal to ${SPOTS_PER_COLUMNS_COUNT}. It was given ${spots.length}`
    );
  }

  getSpots() {
    return this.spots;
  }

  hasAvailableSpot() {
    return this.spots.some((spot) => !spot.hasOwner());
  }
}
