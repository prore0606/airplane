import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserMode, Language } from '../types/foreigner'

interface UserModeCtx {
  mode: UserMode | null
  language: Language
  selectMode: (m: UserMode) => void
  setLanguage: (l: Language) => void
  resetMode: () => void
}

const UserModeContext = createContext<UserModeCtx>({
  mode: null,
  language: 'en',
  selectMode: () => {},
  setLanguage: () => {},
  resetMode: () => {},
})

const MODE_KEY = 'app_user_mode'
const LANG_KEY = 'app_language'

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode | null>(() => {
    const v = localStorage.getItem(MODE_KEY)
    return v === 'korean' || v === 'foreigner' ? v : null
  })

  const [language, setLangState] = useState<Language>(() => {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'ja' || v === 'zh' ? v : 'en'
  })

  function selectMode(m: UserMode) {
    localStorage.setItem(MODE_KEY, m)
    setMode(m)
  }

  function setLanguage(l: Language) {
    localStorage.setItem(LANG_KEY, l)
    setLangState(l)
  }

  function resetMode() {
    localStorage.removeItem(MODE_KEY)
    setMode(null)
  }

  return (
    <UserModeContext.Provider value={{ mode, language, selectMode, setLanguage, resetMode }}>
      {children}
    </UserModeContext.Provider>
  )
}

export function useUserMode() {
  return useContext(UserModeContext)
}
