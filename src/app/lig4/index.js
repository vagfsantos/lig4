import { PLAYERS_ID } from '@lig4/constants/gameSettings'
import { Lig4Controller } from '@lig4/game/Lig4Controller'

const gameController = new Lig4Controller()

function setupStartGame() {
  const startButton = document.querySelector('#game-start-btn')
  document.querySelector('#game-start-btn').addEventListener('click', () => {
    startButton.textContent = 'Restart'

    setCanvasAsPlaying()
    toggleScorePanel()
    onPlayerTurnChange()

    gameController.startGame()
  })
}

function toggleScorePanel() {
  document.querySelector('#score').classList.toggle('is-playing')
}

function onPlayerTurnChange() {
  gameController.onPlayerTurnChange(({ playerTurn }) => {
    const canvasDOM = document.querySelector('#canvas-placeholder')
    document.querySelector('#player-turn-msg').textContent =
      playerTurn === PLAYERS_ID.USER
        ? 'Pick a column to launch'
        : 'Wait, the computer is playing'

    if (playerTurn === PLAYERS_ID.USER) {
      canvasDOM.classList.add('is-user')
      canvasDOM.classList.remove('is-machine')
      return
    }

    if (playerTurn === PLAYERS_ID.MACHINE) {
      canvasDOM.classList.remove('is-user')
      canvasDOM.classList.add('is-machine')
      return
    }

    canvasDOM.classList.remove('is-user')
    canvasDOM.classList.remove('is-machine')
  })
}

function setCanvasAsPlaying() {
  document.querySelector('#canvas-placeholder').classList.add('is-playing')
}

document.addEventListener('DOMContentLoaded', () => {
  gameController.init()

  document
    .querySelector('#canvas-placeholder')
    .appendChild(gameController.Canvas.getCanvas())

  setupStartGame()
})
