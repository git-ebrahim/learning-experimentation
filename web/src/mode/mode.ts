import { createContext, useContext } from 'react'

// The site has two looks:
//   builder:  the default. A dark terminal-style "builder's log" for engineers.
//   friendly: a playful, hand-made notebook for everyone else.
// The choice is stored as data-mode on <html>, so CSS can restyle everything,
// and remembered in localStorage for this browser only.
export type Mode = 'builder' | 'friendly'

const storageKey = 'learning-experimentation:mode'

export function readSavedMode(): Mode {
  try {
    return localStorage.getItem(storageKey) === 'friendly' ? 'friendly' : 'builder'
  } catch {
    // Storage can be blocked (private windows, strict settings). Use the default.
    return 'builder'
  }
}

export function applyMode(mode: Mode) {
  document.documentElement.dataset.mode = mode
  try {
    localStorage.setItem(storageKey, mode)
  } catch {
    // Not being able to remember the choice is fine.
  }
}

export const ModeContext = createContext<{ mode: Mode; setMode: (mode: Mode) => void }>({
  mode: 'builder',
  setMode: () => {},
})

export function useMode() {
  return useContext(ModeContext)
}
