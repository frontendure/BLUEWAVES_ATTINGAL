import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ScrollAnimation from '../components/ScrollAnimation'

function HeroSlideshow() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    supabase.from('hero_slides').select('*').eq('is_active', true).order('order_val')
      .then(({ data }) => { if (data?.length) setSlides(data) })
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) {
    return (
      <div className="hero-image-container">
        <img src="/assets/hero-optimized.jpg" alt="Blue Waves Premium Pool" className="hero-image-box" />
      </div>
    )
  }

  return (
    <div className="hero-slideshow">
      {slides.map((s, i) => (
        <div key={s.id} className={`hero-slide${i === current ? ' active' : ''}`}>
          <img src={s.image_url} alt={s.title || 'Blue Waves'} />
          {s.title && <div className="hero-slide-caption"><h3>{s.title}</h3>{s.subtitle && <p>{s.subtitle}</p>}</div>}
        </div>
      ))}
      {slides.length > 1 && (
        <div className="hero-slide-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

const features = [
  { icon: '💧', title: 'Swimming Pool', desc: 'Dive into our state-of-the-art pool with expert coaching for all ages and skill levels — from beginners to competitive swimmers.' },
  { icon: '🧘', title: 'Yoga', desc: 'Find your balance with guided yoga sessions designed to improve flexibility, strength, and mental well-being in a peaceful setting.' },
  { icon: '🎵', title: 'Zumba', desc: 'Get moving with high-energy Zumba classes that combine dance, music, and fitness into a fun, calorie-burning workout for everyone.' },
]

const facilities = [
  { icon: '💧', label: 'Crystal Clear\nWater' }, { icon: '🧪', label: 'Water Testing\nLab' },
  { icon: '🚿', label: 'Hygienic\nChanging Room' }, { icon: '📐', label: 'Large Deck\nArea' },
  { icon: '🔒', label: 'Locker\nFacility' }, { icon: '🚿', label: 'Ample Open\nShower Facility' },
  { icon: '🩹', label: 'First Aid\nAvailable' }, { icon: '👥', label: 'Spectator\nGallery' },
  { icon: '🅿️', label: 'Ample Parking\nFacility' },
]

function ScheduleBoard() {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(new Date())
  if (day === 'Wed') {
    return (
      <div className="premium-box" style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
        <h3>Holiday Today</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Every Wednesday is a scheduled holiday for all Pool, Yoga, and Zumba sessions at Blue Waves.</p>
      </div>
    )
  }
  return (
    <div className="premium-box">
      <h4 className="schedule-title">Today's Available Timings</h4>
      {[
        { icon: '🏊', name: 'Pool Sessions', time: '6:00 AM - 10:30 PM', badge: 'Open' },
        { icon: '🧘', name: 'Yoga', time: 'Morning: 8:10 AM - 9:10 AM\nEvening: 6:45 PM - 7:45 PM' },
        { icon: '🎵', name: 'Zumba', time: 'Morning: 6:30 AM - 7:30 AM\nEvening: 8:30 PM - 9:30 PM' },
      ].map(s => (
        <div key={s.name} className="schedule-block">
          <div className="schedule-block-header">
            <span className="schedule-icon">{s.icon}</span>
            <h5>{s.name}</h5>
          </div>
          <div className="schedule-block-time">{s.time.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
            {s.badge && <span className="badge-open">{s.badge}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <ScrollAnimation className="hero-left">
            <span className="hero-subtitle">Premium Aquatic Club</span>
            <h1 className="hero-title">DIVE INTO<br />EXCELLENCE</h1>
            <p className="hero-text">From expert coaching to relaxing family swims, Blue Waves offers a refined aquatic experience built around performance, wellness, and community.</p>
            <div className="hero-btns">
              <Link to="/programs" className="btn-modern-solid">Explore Programs</Link>
              <Link to="/membership" className="btn-modern-outline">Discover Membership</Link>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={200} className="hero-right">
            <HeroSlideshow />
          </ScrollAnimation>
        </div>
      </section>

      <section className="feature-cards-section">
        <div className="container">
          <div className="feature-cards-grid">
            {features.map((f, i) => (
              <ScrollAnimation key={f.title} delay={i * 100}>
                <div className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space why-section">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <h2>Why Blue Waves?</h2>
              <div className="accent-line"></div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={100}>
            <div className="why-text-grid">
              <p>Blue Waves is a premium facility designed to provide a high-performance aquatic program. Our center features a state-of-the-art racing pool, a dedicated warm-up pool, and a safe toddler pool, ensuring a comprehensive swimming experience for all ages and skill levels.</p>
              <p>The amalgamation of premium infrastructure, superior coaching, and modern techniques makes Blue Waves your one-stop destination to learn swimming and imbibe it as a culture in your daily routine. We strive to establish ourselves as a premier aquatic centre of excellence.</p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={200}>
            <div className="facilities-grid">
              {facilities.map(f => (
                <div key={f.label} className="facility-item hover-lift">
                  <span className="facility-icon">{f.icon}</span>
                  <h6>{f.label.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</h6>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="section-space schedule-section">
        <div className="container">
          <div className="schedule-grid">
            <ScrollAnimation>
              <div className="schedule-left">
                <h2>Today's Sessions</h2>
                <p>Plan your visit. We maintain strict capacity limits to ensure a premium, uncrowded experience for all our members.</p>
                <Link to="/membership" className="btn-brand">Reserve a Lane</Link>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <ScheduleBoard />
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  )
}
