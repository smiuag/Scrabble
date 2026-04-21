import { BOARD_SIZE, getMultiplier } from './BoardLayout.js'

export class Board {
  constructor() {
    this.cells = []
    this.initialize()
  }

  initialize() {
    this.cells = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardRow = []
      for (let col = 0; col < BOARD_SIZE; col++) {
        boardRow.push({
          row,
          col,
          tile: null,
          multiplier: getMultiplier(row, col),
          isUsedMultiplier: false
        })
      }
      this.cells.push(boardRow)
    }
  }

  getCell(row, col) {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null
    return this.cells[row][col]
  }

  placeTile(tile, row, col) {
    const cell = this.getCell(row, col)
    if (!cell) throw new Error('Invalid cell')
    if (cell.tile) throw new Error('Cell already occupied')
    cell.tile = tile
  }

  isEmpty(row, col) {
    const cell = this.getCell(row, col)
    return cell && !cell.tile
  }

  isTile(row, col) {
    const cell = this.getCell(row, col)
    return cell && !!cell.tile
  }

  hasAdjacent(row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    return directions.some(([dr, dc]) => {
      const cell = this.getCell(row + dr, col + dc)
      return cell && cell.tile
    })
  }
}
