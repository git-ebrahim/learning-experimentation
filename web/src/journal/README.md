# Development journal

Each file in `entries/` is one journal entry. The site builds them into the **Journal** pages at https://git-ebrahim.github.io/learning-experimentation/#/journal.

## Add an entry

1. Create `entries/NNN-short-slug.md`. Use the next number. The slug becomes the URL, for example `#/journal/short-slug`.
2. Start the file with this frontmatter:

   ```markdown
   ---
   title: What I set out to learn
   date: 2026-11-22
   status: in-progress
   summary: One sentence for the journal list.
   demo: /page-that-shows-it
   issues: 11
   prs: 12
   ---
   ```

   - `status` is `planned`, `in-progress`, or `done`.
   - `date` is a real date written `YYYY-MM-DD`.
   - `demo` must be a page path from `web/src/siteMap.ts`.
   - `demo`, `issues`, and `prs` are optional. `issues` and `prs` take comma-separated numbers.
   - Every task starts as a GitHub issue where the problem, options, and decision are discussed. List it in `issues` so readers can follow the thinking from issue to pull request.
3. Write the body with these sections:
   - `## Question`: what you wanted to understand.
   - `## Approach`: the steps someone else could repeat.
   - `## Findings`: what you observed, what surprised you, and what you'd change.
   - `## Evidence`: how you checked it works, plus links to docs.
4. Run `npm test` in `web/`. The test in `entries.test.ts` loads every entry and lists every problem it finds, for example a date that isn't real, a `demo` that isn't a page, or a misspelt frontmatter key. The same test runs on every pull request, so a broken entry can't be merged. The rules live in `loadJournal.ts`.
5. Open a pull request. The entry goes live when it merges.

Keep links absolute (`https://…`) so they work both on GitHub and on the site.
