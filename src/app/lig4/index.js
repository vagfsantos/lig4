import { PLAYERS_ID } from '@lig4/constants/gameSettings'
import { Lig4Controller } from '@lig4/game/Lig4Controller'

const gameController = new Lig4Controller()

function setupStartGame() {
  const startButton = document.querySelector('#game-start-btn')
  document.querySelector('#game-start-btn').addEventListener('click', () => {
    startButton.textContent = 'Restart'

    toggleScorePanel()
    onPlayerTurnChange()

    gameController.startGame()
  })
}

function toggleScorePanel() {
  document.querySelector('#score').classList.toggle('is-game-started')
}

function onPlayerTurnChange() {
  gameController.onPlayerTurnChange(({ playerTurn }) => {
    document.querySelector('#player-turn-msg').textContent =
      playerTurn === PLAYERS_ID.USER
        ? 'Pick a column to launch'
        : 'Wait, the computer is playing'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  gameController.init()

  document
    .querySelector('#canvas-placeholder')
    .appendChild(gameController.canvas.getCanvas())

  setupStartGame()
})
