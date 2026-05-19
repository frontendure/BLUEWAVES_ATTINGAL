import { FiMail, FiMapPin, FiMessageCircle, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <img
                src="/assets/logo-dark-transp.PNG"
                alt="Blue Waves Logo"
                className="site-logo-footer"
                width="280"
                height="93"
                loading="lazy"
                decoding="async"
              />
              <p className="footer-text">Blue Waves brings swimming, coaching, and wellness into one polished aquatic campus built for comfort, cleanliness, and consistent routines.</p>
              <div className="social-icons">
                <a href="https://maps.app.goo.gl/wrqd2AQjrpPMctRj9" target="_blank" rel="noreferrer" aria-label="Open Blue Waves location">
                  <FiMapPin />
                </a>
                <a href="tel:+918090900914" aria-label="Call Blue Waves">
                  <FiPhone />
                </a>
                <a href="mailto:bluewavesattingal@gmail.com" aria-label="Email Blue Waves">
                  <FiMail />
                </a>
                <a href="https://wa.me/918090900914" target="_blank" rel="noreferrer" aria-label="Chat with Blue Waves on WhatsApp">
                  <FiMessageCircle />
                </a>
              </div>
            </div>
            <nav className="footer-col" aria-label="Explore Blue Waves">
              <h5 className="footer-heading">Explore</h5>
              <div className="footer-links">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/programs" className="footer-link">Programs</Link>
                <Link to="/membership" className="footer-link">Membership</Link>
                <Link to="/gallery" className="footer-link">Gallery</Link>
              </div>
            </nav>
            <nav className="footer-col" aria-label="Discover more">
              <h5 className="footer-heading">Discover</h5>
              <div className="footer-links">
                <Link to="/about" className="footer-link">About Us</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
                <Link to="/programs" className="footer-link">Programs</Link>
                <Link to="/membership" className="footer-link">Fees</Link>
              </div>
            </nav>
            <div className="footer-col footer-contact-col">
              <h5 className="footer-heading">Visit Us</h5>
              <div className="footer-contact-list">
                <a
                  href="https://maps.app.goo.gl/wrqd2AQjrpPMctRj9"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-contact-item"
                >
                  <span className="footer-contact-icon" aria-hidden="true"><FiMapPin /></span>
                  <span className="footer-contact-copy">Pwd Rest House Road Tb Junction Attingal, Trivandrum 695101</span>
                </a>
                <a href="tel:+918090900914" className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true"><FiPhone /></span>
                  <span className="footer-contact-copy">+91 8090900914</span>
                </a>
                <a href="mailto:bluewavesattingal@gmail.com" className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true"><FiMail /></span>
                  <span className="footer-contact-copy">bluewavesattingal@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {year} Blue Waves Aquatic Center. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
