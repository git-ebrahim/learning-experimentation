import { Link } from 'react-router'
import { statusLabels, type JournalEntry } from './entries.ts'

export function StatusBadge({ status }: { status: JournalEntry['status'] }) {
  return <span className={`status status-${status}`}>{statusLabels[status]}</span>
}

export function JournalCard({ entry }: { entry: JournalEntry }) {
  return (
    <li className="journal-card">
      <div className="journal-meta">
        <span>#{entry.number}</span>
        <time dateTime={entry.date}>{entry.date}</time>
        <StatusBadge status={entry.status} />
      </div>
      <h2>
        <Link to={`/journal/${entry.slug}`}>{entry.title}</Link>
      </h2>
      <p>{entry.summary}</p>
    </li>
  )
}
