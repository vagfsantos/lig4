export class MachinePlayer {
  getColumnIndexToPlayIn(boardColumnsState) {
    const bestDefensiveMoves =
      this._processBestDefensiveMoves(boardColumnsState);
    return this._calculateColumnIndextoPlayIn({
      boardColumnsState,
      bestDefensiveMoves,
    });
  }

  _getColumnIndexesPossibleToPlay(boardColumnsState) {
    return boardColumnsState.reduce((availableIndexes, column, index) => {
      const available = column.hasAvailableSpot() ? [index] : [];
      return [...availableIndexes, ...available];
    }, []);
  }

  _calculateColumnIndextoPlayIn({ boardColumnsState, bestDefensiveMoves }) {
    const columnIndexesAvailable =
      this._getColumnIndexesPossibleToPlay(boardColumnsState);

    const randomPosition =
      columnIndexesAvailable[
        Math.round(Math.random() * (columnIndexesAvailable.length - 1))
      ];

    const bestDefensiveSingleMove =
      bestDefensiveMoves.length > 0 &&
      bestDefensiveMoves.reduce((bestMove, currentMove) => {
        return bestMove?.sequence > currentMove.sequence
          ? bestMove
          : currentMove;
      });

    return bestDefensiveSingleMove
      ? bestDefensiveSingleMove.chosenMoveToColumnIndex
      : randomPosition;
  }

  _processBestDefensiveMoves(boardColumnsState) {
    const opponentColumnSequences = [];

    boardColumnsState.forEach((column, columnIndex) => {
      const hasAvailableSpot = column.hasAvailableSpot();

      if (hasAvailableSpot) {
        const spotsOrderedDownToTop = [...column.getSpots()].reverse();
        let currentSequence = 0;

        spotsOrderedDownToTop.forEach((spot) => {
          const isOpponentSpot = spot.isPlayerOwner();
          const hasOwner = spot.hasOwner();

          if (isOpponentSpot) {
            currentSequence++;
          } else if (!hasOwner && currentSequence > 1) {
            opponentColumnSequences.push({
              sequence: currentSequence,
              chosenMoveToColumnIndex: columnIndex,
            });
            currentSequence = 0;
          } else {
            currentSequence = 0;
          }
        });
      }
    });

    return opponentColumnSequences;
  }
}
