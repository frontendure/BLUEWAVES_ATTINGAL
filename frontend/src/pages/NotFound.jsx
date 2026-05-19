import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-header" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-brand">Back to Home</Link>
      </div>
    </section>
  )
}
