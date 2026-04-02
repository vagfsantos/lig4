import { PLAYERS_ID } from '@lig4/constants/gameSettings'

export class Lig4RoundController {
  _playerInCurrentTurn = null
  _onRoundChangeCallbackList = []

  togglePlayTurn() {
    if (this._playerInCurrentTurn === PLAYERS_ID.USER) {
      this._playerInCurrentTurn = PLAYERS_ID.MACHINE
    } else {
      this._playerInCurrentTurn = PLAYERS_ID.USER
    }
    this._runAllCallbacks()
  }

  onRoundChange(callback) {
    this._onRoundChangeCallbackList.push(callback)
  }

  setPlayerInCurrentTurn(player) {
    this._playerInCurrentTurn = player
    this._runAllCallbacks()
  }

  getPlayerInCurrentTurn() {
    return this._playerInCurrentTurn
  }

  isUsersTurn() {
    return this._playerInCurrentTurn === PLAYERS_ID.USER
  }

  isMachinesTurn() {
    return this._playerInCurrentTurn === PLAYERS_ID.MACHINE
  }

  _runAllCallbacks() {
    this._onRoundChangeCallbackList.forEach((callback) => {
      callback({ playerTurn: this._playerInCurrentTurn })
    })
  }
}
