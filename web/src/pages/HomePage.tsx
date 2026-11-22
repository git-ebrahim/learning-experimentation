import { Link } from 'react-router'
import { BookIcon, CursorIcon, MediaIcon } from '../components/icons.tsx'
import { useDocumentTitle } from '../components/useDocumentTitle.ts'
import { Timeline } from '../journal/Timeline.tsx'
import { formatDate, journalEntries } from '../journal/entries.ts'
import { useMode } from '../mode/mode.ts'
import { githubHandle, profileUrl } from '../site.ts'

const experiments = [
  {
    to: '/interactivity',
    icon: <CursorIcon />,
    title: 'Interactivity',
    builder: 'Clicks, typing, toggles, and a task list, all driven by React state.',
    friendly: 'Buttons, typing, and a to-do list that react as you use them.',
  },
  {
    to: '/media',
    icon: <MediaIcon />,
    title: 'Images, audio, and video',
    builder: 'A bundled chime and diagram, plus safe local previews of PNG, MP3, M4A, and MP4.',
    friendly: 'Play a little chime, then try dropping in your own photo or song.',
  },
  {
    to: '/journal',
    icon: <BookIcon />,
    title: 'The journal itself',
    builder: 'Markdown files in the repo, validated and rendered at build time.',
    friendly: 'Every lesson written down: what I tried, what broke, what worked.',
  },
]

// The default hero: a terminal session. The <h1> is the line that answers
// "whoami", so screen readers still get a real page heading.
function BuilderHero() {
  return (
    <section className="hero">
      <div className="terminal" aria-label="Introduction">
        <div className="terminal-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <em>{githubHandle}@lab: ~</em>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="prompt" aria-hidden="true">
              $
            </span>{' '}
            whoami
          </p>
          <h1 className="hero-title">
            {githubHandle}: learning web development in public, one experiment
            at a time.
          </h1>
          <p className="terminal-line">
            <span className="prompt" aria-hidden="true">
              $
            </span>{' '}
            cat README.md
          </p>
          <p className="lede">
            I pick one idea, build it into this site, and log what worked, what
            broke, and how to reproduce it. Every entry links to a working demo
            and the pull request behind it.
          </p>
          <p className="terminal-line" aria-hidden="true">
            <span className="prompt">$</span> <span className="cursor" />
          </p>
        </div>
      </div>
      <div className="button-row">
        <Link to="/journal" className="btn btn-primary">
          ./read-the-journal
        </Link>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn">
          github.com/{githubHandle}
        </a>
      </div>
    </section>
  )
}

function FriendlyHero() {
  return (
    <section className="hero">
      <span className="eyebrow">Hello there! 👋</span>
      <h1 className="hero-title">
        I&apos;m learning to build websites, and writing down{' '}
        <mark>everything</mark> as I go.
      </h1>
      <p className="lede">
        This is my notebook. Each time I learn something new, I build it into
        this site and explain it in plain words: what I tried, what went wrong,
        and how I fixed it.
      </p>
      <div className="button-row">
        <Link to="/journal" className="btn btn-primary">
          Read my notebook
        </Link>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn">
          See my other projects
        </a>
      </div>
    </section>
  )
}

export function HomePage() {
  useDocumentTitle()
  const { mode } = useMode()
  const done = journalEntries.filter((entry) => entry.status === 'done').length
  const inProgress = journalEntries.filter((entry) => entry.status === 'in-progress').length
  const lastUpdated = journalEntries.map((entry) => entry.date).sort().at(-1)

  return (
    <div className="container">
      {mode === 'builder' ? <BuilderHero /> : <FriendlyHero />}

      <dl className="stats">
        <div className="stat">
          <dt>{mode === 'builder' ? 'entries' : 'Notebook entries'}</dt>
          <dd>{journalEntries.length}</dd>
        </div>
        <div className="stat">
          <dt>{mode === 'builder' ? 'shipped' : 'Finished'}</dt>
          <dd>{done}</dd>
        </div>
        <div className="stat">
          <dt>{mode === 'builder' ? 'in_progress' : 'Still working on'}</dt>
          <dd>{inProgress}</dd>
        </div>
        <div className="stat">
          <dt>{mode === 'builder' ? 'last_commit' : 'Last updated'}</dt>
          <dd>{lastUpdated ? formatDate(lastUpdated) : '—'}</dd>
        </div>
      </dl>

      <section className="section" aria-labelledby="latest-heading">
        <div className="section-header">
          <h2 id="latest-heading" className="section-title">
            {mode === 'builder' ? 'Latest entries' : 'Fresh from the notebook'}
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
            {mode === 'builder' ? 'Run the experiments' : 'Have a play'}
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
              <p>{mode === 'builder' ? experiment.builder : experiment.friendly}</p>
              <span className="card-cta" aria-hidden="true">
                {mode === 'builder' ? 'open →' : 'Try it →'}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
