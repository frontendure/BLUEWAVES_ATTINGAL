import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const cats = ['facilities', 'pool-area', 'training', 'swimmers-coaches', 'general']

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [file, setFile] = useState(null)
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('general')
  const [uploading, setUploading] = useState(false)

  const load = () => supabase.from('gallery').select('*').order('order_val').then(({ data }) => setImages(data || []))
  useEffect(() => { load() }, [])

  const upload = async () => {
    if (!file) return alert('Select a file')
    setUploading(true)
    const fileName = Date.now() + '_' + file.name
    const { error: upErr } = await supabase.storage.from('gallery').upload(fileName, file)
    if (upErr) { alert('Upload failed: ' + upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
    await supabase.from('gallery').insert([{ url: publicUrl, alt, category, order_val: Date.now() }])
    setFile(null); setAlt(''); setUploading(false); load()
  }

  const remove = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('gallery').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h2>Gallery</h2>
      <div className="admin-card">
        <h5>Upload Image</h5>
        <div className="admin-form-row">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <input type="text" placeholder="Alt text" value={alt} onChange={e => setAlt(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-brand" onClick={upload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h5>Images ({images.length})</h5>
        <div className="admin-grid">
          {images.map(img => (
            <div key={img.id} className="admin-image-card">
              <img src={img.url} alt={img.alt || ''} />
              <div className="admin-image-info">
                <small>{img.category || 'general'}</small>
                <button onClick={() => remove(img.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
