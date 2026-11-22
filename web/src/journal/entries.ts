// Loads every journal entry at build time. Each entry is a Markdown file in
// ./entries/ named NNN-slug.md, starting with a small frontmatter block:
//
//   ---
//   title: Add navigation buttons between pages
//   date: 2026-11-22
//   status: done            (planned, in-progress, or done)
//   summary: One sentence shown in the list.
//   demo: /about            (optional: the page that shows it working)
//   issues: 18              (optional: comma-separated issue numbers)
//   prs: 4                  (optional: comma-separated PR numbers)
//   ---
//
// import.meta.glob is a Vite feature. It finds matching files when the site
// is built, and `?raw` imports each one as a plain string.
const files = import.meta.glob<string>('./entries/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type EntryStatus = 'planned' | 'in-progress' | 'done'

export type JournalEntry = {
  number: number
  slug: string
  title: string
  date: string
  status: EntryStatus
  summary: string
  demo?: string
  issues: number[]
  prs: number[]
  body: string
}

const statuses: EntryStatus[] = ['planned', 'in-progress', 'done']

function parseNumberList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0)
}

function parseEntry(path: string, raw: string): JournalEntry {
  const fileName = path.split('/').pop()!.replace(/\.md$/, '')
  const nameMatch = /^(\d+)-(.+)$/.exec(fileName)
  const frontmatterMatch = /^---\n([\s\S]*?)\n---\n/.exec(raw)
  // Fail the build loudly instead of showing a broken entry.
  if (!nameMatch || !frontmatterMatch) {
    throw new Error(`Journal entry ${path} needs an NNN-slug.md name and a frontmatter block.`)
  }

  const fields = Object.fromEntries(
    frontmatterMatch[1].split('\n').map((line) => {
      const separator = line.indexOf(':')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    }),
  )

  const status = fields.status as EntryStatus
  if (!fields.title || !fields.date || !statuses.includes(status)) {
    throw new Error(`Journal entry ${path} needs a title, a date, and a valid status.`)
  }

  return {
    number: Number(nameMatch[1]),
    slug: nameMatch[2],
    title: fields.title,
    date: fields.date,
    status,
    summary: fields.summary ?? '',
    demo: fields.demo || undefined,
    issues: parseNumberList(fields.issues),
    prs: parseNumberList(fields.prs),
    body: raw.slice(frontmatterMatch[0].length).trim(),
  }
}

// Newest first.
export const journalEntries: JournalEntry[] = Object.entries(files)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => b.number - a.number)

export function findEntry(slug: string | undefined) {
  return journalEntries.find((entry) => entry.slug === slug)
}

export const statusLabels: Record<EntryStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In progress',
  done: 'Done',
}

// Shows 2026-11-22 as "22 Nov 2026".
export function formatDate(isoDate: string) {
  // Parse as UTC so the date doesn't shift with the visitor's time zone.
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
