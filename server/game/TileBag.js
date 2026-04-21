import { v4 as uuid } from 'uuid'
import { TILE_DEFINITIONS } from './TileDefinitions.js'

export class TileBag {
  constructor() {
    this.tiles = []
    this.initialize()
  }

  initialize() {
    this.tiles = []
    for (const def of TILE_DEFINITIONS) {
      for (let i = 0; i < def.count; i++) {
        this.tiles.push({
          id: uuid(),
          letter: def.letter,
          points: def.points,
          isWildcard: def.letter === '*',
          wildcardLetter: null
        })
      }
    }
    this.shuffle()
  }

  shuffle() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]]
    }
  }

  draw(count) {
    return this.tiles.splice(0, Math.min(count, this.tiles.length))
  }

  returnTiles(tiles) {
    this.tiles.push(...tiles)
    this.shuffle()
  }

  get length() {
    return this.tiles.length
  }
}
