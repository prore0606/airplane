import { useUserMode } from '../context/UserModeContext'
import type { Language } from '../types/foreigner'

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English',  native: 'English',  flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', native: '日本語',    flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese',  native: '中文',      flag: '🇨🇳' },
]

export default function LanguageSelectPage() {
  const { setLanguage } = useUserMode()

  return (
    <div
      className="flex flex-col h-full px-6 py-12"
      style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 60%, #1a3320 100%)' }}
    >
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.18), transparent 65%)' }} />

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-brand-green font-bold text-[13px] tracking-widest uppercase mb-3 relative z-10">
          Welcome · ようこそ · 欢迎
        </p>
        <h1 className="font-display font-black text-[32px] text-white leading-tight mb-2 relative z-10">
          Choose your<br />language
        </h1>
        <p className="text-white/40 text-[14px] mb-10 relative z-10">
          You can change this later in My page
        </p>

        <div className="space-y-3 relative z-10">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left active:scale-[0.98] transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-3xl shrink-0">{lang.flag}</span>
              <div className="flex-1">
                <p className="text-white font-black text-[16px]">{lang.native}</p>
                <p className="text-white/40 text-[12px]">{lang.label}</p>
              </div>
              <span className="text-white/20 text-xl">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
