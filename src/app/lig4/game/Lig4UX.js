import { PLAYERS_ID } from '@lig4/constants/gameSettings'

export class Lig4UX {
  _DOMElements = {
    canvasWrapper: null,
    startGameButton: null,
    scorePanel: null,
    playerTurnMessage: null,
  }

  onStartGameCallbackList = []

  constructor() {
    this._DOMElements.startGameButton =
      document.querySelector('#game-start-btn')
    this._DOMElements.scorePanel = document.querySelector('#score')
    this._DOMElements.canvasWrapper = document.querySelector(
      '#canvas-placeholder'
    )
    this._DOMElements.playerTurnMessage =
      document.querySelector('#player-turn-msg')
  }

  init({ gameCanvas }) {
    this._appendCanvasToDOM({ gameCanvas })
    this._setupStartButtonClickEvent()
  }

  onPlayerTurnChange({ playerTurn }) {
    const { playerTurnMessage, canvasWrapper } = this._DOMElements

    playerTurnMessage.textContent =
      playerTurn === PLAYERS_ID.USER
        ? 'Pick a column to launch'
        : 'Wait, the computer is playing'

    if (playerTurn === PLAYERS_ID.USER) {
      canvasWrapper.classList.add('is-user')
      canvasWrapper.classList.remove('is-machine')
      return
    }

    if (playerTurn === PLAYERS_ID.MACHINE) {
      canvasWrapper.classList.remove('is-user')
      canvasWrapper.classList.add('is-machine')
      return
    }

    canvasWrapper.classList.remove('is-user')
    canvasWrapper.classList.remove('is-machine')
  }

  onStartGame(callback) {
    this.onStartGameCallbackList.push(callback)
  }

  _runAllStartGameCallbacks() {
    this.onStartGameCallbackList.forEach((callback) => {
      callback()
    })
  }

  _setupStartButtonClickEvent() {
    const { startGameButton, scorePanel, canvasWrapper } = this._DOMElements

    startGameButton.addEventListener('click', () => {
      startGameButton.textContent = 'Restart'
      scorePanel.classList.toggle('is-playing')
      canvasWrapper.classList.toggle('is-playing')
      this._runAllStartGameCallbacks()
    })
  }

  _appendCanvasToDOM({ gameCanvas }) {
    const { canvasWrapper } = this._DOMElements
    canvasWrapper.appendChild(gameCanvas)
  }
}
