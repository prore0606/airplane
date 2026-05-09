import { useUserMode } from '../../../context/UserModeContext'
import type { Language } from '../../../types/foreigner'

const OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English',  flag: '🇺🇸' },
  { value: 'ja', label: '日本語',   flag: '🇯🇵' },
  { value: 'zh', label: '中文',     flag: '🇨🇳' },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useUserMode()

  return (
    <div className="bg-white rounded-2xl p-4 border border-brand-border">
      <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-3">
        Guide Language
      </p>
      <div className="flex gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
              language === opt.value
                ? 'bg-brand-green text-white'
                : 'bg-brand-surface text-brand-muted hover:bg-brand-pale'
            }`}
          >
            <span className="text-xl">{opt.flag}</span>
            <span className="text-[11px] font-bold">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
