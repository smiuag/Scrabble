import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { useRoomStore } from '../store/useRoomStore'
import { socket } from '../socket/socket'
import styles from './ResultsPage.module.css'

function ResultsPage() {
  const navigate = useNavigate()
  const players = useGameStore((state) => state.players)
  const myPlayerId = useGameStore((state) => state.myPlayerId)
  const clearRoom = useRoomStore((state) => state.clearRoom)

  const handleHome = () => {
    socket.emit('room:leave')
    clearRoom()
    navigate('/')
  }

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎉 Partida Finalizada</h1>

        {winner && (
          <div className={styles.winner}>
            <p className={styles.winnerLabel}>
              {winner.id === myPlayerId ? '¡Ganaste! 🎊' : 'Ganador'}
            </p>
            <p className={styles.winnerName}>{winner.nickname}</p>
            <p className={styles.winnerScore}>{winner.score} puntos</p>
          </div>
        )}

        <div className={styles.scoresList}>
          <h2>Clasificación Final</h2>
          <ol>
            {sortedPlayers.map((player, idx) => (
              <li key={player.id} className={styles.scoreItem}>
                <span className={styles.position}>#{idx + 1}</span>
                <span className={styles.name}>
                  {player.nickname}
                  {player.id === myPlayerId && ' (Tú)'}
                </span>
                <span className={styles.score}>{player.score} pts</span>
              </li>
            ))}
          </ol>
        </div>

        <button className={styles.btnHome} onClick={handleHome}>
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default ResultsPage
