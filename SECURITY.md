# Security policy

## Reporting a vulnerability

Please report security problems privately. Don't open a public issue.

1. Go to the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Describe the problem, the steps to reproduce it, and its impact.

You'll get a reply within a week. Please give a reasonable amount of time to fix the problem before you share it publicly.

## Scope

- The site published at https://git-ebrahim.github.io/learning-experimentation/
- The code and GitHub Actions workflows in this repository

## How the repository is protected

- `main` only changes through pull requests that pass the build check. Force pushes and branch deletion are blocked.
- GitHub Actions run with read-only permissions by default. Each job asks for only what it needs, and actions are pinned to commit SHAs.
- Workflows from first-time and outside contributors' pull requests wait for maintainer approval before they run.
- Dependabot, secret scanning with push protection, and CodeQL code scanning are on.
- The site is static. It has no server, database, or secrets. A Content Security Policy limits it to loading its own scripts.
