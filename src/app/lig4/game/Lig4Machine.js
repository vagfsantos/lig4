export class Lig4Machine {
  constructor({ Board }) {
    this.Board = Board
  }

  whereToplay() {
    if (this.Board.isBoardFull()) return null

    const horizontalDefensiveSpot = this._defendHorizontally()
    if (horizontalDefensiveSpot) {
      return { columIndex: horizontalDefensiveSpot.getColumnIndex() }
    }

    const verticalDefensiveSpot = this._defendVerticaly()
    if (verticalDefensiveSpot) {
      return { columIndex: verticalDefensiveSpot.getColumnIndex() }
    }

    const diagonalDefensiveSpot = this._defendDiagonaly()
    if (diagonalDefensiveSpot) {
      return { columIndex: diagonalDefensiveSpot.getColumnIndex() }
    }

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

  _shouldDefendOnPlayingOnSpot({ spot }) {
    return this.Board.willPlayOnSpotColumnIndexMatchGivenSpot({ spot })
  }

  _defendHorizontally() {
    const rows = this.Board.getRows()

    const riskySpots = this._getDefenseRiskySpots({ spotMatriz: rows })
    const riskierSpots = this._getMostRiskierSetOfSpots({ riskySpots })
    const nextSpotToPlay = this._getNextSpotToPlay({ riskierSpots })

    return nextSpotToPlay ?? null
  }

  _defendVerticaly() {
    const columns = this.Board.getColumns()

    const riskySpots = this._getDefenseRiskySpots({ spotMatriz: columns })
    const riskierSpots = this._getMostRiskierSetOfSpots({ riskySpots })
    const nextSpotToPlay = this._getNextSpotToPlay({ riskierSpots })

    return nextSpotToPlay ?? null
  }

  _defendDiagonaly() {
    const diagonals = [
      ...this.Board.getDiagonalLeftToRight(),
      ...this.Board.getDiagonalRightToLeft(),
    ]

    const riskySpots = this._getDefenseRiskySpots({ spotMatriz: diagonals })
    const riskierSpots = this._getMostRiskierSetOfSpots({ riskySpots })
    const nextSpotToPlay = this._getNextSpotToPlay({ riskierSpots })

    return nextSpotToPlay ?? null
  }

  _getNextSpotToPlay({ riskierSpots }) {
    const riskierInSequence = riskierSpots?.find(
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

        const worthPlayingOnColumn =
          this.Board.willPlayOnSpotColumnIndexMatchGivenSpot({ spot })

        return (
          currentDoesNotHaveOwner &&
          worthPlayingOnColumn &&
          (nextHasUserOwner || prevHasUserOwner)
        )
      }
    )

    return riskierInSequence ?? null
  }

  _getDefenseRiskySpots({ spotMatriz }) {
    const riskySpots = []

    /*
      Uses a spot as pointer and create an slice of 4 spots in sequence
      if in any set of 4 spots there's no spot owned by the machine
      it means that it can be a place where user can play to win
      however, it needs to check if there's at least 2 spots owned by the user
      so it doesn't return when it's all empty spots
    */
    spotMatriz.forEach((setOfSpots) => {
      setOfSpots.forEach((_, spotIndex, allSpots) => {
        const sequence = 4
        if (spotIndex + sequence > allSpots.length) return

        const sliceOf4Ahead = allSpots.slice(spotIndex, spotIndex + sequence)
        const needCheckIfContainsRiskySpots = sliceOf4Ahead.every(
          (spot) => !spot.isOwnerMachine()
        )

        if (needCheckIfContainsRiskySpots) {
          const isRisky =
            sliceOf4Ahead.filter((spot) => spot.isOwnerUser()).length >= 2

          if (isRisky) {
            riskySpots.push(sliceOf4Ahead)
          }
        }
      })
    })

    return riskySpots
  }

  _getMostRiskierSetOfSpots({ riskySpots }) {
    const spotsByUserPoint = riskySpots.map((spots) => {
      return spots.map((s) => {
        return s.isOwnerUser() ? 1 : 0
      })
    })

    const countRiskOfUserSpots = spotsByUserPoint.map((vals) =>
      vals.reduce((count, current) => count + current, 0)
    )

    const indexOfRiskierSpotSet = countRiskOfUserSpots.length
      ? countRiskOfUserSpots.indexOf(Math.max(...countRiskOfUserSpots))
      : null

    const riskierSpots =
      indexOfRiskierSpotSet === null ? null : riskySpots[indexOfRiskierSpotSet]

    return riskierSpots
  }
}
