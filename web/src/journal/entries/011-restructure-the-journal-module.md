---
title: Restructure the code around what it does
date: 2026-11-22
status: done
summary: An architecture review, two rounds of design questions, and three small pull requests that give the journal one tested module.
demo: /journal
issues: 20
prs: 25, 26, 27
---

## Question

The site grew one feature at a time. How do I find the parts of the code that will be hard to change, and restructure them the way a production team would: decide first, then change in small reviewable steps, with tests to prove nothing broke?

## Approach

1. **Review the architecture.** I read the recent history to find the files that kept changing, then looked for *shallow modules*: code whose interface is nearly as complicated as what it does, so every caller has to know its details. Four candidates came out. The **journal** was the strongest:
   - `entries.ts` read the files, parsed them, checked a few rules, and sorted entries, all at import time with a Vite-only feature, so nothing could test it.
   - The three statuses were written out three times, and entry links were built by hand in two places.
   - Mistakes such as a misspelt `isues:` key, or a non-number in `prs:`, were silently ignored.
2. **Decide in the issue before writing code.** Issue #20 records two rounds of questions, each with a recommendation, and my answers:
   - Report **every** problem at once, not just the first.
   - Split a **pure loader** (`loadJournal.ts`: takes file names and text, returns entries or problems) from a **one-line file reader** (`entries.ts`).
   - Check `demo:` against a **site map** (`siteMap.ts`) instead of a second hand-written list.
   - Seven rules that fail, Vitest as the test runner, tests in CI, and a `GLOSSARY.md` for the words the code uses.
3. **Ship it as three stacked pull requests** with `gh stack`, so each is small enough to review on its own:
   1. #25 adds Vitest, a first test for `detectMediaType`, the `npm test` CI step, and the glossary.
   2. #26 moves the page list into `siteMap.ts` with no change in behaviour.
   3. #27 adds the journal loader, its tests, the real-entries test, this entry, and a Mermaid diagram of the code in the README.

## Findings

- **The old check never failed the build.** The journal is parsed when the site starts in the visitor's browser, not during `vite build`. A broken entry passed CI, deployed, and showed a blank page. Entry #6 said the opposite, which is why I now test claims like that instead of trusting them. A test that loads the real entries now closes the gap.
- **Pass data in, get data out.** Because the loader takes `{ fileName: text }` and returns a result, a test can hand it any made-up file in one line. There are 31 tests for the rules, and none of them touch the disk.
- **One table, three jobs.** `statusLabels` lists the valid statuses, the TypeScript type comes from its keys, and the site shows its values. Adding a status now means one new line in that table, plus a badge colour in the CSS.
- **Let the type checker enforce the site map.** `App.tsx` maps each path to its page with `Record<SitePath, ReactNode>`. Add a page to `siteMap.ts` and forget its component, and TypeScript stops the build.
- **The thinking is the slow part.** Writing the questions down took longer than the code, but the code then went in without surprises.

## Evidence

- `npm test` runs 45 tests in under a second: 31 for the loader's rules, 3 for its helpers, 1 that loads the real journal, and 10 for media detection. Some are one test run with several inputs.
- I broke entry #8 on purpose (a 13th month, `isues:`, and `demo: /medai`). The test failed with all three problems listed by file, then passed again once I put the entry back.
- The site looks and behaves as before: lint, type checking, and the build pass, and every page and journal link still opens.
- [Vitest documentation](https://vitest.dev/guide/)
