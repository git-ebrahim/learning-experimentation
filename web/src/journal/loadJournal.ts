// The journal loader. It turns entry files into journal entries, checking
// every rule, and reports every problem it finds in one go.
//
// It never reads the disk itself: callers pass in each file's path and text.
// entries.ts does that for the real site, and the tests pass in made-up files.
//
// An entry file is named NNN-slug.md and starts with a frontmatter block:
//
//   ---
//   title: Add navigation buttons between pages
//   date: 2026-11-22
//   status: done            (planned, in-progress, or done)
//   summary: One sentence shown in the list.
//   demo: /about            (optional: a page from the site map)
//   issues: 18              (optional: comma-separated issue numbers)
//   prs: 4, 5               (optional: comma-separated PR numbers)
//   ---

// The one status table. Its keys are the valid statuses and its values are
// the labels the site shows.
export const statusLabels = {
  planned: 'Planned',
  'in-progress': 'In progress',
  done: 'Done',
} as const

export type EntryStatus = keyof typeof statusLabels

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

export type LoadResult =
  | { ok: true; entries: JournalEntry[] }
  | { ok: false; problems: string[] }

// The address of an entry's page.
export function entryPath(slug: string) {
  return `/journal/${slug}`
}

const knownKeys = ['title', 'date', 'status', 'summary', 'demo', 'issues', 'prs']

// Three digits, a dash, then a slug of lowercase words joined by dashes.
const fileNamePattern = /^(\d{3})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/
const frontmatterPattern = /^---\n([\s\S]*?)\n---\n/

/**
 * Loads and checks journal entries.
 *
 * @param files - each entry file's path (only the file name is used) and raw text.
 * @param sitePaths - the site map's page paths, which `demo:` must be one of.
 * @returns every entry, newest (highest number) first, or, if any rule is
 *   broken, every problem as a "file-name: what's wrong" line.
 */
export function loadJournal(
  files: Record<string, string>,
  sitePaths: readonly string[],
): LoadResult {
  const problems: string[] = []
  const entries: JournalEntry[] = []
  const fileByNumber = new Map<number, string>()
  const fileBySlug = new Map<string, string>()

  const named = Object.entries(files)
    .map(([path, raw]) => ({ fileName: path.split('/').pop() ?? path, raw }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName))

  for (const { fileName, raw } of named) {
    const report = (problem: string) => problems.push(`${fileName}: ${problem}`)
    const entry = checkEntry(fileName, raw.replace(/\r\n/g, '\n'), sitePaths, report)
    if (!entry) continue

    const numberOwner = fileByNumber.get(entry.number)
    if (numberOwner) report(`number ${entry.number} is already used by ${numberOwner}`)
    else fileByNumber.set(entry.number, fileName)

    const slugOwner = fileBySlug.get(entry.slug)
    if (slugOwner) report(`slug "${entry.slug}" is already used by ${slugOwner}`)
    else fileBySlug.set(entry.slug, fileName)

    entries.push(entry)
  }

  if (problems.length > 0) return { ok: false, problems }
  return { ok: true, entries: entries.sort((a, b) => b.number - a.number) }
}

// The message the site throws when the journal has problems.
export function describeProblems(problems: string[]) {
  const count = problems.length === 1 ? '1 problem' : `${problems.length} problems`
  return [`${count} in the journal:`, ...problems.map((problem) => `  ${problem}`)].join('\n')
}

// Checks one file. Reports each problem it finds and returns the entry, or
// undefined if the file broke a rule.
function checkEntry(
  fileName: string,
  raw: string,
  sitePaths: readonly string[],
  report: (problem: string) => void,
): JournalEntry | undefined {
  let broken = false
  const track = (problem: string) => {
    broken = true
    report(problem)
  }

  const nameMatch = fileNamePattern.exec(fileName)
  if (!nameMatch) track('the file name must look like 012-short-slug.md')

  const frontmatterMatch = frontmatterPattern.exec(raw)
  if (!frontmatterMatch) {
    track('the file must start with a frontmatter block between two --- lines')
    return undefined
  }

  const fields = readFields(frontmatterMatch[1], track)

  const { title, date, status, summary, demo } = fields
  if (!title) track('title is missing')
  if (!date) track('date is missing')
  else if (!isRealDate(date)) track(`date "${date}" is not a real YYYY-MM-DD date`)
  if (!status) track('status is missing')
  else if (!Object.hasOwn(statusLabels, status)) {
    track(`status "${status}" must be one of: ${Object.keys(statusLabels).join(', ')}`)
  }
  if (demo !== undefined && !sitePaths.includes(demo)) {
    track(`demo "${demo}" is not a page in the site map (${sitePaths.join(', ')})`)
  }
  const issues = readNumberList('issues', fields.issues, track)
  const prs = readNumberList('prs', fields.prs, track)

  if (broken || !nameMatch) return undefined
  return {
    number: Number(nameMatch[1]),
    slug: nameMatch[2],
    title: title!,
    date: date!,
    status: status as EntryStatus,
    summary: summary ?? '',
    demo: demo || undefined,
    issues,
    prs,
    body: raw.slice(frontmatterMatch[0].length).trim(),
  }
}

// Reads "key: value" lines into an object. Reports lines that aren't
// "key: value", keys that aren't known (often a typo), and repeated keys.
function readFields(frontmatter: string, report: (problem: string) => void) {
  const fields: Record<string, string> = {}
  for (const line of frontmatter.split('\n')) {
    if (line.trim() === '') continue
    const separator = line.indexOf(':')
    if (separator === -1) {
      report(`frontmatter line "${line}" must look like "key: value"`)
      continue
    }
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (!knownKeys.includes(key)) {
      report(`unknown frontmatter key "${key}" (known keys: ${knownKeys.join(', ')})`)
    } else if (key in fields) {
      report(`frontmatter key "${key}" appears more than once`)
    } else {
      fields[key] = value
    }
  }
  return fields
}

// True for a calendar date such as 2026-11-22, false for 2026-13-01 or
// 2026-02-30. Parsing as UTC means the visitor's time zone doesn't matter.
function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
}

// Reads "4" or "4, 5" into [4, 5]. Every item must be a positive whole number.
function readNumberList(key: string, value: string | undefined, report: (problem: string) => void) {
  if (value === undefined) return []
  const numbers: number[] = []
  for (const item of value.split(',').map((part) => part.trim())) {
    if (/^[1-9]\d*$/.test(item)) numbers.push(Number(item))
    else report(`${key} item "${item}" must be a positive whole number`)
  }
  return numbers
}
