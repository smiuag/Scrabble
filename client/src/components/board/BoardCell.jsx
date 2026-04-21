import { useGameStore } from '../../store/useGameStore'
import { getMultiplier } from '../../game/boardLayout'
import PlacedTile from './PlacedTile'
import styles from './BoardCell.module.css'

function BoardCell({ row, col, cell }) {
  const multiplier = getMultiplier(row, col)
  const isCenter = row === 7 && col === 7

  const getCellClass = () => {
    if (isCenter) return styles.center
    switch (multiplier) {
      case 'TP':
        return styles.tp
      case 'DP':
        return styles.dp
      case 'TL':
        return styles.tl
      case 'DL':
        return styles.dl
      default:
        return styles.default
    }
  }

  const getMultiplierLabel = () => {
    if (isCenter) return '★'
    return multiplier || ''
  }

  return (
    <div className={`${styles.cell} ${getCellClass()}`}>
      {cell?.tile ? (
        <PlacedTile tile={cell.tile} />
      ) : (
        <span className={styles.multiplierLabel}>{getMultiplierLabel()}</span>
      )}
    </div>
  )
}

export default BoardCell
