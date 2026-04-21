import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { useRoomStore } from '../store/useRoomStore'
import Board from '../components/board/Board'
import Rack from '../components/rack/Rack'
import Scoreboard from '../components/game/Scoreboard'
import GameControls from '../components/game/GameControls'
import Chat from '../components/game/Chat'
import styles from './GamePage.module.css'

function GamePage() {
  const navigate = useNavigate()
  const gameStatus = useGameStore((state) => state.gameStatus)
  const roomCode = useRoomStore((state) => state.roomCode)

  console.log('🎮 GamePage montado - gameStatus:', gameStatus, 'roomCode:', roomCode)

  useEffect(() => {
    if (!roomCode) {
      navigate('/')
    }
    if (gameStatus === 'finished') {
      navigate('/results')
    }
  }, [roomCode, gameStatus, navigate])

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <Board />
        <Rack />
        <GameControls />
      </div>

      <aside className={styles.sidebar}>
        <Scoreboard />
        <Chat />
      </aside>
    </div>
  )
}

export default GamePage
