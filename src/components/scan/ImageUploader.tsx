import { useRef, type DragEvent, type ChangeEvent } from 'react'

interface Props {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,application/pdf'

/**
 * 단일 책임: 파일 선택 UI (드래그앤드롭 + 클릭 + 카메라)
 * OCR 실행은 하지 않음
 */
export default function ImageUploader({ onFileSelect, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  return (
    <div className="space-y-3">
      {/* 드래그앤드롭 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`bg-brand-pale border-2 border-dashed border-brand-mid rounded-hero px-8 py-10 text-center transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-green hover:bg-brand-pale/70'}`}
      >
        <div className="text-5xl mb-4">📸</div>
        <p className="font-bold text-brand-black mb-2">항공권 사진을 올려주세요</p>
        <p className="text-sm text-brand-muted leading-relaxed">
          클릭하거나 사진을 드래그하세요<br />
          AI가 자동으로 정보를 읽어드립니다
        </p>
      </div>

      {/* 카메라 촬영 */}
      <button
        disabled={disabled}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.setAttribute('capture', 'environment')
            inputRef.current.click()
          }
        }}
        className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        📷 카메라로 촬영하기
      </button>

      {/* 기타 소스 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '🖼️', label: '갤러리에서' },
          { icon: '📄', label: 'PDF 파일' },
        ].map((opt) => (
          <button
            key={opt.label}
            disabled={disabled}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.removeAttribute('capture')
                inputRef.current.click()
              }
            }}
            className="bg-white border border-brand-border rounded-xl p-3.5 flex items-center gap-2.5 hover:border-brand-green transition-colors disabled:opacity-50"
          >
            <span className="text-xl">{opt.icon}</span>
            <span className="text-xs font-semibold text-brand-ink">{opt.label}</span>
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
