import { Link } from 'react-router'
import { PageHeader } from '../components/layout.tsx'

export function NotFoundPage() {
  return (
    <div className="container container-narrow">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        lede="That page doesn't exist, or it moved. The journal lists everything on this site."
      />
      <div className="button-row">
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
        <Link to="/journal" className="btn">
          Open the journal
        </Link>
      </div>
    </div>
  )
}
