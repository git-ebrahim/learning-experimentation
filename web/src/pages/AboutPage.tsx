import { PageHeader } from '../components/layout.tsx'
import { repositoryUrl } from '../journal/entries.ts'

export function AboutPage() {
  return (
    <div className="container container-narrow">
      <PageHeader
        eyebrow="About"
        title="A small site for learning out loud"
        lede="This site is both the experiment and the notebook. Each idea gets built here, then written up in the journal so anyone can follow the steps."
        journalSlug="react-site-with-nestjs-api"
      />

      <dl className="facts">
        <dt>Interface</dt>
        <dd>React 19 with React Router, written in TypeScript</dd>
        <dt>Build</dt>
        <dd>Vite bundles the app and its fonts into static files</dd>
        <dt>Hosting</dt>
        <dd>GitHub Pages, published by GitHub Actions on every merge to main</dd>
        <dt>Journal</dt>
        <dd>Markdown files in the repository, rendered at build time</dd>
        <dt>Security</dt>
        <dd>
          Protected main branch, pinned actions, Dependabot, CodeQL, and a
          Content Security Policy
        </dd>
        <dt>Next</dt>
        <dd>A NestJS API on its own host, so the site can save and share data</dd>
      </dl>

      <div className="button-row after-facts">
        <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          View the source on GitHub
        </a>
      </div>
    </div>
  )
}
