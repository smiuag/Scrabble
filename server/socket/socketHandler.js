import { registerRoomHandlers } from './roomHandlers.js'
import { registerGameHandlers } from './gameHandlers.js'

export const registerSocketHandlers = (io, gameManager, dictionary) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}`)

    socket.data = {
      roomCode: null,
      playerId: null
    }

    registerRoomHandlers(io, socket, gameManager, dictionary)
    registerGameHandlers(io, socket, gameManager, dictionary)

    socket.on('error', (err) => {
      console.error(`Socket error for ${socket.id}:`, err)
    })
  })
}
