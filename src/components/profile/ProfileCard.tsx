import { useAuth } from '../../context/AuthContext'

export default function ProfileCard() {
  const { user } = useAuth()
  const name   = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '여행자'
  const avatar = user?.user_metadata?.avatar_url as string | undefined
  const email  = user?.email ?? ''

  return (
    <div className="rounded-hero p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
      <div className="absolute -bottom-1/3 -right-4 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />

      {avatar
        ? <img src={avatar} alt={name} className="w-12 h-12 rounded-2xl object-cover mb-4 border-2 border-brand-green/30" />
        : <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-[#00c48c] flex items-center justify-center text-2xl mb-4">🧑‍💼</div>
      }

      <p className="text-lg font-bold text-white leading-tight">{name}</p>
      <p className="text-[11px] text-white/45 mt-0.5 truncate">{email}</p>

      <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.08]">
        {([['0', '총 여행'], ['Lv.1', '레벨'], ['0', '배지']] as const).map(([v, l]) => (
          <div key={l}>
            <p className="font-display font-black text-xl text-brand-green">{v}</p>
            <p className="text-[10px] text-white/35 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
