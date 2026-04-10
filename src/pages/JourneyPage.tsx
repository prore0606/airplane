import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_ORDER } from '../context/JourneyContext'
import { useFlightContext } from '../context/FlightContext'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import ChapterBar from '../components/journey/ChapterBar'
import CharacterCard from '../components/journey/CharacterCard'
import StageActions from '../components/journey/StageActions'
import StageExtras from '../components/journey/StageExtras'
import BoardingCountdown from '../components/journey/BoardingCountdown'
import { NEXT_LABEL } from '../components/journey/stageConfig'
import { parseDatetime } from '../services/flightApi'

/** 카운트다운을 표시할 단계 */
const COUNTDOWN_STAGES = new Set(['airside', 'boarding', 'external', 'checkin'])

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered } = useJourney()
  const { flights } = useFlightContext()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()

  const nextLabel = NEXT_LABEL[stage] ?? ''
  const flight = flights[0]
  // HHMM 형태만 추출 (전체 datetime이면 시간 부분만)
  const departureHHMM = flight
    ? (() => {
        const raw = flight.scheduleDatetime ?? ''
        if (raw.length <= 4) return raw          // 이미 HHMM
        const { time } = parseDatetime(raw)
        return time.replace(':', '')              // "14:30" → "1430"
      })()
    : null

  function handleNext() {
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1])
  }

  function handleScan() {
    setFlightRegistered(true)
    setStage('preparing')
  }

  function handleReset() {
    setFlightRegistered(false)
    setStage('no_ticket')
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}

          <CharacterCard stage={stage} flight={flight} />

          {/* 탑승 카운트다운 — checkin 이후 단계에서 표시 */}
          {COUNTDOWN_STAGES.has(stage) && (
            <BoardingCountdown
              departureHHMM={departureHHMM}
              flightId={flight?.flightId}
            />
          )}

          <StageActions
            stage={stage}
            onScan={handleScan}
            onNext={handleNext}
            nextLabel={nextLabel}
          />

          <StageExtras
            stage={stage}
            shuttles={shuttles}
            congestion={congestion}
            onReset={handleReset}
          />

        </div>
      </div>
    </div>
  )
}
