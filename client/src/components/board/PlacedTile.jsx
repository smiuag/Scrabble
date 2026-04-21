import styles from './PlacedTile.module.css'

function PlacedTile({ tile }) {
  return (
    <div className={styles.tile}>
      <div className={styles.letter}>{tile.letter === '*' ? '?' : tile.letter}</div>
      <div className={styles.points}>{tile.points}</div>
    </div>
  )
}

export default PlacedTile
