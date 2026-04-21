import { create } from 'zustand'

export const useRoomStore = create((set) => ({
  // Room state
  roomCode: null,
  players: [],
  myNickname: '',
  myPlayerId: null,
  status: 'idle', // idle | creating | joining | waiting | playing | finished
  error: null,
  chatMessages: [],
  isHost: false,

  // Actions
  setRoomCode: (code) => set({ roomCode: code }),
  setPlayers: (players) => set({ players }),
  setMyNickname: (nickname) => set({ myNickname: nickname }),
  setMyPlayerId: (id) => set({ myPlayerId: id }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setIsHost: (isHost) => set({ isHost }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message]
    })),

  clearRoom: () =>
    set({
      roomCode: null,
      players: [],
      myNickname: '',
      myPlayerId: null,
      status: 'idle',
      error: null,
      chatMessages: [],
      isHost: false
    })
}))
