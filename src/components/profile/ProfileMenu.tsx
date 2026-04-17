import { useAuth } from '../../context/AuthContext'

const MENU = [
  { icon: '✈️', label: '내 여행 기록' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '📔', label: '여권 · 서류 관리' },
  { icon: '👫', label: '친구 위치 공유' },
  { icon: '⚙️', label: '앱 설정' },
]

export default function ProfileMenu() {
  const { signOut } = useAuth()

  return (
    <div className="space-y-2">
      {MENU.map((item) => (
        <button key={item.label}
          className="bg-white border border-brand-border rounded-xl px-3 py-3 flex items-center gap-2.5 w-full text-left hover:border-brand-green transition-colors">
          <div className="w-7 h-7 rounded-lg bg-brand-pale flex items-center justify-center text-sm flex-shrink-0">
            {item.icon}
          </div>
          <span className="flex-1 font-semibold text-brand-ink text-xs">{item.label}</span>
          <span className="text-brand-muted text-sm">›</span>
        </button>
      ))}

      <button onClick={signOut}
        className="bg-white border border-brand-border rounded-xl px-3 py-3 flex items-center gap-2.5 w-full text-left hover:border-red-300 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-sm flex-shrink-0">🚪</div>
        <span className="flex-1 font-semibold text-red-500 text-xs">로그아웃</span>
      </button>
    </div>
  )
}
