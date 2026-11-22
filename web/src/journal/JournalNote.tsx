import { Link } from 'react-router'
import { findEntry } from './entries.ts'

// A short pointer from a demo page to the journal entry that explains it.
export function JournalNote({ slug }: { slug: string }) {
  const entry = findEntry(slug)
  if (!entry) return null

  return (
    <p className="journal-note">
      Journal #{entry.number}:{' '}
      <Link to={`/journal/${entry.slug}`}>{entry.title}</Link> explains how
      this page was built and what I learned.
    </p>
  )
}
