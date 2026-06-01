import { IconBadge, siteIcons } from '../components/SiteIcon'
import ScrollAnimation from '../components/ScrollAnimation'

const pillars = [
  {
    icon: siteIcons.coaching,
    title: 'Clear Coaching Paths',
    desc: 'Beginners, regular swimmers, and developing athletes all need structure. We focus on consistent progress instead of random pool time.',
  },
  {
    icon: siteIcons.clean,
    title: 'Cleaner Daily Experience',
    desc: 'Water care, circulation space, changing areas, and deck flow all shape whether people actually enjoy coming back each week.',
  },
  {
    icon: siteIcons.wellness,
    title: 'Wellness Beyond Laps',
    desc: 'Yoga and zumba make the facility useful beyond one activity, helping members build a routine that lasts.',
  },
]

const rules = [
  "Entry to the swimming pool is regulated with a pass. The pass issued has to be renewed accordingly.",
  "Monthly, one-time, or club passes are issued for entry to the pool.",
  "New entrants to the swimming pool must have a minimum height of 120 cm and a maximum height of 1 meter.",
  "Swimmers should wear a proper swimming suit and swim cap. You may purchase them at the counter.",
  "Beginners should practice only in the beginners’ pool, otherwise they must be authorized and assisted by an instructor.",
  "Swimmers must follow the directions of lifeguards and coaches.",
  "Valuables brought by swimmers are at their own risk.",
  "Use of oil, soaps, etc. is strictly prohibited. If your hair is too oily, entry to the pool may be denied.",
  "Take a shower before entering and after leaving the pool.",
  "Running, jumping, and pushing each other on the pool deck is strictly prohibited.",
  "Do not spit while in the pool.",
  "Anyone needing to urinate or use the toilet may leave the pool during the session with the coach’s permission.",
  "Use of footwear on the pool deck is prohibited.",
  "Newcomers should submit a medical certificate.",
  "Those with contagious diseases, heart disease, or skin diseases should not use the pool.",
  "Intoxicated people are not allowed in the pool.",
  "Keep the pool and premises clean and tidy.",
  "Users of the pool should follow instructions of the staff on duty.",
  "Video and photography in the pool is prohibited. No cameras or phones are allowed inside the pool for swimmers.",
  "Swimming is permitted only in the presence of lifeguards or coaches.",
  "Do not damage rooms, bathroom fittings, pool fittings, or equipment.",
  "Those who destroy equipment or other materials will be fined.",
  "Management is not responsible for theft, accidents, injuries, or other losses occurring in the swimming pool and premises.",
  "Persons who violate the rules may be asked to leave immediately, and no refunds will be provided, including registration fees.",
  "To enroll in professional swimming coaching, you need to register separately.",
  "Please make sure to flush toilets and urinals after use.",
  "Make sure you collect all your belongings before leaving.",
  "Do not push or pull others while in the pool. You may be asked to leave if such action is observed.",
  "The pool and premises are fully monitored by CCTV cameras."
]

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container"><h1>Our Philosophy</h1><p>Premium aquatic training should feel clean, calm, and easy to return to week after week.</p></div>
      </section>
      <section className="section-space about-story">
        <div className="container">
          <div className="about-grid">
            <div className="about-text animate-on-load">
              <span className="section-label">Our Story</span>
              <h2>A cleaner, calmer way to build a swimming habit.</h2>
              <p>Blue Waves was created for people who wanted more than a crowded pool. We built the space around water quality, structured timings, welcoming staff, and a facility that works for first-timers, children, families, and repeat swimmers.</p>
              <p>That same thinking shapes the full experience today: clear schedules, safer circulation areas, wellness programs that complement swim training, and a setting that feels premium without becoming intimidating.</p>
              <div className="story-stats">
                <div className="story-stat">
                  <strong>2018</strong>
                  <span>Blue Waves opened in Attingal.</span>
                </div>
                <div className="story-stat">
                  <strong>3 tracks</strong>
                  <span>Swimming, yoga, and zumba under one roof.</span>
                </div>
                <div className="story-stat">
                  <strong>All ages</strong>
                  <span>Programs for beginners, families, and growing swimmers.</span>
                </div>
              </div>
            </div>
            <div className="about-visual animate-on-load-delayed">
              <div className="about-image-frame">
                <img src="/assets/hero-optimized.jpg" alt="Blue Waves pool deck" loading="lazy" decoding="async" />
              </div>
              <div className="about-highlight-card">
                <span className="section-label">What Matters Here</span>
                <h3>Comfort, clarity, and consistent coaching.</h3>
                <p>Members should know exactly where to go, when to arrive, and what kind of session they are stepping into. That predictability is part of the premium experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space coaches-section">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header section-header-center">
              <span className="section-label">What Sets Us Apart</span>
              <h2>Built around repeatable routines</h2>
              <p className="text-muted">The best facility is the one people actually enjoy returning to. That means quality, structure, and less friction in the experience.</p>
            </div>
          </ScrollAnimation>
          <div className="pillar-grid">
            {pillars.map((pillar, i) => (
              <ScrollAnimation key={pillar.title} delay={(i + 1) * 120}>
                <article className="pillar-card">
                  <IconBadge icon={pillar.icon} className="feature-icon" />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </article>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section-space about-rules-section">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header section-header-center">
              <span className="section-label">Safety & Conduct</span>
              <h2>Pool Rules & Regulations</h2>
              <p className="text-muted">To ensure a safe, clean, and premium environment for everyone, please adhere to our strict guidelines.</p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <div className="premium-box rules-box">
              <div className="rules-grid">
                {rules.map((rule, idx) => (
                  <div key={idx} className="rule-item">
                    <div className="rule-number">
                      {idx + 1}
                    </div>
                    <div className="rule-text">
                      {rule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  )
}
