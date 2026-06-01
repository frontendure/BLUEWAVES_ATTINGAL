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
  const [studentPass, setStudentPass] = useState({
    name: 'Student Pass',
    price: '₹100',
    note: 'Applicable for Std 8 to 12. Valid school ID required.'
  })

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data } = await supabase.from('membership_fees').select('*').order('order_val')
        if (!active || !data?.length) return

        const c = data.filter(d => d.category === 'swimming_coaching').map(d => ({ name: d.name, price: d.price, note: d.note }))
        const p = data.filter(d => d.category === 'swimming_public').map(d => ({ name: d.name, price: d.price, note: d.note }))
        const w = data.filter(d => d.category === 'wellness').map(d => ({ name: d.name, price: d.price, note: d.note }))
        const s = data.find(d => d.category === 'special')

        if (c.length) setCoaching(c.map(item => ({ ...item, highlight: item.name.toLowerCase().includes('advanced'), accent: item.name.toLowerCase().includes('personal') })))
        if (p.length) setPublicFees(p.map(item => ({ ...item, accent: item.name.toLowerCase().includes('pass') })))
        if (w.length) setWellness(w)
        if (s) setStudentPass({ name: s.name, price: s.price, note: s.note || '' })
      } catch {
        // Default fee data keeps the page usable offline.
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Exclusive Memberships</h1><p>Unlock unrestricted access to our pristine pools and elite coaching.</p></div>
      </section>
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
            <ScrollAnimation animation="fade-right">
              <div className="premium-box membership-box">
                <h4 className="programs-box-title">
                  <IconBadge icon={siteIcons.pool} className="title-icon" />
                  <span>Swimming Programs</span>
                </h4>
                <div className="fee-section-label">WITH COACHING</div>
                <div className="fee-table">
                  {coaching.map((f, i) => (
                    <div key={i} className={`fee-row${f.highlight ? ' highlight' : ''}${f.accent ? ' accent' : ''}`}>
                      <span className="fee-name">{f.name}</span>
                      <span className="fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                    </div>
                  ))}
                </div>
                <div className="fee-section-label" style={{ marginTop: '2rem' }}>WITHOUT COACHING</div>
                <div className="fee-table">
                  {publicFees.map((f, i) => (
                    <div key={i} className={`fee-row${f.accent ? ' accent' : ''}`}>
                      <span className="fee-name">{f.name}</span>
                      <span className="fee-price">{f.price} {f.note && <small>{f.note}</small>}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200} animation="fade-left">
              <div className="membership-side">
                <div className="premium-box membership-box">
                  <h4 className="programs-box-title">
                    <IconBadge icon={siteIcons.ticket} className="title-icon" />
                    <span>Special Passes</span>
                  </h4>
                  <div className="student-pass">
                    <div><strong>{studentPass.name}</strong>{studentPass.note && <><br /><small>{studentPass.note}</small></>}</div>
                    <div className="student-price">{studentPass.price}</div>
                  </div>
                </div>
                <div className="premium-box membership-box" style={{ marginTop: '1.5rem' }}>
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
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  )
}
