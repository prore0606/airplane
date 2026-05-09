import type { ForeignerTab } from '../../../types/foreigner'

const TABS: { id: ForeignerTab; icon: string; label: string }[] = [
  { id: 'home',  icon: '🏠', label: 'Home'  },
  { id: 'route', icon: '🚉', label: 'Route' },
  { id: 'my',    icon: '👤', label: 'My'    },
]

type Props = {
  active: ForeignerTab
  onChange: (id: ForeignerTab) => void
}

export default function ForeignerBottomTab({ active, onChange }: Props) {
  return (
    <nav className="bg-white border-t border-brand-border shrink-0 pt-2 pb-safe">
      <div className="max-w-2xl mx-auto flex px-2">
        {TABS.map(tab => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-1 group"
            >
              <div className={`flex items-center justify-center rounded-2xl transition-all duration-150
                w-12 h-8 md:w-14 md:h-9
                ${isActive ? 'bg-brand-pale scale-110' : 'scale-100 group-hover:bg-brand-surface'}`}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
              </div>
              <span className={`text-[10px] leading-none transition-colors
                ${isActive ? 'text-brand-green font-black' : 'text-brand-muted font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
