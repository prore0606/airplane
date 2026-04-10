import { useRef, type DragEvent, type ChangeEvent } from 'react'

interface Props {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageUploader({ onFileSelect, disabled }: Props) {
  const fileRef   = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { onFileSelect(file); e.target.value = '' }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="space-y-4">

      {/* 탑승권 일러스트 카드 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && fileRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl cursor-pointer group
          ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* 그라디언트 배경 */}
        <div className="bg-gradient-to-br from-brand-green to-brand-dark px-8 pt-8 pb-6 text-center">

          {/* 탑승권 아이콘 영역 */}
          <div className="relative inline-block mb-4">
            {/* 탑승권 카드 모양 */}
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-4 inline-flex flex-col items-center gap-1">
              <span className="text-4xl">✈️</span>
              <div className="flex gap-1 mt-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
                ))}
              </div>
              <div className="text-white/80 text-[10px] font-mono tracking-widest">BOARDING PASS</div>
            </div>
            {/* 호버 효과 */}
            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p className="text-white font-black text-lg leading-tight">항공권을 가져오세요</p>
          <p className="text-white/70 text-sm mt-1">AI가 정보를 자동으로 읽어드려요</p>

          {/* 점선 분리선 (탑승권 티어) */}
          <div className="flex items-center gap-1 mt-5 mx-[-8px]">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex-1 h-px bg-white/25" />
            ))}
          </div>

          <p className="text-white/50 text-xs mt-3">파일을 이 영역에 드래그해도 됩니다</p>
        </div>

        {/* 반원 컷아웃 효과 */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
      </div>

      {/* 액션 버튼 2개 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 카메라 */}
        <button
          disabled={disabled}
          onClick={() => cameraRef.current?.click()}
          className="flex flex-col items-center gap-2 bg-brand-pale border-2 border-brand-green rounded-2xl py-5
            hover:bg-brand-green hover:text-white transition-all group disabled:opacity-50"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">📷</span>
          <div className="text-center">
            <p className="text-sm font-black text-brand-black group-hover:text-white">카메라</p>
            <p className="text-[10px] text-brand-muted group-hover:text-white/80 mt-0.5">바로 촬영</p>
          </div>
        </button>

        {/* 갤러리 / 파일 */}
        <button
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 bg-brand-surface border-2 border-brand-border rounded-2xl py-5
            hover:border-brand-green hover:bg-brand-pale transition-all group disabled:opacity-50"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
          <div className="text-center">
            <p className="text-sm font-black text-brand-black">갤러리 / 파일</p>
            <p className="text-[10px] text-brand-muted mt-0.5">사진 · PDF</p>
          </div>
        </button>
      </div>

      {/* hidden inputs */}
      <input ref={fileRef}   type="file" accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
        className="hidden" onChange={handleChange} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={handleChange} />
    </div>
  )
}
