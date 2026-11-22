import { PageHeader } from '../components/layout.tsx'
import { designVersions, type DesignVersion } from '../design/versions.ts'
import { formatDate } from '../formatDate.ts'
import { repositoryUrl } from '../site.ts'

// A strip of small thumbnails, oldest to newest, so the whole evolution
// reads left to right at a glance.
function EvolutionStrip() {
  const oldestFirst = [...designVersions].reverse()
  return (
    <ol className="evolution" aria-label="Versions from oldest to newest">
      {oldestFirst.map((version) => (
        <li key={version.version}>
          <img
            src={version.screenshots[0].desktop}
            alt=""
            width={1024}
            height={640}
            loading="lazy"
            decoding="async"
          />
          <span className="evolution-label">
            <strong>{version.version}</strong> {version.name}
          </span>
        </li>
      ))}
    </ol>
  )
}

function VersionCard({ version, isCurrent }: { version: DesignVersion; isCurrent: boolean }) {
  return (
    <article className="version" aria-labelledby={`version-${version.version}`}>
      <header className="version-head">
        <span className="version-badge">{version.version}</span>
        <div>
          <h2 id={`version-${version.version}`}>
            {version.name}
            {isCurrent && <span className="version-current">current</span>}
          </h2>
          <div className="entry-meta">
            <time dateTime={version.date}>{formatDate(version.date)}</time>
            {version.issues.map((issue) => (
              <a key={`i${issue}`} href={`${repositoryUrl}/issues/${issue}`} target="_blank" rel="noopener noreferrer">
                Issue #{issue}
              </a>
            ))}
            {version.prs.map((pr) => (
              <a key={`p${pr}`} href={`${repositoryUrl}/pull/${pr}`} target="_blank" rel="noopener noreferrer">
                PR #{pr}
              </a>
            ))}
          </div>
        </div>
      </header>

      <dl className="version-notes">
        <div>
          <dt>What changed</dt>
          <dd>{version.changed}</dd>
        </div>
        <div>
          <dt>Why</dt>
          <dd>{version.why}</dd>
        </div>
        <div>
          <dt>Lesson</dt>
          <dd>{version.lesson}</dd>
        </div>
      </dl>

      {version.screenshots.map((shot) => (
        <figure key={shot.desktop} className="version-shots">
          {shot.label && <figcaption>{shot.label}</figcaption>}
          <div className="version-shots-row">
            <a href={shot.desktop} target="_blank" rel="noopener noreferrer" className="shot shot-desktop">
              <img
                src={shot.desktop}
                alt={`${version.version} ${shot.label ?? version.name} home page on a desktop screen`}
                width={1024}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </a>
            <a href={shot.mobile} target="_blank" rel="noopener noreferrer" className="shot shot-mobile">
              <img
                src={shot.mobile}
                alt={`${version.version} ${shot.label ?? version.name} home page on a phone`}
                width={390}
                height={844}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </figure>
      ))}
    </article>
  )
}

export function DesignHistoryPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="Design history"
        title="How this site has looked"
        lede="Every version of the design, newest first, with the reason it changed and what I learned. Select a screenshot to see it full size."
        journalSlug="design-history"
      />
      <EvolutionStrip />
      <div className="version-list">
        {designVersions.map((version, index) => (
          <VersionCard key={version.version} version={version} isCurrent={index === 0} />
        ))}
      </div>
    </div>
  )
}
