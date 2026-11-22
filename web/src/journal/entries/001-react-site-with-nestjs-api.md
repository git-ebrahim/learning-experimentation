---
title: Build and publish a React site with a NestJS API
date: 2026-11-22
status: in-progress
summary: Plan for a React site on GitHub Pages that talks to a NestJS API, and what publishing the frontend taught me.
demo: /
prs: 2,3
---

## Question

How do a React frontend and a NestJS API work together when the frontend is published to GitHub Pages and visitors open it from their own devices?

## Milestones

- [ ] Build a small React page with Vite that fetches and displays data from a NestJS endpoint.
- [ ] Deploy NestJS to a Node.js host and configure the API to allow requests from the GitHub Pages origin.
- [x] Set Vite’s base path to `/learning-experimentation/` and publish the production build to GitHub Pages via GitHub Actions. [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages)
- [ ] Open the public site in a fresh browser session with the local servers stopped. Confirm that the page and its assets load and that it displays data from the hosted API. Record the verified URL and steps to reproduce.

## Starting point

GitHub Pages serves the frontend build. NestJS needs a Node.js runtime to handle API requests, so the two parts have separate deployment destinations. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) · [NestJS deployment guide](https://docs.nestjs.com/deployment)

## Findings

- 2026-11-22: The React app lives in `web/` so the NestJS API can sit beside it in `api/`. Vite's `base` must be `/learning-experimentation/` because Pages serves a project site from a subpath. Without it, `index.html` loads but its JS and CSS 404. [#2](https://github.com/git-ebrahim/learning-experimentation/pull/2)
- 2026-11-22: `.github/workflows/deploy-pages.yml` builds every PR into `main` and deploys only pushes to `main`. Pages needs Settings → Pages → Source set to **GitHub Actions** before the first deploy. [#3](https://github.com/git-ebrahim/learning-experimentation/pull/3)
- 2026-11-22: "Site not found" right after merging meant the first deploy hadn't finished, or the browser cached the 404. An empty page would still load. A hard refresh after the deploy run went green showed the site.

## Code and demo

[#2](https://github.com/git-ebrahim/learning-experimentation/pull/2), [#3](https://github.com/git-ebrahim/learning-experimentation/pull/3) · https://git-ebrahim.github.io/learning-experimentation/
