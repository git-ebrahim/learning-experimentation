---
title: Give the site a proper visual design
date: 2026-11-22
status: done
summary: From default-looking boxes to an editorial "lab notebook" with design tokens, real typography, and checked contrast.
demo: /
prs: 13
---

## Question

The site worked but looked like a first attempt: boxed buttons, every block in a bordered card, default blue links, and no visual hierarchy. What turns a functional page into a polished one?

## Approach

1. **Diagnose first.** I screenshotted every page at desktop and phone widths and listed what looked cheap. Everything had the same weight. Borders were doing all the work. Nothing had a typographic voice.
2. **Pick one direction:** an editorial "lab notebook". Warm paper background, ink-colored text, and one vermilion accent.
3. **Define design tokens** at the top of `web/src/index.css`: colors, three font families, widths, and corner radii. Dark mode only swaps the color values.
4. **Choose three typefaces with clear jobs:**
   - Newsreader (serif) for headlines.
   - Inter (sans) for reading and controls.
   - JetBrains Mono for "log" details such as entry numbers, dates, and statuses.
5. **Build a few reusable pieces** in `web/src/components/`: the site header and footer, `PageHeader` (eyebrow, title, lede, journal link), and `Panel` for each demo.
6. **Redesign each page:**
   - **Home:** a hero, a stats strip, a timeline of the latest entries, and experiment cards.
   - **Journal:** the cards became a numbered timeline.
   - **Entries:** article typography and styled tables.
   - **Demos:** numbered panels, primary and secondary buttons, proper inputs, and a drag-and-drop file zone.
7. **Check it:** screenshots in light and dark mode at 1280 px and 390 px, an automated overflow check, a contrast check, and the earlier functional tests.

## Findings

- **Hierarchy comes from contrast in size, weight, and typeface, not from boxes.** Removing most borders and letting a large serif headline lead did more than any color change.
- **Tokens make design changes cheap.** Every color is a variable, so dark mode is about 15 lines and a future rebrand is a single block.
- **Self-host fonts.** Loading them from Google Fonts would mean loosening the CSP from entry #5 and sending every visitor's IP address to Google. Installing `@fontsource-variable/*` from npm bundles the font files with the site.
- **The CSP caught a real problem.** Vite inlines files under 4 KB as `data:` URLs, so one tiny font file was blocked as an untrusted source. Rather than allow `data:` fonts, `build.assetsInlineLimit` in `vite.config.ts` now keeps fonts as separate files.
- **`minmax(0, 1fr)` stops grid overflow.** A CSS grid column grows to fit its widest child. A text chip that doesn't wrap, and a 480 px diagram, both pushed the page wider than a phone screen. `grid-template-columns: minmax(0, 1fr)` lets children shrink.
- **SVGs can follow dark mode by themselves.** An SVG shown with `<img>` can't read the page's CSS, but a `<style>` inside the SVG with `@media (prefers-color-scheme: dark)` works. A raw `<` inside that `<style>` (even in a comment) breaks the XML and the image silently disappears.
- **Make the whole row clickable without extra links.** A title link with `::after { position: absolute; inset: 0 }` stretches over its card or timeline row. Screen readers still hear one link with a clear name.
- **Small details that read as quality:**
  - A sticky translucent header.
  - The active page shown as a filled pill.
  - Tabular numbers on the counter.
  - Mono uppercase labels for metadata.
  - Hover states that change background, not layout.
  - Respecting `prefers-reduced-motion`.
- **Accessibility improved along the way:**
  - A "Skip to content" link is the first tab stop.
  - Every page sets the browser tab title.
  - Navigating scrolls back to the top.
  - The file drop zone keeps a real, focusable `<input type="file">`.

## Evidence

- **Contrast:** every text color on every background passes WCAG AA (4.5:1) in both themes. The lowest pair is 4.62:1, muted text on the sunken background in light mode.
- **Layout:** no page scrolls sideways at 390 px.
- **Functional tests** (Playwright on the built site, all 18 checks pass):
  - The counter, live greeting (with `<script>` shown as text), tip toggle, and task list all work.
  - The bundled SVG loads, and PNG, MP3, and MP4 previews work.
  - A renamed text file is rejected, and drag-and-drop works.
  - The skip link reaches `<main>`, and scrolling resets on navigation.
  - All three fonts load from the site itself, and the CSP still blocks injected scripts.
- **Bundle:** the build ships 16 font files (564 KB in total). Browsers only download the subsets a page uses, through `unicode-range`.

[Fontsource](https://fontsource.org/) · [MDN: minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) · [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)
