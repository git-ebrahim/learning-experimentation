# Learning log

Add an entry when an experiment starts. As the work progresses, record the steps someone else could reproduce, the result you observed, and what you would change. Link to relevant code, pull requests, or demos as they become available.

## Build and publish a React site with a NestJS API

**Status** — In progress (frontend published 2026-11-22)

**Question** — How do a React frontend and a NestJS API work together when the frontend is published to GitHub Pages and visitors open it from their own devices?

**Milestones**

- [ ] Build a small React page with Vite that fetches and displays data from a NestJS endpoint.
- [ ] Deploy NestJS to a Node.js host and configure the API to allow requests from the GitHub Pages origin.
- [x] Set Vite’s base path to `/learning-experimentation/` and publish the production build to GitHub Pages via GitHub Actions. [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages)
- [ ] Open the public site in a fresh browser session with the local servers stopped. Confirm that the page and its assets load and that it displays data from the hosted API. Record the verified URL and steps to reproduce.

**Starting point** — GitHub Pages serves the frontend build. NestJS needs a Node.js runtime to handle API requests, so the two parts have separate deployment destinations. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) · [NestJS deployment guide](https://docs.nestjs.com/deployment)

**Findings**

- 2026-11-22: The React app lives in `web/` so the NestJS API can sit beside it in `api/`. Vite's `base` must be `/learning-experimentation/` because Pages serves a project site from a subpath. Without it, `index.html` loads but its JS and CSS 404. [#2](https://github.com/git-ebrahim/learning-experimentation/pull/2)
- 2026-11-22: `.github/workflows/deploy-pages.yml` builds every PR into `main` and deploys only pushes to `main`. Pages needs Settings → Pages → Source set to **GitHub Actions** before the first deploy. [#3](https://github.com/git-ebrahim/learning-experimentation/pull/3)
- 2026-11-22: "Site not found" right after merging meant the first deploy hadn't finished, or the browser cached the 404. An empty page would still load. A hard refresh after the deploy run went green showed the site.

**Code and demo** — [#2](https://github.com/git-ebrahim/learning-experimentation/pull/2), [#3](https://github.com/git-ebrahim/learning-experimentation/pull/3) · https://git-ebrahim.github.io/learning-experimentation/

## Add navigation buttons between pages

- **Status and date** — Done, 2026-11-22.
- **Question** — How does a single-page React app show different pages, and how do buttons move between them?
- **Approach**
  1. Install React Router: `npm install react-router` in `web/`.
  2. Wrap the app in `<HashRouter>` in `web/src/main.tsx`.
  3. Create one component per page in `web/src/pages/`.
  4. In `web/src/App.tsx`, list the pages once. That list renders both the `<NavLink>` buttons and the `<Route>` entries. A catch-all `path="*"` route shows a "Page not found" page.
  5. Style the links as buttons in `web/src/index.css`. NavLink adds an `active` class to the current page's button.
- **Findings**
  - The browser never loads a new HTML file. React Router watches the URL and swaps which component renders, so moving between pages is instant.
  - **Use links for navigation and buttons for actions.** A `<NavLink>` is an `<a>` tag styled like a button. That keeps keyboard and screen-reader support, open-in-new-tab, and the back button working. Use `<button>` for actions that stay on the page, such as "Add" or "Clear".
  - **GitHub Pages needs HashRouter.** Pages only serves files that exist. With `BrowserRouter`, refreshing `/learning-experimentation/about` asks the server for a file called `about` and gets a 404. With `HashRouter`, the URL is `/learning-experimentation/#/about`. The server only sees the part before `#`, so it always returns `index.html`. A host with rewrite rules (Netlify, Vercel, a NestJS server) can use `BrowserRouter` for cleaner URLs.
  - **Adding a page is two steps:** create the component, then add one entry to the `pages` list in `App.tsx`.
  - External links opened with `target="_blank"` also get `rel="noopener noreferrer"`. This stops the new tab from controlling the original one through `window.opener`.
- **Evidence** — Verified with `vite preview` and headless Chrome. `#/` shows Home, `#/about` shows About, and `#/nope` shows "Page not found". The active button changes on each page. [React Router docs](https://reactrouter.com/)

## Make a page interactive with React state

- **Status and date** — Done, 2026-11-22.
- **Question** — How does a React page respond to clicks, typing, and forms?
- **Approach** — `web/src/pages/InteractivityPage.tsx` has four small demos, and the page has an **Interactivity** nav button:
  1. **Click events:** a counter with +1, −1, and Reset buttons.
  2. **Typing:** a controlled text input that shows a live greeting.
  3. **Showing and hiding:** a button that toggles a tip.
  4. **Forms and lists:** a task list with add, tick, and remove.
- **Findings**
  - **Every interaction follows one loop.** Keep the value in `useState`, show it in the JSX, and call the setter from an event handler such as `onClick`, `onChange`, or `onSubmit`. React then redraws the component. You don't change the page by hand as you would with `document.querySelector`.
  - When the new value depends on the old one, pass a function: `setCount((c) => c + 1)`. This stays correct even when updates happen quickly.
  - **Never change state in place.** Build a new array or object, with spreads (`[...tasks, newTask]`), `map`, or `filter`. React only re-renders when it sees a new value.
  - Calculate values from state instead of storing them twice. "1 of 2 left to do" comes from filtering the task list.
  - A form's `onSubmit` must call `event.preventDefault()`, or the browser reloads the page and state is lost. A form also makes the Enter key work.
  - Lists need a stable `key` on each item so React can track which row changed.
  - **React escapes text by default.** Typing `<script>alert(1)</script>` shows those characters and doesn't run them. Avoid `dangerouslySetInnerHTML`, which turns that protection off.
  - Accessibility basics: each input has a `<label>`, the toggle sets `aria-expanded`, and icon-like buttons get an `aria-label`.
  - State lives in memory, so it resets on refresh or when you leave the page. Keeping it needs `localStorage` (this browser only) or the planned NestJS API (shared across devices).
- **Evidence** — Playwright drove the built site. It clicked +1 twice and −1 once (count 1), typed a `<script>` tag (shown as text), toggled the tip, then added, ticked, and removed tasks. There were no console errors, and the layout fits a 375 px phone width. [React: Adding interactivity](https://react.dev/learn/adding-interactivity)

## Template for future entries

- **Status and date** — When the experiment started or was last updated.
- **Question** — What you wanted to understand.
- **Approach** — What you tried, including steps someone else can repeat.
- **Findings** — What you observed, what surprised you, and what you would do differently.
- **Evidence** — Links to code, pull requests, demos, or relevant documentation.
