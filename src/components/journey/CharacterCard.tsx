import { STAGE_CHARACTER, STAGE_LABEL, STAGE_ORDER, type JourneyStage } from '../../context/JourneyContext'
import type { Flight } from '../../services/flightApi'
import { parseDatetime } from '../../services/flightApi'

interface Props {
  stage: JourneyStage
  flight: Flight | undefined
}

export default function CharacterCard({ stage, flight }: Props) {
  const charImg = STAGE_CHARACTER[stage]
  const sched = flight ? parseDatetime(flight.scheduleDatetime) : null

  return (
    <div className="bg-white border border-brand-border rounded-hero overflow-hidden">
      {/* 캐릭터 메인 영역 */}
      <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-brand-pale to-white">
        {charImg ? (
          <img
            src={charImg}
            alt={STAGE_LABEL[stage]}
            className="w-52 h-52 object-contain drop-shadow-lg"
          />
        ) : (
          <div className="w-48 h-48 rounded-full bg-white border-2 border-dashed border-brand-mid flex items-center justify-center text-7xl">
            ✈️
          </div>
        )}
      </div>

      {/* 단계 정보 */}
      <div className="px-6 py-5 border-t border-brand-border">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-widest text-brand-green bg-brand-pale px-2.5 py-0.5 rounded-pill mb-1.5 uppercase">
              {stage === 'no_ticket' ? 'START' : `STEP ${STAGE_ORDER.indexOf(stage)}`}
            </span>
            <p className="text-xl font-bold text-brand-black">{STAGE_LABEL[stage]}</p>
          </div>
          {flight && sched && stage !== 'no_ticket' && (
            <div className="text-right">
              <p className="text-xs text-brand-muted">{flight.flightId} · {flight.airportCode}</p>
              <p className="text-sm font-bold text-brand-black mt-0.5">{sched.time} 출발</p>
            </div>
          )}
        </div>
        {stage === 'no_ticket' && (
          <p className="text-sm text-brand-muted mt-1">항공권을 스캔하면 여행이 시작됩니다</p>
        )}
      </div>
    </div>
  )
}
