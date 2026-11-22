import { describe, expect, it } from 'vitest'

// This is the check that stops a broken entry from being merged. It loads the
// real entry files exactly as the site does. If any entry breaks a rule, the
// import fails with the full list of problems.
describe('the real journal', () => {
  it('loads every entry file without problems', async () => {
    const { journalEntries } = await import('./entries.ts')
    // Without `eager`, the glob only lists the files; it doesn't load them.
    const entryFiles = Object.keys(import.meta.glob('./entries/*.md'))

    expect(journalEntries).toHaveLength(entryFiles.length)
  })
})
