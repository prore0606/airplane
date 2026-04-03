import TopNav from '../components/layout/TopNav'

const SCAN_OPTIONS = [
  { icon: '🖼️', label: '갤러리에서' },
  { icon: '💬', label: '카카오톡에서' },
  { icon: '📧', label: '이메일에서' },
  { icon: '📄', label: 'PDF 파일' },
]

export default function FlightPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <TopNav />

      <div className="px-4 pt-3 pb-2">
        <p className="text-base font-bold text-brand-black">항공권 등록하기</p>
        <p className="text-xs text-brand-muted mt-0.5">스캔하면 모든 여행 정보가 자동 연결됩니다</p>
      </div>

      {/* 스캔 히어로 */}
      <div className="mx-4 mb-3 bg-brand-pale border-2 border-dashed border-brand-mid rounded-hero px-5 py-8 text-center">
        <div className="text-4xl mb-3">📸</div>
        <p className="text-sm font-bold text-brand-black mb-1.5">항공권 사진을 올려주세요</p>
        <p className="text-xs text-brand-muted leading-relaxed">AI가 자동으로 항공편 정보를<br />읽어서 등록해드립니다</p>
      </div>

      <button className="mx-4 mb-2.5 bg-brand-green text-white font-bold text-sm py-3.5 rounded-xl">
        📷 카메라로 촬영하기
      </button>

      <div className="grid grid-cols-2 gap-2 mx-4 mb-4">
        {SCAN_OPTIONS.map((opt) => (
          <button key={opt.label}
            className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-2.5">
            <span className="text-xl">{opt.icon}</span>
            <span className="text-xs font-semibold text-brand-ink">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* OCR 결과 샘플 */}
      <div className="mx-4 bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="bg-brand-green px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-white tracking-wider">✅ 자동 인식 완료</span>
          <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-pill">확인됨</span>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {[
            ['항공편', 'KE 723 · 대한항공'],
            ['출발', 'ICN → NRT'],
            ['시간', '13:40 → 15:20'],
            ['터미널', 'T1 · G게이트'],
          ].map(([key, val]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-[11px] text-brand-muted">{key}</span>
              <span className="text-xs font-bold text-brand-black">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
