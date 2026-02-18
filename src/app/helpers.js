export function getBoardRows(boardColumnsState) {
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

export function getBoardDiagonalColumn(boardColumnsState) {
  const diagonalColumns = [];

  boardColumnsState.forEach((column, columnIndex) => {
    const spotsForColumn = column.getSpots();

    spotsForColumn.forEach((spot, spotIndex) => {
      if (Array.isArray(diagonalColumns[spotIndex + columnIndex])) {
        return diagonalColumns[spotIndex + columnIndex].push(spot);
      } else if (diagonalColumns[spotIndex + columnIndex] == undefined) {
        diagonalColumns[spotIndex + columnIndex] = [spot];
      }
    });
  });

  return diagonalColumns;
}
