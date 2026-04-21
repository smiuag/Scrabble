import { socket } from '../../socket/socket'
import { useGameStore } from '../../store/useGameStore'
import { useRoomStore } from '../../store/useRoomStore'
import styles from './GameControls.module.css'

function GameControls() {
  const myPlayerId = useGameStore((state) => state.myPlayerId)
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex)
  const players = useRoomStore((state) => state.players)
  const pendingPlacements = useGameStore((state) => state.pendingPlacements)
  const clearPendingPlacements = useGameStore((state) => state.clearPendingPlacements)

  const isMyTurn = players[currentPlayerIndex]?.id === myPlayerId

  const handlePlay = () => {
    if (pendingPlacements.length === 0) {
      alert('Debes colocar al menos una ficha')
      return
    }

    socket.emit('game:play', { placements: pendingPlacements })
    clearPendingPlacements()
  }

  const handlePass = () => {
    socket.emit('game:pass')
  }

  const handleExchange = () => {
    // TODO: Implement exchange dialog
    alert('Intercambio no implementado aún')
  }

  return (
    <div className={styles.controls}>
      {isMyTurn ? (
        <>
          <button className={styles.btnPlay} onClick={handlePlay}>
            Confirmar Jugada ({pendingPlacements.length})
          </button>
          <button className={styles.btnSecondary} onClick={handlePass}>
            Pasar Turno
          </button>
          <button className={styles.btnSecondary} onClick={handleExchange}>
            Intercambiar Fichas
          </button>
        </>
      ) : (
        <p className={styles.waitingTurn}>Esperando turno de otro jugador...</p>
      )}
    </div>
  )
}

export default GameControls
