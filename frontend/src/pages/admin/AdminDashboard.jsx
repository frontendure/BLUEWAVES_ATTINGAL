import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import HeroSlidesManager from './HeroSlidesManager'
import GalleryManager from './GalleryManager'
import ProgramsManager from './ProgramsManager'
import MembershipFeesManager from './MembershipFeesManager'

const tabs = [
  { key: 'hero', label: '🖼️ Hero Slides' },
  { key: 'gallery', label: '📷 Gallery' },
  { key: 'programs', label: '🏊 Programs' },
  { key: 'fees', label: '💰 Membership Fees' },
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
            <button key={t.key} className={`admin-nav-btn${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={logout}>Logout</button>
      </aside>
      <main className="admin-content">
        {activeTab === 'hero' && <HeroSlidesManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'programs' && <ProgramsManager />}
        {activeTab === 'fees' && <MembershipFeesManager />}
      </main>
    </div>
  )
}
