import { PLAYERS_ID } from '@lig4/constants/gameSettings'

export class Lig4Score {
  _scores = {
    [PLAYERS_ID.USER]: 0,
    [PLAYERS_ID.MACHINE]: 0,
  }

  _onScoreChangeCallbackList = []

  onScoreChange(callback) {
    this._onScoreChangeCallbackList.push(callback)
  }

  addPointTo({ winner }) {
    this._scores[winner]++
    this._runAllCallbacks()
  }

  getScore() {
    return this._scores
  }

  resetScore() {
    this._scores = {
      [PLAYERS_ID.USER]: 0,
      [PLAYERS_ID.MACHINE]: 0,
    }
    this._runAllCallbacks()
  }

  _runAllCallbacks() {
    this._onScoreChangeCallbackList.forEach((callback) => {
      callback({ scores: this._scores })
    })
  }
}
