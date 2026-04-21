import { useGameStore } from '../../store/useGameStore'
import { BOARD_SIZE } from '../../game/boardLayout'
import BoardCell from './BoardCell'
import styles from './Board.module.css'

function Board() {
  const board = useGameStore((state) => state.board)
  const pendingPlacements = useGameStore((state) => state.pendingPlacements)

  // Combinar board con pendingPlacements
  const getBoardWithPending = () => {
    const boardCopy = board.map(row => [...row])

    for (const placement of pendingPlacements) {
      const { row, col, tile } = placement
      if (boardCopy[row] && boardCopy[row][col]) {
        boardCopy[row][col] = {
          ...boardCopy[row][col],
          tile: tile,
          isPending: true
        }
      }
    }

    return boardCopy
  }

  const displayBoard = getBoardWithPending()

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {displayBoard.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <BoardCell
              key={`${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              cell={cell}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Board
