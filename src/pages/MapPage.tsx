import { useState } from 'react'
import TopNav from '../components/layout/TopNav'

interface ParkingSpot {
  zone: string
  floor: string
  savedAt: string
}

export default function MapPage() {
  const [parking, setParking] = useState<ParkingSpot | null>(null)
  const [saving, setSaving] = useState(false)

  function handleSaveParking() {
    setSaving(true)
    setTimeout(() => {
      setParking({ zone: 'A구역', floor: '3층', savedAt: '오후 2:34' })
      setSaving(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">지도 · 주차</p>
            <p className="text-sm text-brand-muted mt-1">현재 위치와 주차 위치를 한눈에</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 지도 영역 */}
            <div className="space-y-4">
              {/* 지도 placeholder */}
              <div className="bg-white border border-brand-border rounded-hero overflow-hidden aspect-square flex flex-col items-center justify-center relative">
                {/* 지도 배경 모의 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4e8] to-[#d4edda] opacity-60" />
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-brand-green/30" />
                  ))}
                </div>

                {/* 현재 위치 핀 */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-brand-green border-4 border-white shadow-lg flex items-center justify-center text-white text-base animate-pulse">
                    📍
                  </div>
                  <div className="bg-white text-[10px] font-bold text-brand-green px-2 py-0.5 rounded-pill shadow-sm">
                    현재 위치
                  </div>
                </div>

                {/* 주차 위치 핀 */}
                {parking && (
                  <div className="absolute top-1/4 right-1/4 z-10 flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-brand-orange border-4 border-white shadow-lg flex items-center justify-center text-white text-sm">
                      🅿️
                    </div>
                    <div className="bg-white text-[10px] font-bold text-brand-orange px-2 py-0.5 rounded-pill shadow-sm whitespace-nowrap">
                      {parking.zone} {parking.floor}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
                  <button className="w-7 h-7 bg-white border border-brand-border rounded-lg shadow-sm flex items-center justify-center text-sm font-bold text-brand-ink">+</button>
                  <button className="w-7 h-7 bg-white border border-brand-border rounded-lg shadow-sm flex items-center justify-center text-sm font-bold text-brand-ink">−</button>
                </div>
              </div>

              <div className="flex gap-3 text-xs text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-brand-green" />
                  <span>현재 위치</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-brand-orange" />
                  <span>주차 위치</span>
                </div>
              </div>
            </div>

            {/* 오른쪽: 주차 정보 */}
            <div className="space-y-4">

              {/* 주차 저장 카드 */}
              {!parking ? (
                <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4">
                  <div>
                    <p className="font-bold text-brand-black mb-1">차 위치 저장</p>
                    <p className="text-sm text-brand-muted">공항 도착 후 주차하면 GPS로 위치를 저장하세요</p>
                  </div>
                  <button
                    onClick={handleSaveParking}
                    disabled={saving}
                    className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
                  >
                    {saving ? '📍 저장 중...' : '📍 현재 위치로 주차 저장'}
                  </button>
                  <div className="space-y-2">
                    <p className="text-xs text-brand-muted font-semibold">직접 입력</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['A구역', 'B구역', 'C구역', 'D구역'].map((z) => (
                        <button key={z}
                          onClick={() => setParking({ zone: z, floor: '1층', savedAt: '지금' })}
                          className="border border-brand-border rounded-xl py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-green transition-colors">
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-brand-green rounded-xl overflow-hidden">
                  <div className="bg-brand-green px-5 py-3 flex items-center justify-between">
                    <span className="font-bold text-white text-sm">✅ 주차 위치 저장됨</span>
                    <span className="text-[10px] text-white/70">{parking.savedAt} 저장</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-muted">구역</span>
                      <span className="font-bold text-brand-black">{parking.zone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-muted">층</span>
                      <span className="font-bold text-brand-black">{parking.floor}</span>
                    </div>
                    <div className="border-t border-brand-border pt-3 space-y-2">
                      <button className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors text-sm">
                        📍 차 위치로 안내
                      </button>
                      <button
                        onClick={() => setParking(null)}
                        className="w-full border border-brand-border text-brand-muted font-semibold py-2.5 rounded-xl hover:border-brand-red hover:text-brand-red transition-colors text-sm">
                        위치 초기화
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 주차 요금 안내 */}
              <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">인천공항 주차 요금</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: '단기 주차장', rate: '1,800원 / 30분' },
                    { label: '장기 주차장', rate: '1,200원 / 1시간' },
                    { label: '화물청사', rate: '1,000원 / 1시간' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-brand-muted">{r.label}</span>
                      <span className="font-semibold text-brand-ink">{r.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
