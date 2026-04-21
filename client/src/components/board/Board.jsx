import { useGameStore } from '../../store/useGameStore'
import { BOARD_SIZE } from '../../game/boardLayout'
import BoardCell from './BoardCell'
import styles from './Board.module.css'

function Board() {
  const board = useGameStore((state) => state.board)

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, rowIdx) =>
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
