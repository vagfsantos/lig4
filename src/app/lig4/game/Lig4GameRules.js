import { PLAYERS_ID } from '@lig4/constants/gameSettings'

export class Lig4GameRules {
  Board = null

  constructor({ Board }) {
    this.Board = Board
  }

  isMatchOver() {
    const horizontalMatch = this._hasHorizontalMatch()
    const verticalMatch = this._hasVerticalMatch()
    const diagonalLeftToRightMatch = this._hasDiagonalLeftToRightMatch()
    const diagonalRightToLeftMatch = this._hasDiagonalRightToLeftMatch()

    const result = [
      horizontalMatch,
      verticalMatch,
      diagonalLeftToRightMatch,
      diagonalRightToLeftMatch,
    ].find(({ hasMatched }) => hasMatched)

    return {
      isMatchOver: result?.hasMatched ?? false,
      matchedSpots: result?.matchedSpots ?? null,
    }
  }

  _hasHorizontalMatch() {
    const rows = this.Board.getRows()
    return this._lookUpFor4MatchedSpotsOn({ spotsMatriz: rows })
  }

  _hasVerticalMatch() {
    const columns = this.Board.getColumns()
    return this._lookUpFor4MatchedSpotsOn({ spotsMatriz: columns })
  }

  _hasDiagonalLeftToRightMatch() {
    const leftToRight = this.Board.getDiagonalLeftToRight()
    return this._lookUpFor4MatchedSpotsOn({ spotsMatriz: leftToRight })
  }

  _hasDiagonalRightToLeftMatch() {
    const rightToLeft = this.Board.getDiagonalRightToLeft()
    return this._lookUpFor4MatchedSpotsOn({ spotsMatriz: rightToLeft })
  }

  _lookUpFor4MatchedSpotsOn({ spotsMatriz }) {
    const matchedSpotsSequences = {
      [PLAYERS_ID.USER]: [],
      [PLAYERS_ID.MACHINE]: [],
    }
    let hasMatched = false

    spotsMatriz.forEach((spotsOnRow) => {
      let currentStreak = null

      spotsOnRow.forEach((spot) => {
        const owner = spot.getOwner()

        if (matchedSpotsSequences[PLAYERS_ID.USER].length >= 4) {
          hasMatched = true
          return
        }

        if (matchedSpotsSequences[PLAYERS_ID.MACHINE].length >= 4) {
          hasMatched = true
          return
        }

        if (!!owner && owner !== currentStreak) {
          matchedSpotsSequences[PLAYERS_ID.USER] = []
          matchedSpotsSequences[PLAYERS_ID.MACHINE] = []
        }

        if (owner) {
          matchedSpotsSequences[owner].push(spot)
        }

        currentStreak = owner || null
      })
    })

    const userMatchedSpots = matchedSpotsSequences[PLAYERS_ID.USER]
    const machineMatchedSpots = matchedSpotsSequences[PLAYERS_ID.MACHINE]

    const matchedSpots = []
    if (machineMatchedSpots.length >= 4) {
      matchedSpots.push(...machineMatchedSpots)
    }

    if (userMatchedSpots.length >= 4) {
      matchedSpots.push(...userMatchedSpots)
    }

    return {
      hasMatched,
      matchedSpots: matchedSpots.length ? matchedSpots : null,
    }
  }
}
