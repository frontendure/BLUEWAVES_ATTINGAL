import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      if (y > lastY && y > 100) setHidden(true)
      else setHidden(false)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  const navClass = `navbar-custom${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`

  const close = () => setMenuOpen(false)

  return (
    <header>
      <nav className={navClass} id="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <img src="/assets/logo-dark-transp.PNG" alt="Blue Waves Logo" className="site-logo" />
          </Link>
          <button className="nav-toggler" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="toggler-icon">☰</span>
          </button>
          <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
            {[
              ['/', 'Home'],
              ['/programs', 'Programs'],
              ['/membership', 'Membership'],
              ['/gallery', 'Gallery'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to} className="nav-item">
                <NavLink to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={close} end={to === '/'}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
