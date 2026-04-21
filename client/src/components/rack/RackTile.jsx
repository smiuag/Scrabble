import { useGameStore } from '../../store/useGameStore'
import styles from './RackTile.module.css'

function RackTile({ tile }) {
  const selectedTileId = useGameStore((state) => state.selectedTileId)
  const setSelectedTile = useGameStore((state) => state.setSelectedTile)
  const isSelected = selectedTileId === tile.id

  return (
    <div
      className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
      onClick={() => setSelectedTile(isSelected ? null : tile.id)}
      title={`${tile.letter} - ${tile.points}pts`}
    >
      <div className={styles.letter}>{tile.letter === '*' ? '?' : tile.letter}</div>
      <div className={styles.points}>{tile.points}</div>
    </div>
  )
}

export default RackTile
