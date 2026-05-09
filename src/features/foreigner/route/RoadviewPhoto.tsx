import type { RouteStep } from '../../../types/foreigner'

type Props = {
  step: RouteStep
  stepNum: number
  total: number
}

const GRADIENTS = [
  'linear-gradient(180deg, rgba(15,26,20,.5) 0%, rgba(21,128,61,.75) 100%)',
  'linear-gradient(135deg, rgba(15,26,20,.6), rgba(194,65,12,.7))',
  'linear-gradient(180deg, rgba(0,52,120,.7) 0%, rgba(34,197,94,.55) 100%)',
  'linear-gradient(180deg, rgba(15,26,20,.5) 0%, rgba(34,197,94,.75) 100%)',
]

export default function RoadviewPhoto({ step, stepNum, total }: Props) {
  const bg = step.photo_url
    ? `url(${step.photo_url})`
    : GRADIENTS[(stepNum - 1) % GRADIENTS.length]

  return (
    <div
      className="relative flex-shrink-0"
      style={{ height: 340, background: bg, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* 위치 스탬프 */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-2.5 py-1.5 rounded">
        {step.location_stamp}
      </div>

      {/* 스텝 카운터 */}
      <div className="absolute top-3 right-3 bg-brand-green text-white text-[11px] font-bold px-2.5 py-1.5 rounded">
        {String(stepNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* 큰 방향 화살표 */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-full bg-brand-green/95 border-[2.5px] border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {step.direction}
        </div>
        {step.distance_m && (
          <div className="bg-black/75 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            ~{step.distance_m}m
          </div>
        )}
      </div>
    </div>
  )
}
