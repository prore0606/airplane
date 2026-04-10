export type TabId = 'home' | 'journey' | 'flights' | 'map' | 'my'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',    icon: '🏠', label: '홈' },
  { id: 'journey', icon: '✈️', label: '여정' },
  { id: 'flights', icon: '🛫', label: '항공편' },
  { id: 'map',     icon: '🗺️', label: '지도' },
  { id: 'my',      icon: '👤', label: 'MY' },
]

type Props = {
  active: TabId
  onChange: (id: TabId) => void
}

export default function BottomTab({ active, onChange }: Props) {
  return (
    <nav className="bg-white border-t border-brand-border shrink-0 pt-2 pb-4">
      <div className="max-w-lg mx-auto flex">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1"
          >
            {/* 아이콘 pill */}
            <div className={`w-12 h-8 flex items-center justify-center rounded-2xl transition-all
              ${isActive ? 'bg-brand-pale scale-110' : 'scale-100'}`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
            </div>
            {/* 레이블 */}
            <span className={`text-[10px] leading-none transition-colors
              ${isActive ? 'text-brand-green font-black' : 'text-brand-muted font-medium'}`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
      </div>
    </nav>
  )
}
