import type { TabId } from './BottomTab'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',      icon: '🏠', label: '홈' },
  { id: 'flight',    icon: '✈️', label: '항공편' },
  { id: 'map',       icon: '🗺️', label: '지도' },
  { id: 'character', icon: '🎮', label: '캐릭터' },
  { id: 'my',        icon: '🤝', label: 'MY' },
]

type Props = {
  active: TabId
  onChange: (id: TabId) => void
}

export default function SideNav({ active, onChange }: Props) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-brand-border flex flex-col min-h-screen sticky top-0">
      {/* 로고 */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-brand-border">
        <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white text-base">
          ✈
        </div>
        <span className="font-display font-black text-base tracking-tight text-brand-black">
          출국<span className="text-brand-green">메이트</span>
        </span>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full text-left ${
                isActive
                  ? 'bg-brand-pale text-brand-green'
                  : 'text-brand-body hover:bg-brand-surface'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-green" />}
            </button>
          )
        })}
      </nav>

      {/* 하단 버전 */}
      <div className="px-6 py-4 border-t border-brand-border">
        <p className="text-[11px] text-brand-muted">AirMate v0.1</p>
        <p className="text-[10px] text-brand-border mt-0.5">로컬 개발 환경</p>
      </div>
    </aside>
  )
}
