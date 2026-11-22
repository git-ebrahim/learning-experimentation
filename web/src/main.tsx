import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
// Fonts are installed from npm and bundled with the site, so no request goes
// to Google Fonts and the Content Security Policy can stay at 'self'.
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/newsreader/opsz.css'
import './index.css'
import App from './App.tsx'

// HashRouter keeps the page path after a "#" (for example /#/about).
// GitHub Pages only serves real files, so a normal URL like /about would 404
// on refresh. With a hash, the server always serves index.html and React
// Router reads the part after "#" to choose the page.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
