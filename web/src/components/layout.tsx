import { useEffect, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { findEntry, journalEntries, repositoryUrl } from '../journal/entries.ts'
import { useDocumentTitle } from './useDocumentTitle.ts'

export type NavItem = { path: string; label: string }

export function SiteHeader({ items }: { items: NavItem[] }) {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="brand" aria-label="Learning Experimentation, home">
          <span className="brand-mark" aria-hidden="true">
            Le
          </span>
          Learning Experimentation
        </Link>
        <nav aria-label="Main" className="site-nav">
          <ul className="nav-list">
            {items.map((item) => (
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
          A development journal, written in public. {journalEntries.length} entries so
          far. Built with React and Vite, and published by GitHub Actions on every
          merge.
        </p>
        <ul className="footer-links">
          <li>
            <Link to="/journal">Journal</Link>
          </li>
          <li>
            <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              Source on GitHub
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
      <span className="eyebrow eyebrow-dot">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
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
