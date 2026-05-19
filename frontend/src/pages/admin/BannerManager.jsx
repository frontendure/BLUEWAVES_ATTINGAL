import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function BannerManager() {
  const [banner, setBanner] = useState(null)
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('home_banners').select('*').limit(1)
    if (data && data.length > 0) {
      setBanner(data[0])
      setHeading(data[0].heading)
      setSubheading(data[0].subheading || '')
      setContent(data[0].content || '')
    } else {
      setBanner(null)
      setHeading('')
      setSubheading('')
      setContent('')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!heading) return alert('Heading is required')
    setSaving(true)
    if (banner) {
      await supabase.from('home_banners').update({ heading, subheading, content }).eq('id', banner.id)
    } else {
      await supabase.from('home_banners').insert([{ heading, subheading, content }])
    }
    setSaving(false)
    load()
  }

  const toggleActive = async () => {
    if (!banner) return
    await supabase.from('home_banners').update({ is_active: !banner.is_active }).eq('id', banner.id)
    load()
  }

  const remove = async () => {
    if (!banner || !confirm('Delete the banner?')) return
    await supabase.from('home_banners').delete().eq('id', banner.id)
    load()
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading banner details...</div>

  return (
    <div>
      <h2>Home Banner</h2>
      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <h5>{banner ? 'Edit Banner' : 'Create Banner'}</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Heading (e.g. Special Announcement)" 
            value={heading} 
            onChange={e => setHeading(e.target.value)} 
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'white' }}
          />
          <input 
            type="text" 
            placeholder="Subheading (e.g. Pool closed on Friday)" 
            value={subheading} 
            onChange={e => setSubheading(e.target.value)} 
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'white' }}
          />
          <textarea 
            placeholder="Detailed Content (optional)" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            rows="4" 
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'white', fontFamily: 'inherit', resize: 'vertical' }} 
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-brand" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Banner'}</button>
            {banner && (
              <>
                <button className={banner.is_active ? 'btn-active' : 'btn-inactive'} onClick={toggleActive}>{banner.is_active ? 'Active' : 'Inactive'}</button>
                <button className="btn-delete" onClick={remove}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
