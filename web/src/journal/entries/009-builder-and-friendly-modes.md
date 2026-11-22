---
title: Give the site its own identity, with two modes
date: 2026-11-22
status: done
summary: A terminal-style Builder look by default, a hand-made Friendly look for everyone else, and a toggle in the header.
demo: /
issues: 18
prs: 21
---

## Question

The editorial design from entry #7 was tidy but anonymous. It could have been anyone's site. How do I make it feel like mine, while still working for people who aren't engineers?

## Approach

1. **Decide in an issue first.** Issue #18 lists four directions (terminal, bold graphic, hand-made, calm minimal) and the decision: **Builder** (terminal) by default, with a toggle to **Friendly** (hand-made).
2. **One switch, many effects.** `web/src/mode/mode.ts` stores the choice as `data-mode` on `<html>` and remembers it in `localStorage`. `main.tsx` applies it before the first render, so the page never flashes the wrong look.
3. **CSS does most of the work.** `index.css` defines one set of variables per mode: colours, fonts, border width, and corner shapes. Components only use the variables. Mode-specific touches sit at the end of the file:
   - **Builder:**
     - Monospace everywhere and a faint dot grid.
     - `./journal`-style navigation.
     - `#` and `##` before headings, and a blinking cursor.
     - A terminal-window hero.
   - **Friendly:**
     - A handwritten headline font (Caveat) with a rounded body font (Nunito).
     - Ruled notebook lines and highlighter marks.
     - Sticky-note cards with tape.
     - Sticker buttons that press down when clicked.
4. **React only where the words change.** A small `useMode()` hook switches the home hero and a few labels (for example "shipped" becomes "Finished").
5. **Portfolio link, no real name.** The site names me only as **@git-ebrahim**, with my GitHub profile in the header, footer, and About page.

## Findings

- **Identity comes from decisions a template wouldn't make:** the prompts, the cursor, tape on the cards, handwriting. Swapping colours alone isn't enough.
- **Data attributes beat class juggling.** `:root[data-mode='friendly']` overrides the variables, so every component restyles itself with no React re-render.
- **Decoration shouldn't be read aloud.** `content: '# ' / ''` adds the `#` before headings while giving screen readers empty alternative text.
- **Wobbly corners need restraint.** Very uneven `border-radius` values make large boxes look broken rather than hand-drawn. Gentle values look sketched.
- **A dashed border style can create borders from nothing.** Setting `border-style` on an element that has no border width draws a default 3 px border. I scoped the dashed style to the elements that already had borders.
- **Fonts only load when used.** Both modes' fonts are bundled, but the browser downloads a font file only when the current mode uses it. So Builder visitors never download the handwriting font.
- **`localStorage` can throw.** Private windows and strict settings block it, so reads and writes sit in `try`/`catch`, and the site falls back to Builder.
- **Doing the thinking in the issue first** turned "make it less generic" into a concrete decision with acceptance criteria, which made it easy to check the result.

## Evidence

- Playwright checks:
  - Builder is the default.
  - The toggle switches to Friendly and sets `aria-pressed` correctly.
  - The choice survives a reload.
  - With `localStorage` blocked, the toggle still works and nothing errors.
  - The GitHub link points to the profile.
  - Caveat and Nunito load in Friendly mode.
- No page scrolls sideways at 390 px in either mode.
- The 17 functional checks from entry #7 still pass. The font check now expects one font family in Builder mode.
- Contrast: every text colour passes WCAG AA in both palettes. The lowest is 5.75:1 in Builder and 4.79:1 in Friendly.
