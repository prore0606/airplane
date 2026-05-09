import { useUserMode } from '../context/UserModeContext'
import type { UserMode } from '../types/foreigner'

function ModeCard({
  emoji, title, subtitle, desc, onClick, dark,
}: {
  emoji: string; title: string; subtitle: string; desc: string
  onClick: () => void; dark?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
      style={{
        background: dark ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
        border: dark ? '1.5px solid rgba(34,197,94,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
      }}
    >
      <span className="text-4xl shrink-0">{emoji}</span>
      <div>
        <p className="font-black text-white text-[17px] leading-snug">{title}</p>
        <p className="text-brand-bright text-[12px] font-bold mt-0.5">{subtitle}</p>
        <p className="text-white/45 text-[12px] mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  )
}

export default function ModeSelectPage() {
  const { selectMode } = useUserMode()

  function handle(m: UserMode) { selectMode(m) }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 60%, #1a3320 100%)' }}
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,.2), transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xl">
            ✈️
          </div>
          <p className="font-display font-black text-2xl text-white">Airport Mate</p>
          <p className="text-white/40 text-sm mt-1">Choose your language / 언어를 선택하세요</p>
        </div>

        <div className="flex flex-col gap-3">
          <ModeCard
            emoji="🇰🇷" title="한국어" subtitle="내국인" dark
            desc="AI 출국 여정 · 실시간 항공 · 체크리스트"
            onClick={() => handle('korean')}
          />
          <ModeCard
            emoji="🌍" title="English" subtitle="Foreigner / 외국인"
            desc="Station-to-station photo guide · Find your way"
            onClick={() => handle('foreigner')}
          />
        </div>

        <p className="text-center text-[11px] text-white/25">
          You can change this anytime in My tab
        </p>
      </div>
    </div>
  )
}
