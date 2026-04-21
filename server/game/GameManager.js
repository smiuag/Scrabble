import { GameRoom } from './GameRoom.js'

export class GameManager {
  constructor() {
    this.rooms = new Map()
    this.playerToRoom = new Map() // playerId -> roomCode
    this.startCleanupTimer()
  }

  generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  createRoom(hostId, nickname, settings) {
    const roomCode = this.generateRoomCode()
    const room = new GameRoom(roomCode, hostId, settings)
    const result = room.addPlayer(hostId, nickname)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    this.rooms.set(roomCode, room)
    this.playerToRoom.set(result.playerId, roomCode)

    return {
      success: true,
      roomCode,
      playerId: result.playerId,
      room: room.getPublicState()
    }
  }

  joinRoom(roomCode, socketId, nickname) {
    const room = this.rooms.get(roomCode.toUpperCase())
    if (!room) {
      return { success: false, error: 'ROOM_NOT_FOUND' }
    }

    const result = room.addPlayer(socketId, nickname)
    if (!result.success) {
      return { success: false, error: result.error }
    }

    this.playerToRoom.set(result.playerId, roomCode)

    return {
      success: true,
      playerId: result.playerId,
      room: room.getPublicState()
    }
  }

  reconnectPlayer(roomCode, playerId, socketId) {
    const room = this.rooms.get(roomCode.toUpperCase())
    if (!room) {
      return { success: false, error: 'ROOM_NOT_FOUND' }
    }

    const player = room.getPlayer(playerId)
    if (!player) {
      return { success: false, error: 'PLAYER_NOT_FOUND' }
    }

    room.updatePlayerSocket(playerId, socketId)

    return {
      success: true,
      room: room.getPublicState(),
      privateState: room.getPrivateStateForPlayer(playerId)
    }
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode.toUpperCase())
  }

  getRoomForPlayer(playerId) {
    const roomCode = this.playerToRoom.get(playerId)
    return roomCode ? this.rooms.get(roomCode) : null
  }

  removePlayerFromRoom(playerId) {
    const roomCode = this.playerToRoom.get(playerId)
    if (!roomCode) return

    const room = this.rooms.get(roomCode)
    if (room) {
      const player = room.getPlayer(playerId)
      if (player) {
        room.removePlayer(player.socketId)
      }

      // Delete room if empty
      if (room.players.length === 0) {
        this.rooms.delete(roomCode)
      }
    }

    this.playerToRoom.delete(playerId)
  }

  startCleanupTimer() {
    setInterval(() => {
      const now = Date.now()
      const oldRooms = []

      for (const [code, room] of this.rooms) {
        // Delete rooms older than 4 hours
        const isOld = now - room.createdAt > 4 * 60 * 60 * 1000
        const isEmpty = room.players.filter(p => p.isConnected).length === 0

        if (isOld || isEmpty) {
          oldRooms.push(code)
        }
      }

      for (const code of oldRooms) {
        const room = this.rooms.get(code)
        if (room) {
          for (const player of room.players) {
            this.playerToRoom.delete(player.id)
          }
          this.rooms.delete(code)
        }
      }
    }, 10 * 60 * 1000) // Every 10 minutes
  }
}
