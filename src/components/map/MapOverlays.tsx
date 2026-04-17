import type { KakaoPlace } from '../../services/kakaoLocalService'
import MapPlaceCard from './MapPlaceCard'

interface Props {
  searching: boolean
  clickedPlace: KakaoPlace | null
  notFound: boolean
  onClose: () => void
}

function SearchingSkeleton() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl px-5 pt-3 pb-8">
      <div className="flex justify-center mb-4">
        <div className="w-9 h-1 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-brand-surface shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-brand-surface rounded-lg w-3/5" />
          <div className="h-3 bg-brand-surface rounded-full w-2/5" />
        </div>
      </div>
      <div className="mt-4 h-12 bg-brand-surface rounded-2xl animate-pulse" />
    </div>
  )
}

function NotFoundBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-20">
      <div className="bg-white border border-brand-border rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-xl shadow-black/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center text-sm">📍</div>
          <p className="text-[13px] text-brand-body font-medium">근처에 등록된 장소가 없어요</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors ml-3 shrink-0"
        >
          <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#8A9E92" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function MapOverlays({ searching, clickedPlace, notFound, onClose }: Props) {
  if (searching) return <SearchingSkeleton />
  if (clickedPlace) return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <MapPlaceCard place={clickedPlace} onClose={onClose} />
    </div>
  )
  if (notFound) return <NotFoundBanner onClose={onClose} />
  return null
}
