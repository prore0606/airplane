import { useState, useEffect, type ChangeEvent } from 'react'
import type { ParsedBoardingPass } from '../../services/ocr/boardingPassParser'
import { AIRLINE_TERMINAL } from '../../services/ocr/boardingPassParser'

interface Props {
  parsed: ParsedBoardingPass
  onConfirm: (info: ParsedBoardingPass) => void
  onRescan: () => void
}

const FIELD_LABELS: {
  key: keyof ParsedBoardingPass
  label: string
  placeholder: string
  hint?: string
}[] = [
  { key: 'flightNumber',  label: '항공편명',   placeholder: 'KE723' },
  { key: 'airline',       label: '항공사',     placeholder: '대한항공' },
  { key: 'origin',        label: '출발 공항',  placeholder: 'ICN' },
  { key: 'destination',   label: '도착 공항',  placeholder: 'NRT' },
  { key: 'date',          label: '출발 날짜',  placeholder: '2026-04-10' },
  { key: 'departureTime', label: '출발 시각',  placeholder: '13:40' },
  { key: 'boardingTime',  label: '탑승 시각',  placeholder: '12:55', hint: '탑승권의 BOARDING TIME' },
  { key: 'terminal',      label: '터미널',     placeholder: 'T1', hint: '항공사 입력 시 자동완성' },
  { key: 'gate',          label: '탑승구 (게이트)', placeholder: 'G23' },
  { key: 'seat',          label: '좌석번호',   placeholder: '12A' },
]

export default function OcrResultForm({ parsed, onConfirm, onRescan }: Props) {
  const [form, setForm] = useState<ParsedBoardingPass>(parsed)

  useEffect(() => { setForm(parsed) }, [parsed])

  // 항공사 변경 시 터미널 자동완성
  useEffect(() => {
    if (!form.airline) return
    const autoTerminal = AIRLINE_TERMINAL[form.airline]
    if (autoTerminal && !form.terminal) {
      setForm((prev) => ({ ...prev, terminal: autoTerminal }))
    }
  }, [form.airline])

  function handleChange(key: keyof ParsedBoardingPass) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => {
        const next = { ...prev, [key]: value }
        // 항공사를 직접 바꾸면 터미널 즉시 자동완성
        if (key === 'airline') {
          const auto = AIRLINE_TERMINAL[value]
          if (auto) next.terminal = auto
        }
        return next
      })
    }
  }

  const filledCount = FIELD_LABELS.filter(({ key }) => !!form[key]).length
  const total = FIELD_LABELS.length

  return (
    <div className="space-y-4">

      {/* 상태 헤더 */}
      <div className={`px-4 py-2.5 rounded-xl flex items-center justify-between
        ${filledCount === total ? 'bg-brand-green' : 'bg-brand-orange'}`}>
        <span className="text-xs font-bold text-white">
          {filledCount === total
            ? '✅ 모두 입력됨 — 확인 후 시작하세요'
            : `✏️ ${filledCount} / ${total} 항목 입력됨`}
        </span>
        <button onClick={onRescan} className="text-[10px] text-white/70 hover:text-white underline">
          취소
        </button>
      </div>

      {/* 필드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {FIELD_LABELS.map(({ key, label, placeholder, hint }) => {
          const filled = !!form[key]
          const isAutoFilled = key === 'terminal' && !!AIRLINE_TERMINAL[form.airline ?? ''] && form.terminal === AIRLINE_TERMINAL[form.airline ?? '']
          return (
            <div key={key}>
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                {label}
                {isAutoFilled && (
                  <span className="ml-1 text-brand-green normal-case tracking-normal font-medium">자동</span>
                )}
              </label>
              <input
                value={form[key] ?? ''}
                onChange={handleChange(key)}
                placeholder={placeholder}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-black outline-none transition-colors
                  focus:border-brand-green
                  ${filled
                    ? isAutoFilled
                      ? 'border-brand-green bg-brand-pale'
                      : 'border-brand-border bg-white'
                    : 'border-brand-orange/50 bg-orange-50'
                  }`}
              />
              {hint && !filled && (
                <p className="text-[10px] text-brand-muted mt-0.5">{hint}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* 확인 버튼 */}
      <button
        onClick={() => onConfirm(form)}
        className="w-full bg-brand-black text-white font-bold py-4 rounded-xl hover:bg-brand-ink transition-colors"
      >
        ✈️ 이 정보로 여정 시작하기
      </button>
    </div>
  )
}
