import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { GameManager } from './game/GameManager.js'
import { Dictionary } from './game/Dictionary.js'
import { registerSocketHandlers } from './socket/socketHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(express.json())
app.use(cors())

const dictionary = new Dictionary()
const gameManager = new GameManager()

try {
  dictionary.load(`${__dirname}/data/dictionary_es.json`)
  console.log('✓ Dictionary loaded')
} catch (err) {
  console.warn('✗ Dictionary not found, game will run without word validation:', err.message)
}

registerSocketHandlers(io, gameManager, dictionary)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3002

httpServer.listen(PORT, () => {
  console.log(`🎮 Apalabrados server running on port ${PORT}`)
  console.log(`📍 Connect from: http://localhost:5173`)
})
