import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBadge, siteIcons } from '../../components/SiteIcon'
import { supabase } from '../../lib/supabase'
import HeroSlidesManager from './HeroSlidesManager'
import GalleryManager from './GalleryManager'
import ProgramsManager from './ProgramsManager'
import MembershipFeesManager from './MembershipFeesManager'

const tabs = [
  { key: 'hero', icon: siteIcons.hero, label: 'Hero Slides' },
  { key: 'gallery', icon: siteIcons.general, label: 'Gallery' },
  { key: 'programs', icon: siteIcons.pool, label: 'Programs' },
  { key: 'fees', icon: siteIcons.fees, label: 'Membership Fees' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero')
  const [authed, setAuthed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin')
      else setAuthed(true)
    })
  }, [navigate])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (!authed) return <div className="admin-login-page"><div className="loader"></div></div>

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h4 className="admin-sidebar-title">CMS Admin</h4>
        <nav className="admin-nav">
          {tabs.map(t => (
            <button key={t.key} className={`admin-nav-btn${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
              <IconBadge icon={t.icon} className="admin-tab-icon" />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={logout}>Logout</button>
      </aside>
      <main className="admin-content">
        <div className="admin-mobile-header">
          <div className="admin-mobile-topbar">
            <h1>CMS Admin</h1>
            <button className="admin-logout-btn admin-logout-btn-mobile" onClick={logout}>Logout</button>
          </div>
          <nav className="admin-mobile-nav" aria-label="Admin sections">
            {tabs.map(t => (
              <button key={t.key} className={`admin-nav-btn${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                <IconBadge icon={t.icon} className="admin-tab-icon" />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {activeTab === 'hero' && <HeroSlidesManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'programs' && <ProgramsManager />}
        {activeTab === 'fees' && <MembershipFeesManager />}
      </main>
    </div>
  )
}
