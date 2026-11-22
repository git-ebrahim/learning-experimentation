import Markdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router'
import remarkGfm from 'remark-gfm'
import { StatusBadge } from '../journal/JournalCard.tsx'
import { findEntry, repositoryUrl } from '../journal/entries.ts'
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
  if (!entry) return <NotFoundPage />

  return (
    <article>
      <p>
        <Link to="/journal">← All journal entries</Link>
      </p>
      <div className="journal-meta">
        <span>#{entry.number}</span>
        <time dateTime={entry.date}>{entry.date}</time>
        <StatusBadge status={entry.status} />
      </div>
      <h1>{entry.title}</h1>

      <div className="button-row entry-actions">
        {entry.demo && (
          <Link to={entry.demo} className="nav-button active">
            See it working
          </Link>
        )}
        {entry.prs.map((pr) => (
          <a
            key={pr}
            href={`${repositoryUrl}/pull/${pr}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-button"
          >
            Pull request #{pr}
          </a>
        ))}
      </div>

      <div className="prose">
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {entry.body}
        </Markdown>
      </div>
    </article>
  )
}
