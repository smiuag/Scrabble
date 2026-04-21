import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { socket } from './socket/socket'
import { useRoomStore } from './store/useRoomStore'
import { useGameStore } from './store/useGameStore'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'

function App() {
  const navigate = useNavigate()
  const { setStatus, setMyPlayerId, setRoomCode, setPlayers, setMyNickname } = useRoomStore()
  const { setGameState, setMyPlayerId: setGamePlayerId, setMyRack, setBoard, setCurrentPlayer, setTileBagCount } = useGameStore()

  useEffect(() => {
    // Handle room created
    socket.on('room:created', (data) => {
      const { roomCode, playerId } = data
      setRoomCode(roomCode)
      setMyPlayerId(playerId)
      setGamePlayerId(playerId)
      setStatus('waiting')
    })

    // Handle room joined
    socket.on('room:joined', (data) => {
      const { playerId } = data
      setMyPlayerId(playerId)
      setGamePlayerId(playerId)
      setStatus('waiting')
    })

    // Handle room updated
    socket.on('room:updated', (data) => {
      const { players } = data
      setPlayers(players)
    })

    // Handle game started
    socket.on('game:started', (data) => {
      console.log('✓ game:started recibido:', data)
      const { roomState } = data
      setStatus('playing')
      setPlayers(roomState.players)
      setBoard(roomState.board)
      setCurrentPlayer(roomState.currentPlayerIndex)
      setTileBagCount(roomState.tileBagCount)
      setGameState({
        gameStatus: 'playing'
      })
      console.log('✓ Estado actualizado, navegando a GamePage')
      navigate('/game')
    })

    // Handle rack received
    socket.on('game:rack', (data) => {
      const { rack } = data
      setMyRack(rack)
    })

    // Handle move result
    socket.on('game:move-result', (data) => {
      const { roomState } = data
      setPlayers(roomState.players)
      setBoard(roomState.board)
      setCurrentPlayer(roomState.currentPlayerIndex)
      setTileBagCount(roomState.tileBagCount)
    })

    // Handle game over
    socket.on('game:over', (data) => {
      setStatus('finished')
      setGameState({
        gameStatus: 'finished',
        finalScores: data.finalScores
      })
    })

    // Handle errors
    socket.on('room:error', (data) => {
      console.error('Room error:', data)
    })

    socket.on('game:play-error', (data) => {
      console.error('Game error:', data)
    })

    return () => {
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:updated')
      socket.off('game:started')
      socket.off('game:rack')
      socket.off('game:move-result')
      socket.off('game:over')
      socket.off('room:error')
      socket.off('game:play-error')
    }
  }, [setStatus, setMyPlayerId, setRoomCode, setPlayers, setGamePlayerId, setGameState, setMyRack, setBoard, setCurrentPlayer, setTileBagCount])

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
