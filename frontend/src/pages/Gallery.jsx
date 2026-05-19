import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ScrollAnimation from '../components/ScrollAnimation'

const categories = [
  { key: 'facilities', icon: '🏢', label: 'Facilities' },
  { key: 'pool-area', icon: '🏊', label: 'Pool Area' },
  { key: 'training', icon: '⏱️', label: 'Training' },
  { key: 'swimmers-coaches', icon: '👥', label: 'Swimmers & Coaches' },
]

export default function Gallery() {
  const [images, setImages] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    supabase.from('gallery').select('*').order('order_val').then(({ data }) => {
      if (data) setImages(data)
    })
  }, [])

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
                <span className="gallery-cat-icon">{cat.icon}</span>
                <h2>{cat.label}</h2>
              </div>
              <div className="gallery-grid">
                {cat.items.length > 0 ? cat.items.map(img => (
                  <div key={img.id} className="gallery-item" onClick={() => setLightbox(img.url)}>
                    <img src={img.url} alt={img.alt || cat.label} loading="lazy" />
                  </div>
                )) : (
                  <div className="gallery-placeholder-msg">No images uploaded yet for this category.</div>
                )}
              </div>
            </ScrollAnimation>
          ))}
          {allGeneral.length > 0 && (
            <ScrollAnimation className="gallery-category">
              <div className="gallery-category-header"><span className="gallery-cat-icon">📷</span><h2>General</h2></div>
              <div className="gallery-grid">
                {allGeneral.map(img => (
                  <div key={img.id} className="gallery-item" onClick={() => setLightbox(img.url)}>
                    <img src={img.url} alt={img.alt || 'Gallery'} loading="lazy" />
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="gallery-lightbox active" onClick={() => setLightbox(null)}>
          <span className="close-btn" onClick={() => setLightbox(null)}>✕</span>
          <img src={lightbox} alt="Gallery" />
        </div>
      )}
    </>
  )
}
