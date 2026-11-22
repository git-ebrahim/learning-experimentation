import type { MouseEvent } from 'react'
import { Route, Routes } from 'react-router'
import { ScrollToTop, SiteFooter, SiteHeader } from './components/layout.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { DesignHistoryPage } from './pages/DesignHistoryPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { InteractivityPage } from './pages/InteractivityPage.tsx'
import { JournalEntryPage } from './pages/JournalEntryPage.tsx'
import { JournalPage } from './pages/JournalPage.tsx'
import { MediaPage } from './pages/MediaPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

// One list drives both the navigation and the routes.
// To add a page: create it in src/pages/, then add one entry here.
const pages = [
  { path: '/', label: 'Home', element: <HomePage /> },
  { path: '/journal', label: 'Journal', element: <JournalPage /> },
  { path: '/interactivity', label: 'Interactivity', element: <InteractivityPage /> },
  { path: '/media', label: 'Media', element: <MediaPage /> },
  { path: '/design', label: 'Design', element: <DesignHistoryPage /> },
  { path: '/about', label: 'About', element: <AboutPage /> },
]

// With HashRouter, "#main" would be read as a page path, so move focus to
// <main> directly instead of following the link.
function skipToMain(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  document.getElementById('main')?.focus()
}

function App() {
  return (
    <>
      <a href="#main" className="skip-link" onClick={skipToMain}>
        Skip to content
      </a>
      <ScrollToTop />
      <SiteHeader items={pages} />
      <main id="main" className="site-main" tabIndex={-1}>
        <Routes>
          {pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
          {/* ":slug" is a URL parameter: /journal/media-and-uploads gives slug "media-and-uploads". */}
          <Route path="/journal/:slug" element={<JournalEntryPage />} />
          {/* "*" matches any path not listed above. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  )
}

export default App
