import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

/* ── Supabase image transform helpers ── */
function thumbUrl(originalUrl, width = 600, quality = 75) {
  if (!originalUrl) return ''
  try {
    const u = new URL(originalUrl)
    if (u.pathname.includes('/storage/v1/object/public/')) {
      u.searchParams.set('width', width)
      u.searchParams.set('quality', quality)
      return u.toString()
    }
  } catch { /* not a valid URL */ }
  return originalUrl
}

function fullUrl(originalUrl, quality = 90) {
  if (!originalUrl) return ''
  try {
    const u = new URL(originalUrl)
    if (u.pathname.includes('/storage/v1/object/public/')) {
      u.searchParams.set('quality', quality)
      return u.toString()
    }
  } catch { /* return as-is */ }
  return originalUrl
}

/* ── Gallery Image Component with Lazy Loading & Skeleton ── */
const GalleryImage = memo(function GalleryImage({ src, alt, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  return (
    <div className={`gallery-item ${loaded ? 'gallery-item--loaded' : ''}`} onClick={onClick}>
      {!loaded && <div className="gallery-skeleton" />}
      <img
        ref={imgRef}
        src={thumbUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
})

/* ── Lightbox adjacent image preloader ── */
function useLightboxPreload(images, currentIndex) {
  useEffect(() => {
    if (currentIndex === null || !images.length) return
    const preloadIndices = [
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ]
    const preloaders = preloadIndices.map(idx => {
      const img = new Image()
      img.src = fullUrl(images[idx]?.url)
      return img
    })
    return () => {
      preloaders.forEach(img => { img.src = '' })
    }
  }, [currentIndex, images])
}

/* ── Feature Detail Gallery Carousel (Gallery-page style) ── */
const FeatureGalleryCarousel = ({ images, openLightbox }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1)
      else if (window.innerWidth < 1024) setItemsPerView(2)
      else setItemsPerView(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const total = images.length
  const isCarouselable = total > itemsPerView

  const nextSlide = useCallback(() => {
    if (!isCarouselable || currentIndex >= total) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + 1)
  }, [isCarouselable, currentIndex, total])

  const prevSlide = useCallback(() => {
    if (!isCarouselable || currentIndex <= -1) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev - 1)
  }, [isCarouselable, currentIndex])

  useEffect(() => {
    if (isExpanded || !isCarouselable) return
    let timer
    if (!isHovered) {
      timer = setInterval(nextSlide, 5000)
    }
    return () => clearInterval(timer)
  }, [isHovered, isExpanded, nextSlide, isCarouselable])

  useEffect(() => {
    if (!isTransitioning) return
    if (currentIndex >= total) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 500)
      return () => clearTimeout(timeout)
    }
    if (currentIndex <= -1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(total - 1)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, total, isTransitioning])

  if (total === 0) return null

  if (isExpanded || !isCarouselable) {
    return (
      <div className="gallery-expanded-view">
        <div className="gallery-grid">
          {images.map(img => (
            <GalleryImage key={img.id} src={img.url} alt={img.alt || 'Gallery'} onClick={() => openLightbox(img.id)} />
          ))}
        </div>
        <div className="gallery-show-more" style={{ marginTop: '2rem' }}>
          {isCarouselable && (
            <button className="btn-modern-outline" onClick={() => setIsExpanded(false)}>Show Less</button>
          )}
        </div>
      </div>
    )
  }

  const leftClones = images.slice(-itemsPerView).map(item => ({ ...item, cloneId: `lc-${item.id}` }))
  const rightClones = images.slice(0, itemsPerView).map(item => ({ ...item, cloneId: `rc-${item.id}` }))
  const trackItems = [...leftClones, ...images, ...rightClones]
  const translateX = -(currentIndex + itemsPerView) * (100 / itemsPerView)

  return (
    <div className="gallery-carousel-wrapper"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onTouchStart={() => setIsHovered(true)}
         onTouchEnd={() => setIsHovered(false)}>

      <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      <div className="carousel-track-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {trackItems.map((item) => (
            <div className="carousel-slide" key={item.cloneId || item.id} style={{ flex: `0 0 ${100 / itemsPerView}%` }}>
              <div style={{ padding: '0 10px', height: '100%', boxSizing: 'border-box' }}>
                <GalleryImage src={item.url} alt={item.alt || 'Gallery'} onClick={() => openLightbox(item.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-nav next" onClick={nextSlide} aria-label="Next image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      <div className="gallery-show-more">
        <button className="btn-modern-outline" onClick={() => setIsExpanded(true)}>Show More</button>
      </div>
    </div>
  )
}

/* ── 3D Flip Card Component ── */
const InfoFlipCard = ({ data, displayTimings, displayFees, badgeClass, featureKey }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [autoFlipEnabled, setAutoFlipEnabled] = useState(true)
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!autoFlipEnabled) return
    
    timerRef.current = setInterval(() => {
      setIsFlipped(prev => !prev)
    }, 15000) // 15 seconds to give plenty of time to read
  }, [autoFlipEnabled])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const handleInteraction = () => {
    setIsFlipped(prev => !prev)
    // Disable auto-flip once the user manually interacts
    setAutoFlipEnabled(false)
  }

  const flipIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.29 7 12 12 20.71 7"></polyline>
      <line x1="12" y1="22" x2="12" y2="12"></line>
    </svg>
  )

  return (
    <div 
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={handleInteraction}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction() }}
    >
      <div className="flip-card-inner">
        {/* Front Side: Timings */}
        <div className="flip-card-front premium-box detail-card">
          <h4 className="detail-card-title">
            <IconBadge icon={siteIcons.calendar} className="title-icon" />
            <span>Session Timings</span>
          </h4>
          <div className="detail-timing-list">
            {displayTimings.map((s, i) => (
              <div key={i} className="detail-timing-row">
                <span className="detail-timing-time">{s.time}</span>
                <span className={`detail-timing-badge ${badgeClass(s.badge)}`}>{s.label}</span>
              </div>
            ))}
          </div>
          {data.timingNotes && <p className="detail-card-note">{data.timingNotes}</p>}
          <div className="flip-indicator">
            {flipIcon} Click to view Fee Structure
          </div>
        </div>

        {/* Back Side: Fees */}
        <div className="flip-card-back premium-box detail-card">
          <h4 className="detail-card-title">
            <IconBadge icon={siteIcons.fees} className="title-icon" />
            <span>Fee Structure</span>
          </h4>
          {featureKey === 'mini-hall' ? (
            <div className="detail-custom-fees">
              <p>{data.feeNotes}</p>
            </div>
          ) : (
            <>
              <div className="detail-fee-list">
                {displayFees.map((f, i) => (
                  <div key={i} className={`detail-fee-row${f.highlight ? ' highlight' : ''}${f.accent ? ' accent' : ''}`}>
                    <span className="detail-fee-name">{f.name}</span>
                    <span className="detail-fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                  </div>
                ))}
              </div>
              {data.feeNotes && <p className="detail-card-note" style={{ marginTop: '1rem' }}>{data.feeNotes}</p>}
            </>
          )}
          <div className="flip-indicator">
            {flipIcon} Click to view Session Timings
          </div>
        </div>
      </div>
    </div>
  )
}


/* ── Static Feature Details Map ── */
const FEATURE_DATA = {
  'swimming-pool': {
    title: 'Swimming Pool Academy',
    subtitle: 'Dive into our state-of-the-art pool with expert coaching for all ages.',
    category: 'pool-area',
    dbProgramCat: 'pool',
    dbFeeCat: ['swimming_coaching', 'swimming_public'],
    description: 'BLUEWAVES features a state-of-the-art swimming pool with a dedicated toddler pool. We maintain strict hygiene protocols and advanced water-testing. Our certified coaches provide structured training for beginners, fitness enthusiasts, and competitive swimmers of all age groups.',
    highlights: [
      { icon: siteIcons.clean, title: 'Crystal Clear Water', desc: 'Continuous filtration and daily chemical balance testing for ultimate hygiene.' },
      { icon: siteIcons.coaching, title: 'Professional Coaching', desc: 'Structured swim training programs led by certified coaches.' },
      { icon: siteIcons.wellness, title: 'Flexible Timing Batches', desc: 'Classes spanning morning and evening hours, including Ladies Only slots.' },
      { icon: siteIcons.facilities, title: 'Modern Infrastructure', desc: 'Hygienic changing rooms, secure locker facilities, and a grand spectator gallery.' }
    ],
    timingNotes: 'Pool sessions are open daily. Every Wednesday is a holiday across all programs.',
    feeNotes: 'Admission fees of ₹500 apply for first-month memberships.',
    whatsAppMsg: 'Hello! I would like to enquire about Swimming Pool memberships and coaching schedules.'
  },
  'yoga': {
    title: 'Yoga & Mindfulness Studio',
    subtitle: 'Find your inner balance and rejuvenate your mind and body.',
    category: 'yoga',
    dbProgramCat: 'yoga',
    dbFeeCat: ['wellness'],
    description: 'Step into a serene studio space away from the noise. Our yoga classes focus on physical postures (asanas), breathing control (pranayama), and meditation. Re-align your posture, build core strength, and ease mental stress under the guidance of expert instructors.',
    highlights: [
      { icon: siteIcons.wellness, title: 'Mind & Body Balance', desc: 'Strengthen muscles, increase flexibility, and improve mental focus.' },
      { icon: siteIcons.coaching, title: 'Expert Yoga Gurus', desc: 'Personalized corrections and guidance for practitioner levels.' },
      { icon: siteIcons.facilities, title: 'Calm Studio Space', desc: 'Quiet, clutter-free campus ambiance optimized for deep meditation.' },
      { icon: siteIcons.calendar, title: 'Routine Consistency', desc: 'Dedicated morning and evening schedules that easily fit your day.' }
    ],
    timingNotes: 'Yoga classes are conducted from Thursday to Tuesday. Sunday is a holiday for wellness classes.',
    feeNotes: 'Monthly fee packages with ₹500 one-time admission for new members.',
    whatsAppMsg: 'Hello! I am interested in joining your Yoga classes. Could you please share the registration details?'
  },
  'zumba': {
    title: 'Zumba Fitness Party',
    subtitle: 'High-energy dance workouts that combine fun and calorie burning.',
    category: 'zumba',
    dbProgramCat: 'zumba',
    dbFeeCat: ['wellness'],
    description: 'Zumba combines high-energy international music with coordinated dance movements. It is an exhilarating, cardio-burning workout that feels more like a dance party than a workout. Led by licensed Zumba instructors, these classes boost stamina and release endorphins.',
    highlights: [
      { icon: siteIcons.zumba, title: 'Aerobic Dance Workout', desc: 'Tone muscles, burn calories, and build stamina through upbeat dance steps.' },
      { icon: siteIcons.wellness, title: 'High-Energy Music', desc: 'Fast-paced Latin, pop, and fusion rhythms to keep the adrenaline pumping.' },
      { icon: siteIcons.coaching, title: 'Certified Instructors', desc: 'Certified trainers who keep every class energetic and engaging.' },
      { icon: siteIcons.spectators, title: 'Community Motivation', desc: 'Work out alongside supportive friends in an exciting group setup.' }
    ],
    timingNotes: 'Zumba classes run Thursday to Tuesday. Class schedules are closed on Wednesdays and Sundays.',
    feeNotes: 'Monthly subscription. One-time admission fee of ₹500 is applicable for new registrations.',
    whatsAppMsg: 'Hello! I want to join the Zumba classes at BLUEWAVES. Please provide availability and fees.'
  },
  'mini-hall': {
    title: 'Modern Event Mini Hall',
    subtitle: 'Premium event space with elegant seating and luxury setups.',
    category: 'mini-hall',
    dbProgramCat: null,
    dbFeeCat: null,
    description: 'Our luxurious Mini Hall provides a premium air-conditioned event space with a seating capacity of 250–300 guests. Complete with stage setups, audio/visual support, and decoration coordination, it is the perfect venue for hosting engagements, birthday parties, corporate workshops, and intimate family gatherings.',
    highlights: [
      { icon: siteIcons.spectators, title: '250–300 Capacity', desc: 'Spacious and flexible seating options designed for functions and meetings.' },
      { icon: siteIcons.changing, title: 'Fully Air-Conditioned', desc: 'Premium climate-controlled atmosphere keeping your guests comfortable.' },
      { icon: siteIcons.locker, title: 'AV & Sound Systems', desc: 'Integrated high-fidelity audio system and microphone support for programs.' },
      { icon: siteIcons.parking, title: 'Ample Guest Parking', desc: 'Convenient, secure parking area capable of handling guest vehicles.' },
      { icon: siteIcons.facilities, title: 'Stage & Decoration Support', desc: 'Dedicated stage area with customizable decoration and theme support.' },
      { icon: siteIcons.calendar, title: 'Diverse Event Types', desc: 'Suitable for engagements, birthday parties, cultural programs, and workshops.' }
    ],
    timingNotes: 'Available daily by booking. Reservations must be made at least 1–2 weeks in advance.',
    feeNotes: 'Booking rates are custom-tailored depending on duration, guest count, and selected catering/decor options. Starts from ₹10,000. Contact our front desk for custom quotes.',
    whatsAppMsg: 'Hello! I would like to check the availability and booking rates of your Mini Hall for an upcoming event.'
  }
}

export default function FeatureDetail({ featureKey }) {
  const data = FEATURE_DATA[featureKey]
  const [images, setImages] = useState([])
  const [timings, setTimings] = useState([])
  const [fees, setFees] = useState([])
  
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)

  // Fetch Category Gallery
  useEffect(() => {
    setLoadingGallery(true)
    let active = true

    supabase.from('gallery')
      .select('*')
      .eq('category', data.category)
      .order('order_val')
      .then(({ data: imgData }) => {
        if (active) {
          setImages(imgData || [])
          setLoadingGallery(false)
        }
      })
      .catch(() => {
        if (active) setLoadingGallery(false)
      })

    return () => { active = false }
  }, [data.category])

  // Fetch Program Timings
  useEffect(() => {
    if (!data.dbProgramCat) {
      setTimings([])
      return
    }
    let active = true

    supabase.from('programs')
      .select('*')
      .eq('category', data.dbProgramCat)
      .order('order_val')
      .then(({ data: progData }) => {
        if (active && progData?.length) {
          setTimings(progData.map(d => ({
            time: d.time_range,
            label: d.label,
            badge: d.badge_type
          })))
        }
      })
      .catch(() => { /* use empty timing lists (fallbacks handled in render) */ })

    return () => { active = false }
  }, [data.dbProgramCat])

  // Fetch Membership Fees
  useEffect(() => {
    if (!data.dbFeeCat) {
      setFees([])
      return
    }
    let active = true

    supabase.from('membership_fees')
      .select('*')
      .order('order_val')
      .then(({ data: feeData }) => {
        if (!active || !feeData?.length) return
        
        // Filter fees matching category names
        const filtered = feeData.filter(f => data.dbFeeCat.includes(f.category))
        setFees(filtered.map(d => ({
          name: d.name,
          price: d.price,
          note: d.note,
          highlight: d.name.toLowerCase().includes('advanced'),
          accent: d.name.toLowerCase().includes('personal') || d.name.toLowerCase().includes('pass')
        })))
      })
      .catch(() => { /* fallbacks handled in render */ })

    return () => { active = false }
  }, [data.dbFeeCat])

  // Fallbacks for display if Supabase is offline/empty
  const getFallbackTimings = () => {
    if (featureKey === 'swimming-pool') {
      return [
        { time: '6:00 AM - 7:00 AM', label: 'Coaching & Public' },
        { time: '9:30 AM - 10:30 AM', label: 'Ladies Only', badge: 'ladies' },
        { time: '10:40 AM - 3:50 PM', label: 'Public Only', badge: 'public' },
        { time: '4:00 PM - 5:00 PM', label: 'Coaching & Public' },
        { time: '8:30 PM - 9:30 PM', label: 'Coaching & Public' },
      ]
    }
    if (featureKey === 'yoga') {
      return [
        { time: '8:10 AM - 9:10 AM', label: 'Morning Session' },
        { time: '6:45 PM - 7:45 PM', label: 'Evening Session' }
      ]
    }
    if (featureKey === 'zumba') {
      return [
        { time: '6:30 AM - 7:30 AM', label: 'Morning Session' },
        { time: '8:30 PM - 9:30 PM', label: 'Evening Session' }
      ]
    }
    return [
      { time: '6:00 AM - 11:00 PM', label: 'By Reservation Only' }
    ]
  }

  const getFallbackFees = () => {
    if (featureKey === 'swimming-pool') {
      return [
        { name: 'Adult - 1st Month', price: '₹3,000', note: '(+₹500 Admission)' },
        { name: 'Kids - 1st Month', price: '₹2,500', note: '(+₹500 Admission)' },
        { name: 'Advanced Coaching', price: '₹2,500' },
        { name: 'Public Pass (1 Hour)', price: '₹150', accent: true },
      ]
    }
    if (featureKey === 'yoga') {
      return [{ name: 'Yoga (Monthly)', price: '₹1,200', note: '(+₹500 Admission)' }]
    }
    if (featureKey === 'zumba') {
      return [{ name: 'Zumba (Monthly)', price: '₹1,500', note: '(+₹500 Admission)' }]
    }
    return []
  }

  const displayTimings = timings.length > 0 ? timings : getFallbackTimings()
  const displayFees = fees.length > 0 ? fees : getFallbackFees()

  // Preload adjacent images & setup lightbox keybindings
  useLightboxPreload(images, lightboxIndex)

  useEffect(() => {
    setLightboxLoaded(false)
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      else if (event.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % images.length)
      else if (event.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, images.length])

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', lightboxIndex !== null)
    return () => document.body.classList.remove('lightbox-open')
  }, [lightboxIndex])

  const openLightbox = useCallback((imgId) => {
    const idx = images.findIndex(item => item.id === imgId)
    setLightboxIndex(idx)
  }, [images])

  const badgeClass = (b) => b === 'ladies' ? 'badge-ladies' : b === 'public' ? 'badge-public' : 'badge-default'
  const waLink = `https://wa.me/918090900914?text=${encodeURIComponent(data.whatsAppMsg)}`

  return (
    <>
      {/* ── Breadcrumbs ── */}
      <div className="detail-breadcrumbs">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="crumb-separator">/</span>
          <Link to="/programs">Programs</Link>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">{data.title}</span>
        </div>
      </div>

      {/* ── Hero Banner Section ── */}
      <section className="detail-hero">
        {images.length > 0 && (
          <div className="detail-hero-backdrop">
            <img src={images[0].url} alt="" />
          </div>
        )}
        <div className="container detail-hero-content">
          <ScrollAnimation animation="fade-up">
            <span className="detail-hero-label">BLUEWAVES CLUB</span>
            <h1 className="detail-hero-title">{data.title}</h1>
            <p className="detail-hero-subtitle">{data.subtitle}</p>
            <div className="detail-hero-ctas">
              <a href={waLink} target="_blank" rel="noreferrer" className="btn-brand">Book Now</a>
              <Link to="/contact" className="btn-modern-outline">Contact Us</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── Core Information ── */}
      <section className="section-space">
        <div className="container">
          {/* Main Grid: Description on Left, Flip Card on Right */}
          <div className="detail-info-grid">
            
            {/* Left side: Description & Highlights */}
            <div className="detail-main-info">
              <ScrollAnimation animation="fade-right">
                <h2 className="detail-section-title">Program Description</h2>
                <p className="detail-description-text">{data.description}</p>
                
                <h3 className="detail-section-subtitle" style={{ marginTop: '3rem' }}>Key Highlights</h3>
                <div className="detail-highlights-grid">
                  {data.highlights.map((item, i) => (
                    <div key={i} className="detail-highlight-card">
                      <IconBadge icon={item.icon} className="detail-highlight-icon" />
                      <div>
                        <h5>{item.title}</h5>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>
            </div>

            {/* Right side: 3D Flip Card (Timings & Fees) */}
            <div className="detail-side-panels">
              <ScrollAnimation animation="fade-left" delay={100}>
                <InfoFlipCard 
                  data={data} 
                  displayTimings={displayTimings} 
                  displayFees={displayFees} 
                  badgeClass={badgeClass} 
                  featureKey={featureKey} 
                />
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Tour Section (full-width Gallery carousel at bottom) ── */}
      {!loadingGallery && images.length > 0 && (
        <section className="section-space" style={{ paddingTop: '0.5rem' }}>
          <div className="container">
            <ScrollAnimation animation="fade-up">
              <h2 className="gallery-section-title" style={{ marginBottom: '2rem' }}>Visual Tour</h2>
              <FeatureGalleryCarousel images={images} openLightbox={openLightbox} />
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* ── Lightbox Overlay (Portal) ── */}
      {lightboxIndex !== null && images[lightboxIndex] && createPortal(
        <div className="gallery-lightbox active" onClick={() => setLightboxIndex(null)}>
          <button type="button" className="lightbox-close" aria-label="Close gallery preview" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          <button type="button" className="lightbox-nav prev-btn" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + images.length) % images.length); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            {!lightboxLoaded && <div className="lightbox-spinner"><div className="loader" /></div>}
            <img
              src={fullUrl(images[lightboxIndex].url)}
              alt={images[lightboxIndex].alt || 'Gallery'}
              loading="eager"
              decoding="async"
              className={lightboxLoaded ? 'lightbox-img--loaded' : 'lightbox-img--loading'}
              onLoad={() => setLightboxLoaded(true)}
              onClick={() => setLightboxIndex(prev => (prev + 1) % images.length)}
            />
          </div>

          <button type="button" className="lightbox-nav next-btn" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % images.length); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
