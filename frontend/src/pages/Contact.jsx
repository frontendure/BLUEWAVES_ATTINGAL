import { useState } from 'react'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('https://formspree.io/f/xkoyneob', {
        method: 'POST', body: new FormData(e.target), headers: { Accept: 'application/json' }
      })
      if (res.ok) setSent(true)
      else alert('Something went wrong. Please try again.')
    } catch { alert('Network error.') }
    setSending(false)
  }

  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Connect With Us</h1><p>Our concierge team is available to assist you with membership inquiries, private bookings, and facility tours.</p></div>
      </section>
      <section className="section-space about-story">
        <div className="container">
          <div className="contact-grid">
            <ScrollAnimation delay={100}>
              <div className="contact-info">
                <h3>Get In Touch</h3>
                <p className="text-muted">Whether you are looking to refine your stroke, enroll your child in our academy, or inquire about our executive memberships, we are here to help.</p><br />
                <div className="contact-item"><IconBadge icon={siteIcons.location} className="contact-icon" /><div><h6>Our Location</h6><p><a href="https://maps.app.goo.gl/wrqd2AQjrpPMctRj9" target="_blank" rel="noreferrer">Pwd Rest House Road, Tb Junction Attingal, Trivandrum 695101</a></p></div></div>
                <div className="contact-item"><IconBadge icon={siteIcons.phone} className="contact-icon" /><div><h6>Concierge Desk</h6><p><a href="tel:+918090900914">+91 8090900914</a><br />Mon-Sun: 6am - 10pm</p></div></div>
                <div className="contact-item"><IconBadge icon={siteIcons.email} className="contact-icon" /><div><h6>Email Inquiry</h6><p><a href="mailto:bluewavesattingal@gmail.com">bluewavesattingal@gmail.com</a></p></div></div>
                <a href="https://wa.me/+918090900914" target="_blank" rel="noreferrer" className="whatsapp-btn">
                  <IconBadge icon={siteIcons.chat} className="whatsapp-icon" />
                  <div><strong>Chat on WhatsApp</strong><br /><small>+91 8090900914</small></div>
                </a>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <div className="contact-form-box">
                {!sent ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group"><label>Full Name</label><input type="text" name="name" required /></div>
                      <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
                    </div>
                    <div className="form-group"><label>Subject</label>
                      <select name="subject"><option>Membership Inquiry</option><option>Private Coaching</option><option>Youth Academy</option><option>Other</option></select>
                    </div>
                    <div className="form-group"><label>Your Message</label><textarea name="message" rows="4" required></textarea></div>
                    <button type="submit" className="btn-brand" style={{ width: '100%' }} disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <IconBadge icon={siteIcons.success} className="status-icon" />
                    <h4>Message Sent!</h4>
                    <p className="text-muted">Thank you for reaching out. We'll get back to you soon.</p>
                    <button className="btn-brand" onClick={() => setSent(false)}>Send Another</button>
                  </div>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </div >
      </section >
    </>
  )
}
