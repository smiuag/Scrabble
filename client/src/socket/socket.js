import { io } from 'socket.io-client'

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3002'
    : 'https://apalabrados-backend.up.railway.app') // Cambiar por tu URL de Railway

export const socket = io(SERVER_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})

socket.on('connect', () => {
  console.log('✓ Connected to server')
})

socket.on('disconnect', () => {
  console.log('✗ Disconnected from server')
})

export default socket
