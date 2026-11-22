# Learning log

Add an entry when an experiment starts. As the work progresses, record the steps someone else could reproduce, the result you observed, and what you would change. Link to relevant code, pull requests, or demos as they become available.

## Build and publish a React site with a NestJS API

**Status** — Planned

**Question** — How do a React frontend and a NestJS API work together when the frontend is published to GitHub Pages and visitors open it from their own devices?

**Milestones**

- [ ] Build a small React page with Vite that fetches and displays data from a NestJS endpoint.
- [ ] Deploy NestJS to a Node.js host and configure the API to allow requests from the GitHub Pages origin.
- [ ] Set Vite’s base path to `/learning-experimentation/` and publish the production build to GitHub Pages via GitHub Actions. [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages)
- [ ] Open the public site in a fresh browser session with the local servers stopped. Confirm that the page and its assets load and that it displays data from the hosted API. Record the verified URL and steps to reproduce.

**Starting point** — GitHub Pages serves the frontend build. NestJS needs a Node.js runtime to handle API requests, so the two parts have separate deployment destinations. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) · [NestJS deployment guide](https://docs.nestjs.com/deployment)

**Findings** — Pending the first implementation and deployment.

**Code and demo** — Add the PR and the verified public URL here.

## Template for future entries

- **Status and date** — When the experiment started or was last updated.
- **Question** — What you wanted to understand.
- **Approach** — What you tried, including steps someone else can repeat.
- **Findings** — What you observed, what surprised you, and what you would do differently.
- **Evidence** — Links to code, pull requests, demos, or relevant documentation.
