import { useState, useRef, useEffect } from 'react'
import { sendMessage, listAvailableModels, type ChatMessage } from '../../services/geminiService'
import { useJourney } from '../../context/JourneyContext'
import { useChecklist } from '../../hooks/useChecklist'

const STAGE_KO: Record<string, string> = {
  no_ticket: '티켓 미등록',
  preparing: '출국 준비 중',
  traveling: '공항 이동 중',
  checkin: '체크인 단계',
  external: '게이트 외부',
  airside: '면세구역',
  boarding: '탑승 직전',
  returned: '귀국 완료',
}

const QUICK_QUESTIONS = [
  '지금 뭐 해야 돼요?',
  '라운지 어디예요?',
  '환전 어디서 해요?',
  '면세점 어떻게 가요?',
  '짐 맡길 수 있어요?',
]

export default function AirportChatbot() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { stage } = useJourney()
  const { items, doneCount, totalCount } = useChecklist()
  const undone = items.filter((i) => !i.done).map((i) => i.text)

  const context = `현재 단계: ${STAGE_KO[stage] ?? stage}
체크리스트: ${doneCount}/${totalCount} 완료${undone.length > 0 ? `\n미완료 항목: ${undone.join(', ')}` : ''}`

  function openChat() {
    setOpen(true)
    setTimeout(() => setVisible(true), 10)
    listAvailableModels().catch(console.error)
    if (messages.length === 0) {
      setMessages([
        {
          role: 'model',
          text: '안녕하세요 😊\n인천공항 AI 도우미예요.\n궁금한 거 편하게 물어보세요!',
        },
      ])
    }
  }

  function closeChat() {
    setVisible(false)
    setTimeout(() => setOpen(false), 300)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 350)
  }, [visible])

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const reply = await sendMessage(messages, msg, context)
      setMessages((prev) => [...prev, { role: 'model', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '잠시 후 다시 시도해 주세요 🙏' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={open ? closeChat : openChat}
        className={`fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
          open
            ? 'bg-brand-ink text-white rotate-45'
            : 'bg-brand-green text-white'
        }`}
        aria-label="AI 도우미"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* 오버레이 + 채팅 패널 */}
      {open && (
        <>
          {/* 딤 */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
            onClick={closeChat}
          />

          {/* 채팅 패널 — 슬라이드업 */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col mx-auto max-w-lg transition-transform duration-300 ease-out"
            style={{
              height: '72vh',
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
            }}
          >
            {/* 패널 본체 */}
            <div className="flex flex-col h-full bg-white rounded-t-[28px] shadow-2xl overflow-hidden">

              {/* 핸들 */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-9 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="flex items-center gap-3 px-5 pt-2 pb-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 flex items-center justify-center shadow-md">
                  <span className="text-lg">✈️</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[15px] text-gray-900 leading-tight">에어봇</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-emerald-500 font-medium">인천공항 AI 도우미</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 mx-4 shrink-0" />

              {/* 메시지 */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
                        <span className="text-xs">✈️</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[72%] px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand-green text-white rounded-[18px] rounded-br-[4px]'
                          : 'bg-gray-100 text-gray-800 rounded-[18px] rounded-bl-[4px]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* 로딩 버블 */}
                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-xs">✈️</span>
                    </div>
                    <div className="bg-gray-100 rounded-[18px] rounded-bl-[4px] px-4 py-3 flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.12}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* 빠른 질문 칩 */}
              {messages.length <= 1 && !loading && (
                <div className="px-4 pb-2 shrink-0">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="shrink-0 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3.5 py-2 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all whitespace-nowrap"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 입력창 */}
              <div className="px-4 pb-6 pt-2 shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="메시지 입력..."
                    className="flex-1 bg-transparent text-[13.5px] text-gray-800 placeholder:text-gray-400 outline-none"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center disabled:opacity-30 transition-all active:scale-90 shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}
