import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import {
  BOARD_SETTINGS,
  PLAYERS_ID,
  SPOT_STATUSES,
} from '@lig4/constants/gameSettings'
import { ColumnEventObject } from '@lig4/objects/ColumnEventObject'
import { SpotObject } from '@lig4/objects/SpotObject'

export class Lig4Controller {
  canvas = new GameCanvas()
  controller = null
  boardSpotsByColumn = null
  columnEventPlaceholders = []

  _onPlayerTurnChangeCallbackList = []
  _playerTurn = null

  init() {
    this._setupCanvas()
    this._setupSpotsOnBoard()
  }

  startGame() {
    this._createColumnEventObjects()
    this._setupEvents()
    this._togglePlayerTurn()
  }

  onPlayerTurnChange(callback) {
    this._onPlayerTurnChangeCallbackList.push(callback)
  }

  _runOnPlayerTurnChangeCallbacks() {
    this._onPlayerTurnChangeCallbackList.forEach((callback) => {
      callback({ playerTurn: this._playerTurn })
    })
  }

  _togglePlayerTurn() {
    const currentPlayerTurn = this._playerTurn
    if (
      currentPlayerTurn === null ||
      currentPlayerTurn === PLAYERS_ID.MACHINE
    ) {
      this._playerTurn = PLAYERS_ID.USER
    } else {
      this._playerTurn = PLAYERS_ID.MACHINE
      this._setAllAvailableSpotsAsDefault()
    }

    this._runOnPlayerTurnChangeCallbacks()
  }

  _setupEvents() {
    this._setupColumnEventsMouseOver()
    this._setupColumnEventsClick()
    this.columnEventPlaceholders.forEach((column) => {
      column.watchForEvents({ DOMElement: this.canvas.getCanvas() })
    })
  }

  _setupColumnEventsMouseOver() {
    this.columnEventPlaceholders.forEach((column, columnIndex) => {
      column.onEvent({
        name: 'mousemove',
        callback: ({ isInsideGameObjectArea }) => {
          const isUserPlayTurn = this._playerTurn === PLAYERS_ID.USER

          if (!isUserPlayTurn) return

          if (isInsideGameObjectArea) {
            this._setAvailableSpotsAsPreSelectedOnColumnIndex({ columnIndex })
          } else {
            this._setAvailableSpotsAsDefaultOnColumnIndex({ columnIndex })
          }
        },
      })
    })
  }

  _setupColumnEventsClick() {
    this.columnEventPlaceholders.forEach((column, columnIndex) => {
      column.onEvent({
        name: 'click',
        callback: ({ isInsideGameObjectArea }) => {
          if (isInsideGameObjectArea) {
            this._setOwnerToFirstAvailableSpotOnColumnIndex({ columnIndex })
          }
        },
      })
    })
  }

  _setOwnerToFirstAvailableSpotOnColumnIndex({ columnIndex }) {
    const columnSpots = this.boardSpotsByColumn[columnIndex]

    const availableSpot = columnSpots.find((spot) => spot.getOwner() === null)

    if (availableSpot) {
      availableSpot?.setOwner(PLAYERS_ID.USER)
      this._togglePlayerTurn()
    }
  }

  _setAvailableSpotsAsDefaultOnColumnIndex({ columnIndex }) {
    const columnSpots = this.boardSpotsByColumn[columnIndex]

    columnSpots.forEach((spot) => {
      if (!spot.hasOwner()) {
        spot.setStatus(SPOT_STATUSES.DEFAULT)
      }
    })
  }

  _setAllAvailableSpotsAsDefault() {
    this.boardSpotsByColumn.forEach((_, columnIndex) => {
      this._setAvailableSpotsAsDefaultOnColumnIndex({ columnIndex })
    })
  }

  _setAvailableSpotsAsPreSelectedOnColumnIndex({ columnIndex }) {
    const columnSpots = this.boardSpotsByColumn[columnIndex]

    columnSpots.forEach((spot) => {
      if (!spot.hasOwner()) {
        spot.setStatus(SPOT_STATUSES.PRE_SELECTED)
      }
    })
  }

  _createColumnEventObjects() {
    const spotExample = this.boardSpotsByColumn[0][0]
    const { height: canvasHeight } = this.canvas.getCanvasSize()

    this.boardSpotsByColumn.forEach((_, columnIndex) => {
      const columnGameObject = new ColumnEventObject({
        name: `column-${columnIndex}`,
      })

      columnGameObject.y = 0
      columnGameObject.height = canvasHeight

      columnGameObject.x =
        columnIndex * (spotExample.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X)
      columnGameObject.width = spotExample.diameterSize
      this.columnEventPlaceholders.push(columnGameObject)

      this.controller.addGameObject({ gameObject: columnGameObject })
    })
  }

  _setupSpotsOnBoard() {
    const columns = new Array(BOARD_SETTINGS.COLUMNS).fill(null)
    const spotsPerColumn = new Array(BOARD_SETTINGS.SPOTS_PER_COLUMN).fill(null)

    const { height: canvasHeight } = this.canvas.getCanvasSize()

    const boardSpotsByColumn = columns.map((_, columnIndex) => {
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
        this.controller.addGameObject({ gameObject: spot })

        return spot
      })
    })

    this.boardSpotsByColumn = boardSpotsByColumn
  }

  _setupCanvas() {
    this.canvas.setCanvasSize(
      BOARD_SETTINGS.CANVAS_WIDTH,
      BOARD_SETTINGS.CANVAS_HEIGHT
    )

    this.controller = new GameController({
      gameCanvas: this.canvas,
    })

    this.controller.startGame()
  }
}
