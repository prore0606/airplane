import TopNav from '../components/layout/TopNav'

const CHECKLIST = [
  { done: true,  text: '여권 유효기간 확인',          badge: null },
  { done: true,  text: '온라인 체크인 완료',           badge: null },
  { done: false, text: '여행 보험 가입',               badge: { label: '⚠ 미완료', warn: true } },
  { done: true,  text: '외장 보조배터리 챙기기',        badge: null },
  { done: true,  text: '보조배터리 용량 확인',          badge: null },
  { done: false, text: '상비약 (진통제·지사제)',        badge: null },
  { done: false, text: '액체류 100ml↓ 기내반입 확인',  badge: { label: '기내', warn: false } },
]

export default function MapPage() {
  const done = CHECKLIST.filter((c) => c.done).length

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <TopNav />

      <div className="px-4 pt-3 pb-2">
        <p className="text-base font-bold text-brand-black">AI 체크리스트</p>
        <p className="text-xs text-brand-muted mt-0.5">오사카 3박 4일 · 기반 자동 생성</p>
      </div>

      {/* 진행률 */}
      <div className="mx-4 mb-3 bg-white rounded-xl border border-brand-border p-4">
        <div className="flex justify-between mb-2.5">
          <span className="text-xs font-bold text-brand-black">준비 진행률</span>
          <span className="text-xs font-bold text-brand-green">{done} / {CHECKLIST.length} 완료</span>
        </div>
        <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden">
          <div className="h-full bg-brand-green rounded-pill transition-all"
            style={{ width: `${Math.round((done / CHECKLIST.length) * 100)}%` }} />
        </div>
      </div>

      <p className="px-4 pb-1.5 text-[11px] font-bold text-brand-muted uppercase tracking-wider">필수 서류</p>
      {CHECKLIST.slice(0, 3).map((item, i) => <CheckItem key={i} {...item} />)}

      <p className="px-4 pt-2 pb-1.5 text-[11px] font-bold text-brand-muted uppercase tracking-wider">짐 체크</p>
      {CHECKLIST.slice(3).map((item, i) => <CheckItem key={i} {...item} />)}
    </div>
  )
}

function CheckItem({ done, text, badge }: {
  done: boolean
  text: string
  badge: { label: string; warn: boolean } | null
}) {
  return (
    <div className="mx-4 mb-1.5 bg-white border border-brand-border rounded-xl px-3.5 py-3 flex items-center gap-3">
      <div className={`w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center text-[11px] font-black border-2 ${done ? 'bg-brand-green border-brand-green text-white' : 'border-brand-border'}`}>
        {done && '✓'}
      </div>
      <span className={`flex-1 text-[13px] ${done ? 'text-brand-muted line-through' : 'text-brand-ink'}`}>{text}</span>
      {badge && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] ${badge.warn ? 'bg-orange-50 text-brand-orange' : 'bg-brand-pale text-brand-dark'}`}>
          {badge.label}
        </span>
      )}
    </div>
  )
}
