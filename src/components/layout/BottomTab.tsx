export type TabId = 'home' | 'journey' | 'map' | 'my'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',    icon: '🏠', label: '홈' },
  { id: 'journey', icon: '✈️', label: '여정' },
  { id: 'map',     icon: '🗺️', label: '지도' },
  { id: 'my',      icon: '👤', label: 'MY' },
]

type Props = {
  active: TabId
  onChange: (id: TabId) => void
}

export default function BottomTab({ active, onChange }: Props) {
  return (
    <nav className="bg-white border-t border-brand-border flex">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-0.5 pt-2 pb-4"
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className={`text-[9px] leading-none ${isActive ? 'text-brand-green font-bold' : 'text-brand-muted font-medium'}`}>
              {tab.label}
            </span>
            {isActive && <span className="w-1 h-1 rounded-full bg-brand-green mt-0.5" />}
          </button>
        )
      })}
    </nav>
  )
}
