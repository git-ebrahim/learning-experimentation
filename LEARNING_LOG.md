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

## Show images, MP3, and MP4 files, and understand uploads

- **Status and date** — Done, 2026-11-22.
- **Question** — How does a site show images, audio, and video? Can a GitHub Pages site accept uploads?
- **Approach** — A new **Media** page (`web/src/pages/MediaPage.tsx`) has three parts:
  1. **Bundled media:** an SVG in `web/src/assets/`, imported in code (`import diagramUrl from '../assets/sample-diagram.svg'`).
  2. **Local preview:** a file picker accepts PNG, JPEG, GIF, WebP, MP3, and MP4 up to 50 MB. It checks the file's first bytes (`web/src/media/detectMediaType.ts`), then shows it with `<img>`, `<audio controls>`, or `<video controls>` through `URL.createObjectURL`. Nothing leaves the browser.
  3. **Real uploads:** a short explanation of what a server-backed upload needs.
- **Findings**
  - **Two places for media files:**
    - `src/assets/` plus an `import`: Vite adds a content hash to the file name, so browsers can cache it, and the build fails if the file is missing.
    - `public/`: files are copied as-is and referenced by path. Use this for files that need a fixed name, such as `favicon.svg`.
  - **Keep big media out of Git.** GitHub rejects files over 100 MB, Pages sites have a 1 GB limit, and every version of a binary stays in the repo's history forever. Host video on YouTube, Vimeo, or object storage instead.
  - **GitHub Pages can't receive uploads.** It only serves static files, so there's nowhere to send or save one. The file picker here only previews files on the visitor's own device. Real uploads need the NestJS API plus object storage such as S3 or R2, usually through a short-lived signed URL.
  - **Don't trust the file name or `file.type`.** Both come from the file's extension, so renaming `notes.txt` to `photo.png` fools them. The first bytes ("magic numbers") are harder to fake: PNG starts with `89 50 4E 47`, MP3 with `ID3`, and MP4 has `ftyp` at byte 4. A server must repeat every check, because anyone can bypass browser code.
  - **Free object URLs when you're done.** `URL.createObjectURL` keeps the file in memory until `URL.revokeObjectURL` runs. A `useEffect` cleanup handles that when the preview changes or the page closes.
  - **Leave SVG out of user uploads.** An SVG can contain scripts. It's safe as an `<img>` you wrote yourself, but not as a file a stranger sends you.
  - **Write `alt` text for images,** and use the browser's built-in `controls` for audio and video so they work with a keyboard.
- **Evidence** — Playwright drove the built site at 375 px width:
  - The bundled SVG loads.
  - A real PNG shows as an image, an MP3 header shows an audio player, and an MP4 header shows a video player.
  - A text file renamed `notes.png` is rejected.
  - A file named `<img src=x onerror=alert(1)>.png` shows as plain text.
  - A 51 MB file is rejected with the size limit.
  - There are no console errors.

  [MDN: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications) · [Vite: Static asset handling](https://vite.dev/guide/assets)

## Secure the repository, the workflow, and the site

- **Status and date** — Done, 2026-11-22.
- **Question** — How do I stop other people from changing this public repo, abusing its workflow, or attacking visitors to the site?
- **Approach** — Work through the real ways a public repo gets attacked, and add one protection for each.

  | Risk | Protection | Where |
  | --- | --- | --- |
  | Someone pushes straight to `main`, or rewrites or deletes it | Ruleset **Protect main**: changes need a PR and the `build` check must pass. Force pushes and deletion are blocked, with no bypass. | Settings → Rules |
  | A stranger's PR changes a workflow to steal tokens or mine crypto | First-time and outside contributors' workflows wait for my approval. The token is read-only by default. The workflow uses `pull_request`, never `pull_request_target`. | Settings → Actions; `deploy-pages.yml` |
  | A workflow token is misused | `permissions: {}` at the top, so each job asks only for what it needs. Only the deploy job can write to Pages. `persist-credentials: false` keeps the token out of `.git/config`. | `deploy-pages.yml` |
  | An action's tag is moved to malicious code | Actions are pinned to full commit SHAs, and only GitHub-owned actions are allowed. | `deploy-pages.yml`; Settings → Actions |
  | A malicious or vulnerable npm package | The lockfile with `npm ci`, plus `--ignore-scripts`, so package install scripts never run. `npm audit --audit-level=high` fails the build. Dependabot proposes updates after a 7-day cooldown and sends security fixes straight away. | `deploy-pages.yml`; `.github/dependabot.yml` |
  | A secret gets committed | Secret scanning with push protection blocks the push. `.gitignore` excludes `.env` and key files. | Settings → Code security; `.gitignore` |
  | A bug in my own code | CodeQL default setup scans every PR and push. | Settings → Code security |
  | Injected script runs in visitors' browsers | React escapes text. The production build adds a Content Security Policy `<meta>` that only allows this site's own scripts, styles, and media. | `web/vite.config.ts` |
  | Nowhere to report a problem quietly | `SECURITY.md` plus private vulnerability reporting | Security tab |

- **Findings**
  - **"Secure" means "only the people and processes I trust can change what ships."** For this repo, the risks are other people's code (PRs, npm packages, actions), leaked secrets, and scripts injected into the site.
  - **Public repos are read-only to strangers.** They can fork and open PRs, but can't push here. The danger is a PR that changes a workflow so that it runs their code with this repo's permissions. That's why outside contributors' workflows need approval, and why `pull_request_target` is avoided.
  - **Pin by SHA, not by tag.** `actions/checkout@v7` points at whatever the owner tags as v7 today. `@3d3c42e…` can never change. Dependabot keeps the pins and their `# v7.0.1` comments up to date.
  - **The site has no secrets to steal.** Everything in `web/` ships to every visitor's browser. API keys must never go in frontend code. They belong in the NestJS API's host settings, or GitHub Actions secrets for CI.
  - **GitHub Pages can't set HTTP headers,** so the CSP goes in a `<meta>` tag added only to production builds. The dev server needs inline scripts for hot reload. A `<meta>` tag can't set `frame-ancestors` (clickjacking protection), which is one reason to use a host with real headers later.
  - **Rulesets apply to admins too.** With no bypass list, even I can't push to `main` directly, which matches this repo's PR-only rule.
  - **Turning on SHA pinning enforcement waited until this PR merged.** Turning it on earlier would have broken deploys from `main`, which still used tag pins.
  - **Account security is part of repo security:** turn on two-factor authentication (preferably a passkey or security key) and review authorised OAuth apps and SSH keys.
- **Evidence**
  - The build passes with `npm ci --ignore-scripts`, and `npm audit` reports 0 vulnerabilities.
  - In the built site, a script injected inline and one loaded from `https://example.com` were both blocked by the CSP. All pages, the bundled image, and `blob:` file previews still work.
  - Settings were read back through the GitHub API after applying.

  [GitHub: Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) · [GitHub: Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) · [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

## Template for future entries

- **Status and date** — When the experiment started or was last updated.
- **Question** — What you wanted to understand.
- **Approach** — What you tried, including steps someone else can repeat.
- **Findings** — What you observed, what surprised you, and what you would do differently.
- **Evidence** — Links to code, pull requests, demos, or relevant documentation.
