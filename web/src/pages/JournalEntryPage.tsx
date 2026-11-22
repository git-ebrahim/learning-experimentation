import Markdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router'
import remarkGfm from 'remark-gfm'
import { useDocumentTitle } from '../components/useDocumentTitle.ts'
import { StatusBadge } from '../journal/Timeline.tsx'
import { formatDate } from '../formatDate.ts'
import { findEntry } from '../journal/entries.ts'
import { repositoryUrl } from '../site.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

// react-markdown turns Markdown into React elements. It ignores raw HTML in
// the Markdown by default, so an entry can't inject a <script>, and React
// escapes all the text.
const markdownComponents: Components = {
  a: ({ href, children }) => {
    const external = href?.startsWith('http')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  },
  // Wide tables scroll sideways on small screens instead of the whole page.
  table: ({ children }) => (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  ),
}

export function JournalEntryPage() {
  const { slug } = useParams()
  const entry = findEntry(slug)
  useDocumentTitle(entry?.title)
  if (!entry) return <NotFoundPage />

  return (
    <article className="container container-narrow">
      <Link to="/journal" className="back-link">
        <span aria-hidden="true">←</span> Journal
      </Link>

      <header className="page-header">
        <div className="entry-meta">
          <span>Entry {String(entry.number).padStart(3, '0')}</span>
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          <StatusBadge status={entry.status} />
        </div>
        <h1 className="page-title">{entry.title}</h1>
        {entry.summary && <p className="lede">{entry.summary}</p>}
        <div className="button-row entry-actions">
          {entry.demo && (
            <Link to={entry.demo} className="btn btn-primary">
              See it working →
            </Link>
          )}
          {entry.issues.map((issue) => (
            <a
              key={`issue-${issue}`}
              href={`${repositoryUrl}/issues/${issue}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Issue #{issue}
            </a>
          ))}
          {entry.prs.map((pr) => (
            <a
              key={pr}
              href={`${repositoryUrl}/pull/${pr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Pull request #{pr}
            </a>
          ))}
        </div>
      </header>

      <div className="prose">
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {entry.body}
        </Markdown>
      </div>
    </article>
  )
}
