import { STAGE_ORDER, type JourneyStage } from '../../context/JourneyContext'

interface Props {
  stage: JourneyStage
}

export default function ChapterBar({ stage }: Props) {
  const idx = STAGE_ORDER.indexOf(stage)
  const pct = Math.round((idx / (STAGE_ORDER.length - 1)) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-brand-muted font-medium">
        <span>여정 진행률</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-green rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-brand-muted/60">
        <span>티켓 등록</span>
        <span>탑승 완료</span>
      </div>
    </div>
  )
}
