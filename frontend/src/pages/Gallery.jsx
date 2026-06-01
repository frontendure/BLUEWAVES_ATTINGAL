import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'


const categories = [
  { key: 'facilities', icon: siteIcons.facilities, label: 'Facilities' },
  { key: 'pool-area', icon: siteIcons.pool, label: 'Pool Area' },
  { key: 'training', icon: siteIcons.training, label: 'Training' },
  { key: 'swimmers-coaches', icon: siteIcons.spectators, label: 'Swimmers & Coaches' },
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
    items: images.filter(img => (img.category || 'general') === c.key)
  }))

  const allGeneral = images.filter(img => !img.category || img.category === 'general')

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
      <section className="page-header">
        <div className="container"><h1>Our Gallery</h1><p>A visual tour of our state-of-the-art facilities, pool area, training sessions, and the people who make Blue Waves special.</p></div>
      </section>
      <section className="section-space">
        <div className="container">
          {grouped.map((cat, i) => (
            <ScrollAnimation key={cat.key} className="gallery-category" delay={i * 100} animation="scale-up">
              <div className="gallery-category-header">
                <IconBadge icon={cat.icon} className="gallery-cat-icon" />
                <h2>{cat.label}</h2>
              </div>
              <div className="gallery-grid">
                {cat.items.length > 0 ? cat.items.map(img => (
                  <GalleryImage
                    key={img.id}
                    src={img.url}
                    alt={img.alt || cat.label}
                    onClick={() => openLightbox(img.id)}
                  />
                )) : (
                  <div className="gallery-placeholder-msg">No images uploaded yet for this category.</div>
                )}
              </div>
            </ScrollAnimation>
          ))}
          {allGeneral.length > 0 && (
            <ScrollAnimation className="gallery-category" delay={grouped.length * 100} animation="scale-up">
              <div className="gallery-category-header"><IconBadge icon={siteIcons.general} className="gallery-cat-icon" /><h2>General</h2></div>
              <div className="gallery-grid">
                {allGeneral.map(img => (
                  <GalleryImage
                    key={img.id}
                    src={img.url}
                    alt={img.alt || 'Gallery'}
                    onClick={() => openLightbox(img.id)}
                  />
                ))}
              </div>
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
