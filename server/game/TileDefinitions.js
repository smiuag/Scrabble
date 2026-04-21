export const TILE_DEFINITIONS = [
  { letter: 'A', points: 1, count: 12 },
  { letter: 'B', points: 3, count: 2 },
  { letter: 'C', points: 3, count: 4 },
  { letter: 'D', points: 2, count: 5 },
  { letter: 'E', points: 1, count: 12 },
  { letter: 'F', points: 4, count: 1 },
  { letter: 'G', points: 2, count: 2 },
  { letter: 'H', points: 4, count: 2 },
  { letter: 'I', points: 1, count: 6 },
  { letter: 'J', points: 8, count: 1 },
  { letter: 'K', points: 8, count: 1 },
  { letter: 'L', points: 1, count: 4 },
  { letter: 'LL', points: 8, count: 1 },
  { letter: 'M', points: 3, count: 2 },
  { letter: 'N', points: 1, count: 5 },
  { letter: 'Ñ', points: 8, count: 1 },
  { letter: 'O', points: 1, count: 9 },
  { letter: 'P', points: 3, count: 2 },
  { letter: 'Q', points: 5, count: 1 },
  { letter: 'R', points: 1, count: 5 },
  { letter: 'RR', points: 8, count: 1 },
  { letter: 'S', points: 1, count: 6 },
  { letter: 'T', points: 1, count: 4 },
  { letter: 'U', points: 1, count: 5 },
  { letter: 'V', points: 4, count: 1 },
  { letter: 'W', points: 10, count: 1 },
  { letter: 'X', points: 8, count: 1 },
  { letter: 'Y', points: 4, count: 1 },
  { letter: 'Z', points: 10, count: 1 },
  { letter: '*', points: 0, count: 2 }
]

export const buildTileMap = () => {
  const map = {}
  for (const def of TILE_DEFINITIONS) {
    map[def.letter] = def
  }
  return map
}
