import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useChecklist } from '../../hooks/useChecklist'

interface Props {
  onConfirm: () => void
  onSkip: () => void
}

const CATEGORY_COLOR: Record<string, string> = {
  서류: 'bg-blue-50 text-blue-600',
  짐:   'bg-amber-50 text-amber-600',
  결제: 'bg-emerald-50 text-emerald-600',
  건강: 'bg-rose-50 text-rose-600',
  기타: 'bg-gray-100 text-gray-500',
}

export default function ChecklistConfirmModal({ onConfirm, onSkip }: Props) {
  const { items, toggle } = useChecklist()
  const [showAll, setShowAll] = useState(false)

  const doneCount = items.filter((i) => i.done).length
  const totalCount = items.length
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)
  const allDone = doneCount === totalCount

  const displayed = showAll ? items : items.slice(0, 6)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[88vh]">
        {/* 핸들 */}
        <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mt-4 shrink-0" />

        {/* 헤더 */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-black text-lg text-brand-black leading-tight">
                ✈️ 공항 도착! 짐 다 챙기셨나요?
              </p>
              <p className="text-xs text-brand-muted mt-1">
                체크인 전에 준비물을 한 번 더 확인해요
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="font-black text-2xl text-brand-green">{pct}%</p>
              <p className="text-[10px] text-brand-muted">{doneCount}/{totalCount}</p>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="mt-3 h-2 bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: allDone
                  ? 'linear-gradient(90deg, #1DB954, #00c48c)'
                  : 'linear-gradient(90deg, #1DB954, #1DB954)',
              }}
            />
          </div>

          {allDone && (
            <p className="text-xs text-brand-green font-bold mt-2 text-center animate-pulse">
              🎉 모든 항목 완료! 체크인할 준비가 됐어요
            </p>
          )}
        </div>

        {/* 아이템 목록 */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-2">
          {displayed.map((item) => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${
                item.done
                  ? 'bg-brand-pale border-brand-green/40'
                  : 'bg-white border-brand-border hover:border-brand-green/50'
              }`}
            >
              {/* 체크박스 */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  item.done
                    ? 'bg-brand-green border-brand-green'
                    : 'border-brand-border bg-white'
                }`}
              >
                {item.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* 텍스트 */}
              <span
                className={`flex-1 text-sm font-semibold transition-all ${
                  item.done ? 'line-through text-brand-muted' : 'text-brand-ink'
                }`}
              >
                {item.text}
              </span>

              {/* 카테고리 뱃지 */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR['기타']
                }`}
              >
                {item.category}
              </span>
            </button>
          ))}

          {items.length > 6 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full text-xs text-brand-muted py-1.5 hover:text-brand-green transition-colors"
            >
              {showAll ? '접기 ↑' : `${items.length - 6}개 더 보기 ↓`}
            </button>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="px-5 py-4 border-t border-brand-border shrink-0 space-y-2">
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-black text-[15px] transition-all active:scale-[0.98] ${
              allDone
                ? 'bg-brand-green text-white shadow-lg'
                : 'bg-brand-green text-white shadow-lg'
            }`}
          >
            {allDone ? '✅ 모두 확인! 체크인 시작하기' : '체크인 시작하기 →'}
          </button>
          <button
            onClick={onSkip}
            className="w-full py-2.5 text-sm text-brand-muted hover:text-brand-ink transition-colors"
          >
            나중에 확인할게요
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
