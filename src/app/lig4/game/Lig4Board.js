import { BOARD_SETTINGS, SPOT_STATUSES } from '@lig4/constants/gameSettings'
import { SpotObject } from '@lig4/objects/SpotObject'

export class Lig4Board {
  _columnsWithSpots = null

  constructor({ gameCanvas }) {
    this.Canvas = gameCanvas
  }

  init() {
    this._setupSpotsOnBoard()
  }

  getColumns() {
    return this._columnsWithSpots
  }

  isBoardFull() {
    return this._columnsWithSpots.every((column) => {
      return column.every((spot) => spot.getOwner() !== null)
    })
  }

  setOwnerToFirstAvailableSpotOnColumnIndex({ columnIndex, owner }) {
    const columnSpots = this._columnsWithSpots[columnIndex]

    const availableSpot = columnSpots.find((spot) => spot.getOwner() === null)

    if (availableSpot) {
      availableSpot?.setOwner(owner)
      return
    }

    throw Error(`No avaiable spot on column index: ${columnIndex}`)
  }

  setAvailableSpotsAsDefaultOnColumnIndex({ columnIndex }) {
    const columnSpots = this._columnsWithSpots[columnIndex]

    columnSpots.forEach((spot) => {
      if (!spot.hasOwner()) {
        spot.setStatus(SPOT_STATUSES.DEFAULT)
      }
    })
  }

  setAvailableSpotsAsPreSelectedOnColumnIndex({ columnIndex }) {
    const columnSpots = this._columnsWithSpots[columnIndex]

    columnSpots.forEach((spot) => {
      if (!spot.hasOwner()) {
        spot.setStatus(SPOT_STATUSES.PRE_SELECTED)
      }
    })
  }

  setAllAvailableSpotsAsDefault() {
    this._columnsWithSpots.forEach((column) => {
      column.forEach((spot) => {
        if (!spot.hasOwner()) {
          spot.setStatus(SPOT_STATUSES.DEFAULT)
        }
      })
    })
  }

  _setupSpotsOnBoard() {
    const columns = new Array(BOARD_SETTINGS.COLUMNS).fill(null)
    const spotsPerColumn = new Array(BOARD_SETTINGS.SPOTS_PER_COLUMN).fill(null)

    const { height: canvasHeight } = this.Canvas.getCanvasSize()

    const columnsWithSpots = columns.map((_, columnIndex) => {
      return spotsPerColumn.map((_, spotIndex) => {
        const spot = new SpotObject({
          name: `spot-col-${columnIndex}-num-${spotIndex}`,
        })

        const x =
          columnIndex * (spot.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X)
        const yOffset =
          spot.diameterSize + (spotIndex && BOARD_SETTINGS.SPOT_MARGIN_Y)
        const y = canvasHeight - yOffset * (spotIndex + 1) // y-offset columns are placed bottom to up

        spot.setCoordinates({ x, y })

        return spot
      })
    })

    this._columnsWithSpots = columnsWithSpots
  }
}
