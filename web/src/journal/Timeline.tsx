import { Link } from 'react-router'
import { formatDate, statusLabels, type JournalEntry } from './entries.ts'

export function StatusBadge({ status }: { status: JournalEntry['status'] }) {
  return <span className={`status status-${status}`}>{statusLabels[status]}</span>
}

// One row in the journal timeline. The title link stretches over the whole
// row (see .timeline-title a::after), so the row is one large click target.
export function TimelineItem({ entry }: { entry: JournalEntry }) {
  return (
    <li className="timeline-item">
      <span className="timeline-number">{String(entry.number).padStart(3, '0')}</span>
      <div className="timeline-body">
        <h3 className="timeline-title">
          <Link to={`/journal/${entry.slug}`}>{entry.title}</Link>
        </h3>
        <p className="timeline-summary">{entry.summary}</p>
      </div>
      <div className="timeline-meta">
        <time className="timeline-date" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
        <StatusBadge status={entry.status} />
      </div>
    </li>
  )
}

export function Timeline({ entries }: { entries: JournalEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <TimelineItem key={entry.slug} entry={entry} />
      ))}
    </ol>
  )
}
