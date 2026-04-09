import { useJourney } from '../context/JourneyContext'

export default function GateFloatingButton() {
  const { stage, setStage } = useJourney()

  if (stage !== 'external') return null

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center px-8 pointer-events-none z-50">
      <button
        onClick={() => setStage('airside')}
        className="pointer-events-auto w-full max-w-sm bg-brand-green text-white font-bold py-4 rounded-pill shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
      >
        <span className="text-lg">🚪</span>
        게이트 입장하기
      </button>
    </div>
  )
}
