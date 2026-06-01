import { useState, useEffect } from 'react'

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data } = await supabase
          .from('home_banners')
          .select('*')
          .eq('is_active', true)
          .limit(1)
        if (active && data?.length) {
          setBanner(data[0])
        }
      } catch {
        // Handle gracefully
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handleClose = (e) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  if (!banner || !isVisible) return null

  return (
    <div className="home-announcement-banner">
      <button
        type="button"
        className="banner-close-btn"
        onClick={handleClose}
        aria-label="Close announcement"
      >
        ✕
      </button>
      <div className="announcement-content">
        <h3 className="banner-heading">{banner.heading}</h3>
        {banner.subheading && (
          <p className="banner-subheading">{banner.subheading}</p>
        )}
        {banner.content && (
          <ul className="banner-body-list">
            {banner.content
              .split('\n')
              .filter((line) => line.trim() !== '')
              .map((line, idx) => (
                <li key={idx}>
                  <span className="bullet-icon">•</span>
                  <span>{line.trim()}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
