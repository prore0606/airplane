import { useState, useRef } from 'react'
import { useChecklist, type ChecklistItem } from '../../hooks/useChecklist'

const CATEGORY_META: Record<ChecklistItem['category'], { icon: string; color: string }> = {
  서류: { icon: '📄', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  짐:   { icon: '🧳', color: 'text-brand-ink bg-brand-surface border-brand-border' },
  결제: { icon: '💳', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  건강: { icon: '💊', color: 'text-red-600 bg-red-50 border-red-200' },
  기타: { icon: '📌', color: 'text-brand-muted bg-brand-surface border-brand-border' },
}

const CATEGORIES: ChecklistItem['category'][] = ['서류', '짐', '결제', '건강', '기타']

export default function ChecklistSection() {
  const { items, toggle, addItem, removeItem, doneCount, totalCount } = useChecklist()
  const [expanded, setExpanded] = useState(false)
  const [inputText, setInputText] = useState('')
  const [inputCategory, setInputCategory] = useState<ChecklistItem['category']>('기타')
  const [showAdd, setShowAdd] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)
  const isComplete = doneCount === totalCount && totalCount > 0

  // 최대 4개까지만 보이다가 expanded 시 전체
  const visibleItems = expanded ? items : items.slice(0, 4)

  function handleAdd() {
    if (!inputText.trim()) return
    addItem(inputText, inputCategory)
    setInputText('')
    setShowAdd(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setShowAdd(false)
      setInputText('')
    }
  }

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">출국 전 체크리스트</p>
          {isComplete && (
            <span className="text-[10px] bg-brand-green text-white font-bold px-2 py-0.5 rounded-full">완료!</span>
          )}
        </div>
        <span className="text-xs font-bold text-brand-muted">{doneCount}/{totalCount}</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-brand-green' : 'bg-brand-green'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 체크리스트 카드 */}
      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
        {visibleItems.map((item, idx) => {
          const meta = CATEGORY_META[item.category]
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                idx < visibleItems.length - 1 ? 'border-b border-brand-border' : ''
              } ${item.done ? 'bg-brand-surface' : 'bg-white'}`}
            >
              {/* 체크박스 */}
              <button
                onClick={() => toggle(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  item.done
                    ? 'bg-brand-green border-brand-green'
                    : 'border-brand-border bg-white hover:border-brand-green'
                }`}
              >
                {item.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* 텍스트 */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${item.done ? 'line-through text-brand-muted' : 'text-brand-black'}`}>
                  {item.text}
                </p>
              </div>

              {/* 카테고리 뱃지 */}
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${meta.color}`}>
                {meta.icon} {item.category}
              </span>

              {/* 삭제 버튼 (사용자 추가 항목만) */}
              {!item.isDefault && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-brand-muted hover:text-brand-red transition-colors shrink-0 ml-1"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          )
        })}

        {/* 더보기 / 접기 버튼 */}
        {items.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2.5 text-xs font-bold text-brand-muted hover:text-brand-black hover:bg-brand-surface transition-colors border-t border-brand-border flex items-center justify-center gap-1"
          >
            {expanded ? (
              <>접기 <span className="text-[10px]">▲</span></>
            ) : (
              <>{items.length - 4}개 더 보기 <span className="text-[10px]">▼</span></>
            )}
          </button>
        )}

        {/* 항목 추가 인풋 */}
        {showAdd && (
          <div className="border-t border-brand-border p-3 space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="준비물 입력..."
              className="w-full border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
              autoFocus
            />
            <div className="flex gap-2">
              <div className="flex gap-1.5 flex-1 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInputCategory(cat)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                      inputCategory === cat
                        ? 'bg-brand-black text-white border-brand-black'
                        : 'bg-white text-brand-muted border-brand-border hover:border-brand-green'
                    }`}
                  >
                    {CATEGORY_META[cat].icon} {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={!inputText.trim()}
                className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-40 transition-opacity shrink-0"
              >
                추가
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      <button
        onClick={() => {
          setShowAdd(true)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-brand-border rounded-xl py-3 text-xs font-bold text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        준비물 직접 추가
      </button>
    </div>
  )
}
