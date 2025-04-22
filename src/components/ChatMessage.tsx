/**
 * @License Apache-2.0
 * @Author Daniel Vo
 * @Description ChatMessage component to display chat messages in the chat interface.
 * @Version 1.0.1
 */

import { ChatHistory } from '../App'
import { ChatbotIcon } from '../assets/ChatbotIcon'
import { format } from 'date-fns'

const ChatMessage = ({ chat }: { chat: ChatHistory }) => {
  // Kiểm tra xem tin nhắn là của người dùng hay chatbot
  const isUser = chat.role === 'user'
  // Định dạng thời gian hiển thị
  const timestamp = format(new Date(), 'HH:mm')

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <ChatbotIcon className='w-9 h-9 p-1.5 bg-[#3d82dd] rounded-full shrink-0 fill-[#fff] self-end' />
      )}
      <div
        className={`flex flex-col gap-1 max-w-[80%] ${
          isUser ? 'items-end' : ''
        }`}
      >
        <div
          className={`px-4 py-3 rounded-xl whitespace-pre-line text-base break-words ${
            isUser
              ? 'bg-[#4b8ce0] text-white rounded-br-xs'
              : 'bg-[#f6f2ff] text-gray-800 rounded-bl-xs'
          }`}
        >
          {chat.text}
        </div>
        <span className='text-xs text-gray-500'>{timestamp}</span>
      </div>
    </div>
  )
}

export default ChatMessage
