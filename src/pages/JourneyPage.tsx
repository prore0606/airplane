import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_CHARACTER, STAGE_LABEL, STAGE_ORDER, type JourneyStage } from '../context/JourneyContext'
import { useFlights } from '../hooks/useFlights'
import { parseDatetime } from '../services/flightApi'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import { congestionColor } from '../services/congestionApi'

/* 단계별 할 일 카드 */
const STAGE_ACTIONS: Record<JourneyStage, { icon: string; text: string; sub?: string }[]> = {
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

/* 단계별 다음 버튼 텍스트 */
const NEXT_LABEL: Partial<Record<JourneyStage, string>> = {
  no_ticket:  '',
  preparing:  '공항으로 출발하기 →',
  traveling:  '공항 도착 · 체크인 시작 →',
  checkin:    '체크인 완료 →',
  external:   '',   // 플로팅 버튼으로 처리
  airside:    '탑승 준비 완료 →',
  boarding:   '탑승 완료 →',
  returned:   '',
}

/* 챕터 진행 바 */
function ChapterBar({ stage }: { stage: JourneyStage }) {
  const idx = STAGE_ORDER.indexOf(stage)
  const total = STAGE_ORDER.length - 1
  const pct = Math.round((idx / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-brand-muted font-medium">
        <span>여정 진행률</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-green rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-brand-muted/60">
        <span>티켓 등록</span>
        <span>탑승 완료</span>
      </div>
    </div>
  )
}

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered } = useJourney()
  const { data: flights } = useFlights()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()
  const next = flights[0]
  const sched = next ? parseDatetime(next.scheduleDatetime) : null

  const charImg = STAGE_CHARACTER[stage]
  const actions = STAGE_ACTIONS[stage]
  const nextLabel = NEXT_LABEL[stage]

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

          {/* 챕터 진행 바 */}
          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}

          {/* 캐릭터 + 단계 정보 */}
          <div className="bg-white border border-brand-border rounded-hero p-6 flex items-center gap-6">
            <div className="w-36 h-36 shrink-0 flex items-center justify-center">
              {charImg ? (
                <img src={charImg} alt={STAGE_LABEL[stage]} className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-brand-pale border-2 border-dashed border-brand-mid flex items-center justify-center text-4xl">
                  ✈️
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] font-bold tracking-widest text-brand-green bg-brand-pale px-2.5 py-0.5 rounded-pill mb-2 uppercase">
                {stage === 'no_ticket' ? 'START' : `STEP ${STAGE_ORDER.indexOf(stage)}`}
              </span>
              <p className="text-xl font-bold text-brand-black mb-1">{STAGE_LABEL[stage]}</p>
              {next && sched && stage !== 'no_ticket' && (
                <p className="text-sm text-brand-muted">
                  {next.flightId} · {next.airportCode} · {sched.time} 출발
                </p>
              )}
              {stage === 'no_ticket' && (
                <p className="text-sm text-brand-muted leading-relaxed">
                  항공권을 스캔하면<br />여행이 시작됩니다
                </p>
              )}
            </div>
          </div>

          {/* 티켓 미등록 — 스캔 영역 */}
          {stage === 'no_ticket' && (
            <div className="space-y-3">
              <button
                onClick={handleScan}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-base"
              >
                📸 항공권 스캔으로 시작하기
              </button>
              <button className="w-full bg-white border border-brand-border text-brand-ink font-semibold py-3.5 rounded-xl hover:border-brand-green transition-colors">
                ✏️ 직접 항공편 입력
              </button>
            </div>
          )}

          {/* 현재 단계 할 일 */}
          {stage !== 'no_ticket' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">지금 할 일</p>
              {actions.map((a, i) => (
                <div key={i}
                  className="bg-white border border-brand-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-brand-green transition-colors cursor-pointer">
                  <span className="text-2xl shrink-0">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{a.text}</p>
                    {a.sub && <p className="text-xs text-brand-muted mt-0.5">{a.sub}</p>}
                  </div>
                  <span className="ml-auto text-brand-muted text-sm">›</span>
                </div>
              ))}
            </div>
          )}

          {/* 이동 중 — 셔틀버스 정보 */}
          {stage === 'traveling' && shuttles.length > 0 && (
            <div>
              <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">셔틀버스 정보</p>
              <div className="space-y-2">
                {shuttles.map((s) => (
                  <div key={s.route_id} className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🚌</span>
                      <div>
                        <p className="font-semibold text-brand-black text-sm">{s.route_name}</p>
                        <p className="text-xs text-brand-muted">배차 {s.interval}분 간격</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-black text-sm">{s.depart_time}</p>
                      <span className="text-[10px] text-brand-green font-bold">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 체크인 단계 — 보안검색 혼잡도 */}
          {stage === 'checkin' && congestion.length > 0 && (
            <div>
              <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">보안검색 라인 현황</p>
              <div className="grid grid-cols-5 gap-2">
                {congestion.map((c) => (
                  <div key={c.line_number} className="bg-white border border-brand-border rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-brand-black mb-1">{c.line_number.replace('번 라인', '')}번</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-pill block ${congestionColor(c.congestion)}`}>
                      {c.congestion}
                    </span>
                    <p className="text-[10px] text-brand-muted mt-1">{c.wait_time}분</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 외부 대기 시 안내 문구 */}
          {stage === 'external' && (
            <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-5 py-4 flex items-start gap-3">
              <span className="text-xl shrink-0">⏰</span>
              <div>
                <p className="font-semibold text-brand-black text-sm">탑승 시간 전에 게이트로 입장하세요</p>
                <p className="text-xs text-brand-muted mt-0.5">화면 하단 버튼으로 언제든 게이트 입장 가능합니다</p>
              </div>
            </div>
          )}

          {/* 다음 단계 버튼 */}
          {nextLabel && (
            <button
              onClick={handleNext}
              className="w-full bg-brand-black text-white font-bold py-4 rounded-xl hover:bg-brand-ink transition-colors"
            >
              {nextLabel}
            </button>
          )}

          {/* 귀국 완료 */}
          {stage === 'returned' && (
            <div className="bg-brand-pale border border-brand-green/30 rounded-hero px-6 py-5 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-brand-black">여행 완료!</p>
              <p className="text-sm text-brand-muted mt-1">수고하셨습니다. 배지가 지급되었습니다.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
