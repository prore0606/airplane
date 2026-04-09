const FACILITIES = [
  { icon: '🍽️', name: '식당' },
  { icon: '🛍️', name: '면세점' },
  { icon: '🛋️', name: '라운지' },
  { icon: '📱', name: '환전' },
  { icon: '🏧', name: 'ATM' },
  { icon: '💊', name: '약국' },
]

export default function FacilityGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-brand-black">공항 내 시설</p>
        <button className="text-sm text-brand-green font-semibold">전체보기 ›</button>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {FACILITIES.map((f) => (
          <button key={f.name}
            className="bg-white border border-brand-border rounded-xl py-4 flex flex-col items-center gap-2 hover:border-brand-green transition-colors">
            <span className="text-2xl">{f.icon}</span>
            <span className="text-[11px] text-brand-muted font-medium">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
