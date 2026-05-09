import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserMode, Language } from '../types/foreigner'

interface UserModeCtx {
  mode: UserMode | null
  language: Language
  langChosen: boolean
  selectMode: (m: UserMode) => void
  setLanguage: (l: Language) => void
  resetMode: () => void
}

const UserModeContext = createContext<UserModeCtx>({
  mode: null,
  language: 'en',
  langChosen: false,
  selectMode: () => {},
  setLanguage: () => {},
  resetMode: () => {},
})

const LANG_KEY = 'app_language'

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode]           = useState<UserMode | null>(null)
  const [langChosen, setLangChosen] = useState<boolean>(false)

  const [language, setLangState] = useState<Language>(() => {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'ja' || v === 'zh' ? v : 'en'
  })

  function selectMode(m: UserMode) {
    setMode(m)
  }

  function setLanguage(l: Language) {
    localStorage.setItem(LANG_KEY, l)
    setLangState(l)
    setLangChosen(true)
  }

  function resetMode() {
    setMode(null)
    setLangChosen(false)
  }

  return (
    <UserModeContext.Provider value={{ mode, language, langChosen, selectMode, setLanguage, resetMode }}>
      {children}
    </UserModeContext.Provider>
  )
}

export function useUserMode() {
  return useContext(UserModeContext)
}
