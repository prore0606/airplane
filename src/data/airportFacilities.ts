/**
 * 인천공항 시설 정적 데이터
 * 실시간 주차현황은 공식 API RSA 암호화로 직접 호출 불가 → 대표 구조만 제공
 * 쇼핑·식음료는 공식 사이트 기준 주요 매장 정리
 */

// ──────────────────────────────────────────────
// 주차장
// ──────────────────────────────────────────────
export interface ParkingLot {
  id: string
  name: string
  type: '단기' | '장기' | '화물'
  terminal: 'T1' | 'T2'
  location: string
  total: number
  /** 실제 연동 전 임시값 — 화면 시연용 */
  available: number
}

export const PARKING_LOTS: ParkingLot[] = [
  { id: 'P1', name: 'P1 단기주차장', type: '단기', terminal: 'T1', location: 'T1 동편', total: 1030, available: 312 },
  { id: 'P2', name: 'P2 단기주차장', type: '단기', terminal: 'T1', location: 'T1 서편', total: 1070, available: 64 },
  { id: 'P3', name: 'P3 장기주차장', type: '장기', terminal: 'T1', location: 'T1 동편 외곽', total: 2100, available: 890 },
  { id: 'P4', name: 'P4 장기주차장', type: '장기', terminal: 'T1', location: 'T1 서편 외곽', total: 3800, available: 1540 },
  { id: 'P5', name: 'P5 단기주차장', type: '단기', terminal: 'T2', location: 'T2 동편', total: 1400, available: 207 },
  { id: 'P6', name: 'P6 장기주차장', type: '장기', terminal: 'T2', location: 'T2 서편', total: 2600, available: 1120 },
]

/** 주차 여유 상태 */
export function parkingStatus(lot: ParkingLot): '여유' | '보통' | '혼잡' | '만차' {
  const ratio = lot.available / lot.total
  if (lot.available === 0) return '만차'
  if (ratio > 0.3) return '여유'
  if (ratio > 0.1) return '보통'
  return '혼잡'
}

// ──────────────────────────────────────────────
// 기존 시설 (면세점·일반쇼핑·식음료) — 하위 호환 유지
// ──────────────────────────────────────────────
export type FacilityType = 'dutyfree' | 'shopping' | 'food'
export type TerminalCode = 'T1' | 'T2' | 'ALL'

export interface Facility {
  id: string
  name: string
  type: FacilityType
  terminal: TerminalCode
  floor: string
  location: string
  hours: string
  category: string
  emoji: string
  badge?: '24H' | 'BEST' | 'NEW'
}

export const FACILITIES: Facility[] = [
  // ── 면세점 ──────────────────────────────────
  {
    id: 'df1', name: '신라면세점', type: 'dutyfree', terminal: 'T1',
    floor: '3F', location: '출국장 전구역', hours: '05:30 – 22:30',
    category: '향수·화장품·주류·패션·전자', emoji: '💎',
  },
  {
    id: 'df2', name: '신세계면세점', type: 'dutyfree', terminal: 'T1',
    floor: '3F', location: 'A·B·C 게이트', hours: '05:30 – 22:30',
    category: '럭셔리·패션·화장품·식품', emoji: '🛍️',
  },
  {
    id: 'df3', name: '현대면세점', type: 'dutyfree', terminal: 'T1',
    floor: '3F', location: 'D 게이트 인근', hours: '06:00 – 22:00',
    category: '화장품·패션·잡화', emoji: '🏷️',
  },
  {
    id: 'df4', name: '롯데면세점', type: 'dutyfree', terminal: 'T1',
    floor: '3F', location: '면세구역 중앙', hours: '05:30 – 22:30',
    category: '주류·담배·식품·잡화', emoji: '🥃',
  },
  {
    id: 'df5', name: '신라면세점', type: 'dutyfree', terminal: 'T2',
    floor: '3F', location: '출국장 전구역', hours: '05:30 – 22:30',
    category: '향수·화장품·주류·패션', emoji: '💎',
  },
  {
    id: 'df6', name: '신세계면세점', type: 'dutyfree', terminal: 'T2',
    floor: '3F', location: 'H·J 게이트', hours: '05:30 – 22:30',
    category: '럭셔리·패션·화장품·식품', emoji: '🛍️',
  },

  // ── 일반쇼핑 ────────────────────────────────
  {
    id: 'sh1', name: 'CU 편의점', type: 'shopping', terminal: 'T1',
    floor: '3F', location: 'T1 출국장 내 2곳', hours: '24시간', badge: '24H',
    category: '편의점·생필품', emoji: '🏪',
  },
  {
    id: 'sh2', name: '올리브영', type: 'shopping', terminal: 'T1',
    floor: '1F', location: '1층 체크인 홀', hours: '06:00 – 21:00',
    category: '뷰티·헬스·드럭스토어', emoji: '💄',
  },
  {
    id: 'sh3', name: '교보문고', type: 'shopping', terminal: 'T1',
    floor: '3F', location: 'G 게이트 인근', hours: '06:00 – 21:30',
    category: '도서·문구·잡화', emoji: '📚',
  },
  {
    id: 'sh4', name: '아모레퍼시픽', type: 'shopping', terminal: 'T1',
    floor: '3F', location: 'B 게이트 인근', hours: '06:30 – 21:00',
    category: 'K-뷰티·스킨케어', emoji: '🌿',
  },
  {
    id: 'sh5', name: 'GS25 편의점', type: 'shopping', terminal: 'T2',
    floor: '3F', location: 'T2 출국장 내', hours: '24시간', badge: '24H',
    category: '편의점·생필품', emoji: '🏪',
  },
  {
    id: 'sh6', name: '아리따움', type: 'shopping', terminal: 'T2',
    floor: '3F', location: 'H 게이트 인근', hours: '06:00 – 21:00',
    category: 'K-뷰티·화장품', emoji: '💅',
  },
  {
    id: 'sh7', name: '잠뱅이', type: 'shopping', terminal: 'T1',
    floor: '3F', location: 'C 게이트 인근', hours: '06:00 – 21:00',
    category: '의류·캐주얼', emoji: '👕',
  },

  // ── 식음료 ──────────────────────────────────
  {
    id: 'fd1', name: '스타벅스', type: 'food', terminal: 'T1',
    floor: '3F', location: 'B 게이트·D 게이트 (2곳)', hours: '05:00 – 22:30', badge: 'BEST',
    category: '카페·디저트', emoji: '☕',
  },
  {
    id: 'fd2', name: '비비고', type: 'food', terminal: 'T1',
    floor: '3F', location: 'A 게이트 인근', hours: '06:00 – 21:30',
    category: '한식', emoji: '🍚',
  },
  {
    id: 'fd3', name: '버거킹', type: 'food', terminal: 'T1',
    floor: '3F', location: 'G 게이트 인근', hours: '05:30 – 22:00', badge: 'BEST',
    category: '패스트푸드', emoji: '🍔',
  },
  {
    id: 'fd4', name: '본죽&비빔밥 cafe', type: 'food', terminal: 'T1',
    floor: '1F', location: '1층 체크인 홀', hours: '06:00 – 21:00',
    category: '한식·죽', emoji: '🥣',
  },
  {
    id: 'fd5', name: '롯데리아', type: 'food', terminal: 'T1',
    floor: '3F', location: 'C 게이트 인근', hours: '05:30 – 22:30',
    category: '패스트푸드', emoji: '🍟',
  },
  {
    id: 'fd6', name: '파리바게뜨', type: 'food', terminal: 'T1',
    floor: '1F', location: '1층 서편', hours: '06:00 – 21:00',
    category: '베이커리·카페', emoji: '🥐',
  },
  {
    id: 'fd7', name: '쉐이크쉑', type: 'food', terminal: 'T1',
    floor: '3F', location: 'F 게이트 인근', hours: '07:00 – 21:30',
    category: '수제버거·밀크쉐이크', emoji: '🍔',
  },
  {
    id: 'fd8', name: '스타벅스', type: 'food', terminal: 'T2',
    floor: '3F', location: 'H·J 게이트 (2곳)', hours: '05:00 – 22:30', badge: 'BEST',
    category: '카페·디저트', emoji: '☕',
  },
  {
    id: 'fd9', name: '한식당 두레', type: 'food', terminal: 'T2',
    floor: '3F', location: 'J 게이트 인근', hours: '06:00 – 21:00',
    category: '한식뷔페', emoji: '🍛',
  },
  {
    id: 'fd10', name: '맥도날드', type: 'food', terminal: 'T2',
    floor: '3F', location: 'H 게이트 인근', hours: '05:30 – 22:00',
    category: '패스트푸드', emoji: '🍟',
  },
  {
    id: 'fd11', name: '투썸플레이스', type: 'food', terminal: 'T2',
    floor: '1F', location: '1층 체크인 홀', hours: '06:00 – 21:00',
    category: '카페·케이크', emoji: '🍰',
  },
]

// ──────────────────────────────────────────────
// 지도 시설 (카카오맵 마커용 좌표 포함)
// ──────────────────────────────────────────────
export type FacilityCategory = 'food' | 'dutyfree' | 'lounge' | 'atm' | 'exchange' | 'pharmacy' | 'shopping'

export interface MapFacility {
  id: string
  name: string
  category: FacilityCategory
  terminal: 'T1' | 'T2'
  floor: string
  location: string
  hours: string
  emoji: string
  lat: number
  lng: number
  badge?: string
}

export const MAP_FACILITIES: MapFacility[] = [
  // ── T1 식당 ──────────────────────────────────
  {
    id: 'mf-t1-starbucks', name: 'T1 스타벅스', category: 'food', terminal: 'T1',
    floor: '3F', location: 'B 게이트 인근', hours: '05:00 – 22:30',
    emoji: '☕', lat: 37.44920, lng: 126.45010, badge: 'BEST',
  },
  {
    id: 'mf-t1-burgerking', name: 'T1 버거킹', category: 'food', terminal: 'T1',
    floor: '3F', location: 'G 게이트 인근', hours: '05:30 – 22:00',
    emoji: '🍔', lat: 37.44900, lng: 126.45050,
  },
  {
    id: 'mf-t1-bibigo', name: 'T1 비비고', category: 'food', terminal: 'T1',
    floor: '3F', location: 'A 게이트 인근', hours: '06:00 – 21:30',
    emoji: '🍚', lat: 37.44880, lng: 126.44980,
  },
  {
    id: 'mf-t1-lotteria', name: 'T1 롯데리아', category: 'food', terminal: 'T1',
    floor: '3F', location: 'C 게이트 인근', hours: '05:30 – 22:30',
    emoji: '🍟', lat: 37.44860, lng: 126.45020,
  },
  {
    id: 'mf-t1-shakeshack', name: 'T1 쉐이크쉑', category: 'food', terminal: 'T1',
    floor: '3F', location: 'F 게이트 인근', hours: '07:00 – 21:30',
    emoji: '🍔', lat: 37.44940, lng: 126.44960,
  },
  {
    id: 'mf-t1-paris', name: 'T1 파리바게뜨', category: 'food', terminal: 'T1',
    floor: '1F', location: '1층 서편', hours: '06:00 – 21:00',
    emoji: '🥐', lat: 37.44850, lng: 126.44940,
  },

  // ── T1 면세점 ────────────────────────────────
  {
    id: 'mf-t1-shilla-df', name: 'T1 신라면세점', category: 'dutyfree', terminal: 'T1',
    floor: '3F', location: '출국장 전구역', hours: '05:30 – 22:30',
    emoji: '💎', lat: 37.44930, lng: 126.45030,
  },
  {
    id: 'mf-t1-lotte-df', name: 'T1 롯데면세점', category: 'dutyfree', terminal: 'T1',
    floor: '3F', location: '면세구역 중앙', hours: '05:30 – 22:30',
    emoji: '🥃', lat: 37.44910, lng: 126.45060,
  },
  {
    id: 'mf-t1-shinsegae-df', name: 'T1 신세계면세점', category: 'dutyfree', terminal: 'T1',
    floor: '3F', location: 'A·B·C 게이트', hours: '05:30 – 22:30',
    emoji: '🛍️', lat: 37.44870, lng: 126.45000,
  },

  // ── T1 라운지 ────────────────────────────────
  {
    id: 'mf-t1-matina', name: 'T1 인천공항 제1라운지(마티나)', category: 'lounge', terminal: 'T1',
    floor: '4F', location: '탑승동 서편', hours: '05:00 – 22:00',
    emoji: '🛋️', lat: 37.44950, lng: 126.45070,
  },
  {
    id: 'mf-t1-kal-lounge', name: 'T1 대한항공 라운지', category: 'lounge', terminal: 'T1',
    floor: '4F', location: '출국장 4층', hours: '05:30 – 22:30',
    emoji: '🛋️', lat: 37.44960, lng: 126.44970,
  },
  {
    id: 'mf-t1-asiana-lounge', name: 'T1 아시아나 라운지', category: 'lounge', terminal: 'T1',
    floor: '4F', location: '출국장 4층 동편', hours: '05:30 – 22:00',
    emoji: '🛋️', lat: 37.44890, lng: 126.45080,
  },

  // ── T1 ATM ────────────────────────────────────
  {
    id: 'mf-t1-hana-atm', name: 'T1 KEB하나은행 ATM', category: 'atm', terminal: 'T1',
    floor: '1F', location: '1층 체크인 홀', hours: '24시간',
    emoji: '🏧', lat: 37.44870, lng: 126.45030, badge: '24H',
  },
  {
    id: 'mf-t1-shinhan-atm', name: 'T1 신한은행 ATM', category: 'atm', terminal: 'T1',
    floor: '3F', location: '출국장 3층', hours: '05:30 – 22:30',
    emoji: '🏧', lat: 37.44840, lng: 126.44990,
  },

  // ── T1 환전 ──────────────────────────────────
  {
    id: 'mf-t1-hana-ex', name: 'T1 KEB하나은행 환전소', category: 'exchange', terminal: 'T1',
    floor: '1F', location: '1층 체크인 홀', hours: '07:00 – 21:00',
    emoji: '💱', lat: 37.44860, lng: 126.45060,
  },
  {
    id: 'mf-t1-woori-ex', name: 'T1 우리은행 환전소', category: 'exchange', terminal: 'T1',
    floor: '2F', location: '2층 출국장', hours: '07:00 – 21:00',
    emoji: '💱', lat: 37.44900, lng: 126.44950,
  },

  // ── T1 약국 ──────────────────────────────────
  {
    id: 'mf-t1-onnuri-ph', name: 'T1 온누리약국', category: 'pharmacy', terminal: 'T1',
    floor: '1F', location: '1층 입국장', hours: '07:00 – 21:00',
    emoji: '💊', lat: 37.44830, lng: 126.45010,
  },
  {
    id: 'mf-t1-intl-ph', name: 'T1 국제약국', category: 'pharmacy', terminal: 'T1',
    floor: '3F', location: '출국장 3층', hours: '06:00 – 22:00',
    emoji: '💊', lat: 37.44920, lng: 126.45040,
  },

  // ── T2 식당 ──────────────────────────────────
  {
    id: 'mf-t2-starbucks', name: 'T2 스타벅스', category: 'food', terminal: 'T2',
    floor: '3F', location: 'H·J 게이트 인근', hours: '05:00 – 22:30',
    emoji: '☕', lat: 37.47000, lng: 126.44230, badge: 'BEST',
  },
  {
    id: 'mf-t2-mcd', name: 'T2 맥도날드', category: 'food', terminal: 'T2',
    floor: '3F', location: 'H 게이트 인근', hours: '05:30 – 22:00',
    emoji: '🍟', lat: 37.46980, lng: 126.44260,
  },
  {
    id: 'mf-t2-dure', name: 'T2 한식당 두레', category: 'food', terminal: 'T2',
    floor: '3F', location: 'J 게이트 인근', hours: '06:00 – 21:00',
    emoji: '🍛', lat: 37.46960, lng: 126.44200,
  },
  {
    id: 'mf-t2-twosome', name: 'T2 투썸플레이스', category: 'food', terminal: 'T2',
    floor: '1F', location: '1층 체크인 홀', hours: '06:00 – 21:00',
    emoji: '🍰', lat: 37.46940, lng: 126.44240,
  },

  // ── T2 면세점 ────────────────────────────────
  {
    id: 'mf-t2-shilla-df', name: 'T2 신라면세점', category: 'dutyfree', terminal: 'T2',
    floor: '3F', location: '출국장 전구역', hours: '05:30 – 22:30',
    emoji: '💎', lat: 37.46990, lng: 126.44280,
  },
  {
    id: 'mf-t2-shinsegae-df', name: 'T2 신세계면세점', category: 'dutyfree', terminal: 'T2',
    floor: '3F', location: 'H·J 게이트', hours: '05:30 – 22:30',
    emoji: '🛍️', lat: 37.46970, lng: 126.44210,
  },

  // ── T2 라운지 ────────────────────────────────
  {
    id: 'mf-t2-skyhub', name: 'T2 인천공항 제2라운지(스카이허브)', category: 'lounge', terminal: 'T2',
    floor: '4F', location: '탑승동 중앙', hours: '05:00 – 22:00',
    emoji: '🛋️', lat: 37.47010, lng: 126.44300,
  },
  {
    id: 'mf-t2-kal-lounge', name: 'T2 대한항공 라운지', category: 'lounge', terminal: 'T2',
    floor: '4F', location: '출국장 4층', hours: '05:30 – 22:30',
    emoji: '🛋️', lat: 37.46950, lng: 126.44190,
  },

  // ── T2 ATM ────────────────────────────────────
  {
    id: 'mf-t2-hana-atm', name: 'T2 KEB하나은행 ATM', category: 'atm', terminal: 'T2',
    floor: '1F', location: '1층 체크인 홀', hours: '24시간',
    emoji: '🏧', lat: 37.46930, lng: 126.44250, badge: '24H',
  },

  // ── T2 환전 ──────────────────────────────────
  {
    id: 'mf-t2-hana-ex', name: 'T2 KEB하나은행 환전소', category: 'exchange', terminal: 'T2',
    floor: '1F', location: '1층 체크인 홀', hours: '07:00 – 21:00',
    emoji: '💱', lat: 37.46920, lng: 126.44220,
  },

  // ── T2 약국 ──────────────────────────────────
  {
    id: 'mf-t2-onnuri-ph', name: 'T2 온누리약국', category: 'pharmacy', terminal: 'T2',
    floor: '1F', location: '1층 입국장', hours: '07:00 – 21:00',
    emoji: '💊', lat: 37.46910, lng: 126.44260,
  },
]
