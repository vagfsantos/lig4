export class Lig4Machine {
  constructor({ Board }) {
    this.Board = Board
  }

  whereToplay() {
    if (this.Board.isBoardFull()) return null

    const defenseHorizontally = this._defendHorizontally()
    if (defenseHorizontally) return { columIndex: defenseHorizontally }

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

  _defendHorizontally() {
    const rows = this.Board.getRows()

    let whichColumnToPlay = null

    rows.find((spotsOnRow) => {
      const riskySpots = this._getDefenseRiskySpots({ spots: spotsOnRow })

      riskySpots.forEach(({ spots, spotPointerIndex }) => {
        if (whichColumnToPlay) return

        /*
          For each risky set of spots
          find the index o the column (whichColumnToPlay)
          that contains a user spot at least on one of the sides
        */
        const firstAvailableSpotIndex = spots.findIndex(
          (spot, findIndex, allFindSpots) => {
            const currentDoesNotHaveOwner = !spot.hasOwner()
            const hasNext = findIndex + 1 < allFindSpots.length
            const nextHasUserOwner = hasNext
              ? allFindSpots[findIndex + 1]?.isOwnerUser()
              : false
            const hasPrev = findIndex - 1 >= 0
            const prevHasUserOwner = hasPrev
              ? allFindSpots[findIndex - 1]?.isOwnerUser()
              : false

            return (
              currentDoesNotHaveOwner && (nextHasUserOwner || prevHasUserOwner)
            )
          }
        )

        whichColumnToPlay = firstAvailableSpotIndex + spotPointerIndex
      })

      return riskySpots.length > 0
    })

    return whichColumnToPlay
  }

  _getDefenseRiskySpots({ spots }) {
    const riskySpots = []

    /*
      Uses a spot as pointer and create an slice of 4 spots in sequence
      if in any set of 4 spots there's no spot owned by the machine
      it means that it can be a place where user can play to win
      however, it needs to check if there's at least 2 spots owned by the user
      so it doesn't return when it's all empty spots
    */
    spots.forEach((_, index, allSpots) => {
      const sequence = 4

      if (index + sequence > allSpots.length) return

      const sliceOf4Ahead = allSpots.slice(index, index + sequence)
      const needCheckIfContainsRiskySpots = sliceOf4Ahead.every(
        (spot) => !spot.isOwnerMachine()
      )

      if (needCheckIfContainsRiskySpots) {
        const isRisky =
          sliceOf4Ahead.filter((spot) => spot.isOwnerUser()).length >= 2

        if (isRisky) {
          riskySpots.push({
            spots: sliceOf4Ahead,
            spotPointerIndex: index,
          })
        }
      }
    })

    return riskySpots
  }
}
