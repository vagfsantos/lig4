export class Lig4GameRules {
  Board = null

  constructor({ Board }) {
    this.Board = Board
  }

  isMatchOver() {}

  _hasHorizontalMatch() {}

  _hasVerticalMatch() {}

  _hasDiagonalMatch() {}
}
