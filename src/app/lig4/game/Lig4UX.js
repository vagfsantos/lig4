import { PLAYERS_ID } from '@lig4/constants/gameSettings'

export class Lig4UX {
  _DOMElements = {
    canvasWrapper: null,
    startGameButton: null,
    scorePanel: null,
    playerTurnMessage: null,
    matchEndModal: null,
  }

  onStartGameCallbackList = []
  onPlayAgainCallbackList = []

  constructor() {
    this._DOMElements.startGameButton =
      document.querySelector('#game-start-btn')
    this._DOMElements.scorePanel = document.querySelector('#score')
    this._DOMElements.canvasWrapper = document.querySelector(
      '#canvas-placeholder'
    )
    this._DOMElements.playerTurnMessage =
      document.querySelector('#player-turn-msg')
    this._DOMElements.matchEndModal = document.querySelector('#match-end-modal')
    this._DOMElements.matchEndResultMessage =
      document.querySelector('#match-end-result')
    this._DOMElements.matchEndPlayAgainButton = document.querySelector(
      '#match-end-play-again-btn'
    )
  }

  init({ gameCanvas }) {
    this._appendCanvasToDOM({ gameCanvas })
    this._setupStartButtonClickEvent()
    this._setupPlayAgainButtonClickEvent()
  }

  onPlayerTurnChange({ playerTurn }) {
    const { playerTurnMessage, canvasWrapper } = this._DOMElements

    if (playerTurn == null) {
      playerTurnMessage.textContent = ''
    }

    if (playerTurn === PLAYERS_ID.USER) {
      playerTurnMessage.textContent = 'Pick a column to launch'
      canvasWrapper.classList.add('is-user')
      canvasWrapper.classList.remove('is-machine')
      return
    }

    if (playerTurn === PLAYERS_ID.MACHINE) {
      playerTurnMessage.textContent = 'Wait, the computer is playing'
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

  onPlayAgain(callback) {
    this.onPlayAgainCallbackList.push(callback)
  }

  setMatchWinner({ winner }) {
    this._DOMElements.matchEndModal.classList.add('is-match-ended')
    this._DOMElements.matchEndResultMessage.textContent =
      winner === PLAYERS_ID.USER ? 'You won' : 'You lost'
  }

  _runAllStartGameCallbacks() {
    this.onStartGameCallbackList.forEach((callback) => {
      callback()
    })
  }

  _runAllPlayAgainCallbacks() {
    this.onPlayAgainCallbackList.forEach((callback) => {
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

  _setupPlayAgainButtonClickEvent() {
    this._DOMElements.matchEndPlayAgainButton.addEventListener('click', () => {
      this._runAllPlayAgainCallbacks()
      this._DOMElements.matchEndModal.classList.remove('is-match-ended')
    })
  }
}
