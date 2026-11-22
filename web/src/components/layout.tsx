import { useEffect, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { findEntry, journalEntries } from '../journal/entries.ts'
import { useMode, type Mode } from '../mode/mode.ts'
import { githubHandle, profileUrl, repositoryUrl } from '../site.ts'
import { sitePages } from '../siteMap.ts'
import { GitHubIcon, SmileIcon, TerminalIcon } from './icons.tsx'
import { useDocumentTitle } from './useDocumentTitle.ts'

const modeOptions: { value: Mode; label: string; icon: ReactNode }[] = [
  { value: 'builder', label: 'Builder', icon: <TerminalIcon /> },
  { value: 'friendly', label: 'Friendly', icon: <SmileIcon /> },
]

// Two buttons that act as a switch between the site's two looks.
// aria-pressed tells screen readers which one is on.
function ModeToggle() {
  const { mode, setMode } = useMode()
  return (
    <div className="mode-toggle" role="group" aria-label="Site style">
      {modeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className="mode-option"
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}

function Brand() {
  const { mode } = useMode()
  return (
    <Link to="/" className="brand" aria-label={`${githubHandle}'s learning lab, home`}>
      {mode === 'builder' ? (
        <>
          <span className="brand-prompt" aria-hidden="true">
            ~/
          </span>
          {githubHandle}
          <span className="brand-path">/lab</span>
          <span className="cursor" aria-hidden="true" />
        </>
      ) : (
        <>
          <span className="brand-mark" aria-hidden="true">
            ✎
          </span>
          {githubHandle}
          <span className="brand-suffix">&apos;s notebook</span>
        </>
      )}
    </Link>
  )
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="header-top">
          <Brand />
          <div className="header-actions">
            <ModeToggle />
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
              aria-label={`${githubHandle} on GitHub`}
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
        <nav aria-label="Main" className="site-nav">
          <ul className="nav-list">
            {sitePages.map((item) => (
              <li key={item.path}>
                {/* NavLink adds the "active" class when its page is showing. */}
                <NavLink to={item.path} end={item.path === '/'} className="nav-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p>
          A development journal by{' '}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            @{githubHandle}
          </a>
          , written in public. {journalEntries.length} entries so far. Built with
          React and Vite, published by GitHub Actions on every merge.
        </p>
        <ul className="footer-links">
          <li>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              More projects on GitHub
            </a>
          </li>
          <li>
            <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              This site&apos;s source
            </a>
          </li>
          <li>
            <a href={`${repositoryUrl}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer">
              Security
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

// A single-page app keeps the scroll position between pages unless told
// otherwise. Jump to the top whenever the path changes.
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

type PageHeaderProps = {
  eyebrow: string
  title: string
  lede?: ReactNode
  journalSlug?: string
}

export function PageHeader({ eyebrow, title, lede, journalSlug }: PageHeaderProps) {
  useDocumentTitle(title)
  const entry = journalSlug ? findEntry(journalSlug) : undefined

  return (
    <header className="page-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">
        <span className="title-text">{title}</span>
      </h1>
      {lede && <p className="lede">{lede}</p>}
      {entry && (
        <Link to={`/journal/${entry.slug}`} className="journal-chip">
          <span className="journal-chip-number">#{entry.number}</span>
          <span className="journal-chip-text">How this was built: {entry.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </header>
  )
}

type PanelProps = {
  index: number
  title: string
  description?: string
  children: ReactNode
}

export function Panel({ index, title, description, children }: PanelProps) {
  const headingId = `panel-${index}`
  return (
    <section className="panel" aria-labelledby={headingId}>
      <div className="panel-head">
        <span className="panel-index">{String(index).padStart(2, '0')}</span>
        <div>
          <h2 id={headingId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  )
}
