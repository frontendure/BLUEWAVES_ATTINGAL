import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-header not-found-page">
      <div className="container not-found-content">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-copy">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-brand">Back to Home</Link>
      </div>
    </section>
  )
}
