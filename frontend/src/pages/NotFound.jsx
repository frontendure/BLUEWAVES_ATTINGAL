import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found-page section-space" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="container not-found-content">
        <h1 className="not-found-code" style={{ fontSize: '6rem', color: 'var(--brand)' }}>404</h1>
        <p className="not-found-copy" style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-brand">Back to Home</Link>
      </div>
    </section>
  )
}
