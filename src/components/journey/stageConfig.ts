import type { JourneyStage } from '../../context/JourneyContext'

export interface StageAction {
  icon: string
  text: string
  sub?: string
}

export const STAGE_ACTIONS: Record<JourneyStage, StageAction[]> = {
  no_ticket: [
    { icon: '📸', text: '항공권 스캔하기', sub: 'OCR로 자동 인식' },
    { icon: '✏️', text: '직접 항공편 입력', sub: '편명·게이트·터미널' },
  ],
  preparing: [
    { icon: '📋', text: 'AI 체크리스트 확인', sub: '준비물 빠짐없이 챙기기' },
    { icon: '📄', text: '여권·서류 확인', sub: '만료일 · 비자 체크' },
    { icon: '⏰', text: 'AI 출발 타이밍 확인', sub: '교통·통행료 분석' },
  ],
  traveling: [
    { icon: '🚗', text: '공항으로 출발 중', sub: '예상 도착 시간 확인' },
    { icon: '🅿️', text: '주차 위치 저장 준비', sub: '공항 도착 시 GPS 저장' },
  ],
  checkin: [
    { icon: '🧳', text: '체크인 카운터 찾기', sub: '수하물 위탁' },
    { icon: '🔒', text: '보안검색 빠른 라인', sub: '현재 대기 3번 라인 · 5분' },
    { icon: '🛂', text: '출국심사 대기', sub: '예상 7분' },
  ],
  external: [
    { icon: '🍽️', text: '외부 식당 탐색', sub: '터미널 1층 푸드코트' },
    { icon: '☕', text: '카페 · 휴게 공간', sub: '탑승까지 여유 있을 때' },
    { icon: '🚌', text: '셔틀버스 탑승구', sub: 'T1 ↔ T2 이동 필요 시' },
  ],
  airside: [
    { icon: '🛍️', text: '면세점 탐색', sub: 'DUTY FREE · 롯데 · 신라' },
    { icon: '🛋️', text: '라운지 안내', sub: '카드사 제휴 라운지 확인' },
    { icon: '📍', text: '게이트 위치 확인', sub: '탑승구까지 이동 경로' },
  ],
  boarding: [
    { icon: '🚨', text: '지금 게이트로 이동하세요', sub: '탑승 시작' },
    { icon: '🎫', text: '탑승권 · 여권 준비', sub: '스캔 대기 중' },
  ],
  returned: [
    { icon: '📍', text: '저장된 차 위치 안내', sub: 'A구역 3층 · GPS 복원' },
    { icon: '💰', text: '주차비 정산', sub: '예상 요금 확인' },
    { icon: '🛣️', text: '귀가 경로 추천', sub: '현재 도로 상황 반영' },
  ],
}

export const NEXT_LABEL: Partial<Record<JourneyStage, string>> = {
  no_ticket:  '',
  preparing:  '공항으로 출발하기 →',
  traveling:  '공항 도착 · 체크인 시작 →',
  checkin:    '체크인 완료 →',
  external:   '',
  airside:    '탑승 준비 완료 →',
  boarding:   '탑승 완료 →',
  returned:   '',
}
