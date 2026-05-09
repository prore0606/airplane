import type { RouteStep } from '../../../types/foreigner'

type Props = {
  step: RouteStep
  stepNum: number
  total: number
}

const GRADIENTS = [
  'linear-gradient(160deg, #0f261a 0%, #1a5c2e 55%, #22c55e 100%)',
  'linear-gradient(160deg, #0f1e26 0%, #1a3e5c 55%, #3b82f6 100%)',
  'linear-gradient(160deg, #1a1526 0%, #3b2a5c 55%, #8b5cf6 100%)',
  'linear-gradient(160deg, #261a0f 0%, #5c3a1a 55%, #f59e0b 100%)',
]

export default function RoadviewPhoto({ step, stepNum, total }: Props) {
  const bg = GRADIENTS[(stepNum - 1) % GRADIENTS.length]

  return (
    <div className="relative flex-1 overflow-hidden">
      {step.photo_url ? (
        <img src={step.photo_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: bg }} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,.75) 0%, transparent 100%)' }} />

      <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg border border-white/10">
        📍 {step.location_stamp}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {step.photo_url?.startsWith('/img2/') && (
          <span className="bg-black/60 backdrop-blur-sm text-white/70 text-[9px] font-bold px-2 py-1 rounded-md border border-white/10 tracking-wider">
            예시화면
          </span>
        )}
        <span className="bg-brand-green text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-brand-green/40">
          {String(stepNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-brand-green border-4 border-white flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-brand-green/60">
          {step.direction}
        </div>
        <div className="bg-black/75 text-white text-[13px] font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
          {step.instruction_en}
          {step.distance_m ? ` · ${step.distance_m}m` : ''}
        </div>
      </div>
    </div>
  )
}
