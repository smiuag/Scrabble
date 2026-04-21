import { useGameStore } from '../../store/useGameStore'
import RackTile from './RackTile'
import styles from './Rack.module.css'

function Rack() {
  const myRack = useGameStore((state) => state.myRack)

  return (
    <div className={styles.rackContainer}>
      <div className={styles.rack}>
        {myRack.map((tile) => (
          <RackTile key={tile.id} tile={tile} />
        ))}
        {myRack.length < 7 && (
          <>
            {Array(7 - myRack.length)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} className={styles.emptySlot}></div>
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Rack
