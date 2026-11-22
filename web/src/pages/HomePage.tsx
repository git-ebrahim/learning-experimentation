import { Link } from 'react-router'
import { useDocumentTitle } from '../components/useDocumentTitle.ts'
import { BookIcon, CursorIcon, MediaIcon } from '../components/icons.tsx'
import { Timeline } from '../journal/Timeline.tsx'
import { formatDate, journalEntries, repositoryUrl } from '../journal/entries.ts'

const experiments = [
  {
    to: '/interactivity',
    icon: <CursorIcon />,
    title: 'Interactivity',
    description: 'Clicks, typing, toggles, and a task list, all driven by React state.',
  },
  {
    to: '/media',
    icon: <MediaIcon />,
    title: 'Images, audio, and video',
    description: 'Preview PNG, MP3, and MP4 files safely, without uploading anything.',
  },
  {
    to: '/journal',
    icon: <BookIcon />,
    title: 'The journal itself',
    description: 'Markdown files in the repo, rendered as pages at build time.',
  },
]

export function HomePage() {
  useDocumentTitle()
  const done = journalEntries.filter((entry) => entry.status === 'done').length
  const inProgress = journalEntries.filter((entry) => entry.status === 'in-progress').length
  const lastUpdated = journalEntries.map((entry) => entry.date).sort().at(-1)

  return (
    <div className="container">
      <section className="hero">
        <span className="eyebrow eyebrow-dot">Development journal</span>
        <h1 className="hero-title">
          Learning web development <em>in public</em>, one experiment at a time.
        </h1>
        <p className="lede">
          I pick one idea, build it into this site, and write down what worked,
          what didn&apos;t, and how to reproduce it. Every write-up links to the
          working example and the pull request behind it.
        </p>
        <div className="button-row">
          <Link to="/journal" className="btn btn-primary">
            Read the journal
          </Link>
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn">
            View the source
          </a>
        </div>
      </section>

      <dl className="stats">
        <div className="stat">
          <dt>Journal entries</dt>
          <dd>{journalEntries.length}</dd>
        </div>
        <div className="stat">
          <dt>Finished</dt>
          <dd>{done}</dd>
        </div>
        <div className="stat">
          <dt>In progress</dt>
          <dd>{inProgress}</dd>
        </div>
        <div className="stat">
          <dt>Last updated</dt>
          <dd>{lastUpdated ? formatDate(lastUpdated) : '—'}</dd>
        </div>
      </dl>

      <section className="section" aria-labelledby="latest-heading">
        <div className="section-header">
          <h2 id="latest-heading" className="section-title">
            Latest entries
          </h2>
          <Link to="/journal" className="section-link">
            All {journalEntries.length} entries →
          </Link>
        </div>
        <Timeline entries={journalEntries.slice(0, 3)} />
      </section>

      <section className="section" aria-labelledby="experiments-heading">
        <div className="section-header">
          <h2 id="experiments-heading" className="section-title">
            Try the experiments
          </h2>
        </div>
        <div className="card-grid">
          {experiments.map((experiment) => (
            <article key={experiment.to} className="card">
              <span className="card-icon">{experiment.icon}</span>
              <h3>
                <Link to={experiment.to} className="card-link">
                  {experiment.title}
                </Link>
              </h3>
              <p>{experiment.description}</p>
              <span className="card-cta" aria-hidden="true">
                Open →
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
