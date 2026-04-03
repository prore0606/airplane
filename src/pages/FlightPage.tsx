import TopNav from '../components/layout/TopNav'

const SCAN_OPTIONS = [
  { icon: '🖼️', label: '갤러리에서' },
  { icon: '💬', label: '카카오톡에서' },
  { icon: '📧', label: '이메일에서' },
  { icon: '📄', label: 'PDF 파일' },
]

const OCR_RESULT = [
  ['항공편', 'KE 723 · 대한항공'],
  ['출발',   'ICN → NRT'],
  ['시간',   '13:40 → 15:20'],
  ['터미널', 'T1 · G게이트'],
]

export default function FlightPage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">항공권 등록하기</p>
            <p className="text-sm text-brand-muted mt-1">스캔하면 모든 여행 정보가 자동 연결됩니다</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 스캔 영역 */}
            <div className="space-y-4">
              <div className="bg-brand-pale border-2 border-dashed border-brand-mid rounded-hero px-8 py-12 text-center">
                <div className="text-5xl mb-4">📸</div>
                <p className="font-bold text-brand-black mb-2">항공권 사진을 올려주세요</p>
                <p className="text-sm text-brand-muted leading-relaxed">
                  AI가 자동으로 항공편 정보를<br />읽어서 등록해드립니다
                </p>
              </div>
              <button className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors">
                📷 카메라로 촬영하기
              </button>
              <div className="grid grid-cols-2 gap-2">
                {SCAN_OPTIONS.map((opt) => (
                  <button key={opt.label}
                    className="bg-white border border-brand-border rounded-xl p-3.5 flex items-center gap-2.5 hover:border-brand-green transition-colors">
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-semibold text-brand-ink">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: OCR 결과 */}
            <div>
              <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">인식 결과</p>
              <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
                <div className="bg-brand-green px-5 py-3.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">✅ 자동 인식 완료</span>
                  <span className="text-xs bg-white/25 text-white px-2.5 py-0.5 rounded-pill">확인됨</span>
                </div>
                <div className="p-5 space-y-4">
                  {OCR_RESULT.map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center border-b border-brand-border pb-3 last:border-0 last:pb-0">
                      <span className="text-sm text-brand-muted">{key}</span>
                      <span className="text-sm font-bold text-brand-black">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
