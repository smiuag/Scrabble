import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket/socket'
import { useRoomStore } from '../store/useRoomStore'
import { useGameStore } from '../store/useGameStore'
import styles from './HomePage.module.css'

function HomePage() {
  const navigate = useNavigate()
  const setMyNickname = useRoomStore((state) => state.setMyNickname)
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = () => {
    if (!nickname.trim()) {
      setError('Por favor ingresa un apodo')
      return
    }

    setLoading(true)
    setError('')
    const trimmedNickname = nickname.trim()
    setMyNickname(trimmedNickname)

    socket.emit('room:create', {
      nickname: trimmedNickname,
      settings: { maxPlayers: 4 }
    })

    socket.once('room:created', (data) => {
      const { roomCode, playerId } = data
      useRoomStore.setState({
        roomCode,
        myPlayerId: playerId,
        myNickname: trimmedNickname,
        isHost: true
      })
      navigate('/lobby')
    })

    socket.once('room:error', (data) => {
      setError('Error al crear la sala: ' + data.message)
      setLoading(false)
    })
  }

  const handleJoin = () => {
    if (!nickname.trim() || !roomCode.trim()) {
      setError('Por favor ingresa un apodo y código de sala')
      return
    }

    setLoading(true)
    setError('')
    const trimmedNickname = nickname.trim()
    const trimmedCode = roomCode.toUpperCase()
    setMyNickname(trimmedNickname)

    socket.emit('room:join', {
      roomCode: trimmedCode,
      nickname: trimmedNickname
    })

    socket.once('room:joined', (data) => {
      const { playerId } = data
      useRoomStore.setState({
        roomCode: trimmedCode,
        myPlayerId: playerId,
        myNickname: trimmedNickname,
        isHost: false
      })
      navigate('/lobby')
    })

    socket.once('room:error', (data) => {
      setError('Error al unirse: ' + data.message)
      setLoading(false)
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎮 Apalabrados</h1>
        <p className={styles.subtitle}>Scrabble en español</p>

        <div className={styles.form}>
          <div className={styles.group}>
            <label htmlFor="nickname">Tu apodo</label>
            <input
              id="nickname"
              type="text"
              placeholder="Ejemplo: Diego"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              maxLength="20"
              disabled={loading}
            />
          </div>

          <button
            className={styles.btn + ' ' + styles.btnPrimary}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear sala'}
          </button>

          <div className={styles.divider}>O</div>

          <div className={styles.group}>
            <label htmlFor="roomCode">Código de sala</label>
            <input
              id="roomCode"
              type="text"
              placeholder="Ej: ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              maxLength="6"
              disabled={loading}
            />
          </div>

          <button
            className={styles.btn + ' ' + styles.btnSecondary}
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? 'Uniéndose...' : 'Unirse a sala'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default HomePage
