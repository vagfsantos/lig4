import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { BOARD_SETTINGS, PLAYERS_ID } from '@lig4/constants/gameSettings'
import { Lig4Board } from '@lig4/game/Lig4Board'
import { Lig4GameRules } from '@lig4/game/Lig4GameRules'
import { Lig4Machine } from '@lig4/game/Lig4Machine'
import { Lig4RoundController } from '@lig4/game/Lig4RoundController'
import { Lig4UX } from '@lig4/game/Lig4UX'
import { ColumnEventObject } from '@lig4/objects/ColumnEventObject'

export class Lig4Controller {
  Canvas = new GameCanvas()
  RoundController = new Lig4RoundController()
  Controller = null
  Machine = null
  Board = null
  UX = null
  GameRules = null

  _columnEventPlaceholders = []

  init() {
    this._setup()
    this._setupBoard()
    this._setupColumnPlaceholders()
    this._setupEvents()
    this._setupUX()
    this._setupRounds()

    this.Controller.startGame()
  }

  _setup() {
    this.Canvas.setCanvasSize(
      BOARD_SETTINGS.CANVAS_WIDTH,
      BOARD_SETTINGS.CANVAS_HEIGHT
    )

    this.Controller = new GameController({
      gameCanvas: this.Canvas,
    })
    this.Board = new Lig4Board({ gameCanvas: this.Canvas })
    this.Machine = new Lig4Machine({ Board: this.Board })
    this.UX = new Lig4UX()
    this.GameRules = new Lig4GameRules({ Board: this.Board })
  }

  _setupBoard() {
    this.Board.init()
    this.Board.getColumns().forEach((column) => {
      column.forEach((spot) => {
        this.Controller.addGameObject({ gameObject: spot })
      })
    })
  }

  _setupUX() {
    this.UX.init({ gameCanvas: this.Canvas.getCanvas() })
    this.UX.onStartGame(() => {
      this.RoundController.setPlayerInCurrentTurn(PLAYERS_ID.USER)
    })
  }

  _setupRounds() {
    this.RoundController.onRoundChange(() => this._machinePlay())
    this.RoundController.onRoundChange(({ playerTurn }) => {
      if (this.GameRules.isMatchOver()) {
        alert('End game')
      }
      this.UX.onPlayerTurnChange({ playerTurn })
    })
  }

  _setupColumnPlaceholders() {
    this._createColumnEventObjects()
  }

  _setupEvents() {
    this._setupColumnEventsMouseOver()
    this._setupColumnEventsClick()
    this._columnEventPlaceholders.forEach((column) => {
      column.watchForEvents({ DOMElement: this.Canvas.getCanvas() })
    })
  }

  _machinePlay() {
    this.Board.setAllAvailableSpotsAsDefault()

    if (!this.RoundController.isMachinesTurn() || this.Board.isBoardFull()) {
      return
    }

    const whereToPlay = this.Machine.whereToplay({
      spotsByColumn: this.Board.getColumns(),
    })

    window.setTimeout(() => {
      this.Board.setOwnerToFirstAvailableSpotOnColumnIndex({
        columnIndex: whereToPlay.columIndex,
        owner: PLAYERS_ID.MACHINE,
      })
      this.RoundController.togglePlayTurn()
    }, 500)
  }

  _userPlayOnColumn({ columnIndex }) {
    try {
      this.Board.setOwnerToFirstAvailableSpotOnColumnIndex({
        columnIndex,
        owner: PLAYERS_ID.USER,
      })
      this.RoundController.togglePlayTurn()
    } catch (e) {
      console.info(e)
    }
  }

  _setupColumnEventsMouseOver() {
    this._columnEventPlaceholders.forEach((column, columnIndex) => {
      column.onEvent({
        name: 'mousemove',
        callback: ({ isInsideGameObjectArea }) => {
          if (!this.RoundController.isUsersTurn()) return

          if (isInsideGameObjectArea) {
            this.Board.setAvailableSpotsAsPreSelectedOnColumnIndex({
              columnIndex,
            })
          } else {
            this.Board.setAvailableSpotsAsDefaultOnColumnIndex({ columnIndex })
          }
        },
      })
    })
  }

  _setupColumnEventsClick() {
    this._columnEventPlaceholders.forEach((column, columnIndex) => {
      column.onEvent({
        name: 'click',
        callback: ({ isInsideGameObjectArea }) => {
          if (isInsideGameObjectArea && this.RoundController.isUsersTurn()) {
            this._userPlayOnColumn({ columnIndex })
          }
        },
      })
    })
  }

  _createColumnEventObjects() {
    const spotExample = this.Board.getColumns()[0][0]
    const { height: canvasHeight } = this.Canvas.getCanvasSize()

    this.Board.getColumns().forEach((_, columnIndex) => {
      const columnGameObject = new ColumnEventObject({
        name: `column-${columnIndex}`,
      })

      columnGameObject.y = 0
      columnGameObject.height = canvasHeight

      columnGameObject.x =
        columnIndex * (spotExample.diameterSize + BOARD_SETTINGS.SPOT_MARGIN_X)
      columnGameObject.width = spotExample.diameterSize
      this._columnEventPlaceholders.push(columnGameObject)

      this.Controller.addGameObject({ gameObject: columnGameObject })
    })
  }
}
