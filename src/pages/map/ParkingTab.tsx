import { useState } from 'react'
import { useParking } from '../../hooks/useParking'
import { parkingStatus } from '../../services/parkingApi'
import type { ParkingLot } from '../../services/parkingApi'
import ParkingNavigationModal from '../../components/map/ParkingNavigationModal'

interface SavedSpot { zone: string; floor: string; savedAt: string }

const ZONES = ['A구역', 'B구역', 'C구역', 'D구역']
const FEE_GUIDE = [
  ['단기 주차장', '1,800원 / 30분'],
  ['장기 주차장', '1,200원 / 1시간'],
  ['화물청사',   '1,000원 / 1시간'],
]

export default function ParkingTab() {
  const [parking, setParking] = useState<SavedSpot | null>(null)
  const [saving,  setSaving]  = useState(false)
  const [navLot,  setNavLot]  = useState<ParkingLot | null>(null)
  const { data: lots, loading } = useParking()

  function handleSave() {
    setSaving(true)
    setTimeout(() => { setParking({ zone: 'A구역', floor: '3층', savedAt: '오후 2:34' }); setSaving(false) }, 1200)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {!parking ? (
          <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4">
            <div>
              <p className="font-bold text-brand-black">차 위치 저장</p>
              <p className="text-sm text-brand-muted mt-0.5">공항 도착 후 주차하면 GPS로 위치를 저장하세요</p>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
            >{saving ? '📍 저장 중...' : '📍 현재 위치로 주차 저장'}</button>
            <div className="space-y-2">
              <p className="text-xs text-brand-muted font-semibold">직접 입력</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((z) => (
                  <button key={z} onClick={() => setParking({ zone: z, floor: '1층', savedAt: '지금' })}
                    className="border border-brand-border rounded-xl py-2.5 text-sm font-semibold hover:border-brand-green transition-colors"
                  >{z}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-brand-green rounded-xl overflow-hidden">
            <div className="bg-brand-green px-5 py-3 flex items-center justify-between">
              <span className="font-bold text-white text-sm">주차 위치 저장됨</span>
              <span className="text-[10px] text-white/70">{parking.savedAt} 저장</span>
            </div>
            <div className="p-5 space-y-3">
              {[['구역', parking.zone], ['층', parking.floor]].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-sm text-brand-muted">{l}</span>
                  <span className="font-bold text-brand-black">{v}</span>
                </div>
              ))}
              <div className="border-t border-brand-border pt-3 space-y-2">
                <button className="w-full bg-brand-green text-white font-bold py-3 rounded-xl text-sm">📍 차 위치로 안내</button>
                <button onClick={() => setParking(null)}
                  className="w-full border border-brand-border text-brand-muted font-semibold py-2.5 rounded-xl text-sm hover:border-brand-red hover:text-brand-red transition-colors"
                >위치 초기화</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">실시간 주차 현황</p>
            {!loading && <span className="text-[10px] text-brand-green font-semibold bg-brand-pale px-2 py-0.5 rounded-pill">● LIVE</span>}
          </div>
          {loading ? <p className="text-sm text-brand-muted animate-pulse">로딩 중...</p> : (
            <div className="space-y-2">
              {lots.map((lot) => {
                const { label, color, pct } = parkingStatus(lot.parking, lot.parkingarea)
                const avail = Math.max(0, Number(lot.parkingarea) - Number(lot.parking))
                const ok = pct < 95
                return (
                  <button key={lot.floor} onClick={() => ok && setNavLot(lot)} disabled={!ok}
                    className={`w-full text-left rounded-xl p-2 -mx-2 transition-all ${ok ? 'hover:bg-brand-pale cursor-pointer' : 'cursor-default opacity-60'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-brand-ink">{lot.floor}</span>
                        {ok && <span className="text-[10px] text-brand-green font-bold bg-brand-pale px-1.5 py-0.5 rounded-full">길안내 →</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${color}`}>{label}</span>
                        <span className="text-[10px] text-brand-muted">{avail}면 여유</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden">
                      <div className={`h-full rounded-pill transition-all ${pct >= 90 ? 'bg-brand-red' : pct >= 70 ? 'bg-brand-orange' : 'bg-brand-green'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">인천공항 주차 요금</p>
          <div className="space-y-2 text-sm">
            {FEE_GUIDE.map(([l, r]) => (
              <div key={l} className="flex justify-between">
                <span className="text-brand-muted">{l}</span>
                <span className="font-semibold text-brand-ink">{r}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
      {navLot && <ParkingNavigationModal lot={navLot} onClose={() => setNavLot(null)} />}
    </div>
  )
}
