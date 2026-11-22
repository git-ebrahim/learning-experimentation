import { PageHeader } from '../components/layout.tsx'
import { githubHandle, profileUrl, repositoryUrl } from '../site.ts'

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
        <dt>Who</dt>
        <dd>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            @{githubHandle}
          </a>{' '}
          on GitHub, where my other projects live
        </dd>
        <dt>Interface</dt>
        <dd>React 19 with React Router, written in TypeScript</dd>
        <dt>Build</dt>
        <dd>Vite bundles the app, its fonts, and its media into static files</dd>
        <dt>Hosting</dt>
        <dd>GitHub Pages, published by GitHub Actions on every merge to main</dd>
        <dt>Journal</dt>
        <dd>Markdown files in the repository, rendered at build time</dd>
        <dt>Security</dt>
        <dd>
          Protected main branch, pinned actions, Dependabot, CodeQL, and a
          Content Security Policy
        </dd>
        <dt>How</dt>
        <dd>Built with help from AI coding tools. I review and merge every change myself.</dd>
        <dt>Next</dt>
        <dd>A NestJS API on its own host, so the site can save and share data</dd>
      </dl>

      <div className="button-row after-facts">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          See my other projects
        </a>
        <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn">
          This site&apos;s source
        </a>
      </div>
    </div>
  )
}
