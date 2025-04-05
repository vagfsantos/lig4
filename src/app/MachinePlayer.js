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

    function getRowSequence(reversed = false) {
      const opponentRowSequences = [];
      getBoardRows(boardColumnsState).forEach((row, rowIndex, allRows) => {
        const hasAvailableSpot = row.some((spot) => !spot.hasOwner());

        if (hasAvailableSpot) {
          const previousRow = rowIndex > 0 ? allRows[rowIndex - 1] : undefined;

          const spotsOnRow = reversed ? [...row].reverse() : row;
          let currentSequence = 0;

          spotsOnRow.forEach((spot, spotIndex, allSpots) => {
            const isOpponentSpot = spot.isPlayerOwner();
            const hasOwner = spot.hasOwner();

            const reversedSpotIndex = allSpots.length - 1 - spotIndex;
            const spotBellowHasOwner = previousRow
              ? previousRow[reversed ? reversedSpotIndex : spotIndex].hasOwner()
              : true;

            if (isOpponentSpot) {
              currentSequence++;
            } else if (!hasOwner && currentSequence > 1 && spotBellowHasOwner) {
              opponentRowSequences.push({
                sequence: currentSequence,
                chosenMoveToColumnIndex: reversed
                  ? reversedSpotIndex
                  : spotIndex,
              });
              currentSequence = 0;
            } else {
              currentSequence = 0;
            }
          });
        }
      });

      return opponentRowSequences;
    }

    console.log({
      columns: opponentColumnSequences,
      rows: getRowSequence(),
      rowsReversed: getRowSequence(true),
    });

    return [
      ...opponentColumnSequences,
      ...getRowSequence(),
      ...getRowSequence(true),
    ];
  }
}

function getBoardRows(boardColumnsState) {
  const rows = [];

  boardColumnsState.forEach((column) => {
    const spotsForColumn = column.getSpots();

    spotsForColumn.forEach((spot, spotIndex) => {
      if (Array.isArray(rows[spotIndex])) {
        return rows[spotIndex].push(spot);
      }
      rows[spotIndex] = [spot];
    });
  });

  return rows.reverse();
}
