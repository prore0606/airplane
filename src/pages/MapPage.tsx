import TopNav from '../components/layout/TopNav'

const CHECKLIST = [
  { done: true,  text: '여권 유효기간 확인',          badge: null,                            group: '필수 서류' },
  { done: true,  text: '온라인 체크인 완료',           badge: null,                            group: '필수 서류' },
  { done: false, text: '여행 보험 가입',               badge: { label: '⚠ 미완료', warn: true }, group: '필수 서류' },
  { done: true,  text: '외장 보조배터리 챙기기',       badge: null,                            group: '짐 체크' },
  { done: true,  text: '보조배터리 용량 확인',         badge: null,                            group: '짐 체크' },
  { done: false, text: '상비약 (진통제·지사제)',       badge: null,                            group: '짐 체크' },
  { done: false, text: '액체류 100ml↓ 기내반입 확인', badge: { label: '기내', warn: false },   group: '짐 체크' },
]

export default function MapPage() {
  const done = CHECKLIST.filter((c) => c.done).length
  const total = CHECKLIST.length
  const groups = [...new Set(CHECKLIST.map((c) => c.group))]

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">AI 체크리스트</p>
            <p className="text-sm text-brand-muted mt-1">오사카 3박 4일 · 기반 자동 생성</p>
          </div>

          {/* 진행률 */}
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <div className="flex justify-between mb-3">
              <span className="font-bold text-brand-black">준비 진행률</span>
              <span className="font-bold text-brand-green">{done} / {total} 완료</span>
            </div>
            <div className="h-2 bg-brand-border rounded-pill overflow-hidden">
              <div className="h-full bg-brand-green rounded-pill transition-all"
                style={{ width: `${Math.round((done / total) * 100)}%` }} />
            </div>
          </div>

          {/* 그룹별 체크리스트 */}
          <div className="grid grid-cols-2 gap-6">
            {groups.map((group) => (
              <div key={group}>
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">{group}</p>
                <div className="space-y-2">
                  {CHECKLIST.filter((c) => c.group === group).map((item, i) => (
                    <div key={i} className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center text-xs font-black border-2 ${item.done ? 'bg-brand-green border-brand-green text-white' : 'border-brand-border'}`}>
                        {item.done && '✓'}
                      </div>
                      <span className={`flex-1 text-sm ${item.done ? 'text-brand-muted line-through' : 'text-brand-ink'}`}>
                        {item.text}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${item.badge.warn ? 'bg-orange-50 text-brand-orange' : 'bg-brand-pale text-brand-dark'}`}>
                          {item.badge.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
