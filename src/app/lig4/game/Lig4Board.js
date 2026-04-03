import { BOARD_SETTINGS, SPOT_STATUSES } from '@lig4/constants/gameSettings'
import { SpotObject } from '@lig4/objects/SpotObject'

const COLUMNS_PLACEHOLDER = new Array(BOARD_SETTINGS.COLUMNS).fill(null)
const SPOTS_PER_COLUMN_PLACEHOLDER = new Array(
  BOARD_SETTINGS.SPOTS_PER_COLUMN
).fill(null)

const DIAGONALS_COLUMNS = new Array(
  COLUMNS_PLACEHOLDER.length + SPOTS_PER_COLUMN_PLACEHOLDER.length - 1
).fill(null)

export class Lig4Board {
  Canvas = null

  _columnsWithSpots = null

  _verticalSpots = []
  _horizontalSpots = SPOTS_PER_COLUMN_PLACEHOLDER.map(() => [])
  _diagonalSpotsLeftToRight = DIAGONALS_COLUMNS.map(() => [])
  _diagonalSpotsRightToLeft = DIAGONALS_COLUMNS.map(() => [])

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
    const { height: canvasHeight } = this.Canvas.getCanvasSize()

    const columnsWithSpots = COLUMNS_PLACEHOLDER.map((_, columnIndex) => {
      const allSpotsOnColumn = SPOTS_PER_COLUMN_PLACEHOLDER.map(
        (_, spotIndex) => {
          const spot = new SpotObject({
            name: `spot-col-${columnIndex}-spot-${spotIndex}`,
          })

          const x =
            columnIndex * (spot.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X)
          const yOffset =
            spot.diameterSize + (spotIndex && BOARD_SETTINGS.SPOT_MARGIN_Y)
          const y = canvasHeight - yOffset * (spotIndex + 1) // y-offset columns are placed bottom to up

          spot.setCoordinates({ x, y })

          this._fillHorizontalSpotsWith({ spot, horizontalIndex: spotIndex })

          return spot
        }
      )

      this._fillVerticalSpotsWith({ spots: allSpotsOnColumn })

      return allSpotsOnColumn
    })

    this._columnsWithSpots = columnsWithSpots
    this._fillDiagonalSpots()
  }

  _fillDiagonalSpots() {
    this._verticalSpots.forEach((spotsOnColumn, columnIndex) => {
      spotsOnColumn.forEach((spot, spotIndex) => {
        this._diagonalSpotsLeftToRight[columnIndex + spotIndex].push(spot)
      })
    })

    this._verticalSpots.reverse().forEach((spotsOnColumn, columnIndex) => {
      spotsOnColumn.forEach((spot, spotIndex) => {
        this._diagonalSpotsRightToLeft[columnIndex + spotIndex].push(spot)
      })
    })
  }

  _fillVerticalSpotsWith({ spots }) {
    this._verticalSpots.push(spots)
  }

  _fillHorizontalSpotsWith({ spot, horizontalIndex }) {
    this._horizontalSpots[horizontalIndex].push(spot)
  }

  _fillDiagonalSpotsWith({ spots }) {
    this._diagonalSpots.push(spots)
  }
}
