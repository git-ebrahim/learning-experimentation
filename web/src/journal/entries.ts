// The real journal. This file reads the entry files and hands them to the
// loader (loadJournal.ts), which holds every rule and is what the tests use.
//
// import.meta.glob is a Vite feature. It finds the matching files when the
// site is built, and `?raw` imports each one as a plain string. The checks
// themselves run when the site starts in the browser, so the test in
// entries.test.ts loads these same files in CI to catch problems before a
// broken entry can be merged.
import { sitePages } from '../siteMap.ts'
import { describeProblems, loadJournal } from './loadJournal.ts'

const files = import.meta.glob<string>('./entries/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const result = loadJournal(
  files,
  sitePages.map((page) => page.path),
)
if (!result.ok) throw new Error(describeProblems(result.problems))

// Every entry, newest first.
export const journalEntries = result.entries

export function findEntry(slug: string | undefined) {
  return journalEntries.find((entry) => entry.slug === slug)
}

export { entryPath, statusLabels, type EntryStatus, type JournalEntry } from './loadJournal.ts'
