const MULTIPLIERS_CONFIG = {
  TP: [ // Triple Word - corners and edges
    [0, 0], [0, 7], [0, 14],
    [7, 0], [7, 14],
    [14, 0], [14, 7], [14, 14]
  ],
  DP: [ // Double Word - diagonals
    [1, 1], [2, 2], [3, 3], [4, 4],
    [1, 13], [2, 12], [3, 11], [4, 10],
    [10, 4], [11, 3], [12, 2], [13, 1],
    [10, 10], [11, 11], [12, 12], [13, 13],
    [7, 7] // Center
  ],
  TL: [ // Triple Letter
    [1, 5], [1, 9],
    [5, 1], [5, 5], [5, 9], [5, 13],
    [9, 1], [9, 5], [9, 9], [9, 13],
    [13, 5], [13, 9]
  ],
  DL: [ // Double Letter
    [0, 3], [0, 11],
    [2, 6], [2, 8],
    [3, 0], [3, 7], [3, 14],
    [6, 2], [6, 6], [6, 8], [6, 12],
    [7, 3], [7, 11],
    [8, 2], [8, 6], [8, 8], [8, 12],
    [11, 0], [11, 7], [11, 14],
    [12, 6], [12, 8],
    [14, 3], [14, 11]
  ]
}

const buildMultiplierMap = () => {
  const map = {}
  for (const [type, positions] of Object.entries(MULTIPLIERS_CONFIG)) {
    for (const [row, col] of positions) {
      map[`${row},${col}`] = type
    }
  }
  return map
}

export const CELL_MULTIPLIER_MAP = buildMultiplierMap()

export const getMultiplier = (row, col) => {
  return CELL_MULTIPLIER_MAP[`${row},${col}`] || null
}

export const BOARD_SIZE = 15
