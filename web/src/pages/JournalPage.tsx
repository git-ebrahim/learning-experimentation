import { PageHeader } from '../components/layout.tsx'
import { Timeline } from '../journal/Timeline.tsx'
import { journalEntries, repositoryUrl } from '../journal/entries.ts'

export function JournalPage() {
  return (
    <div className="container container-narrow">
      <PageHeader
        eyebrow={`${journalEntries.length} entries`}
        title="Development journal"
        lede={
          <>
            What I wanted to learn, how I built it, what I found, and the proof
            that it works. Each entry is a Markdown file in{' '}
            <a
              href={`${repositoryUrl}/tree/main/web/src/journal/entries`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <code>web/src/journal/entries/</code>
            </a>
            .
          </>
        }
      />
      <Timeline entries={journalEntries} />
    </div>
  )
}
