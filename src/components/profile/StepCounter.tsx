const STEPS_TODAY = 4820
const STEPS_GOAL  = 10000
const DISTANCE_KM = 3.4
const CALORIES    = 180

export default function StepCounter() {
  const pct = Math.round((STEPS_TODAY / STEPS_GOAL) * 100)

  return (
    <div className="bg-white border border-brand-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-brand-black text-sm">오늘 걸음수</p>
        <span className="text-[10px] text-brand-green font-bold bg-brand-pale px-2 py-0.5 rounded-pill">공항 내</span>
      </div>
      <p className="font-display font-black text-3xl text-brand-black">
        {STEPS_TODAY.toLocaleString()}
        <span className="text-sm font-sans font-normal text-brand-muted ml-1">보</span>
      </p>
      <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden">
        <div className="h-full bg-brand-green rounded-pill" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-brand-surface rounded-xl p-2.5 text-center">
          <p className="font-bold text-brand-black text-sm">{DISTANCE_KM}km</p>
          <p className="text-[10px] text-brand-muted mt-0.5">이동 거리</p>
        </div>
        <div className="bg-brand-surface rounded-xl p-2.5 text-center">
          <p className="font-bold text-brand-black text-sm">{CALORIES}kcal</p>
          <p className="text-[10px] text-brand-muted mt-0.5">소모 칼로리</p>
        </div>
      </div>
    </div>
  )
}
