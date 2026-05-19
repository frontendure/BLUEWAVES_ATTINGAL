import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  ['/', 'Home'],
  ['/programs', 'Programs'],
  ['/membership', 'Membership'],
  ['/gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastYRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const updateFromScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(!menuOpen && y > lastYRef.current && y > 160)
      lastYRef.current = y
      frameRef.current = 0
    }

    const onScroll = () => {
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(updateFromScroll)
    }

    updateFromScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  const navClass = `navbar-custom${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`

  return (
    <header>
      <nav className={navClass} id="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <img
              src="/assets/logo-dark-transp.PNG"
              alt="Blue Waves Logo"
              className="site-logo"
              width="280"
              height="93"
              decoding="async"
            />
          </Link>
          <button
            type="button"
            className="nav-toggler"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen(open => !open)}
          >
            <span className="toggler-icon" aria-hidden="true">
              {menuOpen ? <FiX /> : <FiMenu />}
            </span>
          </button>
          <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
            {navItems.map(([to, label]) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
