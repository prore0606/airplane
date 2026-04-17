import ImageUploader from '../scan/ImageUploader'
import ScanProgress from '../scan/ScanProgress'
import OcrResultForm from '../scan/OcrResultForm'
import type { ScanStep } from '../../hooks/useBoardingScan'
import type { ParsedBoardingPass } from '../../services/ocr/boardingPassParser'

const CLOSE_BTN = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const TITLES: Record<ScanStep, string> = {
  idle:     '항공권 가져오기',
  scanning: '정보 인식 중...',
  result:   '정보 확인 · 수정',
}
const SUBTITLES: Record<ScanStep, string> = {
  idle:     'AI가 편명·게이트·시간을 자동으로 읽어드려요',
  scanning: 'OCR로 텍스트 추출 중이에요',
  result:   '틀린 부분을 탭해서 수정하세요',
}

interface Props {
  scanStep:     ScanStep
  scanProgress: number
  preview:      string | null
  parsed:       ParsedBoardingPass | null
  onClose:      () => void
  onFileSelect: (f: File) => void
  onRescan:     () => void
  onConfirm:    (info: ParsedBoardingPass) => void
}

export default function ScanModal({ scanStep, scanProgress, preview, parsed, onClose, onFileSelect, onRescan, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => scanStep !== 'scanning' && onClose()} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
        <div className="px-5 py-4 flex items-center justify-between border-b border-brand-border shrink-0">
          <div>
            <p className="font-black text-base text-brand-black">{TITLES[scanStep]}</p>
            <p className="text-xs text-brand-muted mt-0.5">{SUBTITLES[scanStep]}</p>
          </div>
          {scanStep !== 'scanning' && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors text-brand-body shrink-0 ml-3">
              {CLOSE_BTN}
            </button>
          )}
        </div>
        <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
          {scanStep === 'idle'    && <ImageUploader onFileSelect={onFileSelect} />}
          {scanStep === 'scanning' && <ScanProgress progress={scanProgress} imagePreview={preview} />}
          {scanStep === 'result'  && parsed && <OcrResultForm parsed={parsed} onConfirm={onConfirm} onRescan={onRescan} />}
        </div>
      </div>
    </div>
  )
}
