import { useRef, type DragEvent, type ChangeEvent } from 'react'

interface Props {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

/**
 * 단일 책임: 파일 선택 UI
 * - 데스크톱: 클릭 파일첨부 + 드래그앤드롭
 * - 모바일: 카메라 촬영 / 갤러리 선택 (input 분리로 확실하게 동작)
 */
export default function ImageUploader({ onFileSelect, disabled }: Props) {
  // 파일 선택 input (데스크톱 + 모바일 갤러리)
  const fileRef = useRef<HTMLInputElement>(null)
  // 카메라 촬영 전용 input (capture="environment")
  const cameraRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // 같은 파일 재선택을 위해 초기화
      e.target.value = ''
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="space-y-3">

      {/* 드래그앤드롭 영역 (데스크톱) */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && fileRef.current?.click()}
        className={`bg-brand-pale border-2 border-dashed border-brand-mid rounded-hero px-8 py-10 text-center transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-green hover:bg-brand-pale/70'}`}
      >
        <div className="text-5xl mb-3">📎</div>
        <p className="font-bold text-brand-black mb-1">항공권 사진을 첨부하세요</p>
        <p className="text-sm text-brand-muted leading-relaxed">
          클릭하거나 파일을 드래그하세요<br />
          <span className="text-xs">JPG · PNG · PDF 지원</span>
        </p>
      </div>

      {/* 모바일 전용: 카메라 촬영 */}
      <button
        disabled={disabled}
        onClick={() => cameraRef.current?.click()}
        className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span className="text-lg">📷</span>
        <span>카메라로 촬영하기</span>
      </button>

      {/* 갤러리 / PDF */}
      <button
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
        className="w-full bg-white border border-brand-border rounded-xl py-3.5 flex items-center justify-center gap-2 hover:border-brand-green transition-colors disabled:opacity-50"
      >
        <span className="text-lg">🖼️</span>
        <span className="text-sm font-semibold text-brand-ink">갤러리 · 파일에서 선택</span>
      </button>

      {/* 파일 선택 input — 데스크톱 + 모바일 갤러리 */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      {/* 카메라 전용 input — 모바일에서 카메라 앱 직접 실행 */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
