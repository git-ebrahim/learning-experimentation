---
title: Make a page interactive with React state
date: 2026-11-22
status: done
summary: Clicks, typing, toggles, and lists all follow one loop: state, render, event, update.
demo: /interactivity
prs: 5
---

## Question

How does a React page respond to clicks, typing, and forms?

## Approach

`web/src/pages/InteractivityPage.tsx` has four small demos, and the page has an **Interactivity** nav button:
1. **Click events:** a counter with +1, −1, and Reset buttons.
2. **Typing:** a controlled text input that shows a live greeting.
3. **Showing and hiding:** a button that toggles a tip.
4. **Forms and lists:** a task list with add, tick, and remove.

## Findings

- **Every interaction follows one loop.** Keep the value in `useState`, show it in the JSX, and call the setter from an event handler such as `onClick`, `onChange`, or `onSubmit`. React then redraws the component. You don't change the page by hand as you would with `document.querySelector`.
- When the new value depends on the old one, pass a function: `setCount((c) => c + 1)`. This stays correct even when updates happen quickly.
- **Never change state in place.** Build a new array or object, with spreads (`[...tasks, newTask]`), `map`, or `filter`. React only re-renders when it sees a new value.
- Calculate values from state instead of storing them twice. "1 of 2 left to do" comes from filtering the task list.
- A form's `onSubmit` must call `event.preventDefault()`, or the browser reloads the page and state is lost. A form also makes the Enter key work.
- Lists need a stable `key` on each item so React can track which row changed.
- **React escapes text by default.** Typing `<script>alert(1)</script>` shows those characters and doesn't run them. Avoid `dangerouslySetInnerHTML`, which turns that protection off.
- Accessibility basics: each input has a `<label>`, the toggle sets `aria-expanded`, and icon-like buttons get an `aria-label`.
- State lives in memory, so it resets on refresh or when you leave the page. Keeping it needs `localStorage` (this browser only) or the planned NestJS API (shared across devices).

## Evidence

Playwright drove the built site. It clicked +1 twice and −1 once (count 1), typed a `<script>` tag (shown as text), toggled the tip, then added, ticked, and removed tasks. There were no console errors, and the layout fits a 375 px phone width. [React: Adding interactivity](https://react.dev/learn/adding-interactivity)
