import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBadge, siteIcons } from '../../components/SiteIcon'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard')
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/admin/dashboard')
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <IconBadge icon={siteIcons.locker} className="admin-login-icon" />
        <h3>Staff Portal</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Admin Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" className="btn-brand" style={{ width: '100%' }} disabled={loading}>{loading ? 'Authenticating...' : 'Secure Login'}</button>
        </form>
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Return to Main Site</a>
      </div>
    </div>
  )
}
