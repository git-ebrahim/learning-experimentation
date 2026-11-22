import { Link } from 'react-router'

export function HomePage() {
  return (
    <section>
      <h1>Learning Experimentation</h1>
      <p>
        A small site for trying web development ideas one step at a time. Each
        page shows one concept, and the repository&apos;s learning log explains
        how it was built.
      </p>
      <p>
        Use the buttons at the top to move between pages. Links inside a page
        work the same way. For example, read more{' '}
        <Link to="/about">about this project</Link>.
      </p>
    </section>
  )
}
