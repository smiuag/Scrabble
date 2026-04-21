import { useRoomStore } from '../../store/useRoomStore'
import { useGameStore } from '../../store/useGameStore'
import styles from './Scoreboard.module.css'

function Scoreboard() {
  const players = useRoomStore((state) => state.players)
  const myPlayerId = useGameStore((state) => state.myPlayerId)
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex)
  const tileBagCount = useGameStore((state) => state.tileBagCount)
  const gameStatus = useGameStore((state) => state.gameStatus)

  const currentPlayer = players[currentPlayerIndex]

  return (
    <div className={styles.scoreboard}>
      <div className={styles.header}>
        <h3>Marcador</h3>
        {gameStatus === 'playing' && (
          <div className={styles.tileBagInfo}>
            Fichas: {tileBagCount}
          </div>
        )}
      </div>

      {currentPlayer && (
        <div className={styles.currentTurn}>
          <p>Turno: <strong>{currentPlayer.nickname}</strong></p>
        </div>
      )}

      <ul className={styles.playersList}>
        {players.map((player) => (
          <li key={player.id} className={`${styles.playerItem} ${currentPlayer?.id === player.id ? styles.active : ''}`}>
            <span className={styles.playerName}>
              {player.nickname}
              {player.id === myPlayerId && ' (Tú)'}
            </span>
            <span className={styles.playerScore}>{player.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Scoreboard
