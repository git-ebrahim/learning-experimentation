---
title: Add navigation buttons between pages
date: 2026-11-22
status: done
summary: Move between pages with React Router, and why GitHub Pages needs HashRouter.
demo: /about
prs: 4
---

## Question

How does a single-page React app show different pages, and how do buttons move between them?

## Approach

1. Install React Router: `npm install react-router` in `web/`.
2. Wrap the app in `<HashRouter>` in `web/src/main.tsx`.
3. Create one component per page in `web/src/pages/`.
4. In `web/src/App.tsx`, list the pages once. That list renders both the `<NavLink>` buttons and the `<Route>` entries. A catch-all `path="*"` route shows a "Page not found" page.
5. Style the links as buttons in `web/src/index.css`. NavLink adds an `active` class to the current page's button.

## Findings

- The browser never loads a new HTML file. React Router watches the URL and swaps which component renders, so moving between pages is instant.
- **Use links for navigation and buttons for actions.** A `<NavLink>` is an `<a>` tag styled like a button. That keeps keyboard and screen-reader support, open-in-new-tab, and the back button working. Use `<button>` for actions that stay on the page, such as "Add" or "Clear".
- **GitHub Pages needs HashRouter.** Pages only serves files that exist. With `BrowserRouter`, refreshing `/learning-experimentation/about` asks the server for a file called `about` and gets a 404. With `HashRouter`, the URL is `/learning-experimentation/#/about`. The server only sees the part before `#`, so it always returns `index.html`. A host with rewrite rules (Netlify, Vercel, a NestJS server) can use `BrowserRouter` for cleaner URLs.
- **Adding a page is two steps:** create the component, then add one entry to the `pages` list in `App.tsx`.
- External links opened with `target="_blank"` also get `rel="noopener noreferrer"`. This stops the new tab from controlling the original one through `window.opener`.

## Evidence

Verified with `vite preview` and headless Chrome. `#/` shows Home, `#/about` shows About, and `#/nope` shows "Page not found". The active button changes on each page. [React Router docs](https://reactrouter.com/)
