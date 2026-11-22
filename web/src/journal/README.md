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
   prs: 12
   ---
   ```

   - `status` is `planned`, `in-progress`, or `done`.
   - `demo` and `prs` are optional. `prs` takes comma-separated numbers.
3. Write the body with these sections:
   - `## Question`: what you wanted to understand.
   - `## Approach`: the steps someone else could repeat.
   - `## Findings`: what you observed, what surprised you, and what you'd change.
   - `## Evidence`: how you checked it works, plus links to docs.
4. Run `npm run build` in `web/`. A bad name, missing frontmatter, or unknown status fails the build with a message.
5. Open a pull request. The entry goes live when it merges.

Keep links absolute (`https://…`) so they work both on GitHub and on the site.
