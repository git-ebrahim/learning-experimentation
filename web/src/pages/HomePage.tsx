import { Link } from 'react-router'
import { JournalCard } from '../journal/JournalCard.tsx'
import { journalEntries } from '../journal/entries.ts'

export function HomePage() {
  const latest = journalEntries.slice(0, 3)

  return (
    <section>
      <h1>Learning Experimentation</h1>
      <p>
        My development journal. I learn one web development idea at a time,
        build it into this site, and write down what worked, what didn&apos;t,
        and how to reproduce it.
      </p>
      <p>
        The <Link to="/journal">journal</Link> holds the write-ups. The other
        pages in the menu are the working examples they describe.
      </p>

      <h2>Latest entries</h2>
      <ol className="journal-list">
        {latest.map((entry) => (
          <JournalCard key={entry.slug} entry={entry} />
        ))}
      </ol>
      <p>
        <Link to="/journal">See all {journalEntries.length} entries →</Link>
      </p>
    </section>
  )
}
