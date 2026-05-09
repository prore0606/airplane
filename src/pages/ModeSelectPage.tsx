import { useUserMode } from '../context/UserModeContext'

function ModeCard({
  emoji, title, subtitle, desc, onClick, featured,
}: {
  emoji: string; title: string; subtitle: string; desc: string
  onClick: () => void; featured?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
      style={{
        background: featured ? 'rgba(29,185,84,0.15)' : 'rgba(255,255,255,0.06)',
        border: featured ? '1.5px solid rgba(29,185,84,0.45)' : '1.5px solid rgba(255,255,255,0.1)',
      }}
    >
      <span className="text-4xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-black text-white text-[17px] leading-snug">{title}</p>
        <p className="text-[12px] font-semibold mt-0.5"
          style={{ color: featured ? '#4ade80' : 'rgba(255,255,255,0.45)' }}>
          {subtitle}
        </p>
        <p className="text-white/35 text-[11px] mt-1 leading-relaxed">{desc}</p>
      </div>
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="shrink-0">
        <path d="M1 1l4 4-4 4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

export default function ModeSelectPage() {
  const { selectMode } = useUserMode()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 60%, #1a3320 100%)' }}
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.1), transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xl shadow-brand-green/40">
            ✈️
          </div>
          <p className="font-display font-black text-2xl text-white">Airport Mate</p>
          <p className="text-white/40 text-[13px] mt-1">Choose your language / 언어를 선택하세요</p>
        </div>

        <div className="flex flex-col gap-3">
          <ModeCard
            emoji="🇰🇷" title="한국어" subtitle="내국인" featured
            desc="AI 출국 여정 · 실시간 항공 · 체크리스트"
            onClick={() => selectMode('korean')}
          />
          <ModeCard
            emoji="🌍" title="English" subtitle="For Foreigners"
            desc="Station-to-station guide · Photo by photo"
            onClick={() => selectMode('foreigner')}
          />
        </div>

        <p className="text-center text-[11px] text-white/25">
          You can change this anytime in My tab
        </p>
      </div>
    </div>
  )
}
