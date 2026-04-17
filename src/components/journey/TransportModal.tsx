import { useState } from 'react'

interface Props {
  onSelectTransit: () => void
  onValetReserve:  () => void
  onSelfPark:      () => void
}

const CARD = 'flex flex-col items-center justify-center gap-3 bg-brand-surface border-2 border-brand-border rounded-2xl py-8 hover:border-brand-green hover:bg-brand-pale transition-all'

export default function TransportModal({ onSelectTransit, onValetReserve, onSelfPark }: Props) {
  const [step, setStep] = useState<'mode' | 'valet'>('mode')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl px-6 pt-6 pb-10">
        <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mb-6" />

        {step === 'mode' && (
          <>
            <p className="font-black text-lg text-brand-black text-center mb-1">공항까지 어떻게 가시나요?</p>
            <p className="text-xs text-brand-muted text-center mb-6">이동 방법에 맞게 안내해 드릴게요</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStep('valet')} className={CARD}>
                <span className="text-4xl">🚗</span>
                <div className="text-center">
                  <p className="font-bold text-brand-black text-sm">자가용</p>
                  <p className="text-[11px] text-brand-muted mt-0.5">주차 현황 안내</p>
                </div>
              </button>
              <button onClick={onSelectTransit} className={CARD}>
                <span className="text-4xl">🚇</span>
                <div className="text-center">
                  <p className="font-bold text-brand-black text-sm">대중교통</p>
                  <p className="text-[11px] text-brand-muted mt-0.5">셔틀·리무진 안내</p>
                </div>
              </button>
            </div>
          </>
        )}

        {step === 'valet' && (
          <>
            <button onClick={() => setStep('mode')} className="flex items-center gap-1 text-xs text-brand-muted mb-4 hover:text-brand-black transition-colors">
              ← 이전
            </button>
            <p className="font-black text-lg text-brand-black text-center mb-1">발렛 주차를 이용하시겠어요?</p>
            <p className="text-xs text-brand-muted text-center mb-6">
              인천공항 공식 주차대행 서비스 (맥서브)<br />
              <span className="text-brand-orange font-medium">현장 접수 불가 · 사전 예약 필수</span>
            </p>
            <div className="space-y-3">
              <button onClick={onValetReserve} className="w-full flex items-center justify-center gap-3 bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors">
                <span className="text-xl">🅿️</span>
                발렛 예약하고 출발하기
                <span className="text-xs opacity-70 ml-1">↗</span>
              </button>
              <button onClick={onSelfPark} className="w-full flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-ink font-semibold py-3.5 rounded-xl hover:border-brand-green transition-colors">
                직접 주차할게요
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
