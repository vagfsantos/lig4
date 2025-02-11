export class MachinePlayer {
  getColumnIndexToPlayIn(boardColumnsState) {
    return this._calculateColumnIndextoPlayIn(boardColumnsState);
  }

  _getColumnIndexesPossibleToPlay(boardColumnsState) {
    return boardColumnsState.reduce((availableIndexes, column, index) => {
      const available = column.hasAvailableSpot() ? [index] : [];
      return [...availableIndexes, ...available];
    }, []);
  }

  _calculateColumnIndextoPlayIn(boardColumnsState) {
    const columnIndexesAvailable =
      this._getColumnIndexesPossibleToPlay(boardColumnsState);

    const randomPosition =
      columnIndexesAvailable[
        Math.round(Math.random() * (columnIndexesAvailable.length - 1))
      ];

    return randomPosition;
  }
}
