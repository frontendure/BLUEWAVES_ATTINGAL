import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ScrollAnimation from '../components/ScrollAnimation'

const defaultPool = [
  { time: '6:00 AM - 7:00 AM', label: 'Coaching & Public', badge: 'default' },
  { time: '7:10 AM - 8:10 AM', label: 'Coaching & Public', badge: 'default' },
  { time: '8:20 AM - 9:20 AM', label: 'Coaching & Public', badge: 'default' },
  { time: '9:30 AM - 10:30 AM', label: 'Ladies Only', badge: 'ladies' },
  { time: '10:40 AM - 3:50 PM', label: 'Public Only', badge: 'public' },
  { time: '4:00 PM - 5:00 PM', label: 'Coaching & Public', badge: 'default' },
  { time: '5:10 PM - 6:10 PM', label: 'Coaching & Public', badge: 'default' },
  { time: '6:20 PM - 7:20 PM', label: 'Coaching & Public', badge: 'default' },
  { time: '8:30 PM - 9:30 PM', label: 'Coaching & Public', badge: 'default' },
  { time: '9:30 PM - 10:30 PM', label: 'Public Only', badge: 'public' },
]

const defaultYoga = [
  { time: '8:10 AM - 9:10 AM', label: 'Morning Session' },
  { time: '6:45 PM - 7:45 PM', label: 'Evening Session' },
]

const defaultZumba = [
  { time: '6:30 AM - 7:30 AM', label: 'Morning Session' },
  { time: '8:30 PM - 9:30 PM', label: 'Evening Session' },
]

export default function Programs() {
  const [pool, setPool] = useState(defaultPool)
  const [yoga, setYoga] = useState(defaultYoga)
  const [zumba, setZumba] = useState(defaultZumba)

  useEffect(() => {
    supabase.from('programs').select('*').order('order_val').then(({ data }) => {
      if (!data?.length) return
      const p = data.filter(d => d.category === 'pool').map(d => ({ time: d.time_range, label: d.label, badge: d.badge_type }))
      const y = data.filter(d => d.category === 'yoga').map(d => ({ time: d.time_range, label: d.label }))
      const z = data.filter(d => d.category === 'zumba').map(d => ({ time: d.time_range, label: d.label }))
      if (p.length) setPool(p)
      if (y.length) setYoga(y)
      if (z.length) setZumba(z)
    })
  }, [])

  const badgeClass = (b) => b === 'ladies' ? 'badge-ladies' : b === 'public' ? 'badge-public' : 'badge-default'

  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Our Curated Programs</h1><p>Expertly designed aquatic experiences tailored to elevate your technique, endurance, and wellness.</p></div>
      </section>
      <section className="section-space">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header" style={{ textAlign: 'center' }}>
              <span className="section-label">Weekly Schedule</span>
              <h2>Our Timings</h2>
              <p className="text-muted">Find the perfect slot for your session.</p>
              <div className="holiday-notice">📅 Please note: Every Wednesday is a holiday for Swimming, Zumba, and Yoga.</div>
            </div>
          </ScrollAnimation>
          <div className="programs-grid">
            <ScrollAnimation>
              <div className="premium-box programs-box">
                <h4 className="programs-box-title">🏊 Pool Timings</h4>
                <div className="timing-list">
                  {pool.map((s, i) => (
                    <div key={i} className="timing-row">
                      <span className="timing-time">{s.time}</span>
                      <span className={`timing-badge ${badgeClass(s.badge)}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <div className="premium-box programs-box wellness-box">
                <h4 className="programs-box-title">🧘 Wellness Classes</h4>
                <div className="wellness-group">
                  <div className="wellness-header"><span className="wellness-icon">🧘</span><h5>Yoga</h5></div>
                  <div className="wellness-times">
                    {yoga.map((s, i) => (
                      <div key={i} className="wellness-time-row"><span>{s.label}</span><span className="wellness-time-value">{s.time}</span></div>
                    ))}
                  </div>
                </div>
                <div className="wellness-group" style={{ marginTop: '2rem' }}>
                  <div className="wellness-header"><span className="wellness-icon">🎵</span><h5>Zumba</h5></div>
                  <div className="wellness-times">
                    {zumba.map((s, i) => (
                      <div key={i} className="wellness-time-row"><span>{s.label}</span><span className="wellness-time-value">{s.time}</span></div>
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
