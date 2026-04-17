const BADGES = [
  { icon: '📸', label: '첫 스캔'   },
  { icon: '📋', label: '준비완료'  },
  { icon: '🅿️', label: '주차마스터' },
  { icon: '🚶', label: '만보왕'    },
  { icon: '🛍️', label: '면세탐험가' },
  { icon: '✈️', label: '여행완료'  },
]

export default function BadgeGrid() {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-brand-black text-sm">배지</p>
        <span className="text-xs text-brand-muted">0 / {BADGES.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {BADGES.map((b) => (
          <div key={b.label}
            className="rounded-xl p-2 flex flex-col items-center gap-1 border border-brand-border bg-brand-surface opacity-40 grayscale">
            <span className="text-xl">{b.icon}</span>
            <p className="text-[9px] font-bold text-brand-ink text-center leading-tight">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
