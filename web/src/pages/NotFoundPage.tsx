import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>
        That page doesn&apos;t exist. <Link to="/">Go to the home page</Link>.
      </p>
    </section>
  )
}
