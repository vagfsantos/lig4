import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { GameSound } from '@game-engine/GameSound'
import { BOARD_SETTINGS, PLAYERS_ID } from '@lig4/constants/gameSettings'
import { Lig4Board } from '@lig4/game/Lig4Board'
import { Lig4GameRules } from '@lig4/game/Lig4GameRules'
import { Lig4Machine } from '@lig4/game/Lig4Machine'
import { Lig4RoundController } from '@lig4/game/Lig4RoundController'
import { Lig4Score } from '@lig4/game/Lig4Score'
import { Lig4UX } from '@lig4/game/Lig4UX'
import { ColumnEventObject } from '@lig4/objects/ColumnEventObject'
import backgroundSound from 'url:../../../sound/background.mp3'
import failSound from 'url:../../../sound/fail.mp3'
import hoverSound from 'url:../../../sound/hover.mp3'
import machinePlaySound from 'url:../../../sound/machine-play.mp3'
import userPlaySound from 'url:../../../sound/user-play.mp3'
import winSound from 'url:../../../sound/win.mp3'

export class Lig4Sound {
  Sound = new GameSound()

  bgSoundIsPlaying = false
  _hoverColumnindex = null

  playBackgroundSound() {
    if (!this._bgSoundIsPlaying) {
      this.Sound.playSound({
        url: backgroundSound,
        loop: true,
      })
      this._bgSoundIsPlaying = true
    }
  }

  playUserPlaySound() {
    this.Sound.playSound({
      url: userPlaySound,
      loop: false,
    })
  }

  playMachinePlaySound() {
    this.Sound.playSound({
      url: machinePlaySound,
      loop: false,
    })
  }

  playWinSound() {
    this.Sound.playSound({
      url: winSound,
      loop: false,
    })
  }

  playFailSound() {
    this.Sound.playSound({
      url: failSound,
      loop: false,
    })
  }

  playHoverSound({ columnIndex }) {
    if (columnIndex !== this._hoverColumnindex) {
      this.Sound.playSound({
        url: hoverSound,
        loop: false,
      })
    }

    this._hoverColumnindex = columnIndex
  }
}
export class Lig4Controller {
  Canvas = new GameCanvas()
  RoundController = new Lig4RoundController()
  Score = new Lig4Score()
  Sound = new Lig4Sound()
  Controller = null
  Machine = null
  Board = null
  UX = null
  GameRules = null

  _columnEventPlaceholders = []
  _matchHasEnded = false

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
      this.Sound.playBackgroundSound()
      this.RoundController.setPlayerInCurrentTurn(PLAYERS_ID.USER)
    })
    this.UX.onPlayAgain(() => {
      this._brandNewMatch()
    })
    this.Score.onScoreChange(({ scores }) => {
      this.UX.updateScore({ scores })
    })

    this.UX.onResetGame(() => {
      this._resetGame()
    })
  }

  _setupRounds() {
    this.RoundController.onRoundChange(() => this._machinePlay())
    this.RoundController.onRoundChange(({ playerTurn }) => {
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

  _checkMatchEnd() {
    const { isMatchOver, matchedSpots } = this.GameRules.isMatchOver()
    if (isMatchOver) {
      this._matchHasEnded = true
      matchedSpots.forEach((spot) => spot.setStatusAsMatched())
      if (this.RoundController.getPlayerInCurrentTurn() === PLAYERS_ID.USER) {
        this.Sound.playWinSound()
      } else {
        this.Sound.playFailSound()
      }

      this.UX.setMatchWinner({
        winner: this.RoundController.getPlayerInCurrentTurn(),
      })
      this.Score.addPointTo({
        winner: this.RoundController.getPlayerInCurrentTurn(),
      })
      this.RoundController.setPlayerInCurrentTurn(null)
    }
  }

  _brandNewMatch() {
    this._matchHasEnded = false
    this.Board.resetBoardToDefault()
    this.RoundController.setPlayerInCurrentTurn(PLAYERS_ID.USER)
  }

  _resetGame() {
    this._matchHasEnded = false
    this.Board.resetBoardToDefault()
    this.RoundController.setPlayerInCurrentTurn(PLAYERS_ID.USER)
    this.Score.resetScore()
  }

  _machinePlay() {
    if (this._matchHasEnded) return

    if (!this.RoundController.isMachinesTurn() || this.Board.isBoardFull()) {
      return
    }

    const whereToPlay = this.Machine.whereToplay()

    window.setTimeout(() => {
      this.Board.setOwnerToFirstAvailableSpotOnColumnIndex({
        columnIndex: whereToPlay.columIndex,
        owner: PLAYERS_ID.MACHINE,
      })
      this.Sound.playMachinePlaySound()
      this._checkMatchEnd()
      this.RoundController.togglePlayTurn()
    }, 500)
  }

  _userPlayOnColumn({ columnIndex }) {
    try {
      this.Board.setOwnerToFirstAvailableSpotOnColumnIndex({
        columnIndex,
        owner: PLAYERS_ID.USER,
      })
      this.Sound.playUserPlaySound()
      this.Board.setAllAvailableSpotsAsDefault()
      this._checkMatchEnd()
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
          if (!this.RoundController.isUsersTurn() || this._matchHasEnded) return

          if (isInsideGameObjectArea) {
            this.Board.setAvailableSpotsAsPreSelectedOnColumnIndex({
              columnIndex,
            })
            this.Sound.playHoverSound({ columnIndex })
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
          if (
            isInsideGameObjectArea &&
            this.RoundController.isUsersTurn() &&
            !this._matchHasEnded
          ) {
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
