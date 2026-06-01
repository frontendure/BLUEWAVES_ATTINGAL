import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const cats = ['facilities', 'pool-area', 'training', 'swimmers-coaches', 'general']

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [file, setFile] = useState(null)
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('general')
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const load = () => supabase.from('gallery').select('*').order('order_val').then(({ data }) => setImages(data || []))
  useEffect(() => { load() }, [])

  const compressImage = (file, maxWidth = 1600, quality = 0.8) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            } else {
              width = Math.round((width * maxWidth) / height)
              height = maxWidth
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (blob) {
              const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
              const compressedFile = new File([blob], `${nameWithoutExt}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          }, 'image/jpeg', quality)
        }
        img.onerror = () => resolve(file)
      }
      reader.onerror = () => resolve(file)
    })
  }

  const upload = async () => {
    if (!file) return alert('Select a file')
    setUploading(true)
    
    // Compress the image client-side to reduce Supabase storage usage and load times
    const uploadFile = await compressImage(file)
    
    const fileName = Date.now() + '_' + uploadFile.name
    const { error: upErr } = await supabase.storage.from('gallery').upload(fileName, uploadFile)
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

  const startEdit = (img) => {
    setEditingId(img.id)
    setEditForm({ alt: img.alt || '', category: img.category || 'general' })
  }

  const saveEdit = async (id) => {
    await supabase.from('gallery').update(editForm).eq('id', id)
    setEditingId(null)
    load()
  }

  const clearGallery = async () => {
    if (!confirm('This will delete all image records from the database. The physical files will remain in storage but won\'t show on the site. Continue?')) return
    await supabase.from('gallery').delete().neq('id', 0)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gallery</h2>
        <button className="btn-brand" style={{ background: '#6c757d' }} onClick={clearGallery}>Clear All (Default)</button>
      </div>
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
              {editingId === img.id ? (
                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="text" value={editForm.alt} onChange={e => setEditForm({ ...editForm, alt: e.target.value })} placeholder="Alt text" style={{ padding: '0.3rem', width: '100%' }} />
                  <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={{ padding: '0.3rem', width: '100%' }}>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => saveEdit(img.id)} className="btn-brand" style={{ flex: 1, padding: '0.3rem', fontSize: '0.85rem' }}>Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-delete" style={{ flex: 1, padding: '0.3rem', fontSize: '0.85rem' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="admin-image-info">
                  <div>
                    <small style={{ display: 'block', fontWeight: 'bold' }}>{img.category || 'general'}</small>
                    <small style={{ color: '#666' }}>{img.alt || 'No alt text'}</small>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => startEdit(img)} className="btn-brand" style={{ background: '#4CAF50', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => remove(img.id)} className="btn-delete" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
