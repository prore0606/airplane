interface Props {
  progress: number   // 0 ~ 100
  imagePreview: string | null
}

/**
 * 단일 책임: OCR 진행 중 상태 표시 UI
 */
export default function ScanProgress({ progress, imagePreview }: Props) {
  return (
    <div className="space-y-4">
      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div className="rounded-xl overflow-hidden border border-brand-border aspect-video bg-brand-surface flex items-center justify-center">
          <img src={imagePreview} alt="업로드된 항공권" className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {/* 진행 상태 */}
      <div className="bg-white border border-brand-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🔍</span>
          <div className="flex-1">
            <p className="font-bold text-brand-black text-sm">항공권 정보 인식 중...</p>
            <p className="text-xs text-brand-muted mt-0.5">{progress}% 완료</p>
          </div>
        </div>
        <div className="h-2 bg-brand-border rounded-pill overflow-hidden">
          <div
            className="h-full bg-brand-green rounded-pill transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-brand-muted">
          <span>이미지 분석</span>
          <span>텍스트 추출</span>
          <span>정보 파싱</span>
        </div>
      </div>
    </div>
  )
}
