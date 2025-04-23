import { useEffect, useRef, useState } from 'react'
import { ChatbotIcon } from './assets/ChatbotIcon'
import ChatForm from './components/ChatForm'
import ChatMessage from './components/ChatMessage'

export interface ChatHistory {
  userMessage?: string
  role?: 'user' | 'assistant'
  text?: string
}

function App() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      role: 'assistant',
      text: '🤖✨ Xin chào, em là trợ lý ảo của dịch vụ khách hàng của Dream Home Riverside. Em có thể giúp gì cho anh/chị hôm nay? 😊'
    }
  ])
  const [isOpen, setIsOpen] = useState(false)
  // Tham chiếu đến phần tử chat body để cuộn xuống cuối khi có tin nhắn mới
  const chatBodyRef = useRef<HTMLDivElement>(null)

  const generateBotResponse = async (history: ChatHistory[]) => {
    const requestHistory = history.filter(
      (msg) =>
        msg.text !==
          '🤖✨ Xin chào, em là trợ lý ảo của dịch vụ khách hàng của Dream Home Riverside. Em có thể giúp gì cho anh/chị hôm nay? 😊' &&
        msg.text !== 'Đang xử lý...'
    )

    const requestBody = requestHistory.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: requestBody })
    }

    try {
      // Gửi yêu cầu đến API
      const res = await fetch(
        import.meta.env.VITE_GEMINI_API_URL,
        requestOptions
      )
      const data = await res.json()

      // Kiểm tra xem phản hồi có thành công không
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }

      // Lấy nội dung phản hồi từ API
      const apiResponseText = data.candidates?.[0]?.content?.parts[0]?.text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim()

      // Cập nhật chatHistory và xóa tin nhắn Đang xử lý...
      setChatHistory((prev) =>
        prev
          .filter((msg) => msg.text !== 'Đang xử lý...')
          .concat({
            role: 'assistant',
            text: apiResponseText
          })
      )
    } catch {
      // Trong trường hợp lỗi, xóa tin nhắn Đang xử lý...
      setChatHistory((prev) =>
        prev.filter((msg) => msg.text !== 'Đang xử lý...')
      )
    }
  }

  // Cuộn xuống cuối chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top:
          chatBodyRef.current.scrollHeight - chatBodyRef.current.clientHeight,
        behavior: 'smooth'
      })
    }
  }, [chatHistory])

  return (
    <div className='container'>
      {/* Toggle Button */}
      <button
        className='fixed right-9 bottom-7 border-none h-12 w-12 bg-[#568ed8] rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer duration-200 ease-in-out hover:bg-[#4b8ce0] z-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`material-symbols-outlined absolute text-white transition-all duration-300 ${
            isOpen
              ? 'opacity-0 rotate-180 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        >
          mode_comment
        </span>
        <span
          className={`material-symbols-outlined absolute text-white transition-all duration-300 ${
            isOpen
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-0'
          }`}
        >
          close
        </span>
      </button>

      <div
        className={`w-[calc(100%-2rem)] max-w-[320px] md:max-w-[380px] lg:max-w-[420px] bg-white rounded-lg shadow-lg right-8 fixed bottom-24 transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-16 scale-50'
        }`}
      >
        <div className='flex py-4 px-6 items-center justify-between bg-[#568ed8] rounded-t-lg'>
          <div className='flex items-center gap-3'>
            <span className='w-9 h-9 p-1.5 bg-white rounded-full shrink-0 fill-[#3d82dd]'>
              <ChatbotIcon />
            </span>
            <h2 className='text-base font-semibold text-white'>
              Chat với nhân viên tư vấn
              <p className='text-sm font-normal'>
                Em ở đây để hỗ trợ cho mình ạ
              </p>
            </h2>
          </div>
          <button
            className='material-symbols-outlined h-10 w-10 rounded-full text-white cursor-pointer pt-0.5 !-mr-2.5 transition-all duration-200 ease-initial hover:bg-white/10'
            onClick={() => setIsOpen(false)}
          >
            keyboard_arrow_down
          </button>
        </div>

        <div
          ref={chatBodyRef}
          className='h-[460px] overflow-y-auto px-5 py-6 flex flex-col gap-5 chat-body pb-24'
        >
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className='absolute bottom-0 left-0 right-0 px-5 py-4 bg-white rounded-b-xl'>
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  )
}

export default App
