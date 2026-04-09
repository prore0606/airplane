import { useState, useEffect, type ChangeEvent } from 'react'
import type { ParsedBoardingPass } from '../../services/ocr/boardingPassParser'

interface Props {
  parsed: ParsedBoardingPass
  onConfirm: (info: ParsedBoardingPass) => void
  onRescan: () => void
}

const FIELD_LABELS: { key: keyof ParsedBoardingPass; label: string; placeholder: string }[] = [
  { key: 'flightNumber',   label: '항공편명',   placeholder: 'KE723' },
  { key: 'airline',        label: '항공사',     placeholder: '대한항공' },
  { key: 'origin',         label: '출발 공항',  placeholder: 'ICN' },
  { key: 'destination',    label: '도착 공항',  placeholder: 'NRT' },
  { key: 'departureTime',  label: '출발 시간',  placeholder: '13:40' },
  { key: 'terminal',       label: '터미널',     placeholder: 'T1' },
  { key: 'gate',           label: '게이트',     placeholder: 'G23' },
  { key: 'date',           label: '출발 날짜',  placeholder: '2026-04-03' },
]

/**
 * 단일 책임: OCR 파싱 결과를 폼으로 보여주고 수정 후 확인
 * 파싱 로직 없음, OCR 실행 없음
 */
export default function OcrResultForm({ parsed, onConfirm, onRescan }: Props) {
  const [form, setForm] = useState<ParsedBoardingPass>(parsed)

  useEffect(() => { setForm(parsed) }, [parsed])

  function handleChange(key: keyof ParsedBoardingPass) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const filledCount = FIELD_LABELS.filter(({ key }) => !!form[key]).length
  const allFilled = filledCount === FIELD_LABELS.length

  return (
    <div className="space-y-4">

      {/* 인식 결과 헤더 */}
      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className={`px-5 py-3 flex items-center justify-between ${allFilled ? 'bg-brand-green' : 'bg-brand-orange'}`}>
          <span className="text-sm font-bold text-white">
            {allFilled ? '✅ 인식 완료 — 내용을 확인해주세요' : `⚠️ ${filledCount}/${FIELD_LABELS.length} 항목 인식됨 — 빈 항목을 채워주세요`}
          </span>
          <button onClick={onRescan} className="text-[10px] text-white/70 hover:text-white underline">
            다시 스캔
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          {FIELD_LABELS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                {label}
              </label>
              <input
                value={form[key] ?? ''}
                onChange={handleChange(key)}
                placeholder={placeholder}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-black outline-none transition-colors
                  focus:border-brand-green
                  ${form[key] ? 'border-brand-border bg-white' : 'border-brand-orange/50 bg-orange-50'}`}
              />
            </div>
          ))}
        </div>
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
