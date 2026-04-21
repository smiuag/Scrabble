import { v4 as uuid } from 'uuid'
import { Board } from './Board.js'
import { TileBag } from './TileBag.js'

export class GameRoom {
  constructor(roomCode, hostId, settings = {}) {
    this.roomCode = roomCode
    this.hostId = hostId
    this.players = []
    this.status = 'waiting' // waiting | playing | finished
    this.currentPlayerIndex = 0
    this.board = new Board()
    this.tileBag = new TileBag()
    this.moveHistory = []
    this.consecutivePassCount = 0
    this.isFirstMove = true
    this.settings = {
      maxPlayers: settings.maxPlayers || 4,
      timePerTurn: settings.timePerTurn || null
    }
    this.createdAt = Date.now()
    this.playerDisconnectTimeouts = new Map()
  }

  addPlayer(socketId, nickname) {
    if (this.players.length >= this.settings.maxPlayers) {
      return { success: false, error: 'ROOM_FULL' }
    }

    if (this.status !== 'waiting') {
      return { success: false, error: 'GAME_IN_PROGRESS' }
    }

    const playerId = uuid()
    const player = {
      id: playerId,
      socketId,
      nickname,
      rack: [],
      score: 0,
      isConnected: true,
      consecutivePasses: 0
    }

    this.players.push(player)
    return { success: true, playerId, player }
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId)
  }

  getPlayerBySocket(socketId) {
    return this.players.find(p => p.socketId === socketId)
  }

  updatePlayerSocket(playerId, newSocketId) {
    const player = this.getPlayer(playerId)
    if (player) {
      player.socketId = newSocketId
      player.isConnected = true
    }
  }

  removePlayer(socketId) {
    const idx = this.players.findIndex(p => p.socketId === socketId)
    if (idx !== -1) {
      this.players.splice(idx, 1)
    }
  }

  startGame() {
    if (this.players.length < 2) {
      return false
    }

    this.status = 'playing'
    for (const player of this.players) {
      player.rack = this.tileBag.draw(7)
    }

    return true
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  advanceTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
  }

  processPlay(playerId, placements) {
    const player = this.getPlayer(playerId)
    if (!player) return { success: false, error: 'PLAYER_NOT_FOUND' }
    if (this.getCurrentPlayer().id !== playerId) return { success: false, error: 'NOT_YOUR_TURN' }

    // Verify tiles belong to player's rack
    const rackTileIds = new Set(player.rack.map(t => t.id))
    for (const p of placements) {
      if (!rackTileIds.has(p.tile.id)) {
        return { success: false, error: 'INVALID_TILE' }
      }
    }

    // Apply placements to board
    for (const placement of placements) {
      this.board.placeTile(placement.tile, placement.row, placement.col)
    }

    // Remove from rack
    for (const placement of placements) {
      const idx = player.rack.findIndex(t => t.id === placement.tile.id)
      if (idx !== -1) player.rack.splice(idx, 1)
    }

    // Replenish rack
    const needed = 7 - player.rack.length
    if (this.tileBag.length > 0) {
      player.rack.push(...this.tileBag.draw(needed))
    }

    // Record move
    this.moveHistory.push({
      playerId,
      type: 'play',
      placements,
      timestamp: Date.now()
    })

    // Reset consecutive passes
    this.consecutivePassCount = 0
    for (const p of this.players) {
      p.consecutivePasses = 0
    }

    // Advance turn
    this.advanceTurn()

    return { success: true }
  }

  processPass(playerId) {
    const player = this.getPlayer(playerId)
    if (!player) return { success: false, error: 'PLAYER_NOT_FOUND' }
    if (this.getCurrentPlayer().id !== playerId) return { success: false, error: 'NOT_YOUR_TURN' }

    player.consecutivePasses++
    this.consecutivePassCount++

    this.moveHistory.push({
      playerId,
      type: 'pass',
      timestamp: Date.now()
    })

    this.advanceTurn()
    return { success: true }
  }

  processExchange(playerId, tileIds) {
    const player = this.getPlayer(playerId)
    if (!player) return { success: false, error: 'PLAYER_NOT_FOUND' }
    if (this.getCurrentPlayer().id !== playerId) return { success: false, error: 'NOT_YOUR_TURN' }

    if (this.tileBag.length < 7) {
      return { success: false, error: 'NOT_ENOUGH_TILES_BAG' }
    }

    // Get tiles to exchange
    const tilesToExchange = player.rack.filter(t => tileIds.includes(t.id))
    if (tilesToExchange.length === 0) {
      return { success: false, error: 'NO_TILES_TO_EXCHANGE' }
    }

    // Remove from rack
    player.rack = player.rack.filter(t => !tileIds.includes(t.id))

    // Draw new tiles
    player.rack.push(...this.tileBag.draw(tilesToExchange.length))

    // Return old tiles to bag
    this.tileBag.returnTiles(tilesToExchange)

    this.moveHistory.push({
      playerId,
      type: 'exchange',
      tilesCount: tilesToExchange.length,
      timestamp: Date.now()
    })

    this.consecutivePassCount++
    this.advanceTurn()

    return { success: true }
  }

  getPublicState() {
    return {
      roomCode: this.roomCode,
      status: this.status,
      board: this.board.cells,
      players: this.players.map(p => ({
        id: p.id,
        nickname: p.nickname,
        score: p.score,
        rackSize: p.rack.length,
        isConnected: p.isConnected
      })),
      currentPlayerIndex: this.currentPlayerIndex,
      tileBagCount: this.tileBag.length,
      moveHistory: this.moveHistory.slice(-20)
    }
  }

  getPrivateStateForPlayer(playerId) {
    const player = this.getPlayer(playerId)
    if (!player) return null

    return {
      rack: player.rack
    }
  }
}
