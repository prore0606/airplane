import { useRoadviewState } from '../../../hooks/useRoadviewState'
import { useUserMode } from '../../../context/UserModeContext'
import RoadviewPhoto from './RoadviewPhoto'
import RoadviewControls from './RoadviewControls'
import RoadviewSOS from './RoadviewSOS'
import PhotoFilmstrip from './PhotoFilmstrip'
import type { RouteStep } from '../../../types/foreigner'

type Props = {
  steps: RouteStep[]
  onComplete: () => void
}

export default function RoadviewPage({ steps, onComplete }: Props) {
  const { language } = useUserMode()
  const { currentStep, index, total, isFirst, isLast, progress, goNext, goPrev, jumpTo } =
    useRoadviewState(steps)

  if (!currentStep) return null

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <RoadviewPhoto
        step={currentStep}
        stepNum={currentStep.step_number}
        total={total}
      />
      <RoadviewControls
        step={currentStep}
        progress={progress}
        isFirst={isFirst}
        isLast={isLast}
        language={language}
        onNext={goNext}
        onPrev={goPrev}
        onDone={onComplete}
      />
      <RoadviewSOS />
      <PhotoFilmstrip
        steps={steps}
        currentIndex={index}
        onJump={jumpTo}
      />
    </div>
  )
}
