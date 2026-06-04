import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'


const categories = [
  { key: 'pool-area', icon: siteIcons.pool, label: 'Pool Area' },
  { key: 'zumba', icon: siteIcons.zumba, label: 'Zumba' },
  { key: 'yoga', icon: siteIcons.yoga, label: 'Yoga' },
  { key: 'mini-hall', icon: siteIcons.facilities, label: 'Mini Hall' },
]

/* ── Supabase image transform helpers ── */

/**
 * Supabase Storage serves images via /storage/v1/object/public/<bucket>/...
 * Appending /render/image/... with transform params gives on-the-fly resizing.
 * For non-Supabase URLs we fall back to the original.
 */
function thumbUrl(originalUrl, width = 600, quality = 75) {
  if (!originalUrl) return ''
  try {
    const u = new URL(originalUrl)
    // Only transform Supabase Storage URLs
    if (u.pathname.includes('/storage/v1/object/public/')) {
      u.searchParams.set('width', width)
      u.searchParams.set('quality', quality)
      return u.toString()
    }
  } catch { /* not a valid URL, return as-is */ }
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

/* ── Optimized gallery image with skeleton + fade-in ── */

const GalleryImage = memo(function GalleryImage({ src, alt, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    // If the image is already cached by the browser it may have loaded before
    // our onLoad handler was attached. Check the `complete` property.
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

/* ── Lightbox with preloading ── */

function useLightboxPreload(images, currentIndex) {
  useEffect(() => {
    if (currentIndex === null || !images.length) return
    // Preload next and previous full-res images
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

/* ── Category Carousel Component ── */

const CategoryCarousel = ({ items, label, openLightbox }) => {
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

  const total = items.length
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

  if (total === 0) {
    return <div className="gallery-placeholder-msg">No images uploaded yet for this category.</div>
  }

  if (isExpanded || !isCarouselable) {
    return (
      <div className="gallery-expanded-view">
        <div className="gallery-grid">
          {items.map(img => (
            <GalleryImage key={img.id} src={img.url} alt={img.alt || label} onClick={() => openLightbox(img.id)} />
          ))}
        </div>
        {isCarouselable && (
          <div className="gallery-show-more">
            <button className="btn-modern-outline" onClick={() => setIsExpanded(false)}>Show Less</button>
          </div>
        )}
      </div>
    )
  }

  const leftClones = items.slice(-itemsPerView).map(item => ({ ...item, cloneId: `lc-${item.id}` }))
  const rightClones = items.slice(0, itemsPerView).map(item => ({ ...item, cloneId: `rc-${item.id}` }))
  const trackItems = [...leftClones, ...items, ...rightClones]

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
                <GalleryImage src={item.url} alt={item.alt || label} onClick={() => openLightbox(item.id)} />
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

export default function Gallery() {
  const [images, setImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)

  useEffect(() => {
    let active = true

    supabase.from('gallery').select('*').order('order_val')
      .then(({ data }) => {
        if (active && data) {
          setImages(data)
        }
      })
      .catch(() => {
        // Leave the gallery empty rather than blocking the route render.
      })

    return () => {
      active = false
    }
  }, [])

  const grouped = categories.map(c => ({
    ...c,
    items: images.filter(img => img.category === c.key)
  }))

  const standardKeys = categories.map(c => c.key)
  const allGeneral = images.filter(img => !img.category || img.category === 'general' || !standardKeys.includes(img.category))

  // Collect all displayed images in the order they appear on the screen
  const displayedImages = [
    ...grouped.flatMap(cat => cat.items),
    ...allGeneral
  ]

  // Preload adjacent lightbox images
  useLightboxPreload(displayedImages, lightboxIndex)

  // Reset lightbox loaded state when index changes
  useEffect(() => {
    setLightboxLoaded(false)
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev + 1) % displayedImages.length)
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev - 1 + displayedImages.length) % displayedImages.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxIndex, displayedImages.length])

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add('lightbox-open')
    } else {
      document.body.classList.remove('lightbox-open')
    }
    return () => {
      document.body.classList.remove('lightbox-open')
    }
  }, [lightboxIndex])

  const openLightbox = useCallback((imgId) => {
    const idx = displayedImages.findIndex(item => item.id === imgId)
    setLightboxIndex(idx)
  }, [displayedImages])

  return (
    <>
      <section className="section-space">
        <div className="container">
          {grouped.map((cat, i) => (
            <ScrollAnimation key={cat.key} className="gallery-category" delay={i * 100} animation="scale-up">
              <div className="gallery-category-header">
                <IconBadge icon={cat.icon} className="gallery-cat-icon" />
                <h2>{cat.label}</h2>
              </div>
              <CategoryCarousel items={cat.items} label={cat.label} openLightbox={openLightbox} />
            </ScrollAnimation>
          ))}
          {allGeneral.length > 0 && (
            <ScrollAnimation className="gallery-category" delay={grouped.length * 100} animation="scale-up">
              <div className="gallery-category-header"><IconBadge icon={siteIcons.general} className="gallery-cat-icon" /><h2>General</h2></div>
              <CategoryCarousel items={allGeneral} label="General" openLightbox={openLightbox} />
            </ScrollAnimation>
          )}
        </div>
      </section>

      {lightboxIndex !== null && displayedImages[lightboxIndex] && createPortal(
        <div className="gallery-lightbox active" onClick={() => setLightboxIndex(null)}>
          {/* Close button */}
          <button type="button" className="lightbox-close" aria-label="Close gallery preview" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {/* Previous arrow */}
          <button type="button" className="lightbox-nav prev-btn" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + displayedImages.length) % displayedImages.length); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Centered image */}
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            {!lightboxLoaded && <div className="lightbox-spinner"><div className="loader" /></div>}
            <img
              src={fullUrl(displayedImages[lightboxIndex].url)}
              alt={displayedImages[lightboxIndex].alt || 'Gallery'}
              loading="eager"
              decoding="async"
              className={lightboxLoaded ? 'lightbox-img--loaded' : 'lightbox-img--loading'}
              onLoad={() => setLightboxLoaded(true)}
              onClick={() => setLightboxIndex(prev => (prev + 1) % displayedImages.length)}
            />
          </div>

          {/* Next arrow */}
          <button type="button" className="lightbox-nav next-btn" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % displayedImages.length); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* Image counter */}
          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex + 1} / {displayedImages.length}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
