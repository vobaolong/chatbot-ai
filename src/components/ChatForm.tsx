/**
 * @License Apache-2.0
 * @Author Daniel Vo
 * @Description This component includes an input field for the user to type their * message and a button to send it.
 * @Version 1.0.1
 */

import { useRef, useState } from 'react'
import { ChatHistory } from '../App'
import { companyInfo } from '../companyInfo'

const ChatForm = ({
  chatHistory,
  setChatHistory,
  generateBotResponse
}: {
  chatHistory: ChatHistory[]
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>
  generateBotResponse: (updatedHistory: ChatHistory[]) => void
}) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Hàm xử lý sự kiện khi người dùng gửi tin nhắn
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Ngăn chặn việc gửi form mặc định
    e.preventDefault()
    // Lấy giá trị tin nhắn từ input
    const userMessage = inputRef.current?.value.trim()
    // Nếu không có tin nhắn thì không làm gì cả
    if (!userMessage) return

    inputRef.current!.value = ''

    // Thêm tin nhắn của user
    setChatHistory((history) => [
      ...history,
      { role: 'user', text: userMessage }
    ])

    setChatHistory((history) => [
      ...history,
      { role: 'assistant', text: 'Đang xử lý...' }
    ])

    // Thêm context từ companyInfo vào prompt
    generateBotResponse([
      {
        role: 'assistant',
        text: `Tôi là chatbot dịch vụ khách hàng của Dream Home Riverside. Đây là cơ sở kiến thức của tôi: ${companyInfo}`
      },
      ...chatHistory,
      {
        role: 'user',
        text: userMessage
      }
    ])
    setInputValue('')
  }

  return (
    <div className='relative'>
      <form
        action='#'
        className='flex items-center bg-white outline outline-[#ccc] rounded-3xl shadow-blue-500 focus-within:outline-[#4b8ce0] transition-all duration-200'
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type='text'
          placeholder='Nhập thông tin...'
          className='w-full h-[40px] !px-4 rounded-sm text-sm border-none outline-none peer'
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue.trim() && (
          <button
            type='submit'
            className='material-symbols-outlined h-8 w-8 rounded-full text-white cursor-pointer transition-all duration-200 ease-initial bg-[#4b8ce0] border-none outline-none shrink-0 !mr-1.5 !text-lg hover:bg-[#3a6b0] '
          >
            arrow_upward
          </button>
        )}
      </form>
    </div>
  )
}

export default ChatForm
