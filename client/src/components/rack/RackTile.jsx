import styles from './RackTile.module.css'

function RackTile({ tile }) {
  return (
    <div className={styles.tile}>
      <div className={styles.letter}>{tile.letter === '*' ? '?' : tile.letter}</div>
      <div className={styles.points}>{tile.points}</div>
    </div>
  )
}

export default RackTile
