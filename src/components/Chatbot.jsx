import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'

function Chatbot({ isOpen, onClose, onSendMessage }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi there! I’m Nexora’s AI assistant. What are you working on?',
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [previousInteractionId, setPreviousInteractionId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function handleSubmit(event) {
    event.preventDefault()
    const prompt = input.trim()
    if (!prompt || isSending) return

    setInput('')
    setMessages((currentMessages) => [...currentMessages, { role: 'user', text: prompt }])
    setIsSending(true)

    try {
      const result = await onSendMessage(prompt, previousInteractionId)
      setPreviousInteractionId(result.interactionId)
      setMessages((currentMessages) => [...currentMessages, { role: 'assistant', text: result.reply }])
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'error', text: error.message },
      ])
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title">
      <div className="chatbot-header">
        <div className="chatbot-brand-icon"><Bot size={19} /></div>
        <div className="chatbot-heading">
          <h2 id="chatbot-title">Nexora AI</h2>
          <span><i /> Here to help</span>
        </div>
        <button className="chatbot-close" type="button" onClick={onClose} aria-label="Close chat">
          <X size={19} />
        </button>
      </div>
      <div className="chatbot-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`chat-message chat-message-${message.role}`} key={`${message.role}-${index}`}>
            {message.role === 'assistant' && <span className="chat-message-icon"><Sparkles size={13} /></span>}
            <p>{message.text}</p>
          </div>
        ))}
        {isSending && <div className="chat-typing" role="status"><i /><i /><i /><span>Thinking</span></div>}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chatbot-input">Your message</label>
        <input
          id="chatbot-input"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask us anything…"
          ref={inputRef}
          value={input}
          maxLength={4000}
          disabled={isSending}
        />
        <button aria-label="Send message" disabled={!input.trim() || isSending} type="submit">
          <Send size={17} />
        </button>
      </form>
      <p className="chatbot-disclaimer">AI can make mistakes. Don&apos;t share sensitive information.</p>
    </div>
  )
}

export default Chatbot
