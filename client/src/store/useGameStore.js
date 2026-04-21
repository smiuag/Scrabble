import { create } from 'zustand'

export const useGameStore = create((set) => ({
  // Game state from server
  board: Array(15).fill(null).map(() => Array(15).fill(null)),
  players: [],
  myRack: [],
  currentPlayerIndex: 0,
  tileBagCount: 0,
  moveHistory: [],
  gameStatus: 'waiting',
  myPlayerId: null,

  // UI state
  pendingPlacements: [],
  selectedTileId: null,
  selectedCellForTap: null,
  error: null,
  loading: false,

  // Actions
  setGameState: (state) => set(state),
  setBoard: (board) => set({ board }),
  setPlayers: (players) => set({ players }),
  setMyRack: (rack) => set({ myRack: rack }),
  setCurrentPlayer: (index) => set({ currentPlayerIndex: index }),
  setTileBagCount: (count) => set({ tileBagCount: count }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setMyPlayerId: (id) => set({ myPlayerId: id }),

  // Pending placements
  addPendingPlacement: (tile, row, col) =>
    set((state) => ({
      pendingPlacements: [...state.pendingPlacements, { tile, row, col }]
    })),

  removePendingPlacement: (tileId) =>
    set((state) => ({
      pendingPlacements: state.pendingPlacements.filter((p) => p.tile.id !== tileId)
    })),

  clearPendingPlacements: () => set({ pendingPlacements: [] }),

  setSelectedTile: (tileId) => set({ selectedTileId: tileId }),
  setSelectedCell: (row, col) =>
    set({ selectedCellForTap: row !== null ? { row, col } : null }),

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading })
}))
