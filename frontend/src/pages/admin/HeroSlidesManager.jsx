import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState([])
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [uploading, setUploading] = useState(false)

  const load = () => supabase.from('hero_slides').select('*').order('order_val').then(({ data }) => setSlides(data || []))
  useEffect(() => { load() }, [])

  const upload = async () => {
    if (!file) return alert('Select a file')
    setUploading(true)
    const fileName = Date.now() + '_' + file.name
    const { error: upErr } = await supabase.storage.from('hero-slides').upload(fileName, file)
    if (upErr) { alert('Upload failed: ' + upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('hero-slides').getPublicUrl(fileName)
    await supabase.from('hero_slides').insert([{ image_url: publicUrl, title, subtitle, order_val: Date.now() }])
    setFile(null); setTitle(''); setSubtitle(''); setUploading(false); load()
  }

  const toggleActive = async (id, current) => {
    await supabase.from('hero_slides').update({ is_active: !current }).eq('id', id)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this slide?')) return
    await supabase.from('hero_slides').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h2>Hero Slides</h2>
      <div className="admin-card">
        <h5>Add New Slide</h5>
        <div className="admin-form-row">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <input type="text" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="text" placeholder="Subtitle (optional)" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          <button className="btn-brand" onClick={upload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h5>Current Slides</h5>
        {slides.length === 0 ? <p>No slides yet.</p> : (
          <div className="admin-grid">
            {slides.map(s => (
              <div key={s.id} className="admin-image-card">
                <img src={s.image_url} alt={s.title || 'Slide'} />
                <div className="admin-image-info">
                  {s.title && <strong>{s.title}</strong>}
                  {s.subtitle && <small>{s.subtitle}</small>}
                  <div className="admin-image-actions">
                    <button onClick={() => toggleActive(s.id, s.is_active)} className={s.is_active ? 'btn-active' : 'btn-inactive'}>{s.is_active ? 'Active' : 'Inactive'}</button>
                    <button onClick={() => remove(s.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
