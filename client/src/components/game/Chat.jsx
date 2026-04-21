import { useState } from 'react'
import { socket } from '../../socket/socket'
import { useRoomStore } from '../../store/useRoomStore'
import styles from './Chat.module.css'

function Chat() {
  const chatMessages = useRoomStore((state) => state.chatMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      socket.emit('chat:message', { text: input.trim() })
      setInput('')
    }
  }

  return (
    <div className={styles.chat}>
      <h4>Chat</h4>
      <div className={styles.messages}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            <span className={styles.nickname}>{msg.nickname}:</span>
            <span className={styles.text}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          maxLength="200"
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  )
}

export default Chat
