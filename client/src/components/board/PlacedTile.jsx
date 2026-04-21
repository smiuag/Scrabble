import { useGameStore } from '../../store/useGameStore'
import styles from './PlacedTile.module.css'

function PlacedTile({ tile, isPending }) {
  const removePendingPlacement = useGameStore((state) => state.removePendingPlacement)

  const handleClick = (e) => {
    e.stopPropagation()
    if (isPending) {
      removePendingPlacement(tile.id)
    }
  }

  return (
    <div
      className={`${styles.tile} ${isPending ? styles.pending : ''}`}
      onClick={handleClick}
      title={isPending ? 'Click para devolver al atril' : ''}
    >
      <div className={styles.letter}>{tile.letter === '*' ? '?' : tile.letter}</div>
      <div className={styles.points}>{tile.points}</div>
    </div>
  )
}

export default PlacedTile
