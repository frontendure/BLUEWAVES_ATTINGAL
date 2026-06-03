import { useState, useEffect } from 'react'
import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

const defaultCoaching = [
  { name: 'Adult - 1st Month', price: '₹3,000', note: '(+₹500 Admission)' },
  { name: 'Adult - 2nd Month', price: '₹3,000' },
  { name: 'Adult - 3rd Month', price: '₹2,500' },
  { name: 'Kids - 1st Month', price: '₹2,500', note: '(+₹500 Admission)' },
  { name: 'Kids - 2nd Month', price: '₹2,500' },
  { name: 'Advanced Coaching', price: '₹2,500', highlight: true },
  { name: 'Personal Training (1 Month)', price: '₹6,000', accent: true },
]

const defaultPublic = [
  { name: 'Monthly Plus', price: '₹2,500', note: '(+₹500 Admission)' },
  { name: '6 Months Package', price: '₹10,000' },
  { name: '1 Year Package', price: '₹18,000' },
  { name: 'Family Package (4 Members)', price: '₹7,500' },
  { name: 'Public Pass (1 Hour)', price: '₹150', accent: true },
]

const defaultWellness = [
  { name: 'Zumba (Monthly)', price: '₹1,500', note: '(+₹500 Adm)' },
  { name: 'Yoga (Monthly)', price: '₹1,200', note: '(+₹500 Adm)' },
]

export default function Membership() {
  const [coaching, setCoaching] = useState(defaultCoaching)
  const [publicFees, setPublicFees] = useState(defaultPublic)
  const [wellness, setWellness] = useState(defaultWellness)

  useEffect(() => {
    let active = true

      ; (async () => {
        try {
          const { supabase } = await import('../lib/supabase')
          const { data } = await supabase.from('membership_fees').select('*').order('order_val')
          if (!active || !data?.length) return

          const c = data.filter(d => d.category === 'swimming_coaching').map(d => ({ name: d.name, price: d.price, note: d.note }))
          const p = data.filter(d => d.category === 'swimming_public').map(d => ({ name: d.name, price: d.price, note: d.note }))
          const w = data.filter(d => d.category === 'wellness').map(d => ({ name: d.name, price: d.price, note: d.note }))

          if (c.length) setCoaching(c.map(item => ({ ...item, highlight: item.name.toLowerCase().includes('advanced'), accent: item.name.toLowerCase().includes('personal') })))
          if (p.length) setPublicFees(p.map(item => ({ ...item, accent: item.name.toLowerCase().includes('pass') })))
          if (w.length) setWellness(w)
        } catch {
          // Default fee data keeps the page usable offline.
        }
      })()

    return () => {
      active = false
    }
  }, [])

  const publicPassItem = publicFees.find(f => f.name.toLowerCase().includes('pass') || f.name.toLowerCase().includes('1 hour') || f.name.toLowerCase().includes('1hr'))
  const publicFeesWithoutPass = publicFees.filter(f => !f.name.toLowerCase().includes('pass') && !f.name.toLowerCase().includes('1 hour') && !f.name.toLowerCase().includes('1hr'))

  return (
    <>
      <section className="section-space">
        <div className="container">
          <ScrollAnimation animation="scale-up">
            <div className="section-header" style={{ textAlign: 'center' }}>
              <span className="section-label">Complete Breakdown</span>
              <h2>Detailed Fee Structure</h2>
              <p className="text-muted">Transparent pricing tailored for individuals, families, and intensive coaching programs.</p>
            </div>
          </ScrollAnimation>
          <div className="membership-grid">
            {/* Column 1: Swimming Programs (Left Side) */}
            <div className="membership-column">
              {/* Card 1: Swimming (With Coaching) */}
              <ScrollAnimation animation="fade-up">
                <div className="premium-box membership-box">
                  <h4 className="programs-box-title">
                    <IconBadge icon={siteIcons.pool} className="title-icon" />
                    <span>Swimming (With Coaching)</span>
                  </h4>
                  <div className="fee-table">
                    {coaching.map((f, i) => (
                      <div key={i} className={`fee-row${f.highlight ? ' highlight' : ''}${f.accent ? ' accent' : ''}`}>
                        <span className="fee-name">{f.name}</span>
                        <span className="fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>

              {/* Card 2: Swimming (Without Coaching) */}
              <ScrollAnimation animation="fade-up" delay={100}>
                <div className="premium-box membership-box">
                  <h4 className="programs-box-title">
                    <IconBadge icon={siteIcons.pool} className="title-icon" />
                    <span>Swimming (Without Coaching)</span>
                  </h4>
                  <div className="fee-table">
                    {publicFeesWithoutPass.map((f, i) => (
                      <div key={i} className={`fee-row${f.accent ? ' accent' : ''}`}>
                        <span className="fee-name">{f.name}</span>
                        <span className="fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Column 2: Passes & Wellness (Right Side) */}
            <div className="membership-column">
              {/* Card 3: Public Pass (1 Hour) */}
              <ScrollAnimation animation="fade-up" delay={200}>
                <div className="premium-box membership-box highlighted-card">
                  <div className="card-accent-badge">Hourly Access</div>
                  <h4 className="programs-box-title">
                    <IconBadge icon={siteIcons.ticket} className="title-icon" />
                    <span>Public Pass (1 Hour)</span>
                  </h4>
                  <div className="public-pass-details">
                    <div className="public-pass-price-box">
                      <span className="price-value">{publicPassItem ? publicPassItem.price : '₹150'}</span>
                      <span className="price-unit">/ hour</span>
                    </div>
                    {publicPassItem && publicPassItem.note && (
                      <p className="public-pass-note">{publicPassItem.note}</p>
                    )}
                    <p className="public-pass-desc">Perfect for casual swimmers who want access to our premium clean pool for individual lap sessions.</p>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Card 4: Wellness Classes */}
              <ScrollAnimation animation="fade-up" delay={300}>
                <div className="premium-box membership-box">
                  <h4 className="programs-box-title">
                    <IconBadge icon={siteIcons.wellness} className="title-icon" />
                    <span>Wellness Classes</span>
                  </h4>
                  <div className="fee-table">
                    {wellness.map((f, i) => (
                      <div key={i} className="fee-row">
                        <span className="fee-name">{f.name}</span>
                        <span className="fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
