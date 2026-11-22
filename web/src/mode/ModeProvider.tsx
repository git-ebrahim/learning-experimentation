import { useState, type ReactNode } from 'react'
import { ModeContext, applyMode, readSavedMode, type Mode } from './mode.ts'

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(readSavedMode)

  function setMode(next: Mode) {
    applyMode(next)
    setModeState(next)
  }

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}
