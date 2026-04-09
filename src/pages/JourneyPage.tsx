import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_ORDER } from '../context/JourneyContext'
import { useFlights } from '../hooks/useFlights'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import ChapterBar from '../components/journey/ChapterBar'
import CharacterCard from '../components/journey/CharacterCard'
import StageActions from '../components/journey/StageActions'
import StageExtras from '../components/journey/StageExtras'
import { NEXT_LABEL } from '../components/journey/stageConfig'

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered } = useJourney()
  const { data: flights } = useFlights()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()

  const nextLabel = NEXT_LABEL[stage] ?? ''

  function handleNext() {
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1])
  }

  function handleScan() {
    setFlightRegistered(true)
    setStage('preparing')
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}

          <CharacterCard stage={stage} flight={flights[0]} />

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
          />

        </div>
      </div>
    </div>
  )
}
