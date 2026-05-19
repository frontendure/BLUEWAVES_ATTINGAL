import { useState, useEffect } from 'react'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

const categories = [
  { key: 'facilities', icon: siteIcons.facilities, label: 'Facilities' },
  { key: 'pool-area', icon: siteIcons.pool, label: 'Pool Area' },
  { key: 'training', icon: siteIcons.training, label: 'Training' },
  { key: 'swimmers-coaches', icon: siteIcons.spectators, label: 'Swimmers & Coaches' },
]

export default function Gallery() {
  const [images, setImages] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data } = await supabase.from('gallery').select('*').order('order_val')
        if (active && data) {
          setImages(data)
        }
      } catch {
        // Leave the gallery empty rather than blocking the route render.
      }
    })()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!lightbox) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightbox])

  const grouped = categories.map(c => ({
    ...c,
    items: images.filter(img => (img.category || 'general') === c.key)
  }))

  const allGeneral = images.filter(img => !img.category || img.category === 'general')

  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Our Gallery</h1><p>A visual tour of our state-of-the-art facilities, pool area, training sessions, and the people who make Blue Waves special.</p></div>
      </section>
      <section className="section-space">
        <div className="container">
          {grouped.map(cat => (
            <ScrollAnimation key={cat.key} className="gallery-category">
              <div className="gallery-category-header">
                <IconBadge icon={cat.icon} className="gallery-cat-icon" />
                <h2>{cat.label}</h2>
              </div>
              <div className="gallery-grid">
                {cat.items.length > 0 ? cat.items.map(img => (
                  <div key={img.id} className="gallery-item" onClick={() => setLightbox(img.url)}>
                    <img src={img.url} alt={img.alt || cat.label} loading="lazy" decoding="async" />
                  </div>
                )) : (
                  <div className="gallery-placeholder-msg">No images uploaded yet for this category.</div>
                )}
              </div>
            </ScrollAnimation>
          ))}
          {allGeneral.length > 0 && (
            <ScrollAnimation className="gallery-category">
              <div className="gallery-category-header"><IconBadge icon={siteIcons.general} className="gallery-cat-icon" /><h2>General</h2></div>
              <div className="gallery-grid">
                {allGeneral.map(img => (
                  <div key={img.id} className="gallery-item" onClick={() => setLightbox(img.url)}>
                    <img src={img.url} alt={img.alt || 'Gallery'} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="gallery-lightbox active" onClick={() => setLightbox(null)}>
          <button type="button" className="close-btn" aria-label="Close gallery preview" onClick={() => setLightbox(null)}>Close</button>
          <img src={lightbox} alt="Gallery" loading="eager" decoding="async" />
        </div>
      )}
    </>
  )
}
