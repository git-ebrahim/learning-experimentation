---
title: Secure the repository, the workflow, and the site
date: 2026-11-22
status: done
summary: The ways a public repo gets attacked, and one protection for each.
prs: 8
---

## Question

How do I stop other people from changing this public repo, abusing its workflow, or attacking visitors to the site?

## Approach

Work through the real ways a public repo gets attacked, and add one protection for each.

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

## Findings

- **"Secure" means "only the people and processes I trust can change what ships."** For this repo, the risks are other people's code (PRs, npm packages, actions), leaked secrets, and scripts injected into the site.
- **Public repos are read-only to strangers.** They can fork and open PRs, but can't push here. The danger is a PR that changes a workflow so that it runs their code with this repo's permissions. That's why outside contributors' workflows need approval, and why `pull_request_target` is avoided.
- **Pin by SHA, not by tag.** `actions/checkout@v7` points at whatever the owner tags as v7 today. `@3d3c42e…` can never change. Dependabot keeps the pins and their `# v7.0.1` comments up to date.
- **The site has no secrets to steal.** Everything in `web/` ships to every visitor's browser. API keys must never go in frontend code. They belong in the NestJS API's host settings, or GitHub Actions secrets for CI.
- **GitHub Pages can't set HTTP headers,** so the CSP goes in a `<meta>` tag added only to production builds. The dev server needs inline scripts for hot reload. A `<meta>` tag can't set `frame-ancestors` (clickjacking protection), which is one reason to use a host with real headers later.
- **Rulesets apply to admins too.** With no bypass list, even I can't push to `main` directly, which matches this repo's PR-only rule.
- **Turning on SHA pinning enforcement waited until this PR merged.** Turning it on earlier would have broken deploys from `main`, which still used tag pins.
- **Account security is part of repo security:** turn on two-factor authentication (preferably a passkey or security key) and review authorised OAuth apps and SSH keys.

## Evidence

- The build passes with `npm ci --ignore-scripts`, and `npm audit` reports 0 vulnerabilities.
- In the built site, a script injected inline and one loaded from `https://example.com` were both blocked by the CSP. All pages, the bundled image, and `blob:` file previews still work.
- Settings were read back through the GitHub API after applying.

[GitHub: Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) · [GitHub: Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) · [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
