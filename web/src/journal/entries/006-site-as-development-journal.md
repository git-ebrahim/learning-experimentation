---
title: Turn the site into my development journal
date: 2026-11-22
status: done
summary: Journal entries live as Markdown files in the repo and render as pages on the site, next to the demos they describe.
demo: /journal
prs: 9
---

## Question

Can the website itself be the learning journal, so each write-up sits next to the working example it describes, without losing the history in the repo?

## Approach

1. Split `LEARNING_LOG.md` into one Markdown file per entry in `web/src/journal/entries/`, named `NNN-slug.md`. The number orders the entries and the slug becomes the URL.
2. Start each file with a small frontmatter block: title, date, status, summary, an optional demo page, and PR numbers.
3. Load all entries at build time with Vite's `import.meta.glob('./entries/*.md', { query: '?raw', eager: true })` in `web/src/journal/entries.ts`.
4. Render each entry's Markdown with `react-markdown` and `remark-gfm` (tables and task lists) on a `/journal/:slug` route.
5. Add a **Journal** nav button, show the latest entries on Home, and give each demo page a link back to its entry.
6. Replace `LEARNING_LOG.md` with a pointer to the site and the entries folder.

## Findings

- **One source, two views.** GitHub renders the same `.md` files in the repo, and the site renders them as pages. Every change still goes through a PR, so the Git history is the audit trail.
- **Write → build → see.** A new entry is a new Markdown file. There's no database and no admin screen, because the build reads the folder.
- **A URL parameter makes one page component serve every entry.** `/journal/:slug` passes `slug` to `useParams()`, which looks up the entry. An unknown slug shows "Page not found".
- **Fail the build, not the reader.** `entries.ts` throws if a file has a bad name, missing frontmatter, or an unknown status. A mistake then stops the deploy instead of publishing a broken page.
- **Markdown rendering stays safe.** `react-markdown` ignores raw HTML in the Markdown and React escapes text, so the CSP from entry #5 doesn't need loosening.
- **The cost is bundle size.** The Markdown libraries took the JavaScript from about 85 KB to about 142 KB gzipped. Loading the entry page with `React.lazy` would keep that cost off the other pages. That's a good next experiment.
- **Link from the demo to the write-up and back.** The "See it working" button and the journal notes on each demo page tie learning and applying together.

## Evidence

Playwright drove the built site with the CSP on:

- The Journal page lists 6 entries, newest first.
- Each entry page renders its headings, lists, and code.
- The security entry's table renders and scrolls inside its box at 375 px instead of widening the page.
- PR buttons point at the right GitHub PRs, and "See it working" opens the demo page.
- An unknown slug shows "Page not found".
- There were no console errors or CSP violations.
