export class Lig4Machine {
  constructor({ Board }) {
    this.Board = Board
  }

  whereToplay() {
    if (this.Board.isBoardFull()) return null

    return this._calcWhereToPlay()
  }

  _columnHasAvailableSpots({ spots }) {
    return spots.find((spot) => spot.getOwner() == null) ? true : false
  }

  _calcWhereToPlay() {
    const allColumns = this.Board.getColumns()
    const getRandomGuess = () => Math.floor(Math.random() * allColumns.length)

    let randomGuess = getRandomGuess()
    let hasAvailableSpot = false

    while (!hasAvailableSpot) {
      hasAvailableSpot = this._columnHasAvailableSpots({
        spots: allColumns[randomGuess],
      })
      if (hasAvailableSpot) return { columIndex: randomGuess }

      randomGuess = getRandomGuess()
    }
  }
}
