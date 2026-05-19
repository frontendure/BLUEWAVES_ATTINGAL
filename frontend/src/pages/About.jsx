import ScrollAnimation from '../components/ScrollAnimation'

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Our Philosophy</h1><p>Elevating the art of swimming through unparalleled facilities and elite coaching methodologies.</p></div>
      </section>
      <section className="section-space about-story">
        <div className="container">
          <div className="about-grid">
            <ScrollAnimation delay={100} className="about-text">
              <h2>A Legacy of Excellence in the Water</h2>
              <p>Founded in 2018, Blue Waves was established with a singular vision: to create a sanctuary where the pursuit of athletic excellence meets the tranquility of a premium retreat. We observed that traditional swimming pools were often crowded, noisy, and lacked personalized attention.</p>
              <p>Today, we are proud to offer an exclusive environment featuring Olympic-grade water filtration, acoustically treated halls, and a roster of coaches who have competed at the highest levels. Whether you are seeking a competitive edge or a serene escape, Blue Waves is your ultimate aquatic destination.</p>
            </ScrollAnimation>
            <ScrollAnimation delay={200} className="about-image">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="About Us" />
            </ScrollAnimation>
          </div>
        </div>
      </section>
      <section className="section-space coaches-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollAnimation>
            <span className="section-label">The Masters</span>
            <h2>Meet Our Elite Coaches</h2>
            <p className="text-muted">Learn from professionals who have mastered the art and science of swimming.</p>
          </ScrollAnimation>
          <div className="coaches-grid">
            {[
              { name: 'Sarah Jenkins', role: 'Head Coach / Former Olympian', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
              { name: 'Michael Torres', role: 'Triathlon Specialist', img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80' },
              { name: 'Elena Rostova', role: 'Youth Academy Director', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
            ].map((c, i) => (
              <ScrollAnimation key={c.name} delay={(i + 1) * 100}>
                <div className="coach-card">
                  <img src={c.img} alt={c.name} className="coach-img" />
                  <h5>{c.name}</h5>
                  <p className="coach-role">{c.role}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
