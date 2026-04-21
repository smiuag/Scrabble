import { GameEngine } from '../game/GameEngine.js'

export const registerGameHandlers = (io, socket, gameManager, dictionary) => {
  socket.on('game:play', (data) => {
    const { placements } = data
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (!playerId || !roomCode) {
      socket.emit('game:play-error', {
        code: 'NOT_IN_GAME',
        message: 'No estás en una partida'
      })
      return
    }

    const room = gameManager.getRoom(roomCode)
    if (!room || room.status !== 'playing') {
      socket.emit('game:play-error', {
        code: 'GAME_NOT_ACTIVE',
        message: 'La partida no está activa'
      })
      return
    }

    if (room.getCurrentPlayer().id !== playerId) {
      socket.emit('game:play-error', {
        code: 'NOT_YOUR_TURN',
        message: 'No es tu turno'
      })
      return
    }

    // Validate placement
    const validation = GameEngine.validatePlay(
      room.board,
      placements,
      room.isFirstMove,
      dictionary
    )

    if (!validation.valid) {
      socket.emit('game:play-error', {
        code: validation.code,
        message: validation.message,
        invalidWords: validation.invalidWords
      })
      return
    }

    // Process the play
    const playResult = room.processPlay(playerId, placements)
    if (!playResult.success) {
      socket.emit('game:play-error', {
        code: playResult.error,
        message: 'Error al procesar la jugada'
      })
      return
    }

    room.isFirstMove = false

    // Broadcast the move result
    io.to(roomCode).emit('game:move-result', {
      move: room.moveHistory[room.moveHistory.length - 1],
      roomState: room.getPublicState()
    })

    // Send updated rack to the player who just played
    const currentPlayer = room.getCurrentPlayer()
    io.to(currentPlayer.socketId).emit('game:rack', {
      rack: currentPlayer.rack
    })

    // Check for game over
    const gameOverCheck = GameEngine.checkGameOver(room)
    if (gameOverCheck.over) {
      room.status = 'finished'
      io.to(roomCode).emit('game:over', {
        reason: gameOverCheck.reason,
        finalScores: room.players.map(p => ({
          playerId: p.id,
          nickname: p.nickname,
          score: p.score
        }))
      })
    }
  })

  socket.on('game:pass', () => {
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (!playerId || !roomCode) {
      socket.emit('game:play-error', {
        code: 'NOT_IN_GAME',
        message: 'No estás en una partida'
      })
      return
    }

    const room = gameManager.getRoom(roomCode)
    if (!room || room.status !== 'playing') {
      socket.emit('game:play-error', {
        code: 'GAME_NOT_ACTIVE',
        message: 'La partida no está activa'
      })
      return
    }

    if (room.getCurrentPlayer().id !== playerId) {
      socket.emit('game:play-error', {
        code: 'NOT_YOUR_TURN',
        message: 'No es tu turno'
      })
      return
    }

    room.processPass(playerId)

    io.to(roomCode).emit('game:move-result', {
      move: room.moveHistory[room.moveHistory.length - 1],
      roomState: room.getPublicState()
    })

    // Send rack to next player
    const nextPlayer = room.getCurrentPlayer()
    io.to(nextPlayer.socketId).emit('game:rack', {
      rack: nextPlayer.rack
    })

    // Check for game over
    const gameOverCheck = GameEngine.checkGameOver(room)
    if (gameOverCheck.over) {
      room.status = 'finished'
      io.to(roomCode).emit('game:over', {
        reason: gameOverCheck.reason,
        finalScores: room.players.map(p => ({
          playerId: p.id,
          nickname: p.nickname,
          score: p.score
        }))
      })
    }
  })

  socket.on('game:exchange', (data) => {
    const { tileIds } = data
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (!playerId || !roomCode) {
      socket.emit('game:play-error', {
        code: 'NOT_IN_GAME',
        message: 'No estás en una partida'
      })
      return
    }

    const room = gameManager.getRoom(roomCode)
    if (!room || room.status !== 'playing') {
      socket.emit('game:play-error', {
        code: 'GAME_NOT_ACTIVE',
        message: 'La partida no está activa'
      })
      return
    }

    if (room.getCurrentPlayer().id !== playerId) {
      socket.emit('game:play-error', {
        code: 'NOT_YOUR_TURN',
        message: 'No es tu turno'
      })
      return
    }

    const result = room.processExchange(playerId, tileIds)
    if (!result.success) {
      socket.emit('game:play-error', {
        code: result.error,
        message: 'No se pueden intercambiar las fichas'
      })
      return
    }

    const player = room.getPlayer(playerId)
    io.to(player.socketId).emit('game:rack', {
      rack: player.rack
    })

    io.to(roomCode).emit('game:move-result', {
      move: room.moveHistory[room.moveHistory.length - 1],
      roomState: room.getPublicState()
    })

    const nextPlayer = room.getCurrentPlayer()
    io.to(nextPlayer.socketId).emit('game:rack', {
      rack: nextPlayer.rack
    })
  })

  socket.on('game:resign', () => {
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (!playerId || !roomCode) {
      socket.emit('game:play-error', {
        code: 'NOT_IN_GAME',
        message: 'No estás en una partida'
      })
      return
    }

    const room = gameManager.getRoom(roomCode)
    if (!room || room.status !== 'playing') {
      socket.emit('game:play-error', {
        code: 'GAME_NOT_ACTIVE',
        message: 'La partida no está activa'
      })
      return
    }

    room.status = 'finished'

    io.to(roomCode).emit('game:over', {
      reason: 'player-resigned',
      finalScores: room.players.map(p => ({
        playerId: p.id,
        nickname: p.nickname,
        score: p.score
      }))
    })
  })

  socket.on('chat:message', (data) => {
    const { text } = data
    const playerId = socket.data.playerId
    const roomCode = socket.data.roomCode

    if (!playerId || !roomCode || !text || text.length > 200) return

    const room = gameManager.getRoom(roomCode)
    if (!room) return

    const player = room.getPlayer(playerId)
    if (!player) return

    io.to(roomCode).emit('chat:message', {
      playerId,
      nickname: player.nickname,
      text,
      timestamp: Date.now()
    })
  })
}
