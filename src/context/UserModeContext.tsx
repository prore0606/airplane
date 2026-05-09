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

const MODE_KEY        = 'app_user_mode'
const LANG_KEY        = 'app_language'
const LANG_CHOSEN_KEY = 'app_lang_chosen'

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode | null>(() => {
    const v = localStorage.getItem(MODE_KEY)
    return v === 'korean' || v === 'foreigner' ? v : null
  })

  const [language, setLangState] = useState<Language>(() => {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'ja' || v === 'zh' ? v : 'en'
  })

  const [langChosen, setLangChosen] = useState<boolean>(() => {
    return localStorage.getItem(LANG_CHOSEN_KEY) === '1'
  })

  function selectMode(m: UserMode) {
    localStorage.setItem(MODE_KEY, m)
    setMode(m)
  }

  function setLanguage(l: Language) {
    localStorage.setItem(LANG_KEY, l)
    localStorage.setItem(LANG_CHOSEN_KEY, '1')
    setLangState(l)
    setLangChosen(true)
  }

  function resetMode() {
    localStorage.removeItem(MODE_KEY)
    localStorage.removeItem(LANG_CHOSEN_KEY)
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
