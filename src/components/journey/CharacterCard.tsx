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
    <div className="bg-white border border-brand-border rounded-hero p-6 flex items-center gap-6">
      <div className="w-36 h-36 shrink-0 flex items-center justify-center">
        {charImg ? (
          <img src={charImg} alt={STAGE_LABEL[stage]} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-brand-pale border-2 border-dashed border-brand-mid flex items-center justify-center text-4xl">
            ✈️
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="inline-block text-[10px] font-bold tracking-widest text-brand-green bg-brand-pale px-2.5 py-0.5 rounded-pill mb-2 uppercase">
          {stage === 'no_ticket' ? 'START' : `STEP ${STAGE_ORDER.indexOf(stage)}`}
        </span>
        <p className="text-xl font-bold text-brand-black mb-1">{STAGE_LABEL[stage]}</p>
        {flight && sched && stage !== 'no_ticket' && (
          <p className="text-sm text-brand-muted">
            {flight.flightId} · {flight.airportCode} · {sched.time} 출발
          </p>
        )}
        {stage === 'no_ticket' && (
          <p className="text-sm text-brand-muted leading-relaxed">
            항공권을 스캔하면<br />여행이 시작됩니다
          </p>
        )}
      </div>
    </div>
  )
}
