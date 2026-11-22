import type { MouseEvent, ReactNode } from 'react'
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
import { sitePages, type SitePath } from './siteMap.ts'

// Each page in the site map gets its component here. The Record type makes
// TypeScript report an error if a page in siteMap.ts has no component.
const pageElements: Record<SitePath, ReactNode> = {
  '/': <HomePage />,
  '/journal': <JournalPage />,
  '/interactivity': <InteractivityPage />,
  '/media': <MediaPage />,
  '/design': <DesignHistoryPage />,
  '/about': <AboutPage />,
}

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
      <SiteHeader />
      <main id="main" className="site-main" tabIndex={-1}>
        <Routes>
          {sitePages.map((page) => (
            <Route key={page.path} path={page.path} element={pageElements[page.path]} />
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
