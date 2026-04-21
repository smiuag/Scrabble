export const registerRoomHandlers = (io, socket, gameManager, dictionary) => {
  socket.on('room:create', (data) => {
    const { nickname, settings } = data
    if (!nickname || nickname.length > 20) {
      socket.emit('room:error', { code: 'INVALID_NICKNAME', message: 'Apodo inválido' })
      return
    }

    const result = gameManager.createRoom(socket.id, nickname, settings)
    if (!result.success) {
      socket.emit('room:error', { code: result.error, message: 'Error al crear la sala' })
      return
    }

    const { roomCode, playerId, room } = result

    // Store room code in socket to track which room user is in
    socket.data.roomCode = roomCode
    socket.data.playerId = playerId
    socket.join(roomCode)

    socket.emit('room:created', {
      roomCode,
      playerId,
      roomState: room
    })

    io.to(roomCode).emit('room:updated', {
      players: room.players
    })
  })

  socket.on('room:join', (data) => {
    const { roomCode, nickname } = data
    if (!roomCode || !nickname || nickname.length > 20) {
      socket.emit('room:error', { code: 'INVALID_DATA', message: 'Datos inválidos' })
      return
    }

    const result = gameManager.joinRoom(roomCode, socket.id, nickname)
    if (!result.success) {
      socket.emit('room:error', { code: result.error, message: 'No se puede unir a la sala' })
      return
    }

    const { playerId, room } = result

    socket.data.roomCode = roomCode
    socket.data.playerId = playerId
    socket.join(roomCode)

    socket.emit('room:joined', {
      playerId,
      roomState: room
    })

    io.to(roomCode).emit('room:updated', {
      players: room.players
    })
  })

  socket.on('room:reconnect', (data) => {
    const { roomCode, playerId, nickname } = data
    if (!roomCode || !playerId) {
      socket.emit('room:error', { code: 'INVALID_DATA', message: 'Datos inválidos' })
      return
    }

    const result = gameManager.reconnectPlayer(roomCode, playerId, socket.id)
    if (!result.success) {
      socket.emit('room:error', { code: result.error, message: 'No se puede reconectar' })
      return
    }

    socket.data.roomCode = roomCode
    socket.data.playerId = playerId
    socket.join(roomCode)

    const { room, privateState } = result

    socket.emit('game:state-sync', {
      roomState: room,
      privateState
    })

    io.to(roomCode).emit('room:updated', {
      players: room.players
    })
  })

  socket.on('room:start', () => {
    const roomCode = socket.data.roomCode
    if (!roomCode) {
      socket.emit('room:error', { code: 'NOT_IN_ROOM', message: 'No estás en una sala' })
      return
    }

    const room = gameManager.getRoom(roomCode)
    if (!room) {
      socket.emit('room:error', { code: 'ROOM_NOT_FOUND', message: 'Sala no encontrada' })
      return
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { code: 'NOT_HOST', message: 'Solo el anfitrión puede iniciar' })
      return
    }

    if (!room.startGame()) {
      socket.emit('room:error', { code: 'CANNOT_START', message: 'No hay suficientes jugadores' })
      return
    }

    io.to(roomCode).emit('game:started', {
      roomState: room.getPublicState()
    })

    // Send private rack to each player
    for (const player of room.players) {
      io.to(player.socketId).emit('game:rack', {
        rack: player.rack
      })
    }
  })

  socket.on('room:leave', () => {
    const playerId = socket.data.playerId
    if (!playerId) return

    const roomCode = socket.data.roomCode
    gameManager.removePlayerFromRoom(playerId)

    if (roomCode) {
      socket.leave(roomCode)
      const room = gameManager.getRoom(roomCode)
      if (room) {
        io.to(roomCode).emit('room:updated', {
          players: room.players
        })
      }
    }

    socket.data.roomCode = null
    socket.data.playerId = null
  })

  socket.on('disconnect', () => {
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (playerId && roomCode) {
      const room = gameManager.getRoom(roomCode)
      if (room) {
        io.to(roomCode).emit('player:disconnected', {
          playerId,
          nickname: room.getPlayer(playerId)?.nickname
        })
      }
    }

    gameManager.removePlayerFromRoom(playerId)
  })
}
