import { JournalCard } from '../journal/JournalCard.tsx'
import { journalEntries, repositoryUrl } from '../journal/entries.ts'

export function JournalPage() {
  return (
    <section>
      <h1>Development journal</h1>
      <p>
        Each entry records what I wanted to learn, how I built it, what I found,
        and the proof that it works. Entries link to their pull requests and to
        the page on this site that shows the idea working. The entries are
        Markdown files in{' '}
        <a
          href={`${repositoryUrl}/tree/main/web/src/journal/entries`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>web/src/journal/entries/</code>
        </a>
        .
      </p>
      <ol className="journal-list">
        {journalEntries.map((entry) => (
          <JournalCard key={entry.slug} entry={entry} />
        ))}
      </ol>
    </section>
  )
}
