import AirportMap from '../../components/map/AirportMap'
import type { AirportMapProps } from '../../components/map/AirportMap'
import type { NaverMapStatus } from '../../hooks/useNaverMap'

type TerminalFilter = 'all' | 'T1' | 'T2'

interface Props extends AirportMapProps {
  naverClientId: string | undefined
  mapStatus: NaverMapStatus
  terminalFilter: TerminalFilter
  onTerminalChange: (t: TerminalFilter) => void
}

export default function MapTab({
  naverClientId, terminalFilter, onTerminalChange,
  ...mapProps
}: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!naverClientId && (
        <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800">
          ⚠️ .env.local에 VITE_NAVER_MAP_CLIENT_ID 필요
        </div>
      )}

      {/* 터미널 필터 */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white border-b border-brand-border">
        <span className="text-[11px] font-bold text-brand-muted mr-1 shrink-0">터미널</span>
        <div className="flex gap-1 bg-brand-surface rounded-xl p-1 flex-1">
          {(['all', 'T1', 'T2'] as TerminalFilter[]).map((id) => (
            <button
              key={id}
              onClick={() => onTerminalChange(id)}
              className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all duration-150 ${
                terminalFilter === id
                  ? 'bg-white text-brand-green shadow-sm ring-1 ring-brand-border'
                  : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              {id === 'all' ? '전체' : id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AirportMap {...mapProps} />
      </div>
    </div>
  )
}
