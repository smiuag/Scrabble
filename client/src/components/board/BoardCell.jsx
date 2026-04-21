import { useGameStore } from '../../store/useGameStore'
import { getMultiplier } from '../../game/boardLayout'
import PlacedTile from './PlacedTile'
import styles from './BoardCell.module.css'

function BoardCell({ row, col, cell }) {
  const multiplier = getMultiplier(row, col)
  const isCenter = row === 7 && col === 7
  const selectedTileId = useGameStore((state) => state.selectedTileId)
  const myRack = useGameStore((state) => state.myRack)
  const addPendingPlacement = useGameStore((state) => state.addPendingPlacement)
  const setSelectedTile = useGameStore((state) => state.setSelectedTile)

  const handleCellClick = () => {
    if (selectedTileId && !cell?.tile) {
      // Encontrar la ficha seleccionada en el rack
      const tile = myRack.find(t => t.id === selectedTileId)
      if (tile) {
        addPendingPlacement(tile, row, col)
        setSelectedTile(null)
      }
    }
  }

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
    <div
      className={`${styles.cell} ${getCellClass()} ${!cell?.tile && selectedTileId ? styles.clickable : ''}`}
      onClick={handleCellClick}
    >
      {cell?.tile ? (
        <PlacedTile tile={cell.tile} />
      ) : (
        <span className={styles.multiplierLabel}>{getMultiplierLabel()}</span>
      )}
    </div>
  )
}

export default BoardCell
