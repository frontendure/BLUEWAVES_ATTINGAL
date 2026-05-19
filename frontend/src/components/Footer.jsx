import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/assets/logo-dark-transp.PNG" alt="Blue Waves Logo" className="site-logo-footer" />
            <p className="footer-text">Redefining aquatic wellness with state-of-the-art facilities and elite coaching for the discerning swimmer.</p>
            <div className="social-icons">
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Explore</h5>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/programs" className="footer-link">Programs</Link>
            <Link to="/membership" className="footer-link">Membership</Link>
            <Link to="/gallery" className="footer-link">Gallery</Link>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Information</h5>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Contact</h5>
            <p className="footer-text"><a href="https://maps.app.goo.gl/wrqd2AQjrpPMctRj9" target="_blank" rel="noreferrer">Pwd Rest House Road Tb Junction Attingal, Trivandrum 695101</a></p>
            <p className="footer-text"><a href="tel:+918090900914">+91 8090900914</a></p>
            <p className="footer-text"><a href="mailto:bluewavesattingal@gmail.com">bluewavesattingal@gmail.com</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Blue Waves Aquatic Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
