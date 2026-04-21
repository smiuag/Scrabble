import { BOARD_SIZE } from './BoardLayout.js'

export class GameEngine {
  static validatePlay(board, placements, isFirstMove, dictionary) {
    if (placements.length === 0) {
      return { valid: false, code: 'NO_TILES' }
    }

    // Check if all in same row or column
    const rows = [...new Set(placements.map(p => p.row))]
    const cols = [...new Set(placements.map(p => p.col))]
    const isHorizontal = rows.length === 1
    const isVertical = cols.length === 1

    if (!isHorizontal && !isVertical) {
      return { valid: false, code: 'INVALID_PLACEMENT', message: 'Las fichas deben estar en la misma fila o columna' }
    }

    // Check for gaps
    if (!this.isLineContinuous(board, placements, isHorizontal)) {
      return { valid: false, code: 'INVALID_PLACEMENT', message: 'No pueden haber espacios en blanco entre fichas' }
    }

    // First move must pass through center
    if (isFirstMove) {
      const touchesCenter = placements.some(p => p.row === 7 && p.col === 7)
      if (!touchesCenter) {
        return { valid: false, code: 'FIRST_MOVE_CENTER', message: 'La primera jugada debe pasar por el centro' }
      }
    } else {
      // Must connect with existing tiles
      const connects = placements.some(p => this.hasAdjacentTile(board, p.row, p.col))
      if (!connects) {
        return { valid: false, code: 'ISOLATED_TILE', message: 'Las fichas deben conectar con fichas existentes' }
      }
    }

    // Extract all words formed
    const words = this.extractWords(board, placements, isHorizontal)
    if (words.length === 0) {
      return { valid: false, code: 'NO_WORDS', message: 'Debes formar al menos una palabra' }
    }

    // Validate words in dictionary if available
    if (dictionary) {
      const validation = dictionary.validateAll(words)
      if (!validation.valid) {
        return { valid: false, code: 'INVALID_WORD', invalidWords: validation.invalidWords }
      }
    }

    return { valid: true, words }
  }

  static isLineContinuous(board, placements, isHorizontal) {
    const sorted = [...placements].sort((a, b) => {
      return isHorizontal ? a.col - b.col : a.row - b.row
    })

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i]
      const next = sorted[i + 1]
      const gap = isHorizontal ? next.col - curr.col : next.row - curr.row

      if (gap === 1) continue // Adjacent

      // Check if gap is filled with existing tiles
      const placementSet = new Set(placements.map(p => `${p.row},${p.col}`))
      for (let j = 1; j < gap; j++) {
        const checkRow = isHorizontal ? curr.row : curr.row + j
        const checkCol = isHorizontal ? curr.col + j : curr.col
        const key = `${checkRow},${checkCol}`
        if (!placementSet.has(key) && !board.isTile(checkRow, checkCol)) {
          return false
        }
      }
    }
    return true
  }

  static hasAdjacentTile(board, row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    return directions.some(([dr, dc]) => board.isTile(row + dr, col + dc))
  }

  static extractWords(board, placements, isHorizontal) {
    const placementMap = new Map()
    for (const p of placements) {
      placementMap.set(`${p.row},${p.col}`, p)
    }

    // Build temporary board with placements
    const tempBoard = this.applyPlacementsTempBoard(board, placements)

    const words = new Set()
    const wordsCells = []

    // Extract main word
    const mainWordCells = this.getWordAt(tempBoard, placements[0], isHorizontal)
    if (mainWordCells.length > 1) {
      const word = mainWordCells.map(c => c.tile.letter === '*' ? c.tile.wildcardLetter : c.tile.letter).join('')
      words.add(word)
      wordsCells.push(mainWordCells)
    }

    // Extract cross words for each new tile
    for (const placement of placements) {
      const crossWordCells = this.getWordAt(tempBoard, placement, !isHorizontal)
      if (crossWordCells.length > 1) {
        const word = crossWordCells.map(c => c.tile.letter === '*' ? c.tile.wildcardLetter : c.tile.letter).join('')
        if (!words.has(word)) {
          words.add(word)
          wordsCells.push(crossWordCells)
        }
      }
    }

    return Array.from(words)
  }

  static applyPlacementsTempBoard(board, placements) {
    const placementMap = new Map()
    for (const p of placements) {
      placementMap.set(`${p.row},${p.col}`, p.tile)
    }

    return {
      isTile: (row, col) => {
        const key = `${row},${col}`
        if (placementMap.has(key)) return true
        return board.isTile(row, col)
      },
      getTile: (row, col) => {
        const key = `${row},${col}`
        if (placementMap.has(key)) return placementMap.get(key)
        const cell = board.getCell(row, col)
        return cell?.tile || null
      }
    }
  }

  static getWordAt(tempBoard, anchorPlacement, isHorizontal) {
    const cells = []
    const { row, col } = anchorPlacement
    const direction = isHorizontal ? 1 : -1
    const axis = isHorizontal ? 'col' : 'row'

    // Go backwards to find start
    let start = isHorizontal ? col : row
    while (start > 0) {
      const checkRow = isHorizontal ? row : start - 1
      const checkCol = isHorizontal ? start - 1 : col
      if (tempBoard.isTile(checkRow, checkCol)) {
        start--
      } else {
        break
      }
    }

    // Go forwards from start
    let current = start
    while (current < BOARD_SIZE) {
      const checkRow = isHorizontal ? row : current
      const checkCol = isHorizontal ? current : col
      const tile = tempBoard.getTile(checkRow, checkCol)
      if (tile) {
        cells.push({
          row: checkRow,
          col: checkCol,
          tile: tile,
          isNew: !tile || tile.id === 'NEW'
        })
        current++
      } else {
        break
      }
    }

    return cells
  }

  static calculateScore(board, placements, words) {
    let total = 0

    for (const word of words) {
      let wordScore = 0
      let wordMultiplier = 1

      const cells = this.getWordCellsForScore(board, placements, word)

      for (const cell of cells) {
        const isNew = placements.some(p => p.row === cell.row && p.col === cell.col)
        const tile = cell.tile
        const tilePoints = tile.isWildcard ? 0 : tile.points

        if (isNew && !cell.isUsedMultiplier) {
          switch (cell.multiplier) {
            case 'DL':
              wordScore += tilePoints * 2
              break
            case 'TL':
              wordScore += tilePoints * 3
              break
            case 'DP':
              wordScore += tilePoints
              wordMultiplier *= 2
              break
            case 'TP':
              wordScore += tilePoints
              wordMultiplier *= 3
              break
            default:
              wordScore += tilePoints
          }
        } else {
          wordScore += tilePoints
        }
      }

      total += wordScore * wordMultiplier
    }

    // Bonus for using all 7 tiles
    if (placements.length === 7) {
      total += 50
    }

    return total
  }

  static getWordCellsForScore(board, placements, word) {
    // Simplified: return cells in order for the given word
    const cells = []
    // This would need more complex logic to match word to cells
    return cells
  }

  static checkGameOver(gameRoom) {
    const { tileBag, players, consecutivePassCount } = gameRoom

    // Someone out of tiles and bag is empty
    const playerFinished = players.find(p => p.rack.length === 0)
    if (playerFinished && tileBag.length === 0) {
      return { over: true, reason: 'tiles-exhausted', winnerId: playerFinished.id }
    }

    // All players passed consecutively
    if (consecutivePassCount >= players.length * 2) {
      return { over: true, reason: 'all-passed' }
    }

    return { over: false }
  }
}
