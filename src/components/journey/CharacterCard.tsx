import { STAGE_CHARACTER, STAGE_LABEL, STAGE_ORDER, type JourneyStage } from '../../context/JourneyContext'
import type { Flight } from '../../services/flightApi'
import { parseDatetime } from '../../services/flightApi'

interface Props {
  stage: JourneyStage
  flight: Flight | undefined
}

const STAGE_DESC: Record<JourneyStage, string> = {
  no_ticket:  '항공권을 스캔하면 여행이 시작돼요',
  preparing:  '짐 싸고 여권 챙기는 중!',
  traveling:  '공항으로 달려가는 중!',
  checkin:    '체크인하고 보안검색 통과 중...',
  external:   '밥도 먹고 커피도 한 잔!',
  airside:    '면세점 구경하는 중 🛍️',
  boarding:   '게이트 앞에서 두근두근!',
  returned:   '여행 완료! 수고했어요 🎉',
}

/** /img/여행준비중.png → "여행준비중" */
function imgTitle(path: string) {
  return path.split('/').pop()?.replace('.png', '') ?? ''
}

export default function CharacterCard({ stage, flight }: Props) {
  const charImg = STAGE_CHARACTER[stage]
  const sched = flight ? parseDatetime(flight.scheduleDatetime) : null
  const title = charImg ? imgTitle(charImg) : STAGE_LABEL[stage]

  return (
    <div className="bg-white border border-brand-border rounded-hero overflow-hidden">

      {/* 캐릭터 이미지 — 배경 없음, 이미지만 크게 */}
      <div className="flex items-center justify-center pt-6 pb-2">
        {charImg ? (
          <img
            src={charImg}
            alt={title}
            className="object-contain drop-shadow-xl"
            style={{ height: '500px', width: 'auto', maxWidth: '100%' }}
          />
        ) : (
          <span className="text-[240px] leading-none">✈️</span>
        )}
      </div>

      {/* 이미지 파일명 제목 + 설명 */}
      <div className="text-center px-6 pt-2 pb-4">
        <p className="text-xl font-black text-brand-black">{title}</p>
        <p className="text-sm text-brand-muted mt-1">{STAGE_DESC[stage]}</p>
      </div>

      {/* 단계 정보 */}
      <div className="px-6 pb-5 border-t border-brand-border pt-4">
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
      </div>

    </div>
  )
}
