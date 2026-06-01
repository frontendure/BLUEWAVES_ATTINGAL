import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

function HeroSlideshow() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let active = true

      ; (async () => {
        try {
          const { supabase } = await import('../lib/supabase')
          const { data } = await supabase.from('hero_slides').select('*').eq('is_active', true).order('order_val')
          if (active && data?.length) {
            setSlides(data)
          }
        } catch {
          // Keep the local hero image as the fast fallback path.
        }
      })()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) {
    return (
      <div className="hero-image-container">
        <img
          src="/assets/hero-optimized.jpg"
          alt="Blue Waves premium pool"
          className="hero-image-box"
          fetchPriority="high"
          decoding="async"
          sizes="(max-width: 1080px) 100vw, 46vw"
        />
      </div>
    )
  }

  return (
    <div className="hero-slideshow">
      {slides.map((s, i) => (
        <div key={s.id} className={`hero-slide${i === current ? ' active' : ''}`}>
          <img
            src={s.image_url}
            alt={s.title || 'Blue Waves'}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            sizes="(max-width: 1080px) 100vw, 46vw"
          />
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
  { icon: siteIcons.pool, title: 'Swimming Pool', desc: 'Dive into our state-of-the-art pool with expert coaching for all ages and skill levels — from beginners to competitive swimmers.' },
  { icon: siteIcons.yoga, title: 'Yoga', desc: 'Find your balance with guided yoga sessions designed to improve flexibility, strength, and mental well-being in a peaceful setting.' },
  { icon: siteIcons.zumba, title: 'Zumba', desc: 'Get moving with high-energy Zumba classes that combine dance, music, and fitness into a fun, calorie-burning workout for everyone.' },
]

const facilities = [
  { icon: siteIcons.water, label: 'Crystal Clear\nWater' }, { icon: siteIcons.lab, label: 'Water Testing\nLab' },
  { icon: siteIcons.changing, label: 'Hygienic\nChanging Room' }, { icon: siteIcons.deck, label: 'Large Deck\nArea' },
  { icon: siteIcons.locker, label: 'Locker\nFacility' }, { icon: siteIcons.shower, label: 'Ample Open\nShower Facility' },
  { icon: siteIcons.firstAid, label: 'First Aid\nAvailable' }, { icon: siteIcons.spectators, label: 'Spectator\nGallery' },
  { icon: siteIcons.parking, label: 'Ample Parking\nFacility' },
]

const heroPoints = [
  'Structured swim coaching for all levels',
  'Yoga and zumba built into the same routine',
  'Cleaner, calmer pool experience for families',
]

const dailySchedule = [
  { icon: siteIcons.pool, name: 'Pool Sessions', time: '6:00 AM - 10:30 PM', badge: 'Open' },
  { icon: siteIcons.yoga, name: 'Yoga', time: 'Morning: 8:10 AM - 9:10 AM\nEvening: 6:45 PM - 7:45 PM' },
  { icon: siteIcons.zumba, name: 'Zumba', time: 'Morning: 6:30 AM - 7:30 AM\nEvening: 8:30 PM - 9:30 PM' },
]

function ScheduleBoard() {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(new Date())

  const now = new Date()
  const kolkataDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const hour = kolkataDate.getHours()
  const minute = kolkataDate.getMinutes()
  const totalMinutes = hour * 60 + minute
  const isPoolOpen = totalMinutes >= (6 * 60) && totalMinutes < (22 * 60 + 30)

  let displayedSchedule = dailySchedule.map(s => {
    if (s.name === 'Pool Sessions') {
      return { ...s, badge: isPoolOpen ? 'Open' : 'Closed' }
    }
    return { ...s }
  })

  if (day === 'Wed') {
    displayedSchedule = displayedSchedule.map(s => ({
      ...s,
      time: 'Holiday',
      badge: null
    }))
  } else if (day === 'Sun') {
    displayedSchedule = displayedSchedule.map(s => {
      if (s.name === 'Yoga' || s.name === 'Zumba') {
        return { ...s, time: 'Holiday', badge: null }
      }
      return s
    })
  }

  return (
    <div className="premium-box">
      <h4 className="schedule-title">Today's Available Timings</h4>
      {displayedSchedule.map(s => (
        <div key={s.name} className="schedule-block">
          <div className="schedule-block-header">
            <IconBadge icon={s.icon} className="schedule-icon" />
            <h5>{s.name}</h5>
          </div>
          <div className="schedule-block-time">
            {s.time.split('\n').map((l, i) => (
              l === 'Holiday' ? <span key={i} className="badge-holiday">{l}</span> : <span key={i}>{l}<br /></span>
            ))}
            {s.badge && <span className={s.badge === 'Closed' ? 'badge-holiday' : 'badge-open'}>{s.badge}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
function AnnouncementBanner() {
  const [banner, setBanner] = useState(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          const { supabase } = await import('../lib/supabase')
          const { data } = await supabase.from('home_banners').select('*').eq('is_active', true).limit(1)
          if (active && data?.length) {
            setBanner(data[0])
          }
        } catch {
          // Handle gracefully
        }
      })()
    return () => { active = false }
  }, [])

  if (!banner || !isVisible) return null

  return createPortal(
    <div className="home-announcement-banner">
      <button className="banner-close-btn" onClick={() => setIsVisible(false)} aria-label="Close announcement">
        ✕
      </button>
      <div className="announcement-content">
        <h3 className="banner-heading">{banner.heading}</h3>
        {banner.subheading && <p className="banner-subheading">{banner.subheading}</p>}
        {banner.content && (
          <ul className="banner-body-list">
            {banner.content.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
              <li key={idx}>
                <span className="bullet-icon">•</span>
                <span>{line.trim()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  )
}

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-left">
            <div className="hero-copy-top">
              <span className="hero-subtitle">Premium Aquatic Club</span>
              <span className="hero-chip">Attingal, Kerala</span>
            </div>
            <h1 className="hero-title">
              <span className="hero-title-line">Create</span>
              <span className="hero-title-line">your own</span>
              <span className="hero-title-wave">waves</span>
            </h1>
            <p className="hero-text">Blue Waves combines swim coaching, family sessions, yoga, and zumba in one polished campus designed for comfort, hygiene, and repeatable daily routines.</p>
            <div className="hero-btns">
              <Link to="/programs" className="btn-modern-solid">Explore Programs</Link>
              <Link to="/membership" className="btn-modern-outline">Discover Membership</Link>
            </div>
            <div className="hero-metrics">
              {heroPoints.map(point => (
                <div key={point} className="hero-metric">{point}</div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-visual">
              <HeroSlideshow />
              <div className="hero-badge hero-badge-top">Clean water system • safer deck flow</div>
              <div className="hero-badge hero-badge-bottom">
                <strong>Open daily programming</strong>
                <span>Swimming, yoga, and zumba schedules built for consistency.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-cards-section">
        <div className="container">
          <div className="feature-cards-grid">
            {features.map((f, i) => (
              <ScrollAnimation key={f.title} delay={i * 100}>
                <div className="feature-card">
                  <IconBadge icon={f.icon} className="feature-icon" />
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
              <span className="section-label">Why Families Return</span>
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
                  <IconBadge icon={f.icon} className="facility-icon" />
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
                <span className="section-label">Plan Your Visit</span>
                <h2>Today's Sessions</h2>
                <p>Plan your visit. We maintain strict capacity limits to ensure a premium, uncrowded experience for all our members.</p>
                <div className="schedule-points">
                  <span>Morning to night session windows</span>
                  <span>Wednesday holiday across programs</span>
                  <span>Membership and public access options</span>
                </div>
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
