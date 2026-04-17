import OcrResultForm from '../scan/OcrResultForm'
import type { ParsedBoardingPass } from '../../services/ocr/boardingPassParser'

const CLOSE_BTN = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

interface Props {
  onClose:   () => void
  onConfirm: (info: ParsedBoardingPass) => void
}

export default function ManualInputModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
        <div className="px-5 py-4 flex items-center justify-between border-b border-brand-border shrink-0">
          <div>
            <p className="font-black text-base text-brand-black">직접 항공편 입력</p>
            <p className="text-xs text-brand-muted mt-0.5">항공편 정보를 직접 입력해주세요</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors text-brand-body shrink-0 ml-3">
            {CLOSE_BTN}
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">
          <OcrResultForm parsed={{}} onConfirm={onConfirm} onRescan={onClose} />
        </div>
      </div>
    </div>
  )
}
