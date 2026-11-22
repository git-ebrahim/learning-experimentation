import { describe, expect, it } from 'vitest'
import { describeProblems, entryPath, loadJournal } from './loadJournal.ts'

const sitePaths = ['/', '/journal', '/media']

// A valid entry file. Pass fields to change or add frontmatter lines;
// pass undefined to leave a line out.
function entryFile(fields: Record<string, string | undefined> = {}, body = '## Question\n\nWhy?') {
  const all: Record<string, string | undefined> = {
    title: 'Learn something',
    date: '2026-11-22',
    status: 'done',
    summary: 'One sentence.',
    ...fields,
  }
  const lines = Object.entries(all)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
  return `---\n${lines.join('\n')}\n---\n\n${body}\n`
}

function problemsFor(files: Record<string, string>) {
  const result = loadJournal(files, sitePaths)
  return result.ok ? [] : result.problems
}

describe('loadJournal', () => {
  it('reads every field of a valid entry', () => {
    const result = loadJournal(
      {
        './entries/004-media-and-uploads.md': entryFile({ demo: '/media', issues: '3', prs: '4, 5' }),
      },
      sitePaths,
    )

    expect(result).toEqual({
      ok: true,
      entries: [
        {
          number: 4,
          slug: 'media-and-uploads',
          title: 'Learn something',
          date: '2026-11-22',
          status: 'done',
          summary: 'One sentence.',
          demo: '/media',
          issues: [3],
          prs: [4, 5],
          body: '## Question\n\nWhy?',
        },
      ],
    })
  })

  it('sorts entries newest (highest number) first', () => {
    const result = loadJournal(
      {
        '001-first.md': entryFile(),
        '010-tenth.md': entryFile(),
        '002-second.md': entryFile(),
      },
      sitePaths,
    )

    expect(result.ok && result.entries.map((entry) => entry.number)).toEqual([10, 2, 1])
  })

  it('treats demo, summary, issues, and prs as optional', () => {
    const result = loadJournal({ '001-first.md': entryFile({ summary: undefined }) }, sitePaths)

    expect(result.ok && result.entries[0]).toMatchObject({
      summary: '',
      demo: undefined,
      issues: [],
      prs: [],
    })
  })

  it('accepts Windows line endings', () => {
    const result = loadJournal({ '001-first.md': entryFile().replace(/\n/g, '\r\n') }, sitePaths)

    expect(result.ok).toBe(true)
  })

  it.each([
    ['no number', 'first.md'],
    ['a two-digit number', '01-first.md'],
    ['capital letters in the slug', '001-First.md'],
    ['spaces in the slug', '001-my first.md'],
  ])('rejects a file name with %s', (_case, fileName) => {
    expect(problemsFor({ [fileName]: entryFile() })).toEqual([
      `${fileName}: the file name must look like 012-short-slug.md`,
    ])
  })

  it('rejects a file without frontmatter', () => {
    expect(problemsFor({ '001-first.md': '# Just a heading\n' })).toEqual([
      '001-first.md: the file must start with a frontmatter block between two --- lines',
    ])
  })

  it('rejects missing required fields', () => {
    const file = entryFile({ title: undefined, date: undefined, status: undefined })

    expect(problemsFor({ '001-first.md': file })).toEqual([
      '001-first.md: title is missing',
      '001-first.md: date is missing',
      '001-first.md: status is missing',
    ])
  })

  it('rejects an unknown status', () => {
    expect(problemsFor({ '001-first.md': entryFile({ status: 'finished' }) })).toEqual([
      '001-first.md: status "finished" must be one of: planned, in-progress, done',
    ])
  })

  it.each(['2026-13-01', '2026-02-30', '22/11/2026', '2026-11-2', 'yesterday'])(
    'rejects the date "%s"',
    (date) => {
      expect(problemsFor({ '001-first.md': entryFile({ date }) })).toEqual([
        `001-first.md: date "${date}" is not a real YYYY-MM-DD date`,
      ])
    },
  )

  it('accepts 29 February in a leap year', () => {
    expect(problemsFor({ '001-first.md': entryFile({ date: '2028-02-29' }) })).toEqual([])
  })

  it('rejects a demo that is not a page in the site map', () => {
    expect(problemsFor({ '001-first.md': entryFile({ demo: '/medai' }) })).toEqual([
      '001-first.md: demo "/medai" is not a page in the site map (/, /journal, /media)',
    ])
  })

  it.each([
    ['a word', 'twelve', 'twelve'],
    ['zero', '0', '0'],
    ['a negative number', '-3', '-3'],
    ['a decimal', '4.5', '4.5'],
    ['a # prefix', '#12', '#12'],
    ['an empty item', '4,', ''],
  ])('rejects prs containing %s', (_case, prs, item) => {
    expect(problemsFor({ '001-first.md': entryFile({ prs }) })).toEqual([
      `001-first.md: prs item "${item}" must be a positive whole number`,
    ])
  })

  it('checks issues the same way as prs', () => {
    expect(problemsFor({ '001-first.md': entryFile({ issues: '12, abc' }) })).toEqual([
      '001-first.md: issues item "abc" must be a positive whole number',
    ])
  })

  it('rejects an unknown frontmatter key, such as a typo', () => {
    expect(problemsFor({ '001-first.md': entryFile({ isues: '12' }) })).toEqual([
      '001-first.md: unknown frontmatter key "isues" (known keys: title, date, status, summary, demo, issues, prs)',
    ])
  })

  it('rejects a repeated frontmatter key', () => {
    const file = entryFile().replace('title: Learn something', 'title: One\ntitle: Two')

    expect(problemsFor({ '001-first.md': file })).toEqual([
      '001-first.md: frontmatter key "title" appears more than once',
    ])
  })

  it('rejects a frontmatter line that is not "key: value"', () => {
    const file = entryFile().replace('summary: One sentence.', 'summary: One sentence.\njust some text')

    expect(problemsFor({ '001-first.md': file })).toEqual([
      '001-first.md: frontmatter line "just some text" must look like "key: value"',
    ])
  })

  it('rejects two entries with the same number', () => {
    expect(problemsFor({ '001-first.md': entryFile(), '001-other.md': entryFile() })).toEqual([
      '001-other.md: number 1 is already used by 001-first.md',
    ])
  })

  it('rejects two entries with the same slug', () => {
    expect(problemsFor({ '001-same.md': entryFile(), '002-same.md': entryFile() })).toEqual([
      '002-same.md: slug "same" is already used by 001-same.md',
    ])
  })

  it('reports every problem in every file at once, in file order', () => {
    const problems = problemsFor({
      '002-second.md': entryFile({ status: 'done!', isues: '4' }),
      '001-first.md': entryFile({ date: '2026-13-01' }),
    })

    expect(problems).toEqual([
      '001-first.md: date "2026-13-01" is not a real YYYY-MM-DD date',
      '002-second.md: unknown frontmatter key "isues" (known keys: title, date, status, summary, demo, issues, prs)',
      '002-second.md: status "done!" must be one of: planned, in-progress, done',
    ])
  })
})

describe('describeProblems', () => {
  it('lists each problem on its own line under a count', () => {
    expect(describeProblems(['a.md: one', 'b.md: two'])).toBe(
      '2 problems in the journal:\n  a.md: one\n  b.md: two',
    )
  })

  it('uses the singular for one problem', () => {
    expect(describeProblems(['a.md: one'])).toBe('1 problem in the journal:\n  a.md: one')
  })
})

describe('entryPath', () => {
  it("builds an entry's page address from its slug", () => {
    expect(entryPath('media-and-uploads')).toBe('/journal/media-and-uploads')
  })
})
