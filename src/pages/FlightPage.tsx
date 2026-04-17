import TopNav from '../components/layout/TopNav'
import ImageUploader from '../components/scan/ImageUploader'
import ScanProgress from '../components/scan/ScanProgress'
import OcrResultForm from '../components/scan/OcrResultForm'
import DepartureBoard from '../components/flight/DepartureBoard'
import { useBoardingScan } from '../hooks/useBoardingScan'
import { useJourney } from '../context/JourneyContext'
import type { ParsedBoardingPass } from '../services/ocr/boardingPassParser'

export default function FlightPage() {
  const { setStage, setFlightRegistered } = useJourney()
  const { scanStep, scanProgress, preview, parsed, handleFileSelect, handleRescan } = useBoardingScan()

  function handleConfirm(info: ParsedBoardingPass) {
    setFlightRegistered(true)
    setStage('preparing')
    console.log('등록된 항공편 정보:', info)
    handleRescan()
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">항공권 등록 · 실시간 운항</p>
            <p className="text-sm text-brand-muted mt-1">스캔하면 모든 여행 정보가 자동 연결됩니다</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              {scanStep === 'idle'     && <ImageUploader onFileSelect={handleFileSelect} />}
              {scanStep === 'scanning' && <ScanProgress progress={scanProgress} imagePreview={preview} />}
              {scanStep === 'result'   && parsed && <OcrResultForm parsed={parsed} onConfirm={handleConfirm} onRescan={handleRescan} />}
            </div>
            <DepartureBoard />
          </div>

        </div>
      </div>
    </div>
  )
}
