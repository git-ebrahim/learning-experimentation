import { NavLink, Route, Routes } from 'react-router'
import { AboutPage } from './pages/AboutPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { JournalEntryPage } from './pages/JournalEntryPage.tsx'
import { JournalPage } from './pages/JournalPage.tsx'
import { InteractivityPage } from './pages/InteractivityPage.tsx'
import { MediaPage } from './pages/MediaPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

// One list drives both the navigation buttons and the routes.
// To add a page: create it in src/pages/, then add one entry here.
const pages = [
  { path: '/', label: 'Home', element: <HomePage /> },
  { path: '/journal', label: 'Journal', element: <JournalPage /> },
  { path: '/interactivity', label: 'Interactivity', element: <InteractivityPage /> },
  { path: '/media', label: 'Media', element: <MediaPage /> },
  { path: '/about', label: 'About', element: <AboutPage /> },
]

function App() {
  return (
    <div className="layout">
      <header className="site-header">
        <span className="site-title">Learning Experimentation</span>
        <nav aria-label="Main">
          <ul className="nav-list">
            {pages.map((page) => (
              <li key={page.path}>
                {/* NavLink adds the "active" class when its page is showing. */}
                <NavLink to={page.path} end={page.path === '/'} className="nav-button">
                  {page.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="content">
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
    </div>
  )
}

export default App
