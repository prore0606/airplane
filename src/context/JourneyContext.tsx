import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

/**
 * 여정 단계
 * no_ticket   → 티켓 미등록
 * preparing   → 티켓 등록 완료, 출국 전 준비 (체크리스트)
 * traveling   → 공항으로 이동 중
 * checkin     → 체크인 & 보안검색
 * external    → 체크인 완료, 게이트 외부 (식당/쇼핑)
 * airside     → 게이트 입장 (면세구역)
 * boarding    → 탑승 직전 (D-15~)
 * returned    → 귀국 완료
 */
export type JourneyStage =
  | 'no_ticket'
  | 'preparing'
  | 'traveling'
  | 'checkin'
  | 'external'
  | 'airside'
  | 'boarding'
  | 'returned'

export type TransportMode = 'car' | 'transit'

const STORAGE_KEY_STAGE     = 'airmate_stage'
const STORAGE_KEY_FLIGHT    = 'airmate_flight_registered'
const STORAGE_KEY_TRANSPORT = 'airmate_transport_mode'

function loadStage(): JourneyStage {
  const saved = localStorage.getItem(STORAGE_KEY_STAGE)
  if (saved && [
    'no_ticket', 'preparing', 'traveling', 'checkin',
    'external', 'airside', 'boarding', 'returned',
  ].includes(saved)) return saved as JourneyStage
  return 'no_ticket'
}

function loadFlightRegistered(): boolean {
  return localStorage.getItem(STORAGE_KEY_FLIGHT) === 'true'
}

function loadTransportMode(): TransportMode | null {
  const v = localStorage.getItem(STORAGE_KEY_TRANSPORT)
  return v === 'car' || v === 'transit' ? v : null
}

export interface JourneyState {
  stage: JourneyStage
  setStage: (s: JourneyStage) => void
  flightRegistered: boolean
  setFlightRegistered: (v: boolean) => void
  transportMode: TransportMode | null
  setTransportMode: (m: TransportMode) => void
}

const JourneyContext = createContext<JourneyState | null>(null)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [stage, setStageState] = useState<JourneyStage>(loadStage)
  const [flightRegistered, setFlightRegisteredState] = useState<boolean>(loadFlightRegistered)
  const [transportMode, setTransportModeState] = useState<TransportMode | null>(loadTransportMode)

  function setStage(s: JourneyStage) {
    setStageState(s)
    localStorage.setItem(STORAGE_KEY_STAGE, s)
  }

  function setFlightRegistered(v: boolean) {
    setFlightRegisteredState(v)
    localStorage.setItem(STORAGE_KEY_FLIGHT, String(v))
  }

  function setTransportMode(m: TransportMode) {
    setTransportModeState(m)
    localStorage.setItem(STORAGE_KEY_TRANSPORT, m)
  }

  useEffect(() => {
    setStageState(loadStage())
    setFlightRegisteredState(loadFlightRegistered())
    setTransportModeState(loadTransportMode())
  }, [])

  return (
    <JourneyContext.Provider value={{
      stage, setStage,
      flightRegistered, setFlightRegistered,
      transportMode, setTransportMode,
    }}>
      {children}
    </JourneyContext.Provider>
  )
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider')
  return ctx
}

/** 단계별 캐릭터 이미지 */
export const STAGE_CHARACTER: Record<JourneyStage, string> = {
  no_ticket:  '',
  preparing:  '/img/여행준비중.png',
  traveling:  '/img/이동중.png',
  checkin:    '/img/긴장모드.png',
  external:   '/img/밥먹는중.png',
  airside:    '/img/쇼핑중.png',
  boarding:   '/img/긴장모드.png',
  returned:   '/img/여행성공.png',
}

/** 단계별 챕터 이름 */
export const STAGE_LABEL: Record<JourneyStage, string> = {
  no_ticket:  '여행 시작',
  preparing:  '출국 준비',
  traveling:  '공항 이동 중',
  checkin:    '체크인 & 보안검색',
  external:   '게이트 외부',
  airside:    '면세구역',
  boarding:   '탑승 직전',
  returned:   '여행 완료',
}

/** 챕터 순서 */
export const STAGE_ORDER: JourneyStage[] = [
  'no_ticket', 'preparing', 'traveling', 'checkin',
  'external', 'airside', 'boarding', 'returned',
]
