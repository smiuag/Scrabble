import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket/socket'
import { useRoomStore } from '../store/useRoomStore'
import styles from './LobbyPage.module.css'

function LobbyPage() {
  const navigate = useNavigate()
  const { roomCode, players, myPlayerId, myNickname, isHost, setIsHost } = useRoomStore()

  useEffect(() => {
    if (!roomCode) {
      navigate('/')
    }
  }, [roomCode, navigate])

  useEffect(() => {
    // isHost viene directamente de la store (se asigna en HomePage)
    // Solo necesitamos mantenerlo actualizado
  }, [])

  const handleStart = () => {
    if (isHost) {
      socket.emit('room:start')
    }
  }

  const handleBack = () => {
    socket.emit('room:leave')
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sala de Espera</h1>

        <div className={styles.roomInfo}>
          <p>
            <strong>Código de sala:</strong>
            <span className={styles.roomCode}>{roomCode}</span>
          </p>
          <p className={styles.hint}>Comparte este código con otros jugadores</p>
        </div>

        <div className={styles.playersList}>
          <h2>Jugadores ({players.length}/4)</h2>
          <ul>
            {players.map((player) => (
              <li key={player.id} className={styles.player}>
                <span className={styles.playerName}>{player.nickname}</span>
                {player.id === myPlayerId && <span className={styles.badge}>Tú</span>}
                {isHost && player.id !== myPlayerId && <span className={styles.badge}>Contrincante</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          {isHost ? (
            <>
              <button
                className={styles.btnStart}
                onClick={handleStart}
                disabled={players.length < 2}
              >
                Iniciar Partida {players.length < 2 && '(necesitas 2+ jugadores)'}
              </button>
            </>
          ) : (
            <p className={styles.waiting}>Esperando que el anfitrión inicie...</p>
          )}

          <button className={styles.btnBack} onClick={handleBack}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
