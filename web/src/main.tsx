import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
// Fonts are installed from npm and bundled with the site, so no request goes
// to a font service and the Content Security Policy can stay at 'self'.
// Browsers only download a font file when the current mode uses it.
import '@fontsource-variable/caveat'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/nunito'
import './index.css'
import App from './App.tsx'
import { ModeProvider } from './mode/ModeProvider.tsx'
import { applyMode, readSavedMode } from './mode/mode.ts'

// Set the mode before the first render so the page never flashes the wrong look.
applyMode(readSavedMode())

// HashRouter keeps the page path after a "#" (for example /#/about).
// GitHub Pages only serves real files, so a normal URL like /about would 404
// on refresh. With a hash, the server always serves index.html and React
// Router reads the part after "#" to choose the page.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ModeProvider>
  </StrictMode>,
)
