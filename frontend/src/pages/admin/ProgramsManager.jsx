import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const defaultPrograms = [
  { category: 'pool', time_range: '6:00 AM - 7:00 AM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '7:10 AM - 8:10 AM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '8:20 AM - 9:20 AM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '9:30 AM - 10:30 AM', label: 'Ladies Only', badge_type: 'ladies' },
  { category: 'pool', time_range: '10:40 AM - 3:50 PM', label: 'Public Only', badge_type: 'public' },
  { category: 'pool', time_range: '4:00 PM - 5:00 PM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '5:10 PM - 6:10 PM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '6:20 PM - 7:20 PM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '8:30 PM - 9:30 PM', label: 'Coaching & Public', badge_type: 'default' },
  { category: 'pool', time_range: '9:30 PM - 10:30 PM', label: 'Public Only', badge_type: 'public' },
  { category: 'yoga', time_range: '8:10 AM - 9:10 AM', label: 'Morning Session', badge_type: 'default' },
  { category: 'yoga', time_range: '6:45 PM - 7:45 PM', label: 'Evening Session', badge_type: 'default' },
  { category: 'zumba', time_range: '6:30 AM - 7:30 AM', label: 'Morning Session', badge_type: 'default' },
  { category: 'zumba', time_range: '8:30 PM - 9:30 PM', label: 'Evening Session', badge_type: 'default' },
]

export default function ProgramsManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: 'pool', time_range: '', label: '', badge_type: 'default' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const load = async () => {
    const { data } = await supabase.from('programs').select('*').order('order_val')
    if (!data || data.length === 0) {
      const defaultsWithOrder = defaultPrograms.map((p, i) => ({ ...p, order_val: i }))
      await supabase.from('programs').insert(defaultsWithOrder)
      const { data: newData } = await supabase.from('programs').select('*').order('order_val')
      setItems(newData || [])
    } else {
      setItems(data)
    }
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.time_range || !form.label) return alert('Fill all fields')
    await supabase.from('programs').insert([{ ...form, order_val: Math.floor(Date.now() / 1000) }])
    setForm({ category: 'pool', time_range: '', label: '', badge_type: 'default' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('programs').delete().eq('id', id)
    load()
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditForm({ time_range: item.time_range, label: item.label, badge_type: item.badge_type })
  }

  const saveEdit = async (id) => {
    if (!editForm.time_range || !editForm.label) return alert('Fill all fields')
    await supabase.from('programs').update(editForm).eq('id', id)
    setEditingId(null)
    load()
  }

  const restoreDefaults = async () => {
    if (!confirm('This will load the current hardcoded site data into the database so you can edit it. Any existing custom edits will be overwritten. Continue?')) return
    await supabase.from('programs').delete().neq('id', 0)
    const defaultsWithOrder = defaultPrograms.map((p, i) => ({ ...p, order_val: i }))
    await supabase.from('programs').insert(defaultsWithOrder)
    load()
  }

  const grouped = { pool: items.filter(i => i.category === 'pool'), yoga: items.filter(i => i.category === 'yoga'), zumba: items.filter(i => i.category === 'zumba') }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Programs & Schedule</h2>
        <button className="btn-brand" style={{ background: '#007bff' }} onClick={restoreDefaults}>Load Current Site Data</button>
      </div>
      <div className="admin-card">
        <h5>Add Timing</h5>
        <div className="admin-form-row">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="pool">Pool</option><option value="yoga">Yoga</option><option value="zumba">Zumba</option>
          </select>
          <input type="text" placeholder="Time (e.g. 6:00 AM - 7:00 AM)" value={form.time_range} onChange={e => setForm({ ...form, time_range: e.target.value })} />
          <input type="text" placeholder="Label (e.g. Coaching & Public)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          {form.category === 'pool' && (
            <select value={form.badge_type} onChange={e => setForm({ ...form, badge_type: e.target.value })}>
              <option value="default">Default</option><option value="ladies">Ladies Only</option><option value="public">Public Only</option>
            </select>
          )}
          <button className="btn-brand" onClick={add}>Add</button>
        </div>
      </div>
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} className="admin-card">
          <h5>{cat.charAt(0).toUpperCase() + cat.slice(1)} Timings ({list.length})</h5>
          {list.length === 0 ? <p>No timings. Default values will be shown on the website.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Time</th><th>Label</th>{cat === 'pool' && <th>Badge</th>}<th>Action</th></tr></thead>
                <tbody>
                  {list.map(item => (
                    <tr key={item.id}>
                      {editingId === item.id ? (
                        <>
                          <td><input type="text" value={editForm.time_range} onChange={e => setEditForm({ ...editForm, time_range: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} /></td>
                          <td><input type="text" value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} /></td>
                          {cat === 'pool' && (
                            <td>
                              <select value={editForm.badge_type} onChange={e => setEditForm({ ...editForm, badge_type: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                                <option value="default">Default</option><option value="ladies">Ladies Only</option><option value="public">Public Only</option>
                              </select>
                            </td>
                          )}
                          <td>
                            <button className="btn-brand" onClick={() => saveEdit(item.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', marginRight: '0.5rem' }}>Save</button>
                            <button className="btn-delete" onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.time_range}</td><td>{item.label}</td>
                          {cat === 'pool' && <td>{item.badge_type}</td>}
                          <td>
                            <button className="btn-brand" onClick={() => startEdit(item)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', marginRight: '0.5rem', background: '#4CAF50' }}>Edit</button>
                            <button className="btn-delete" onClick={() => remove(item.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}>Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      <div className="admin-card" style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)' }}>
        <p style={{ margin: 0, color: '#ffc107' }}>💡 If no timings exist in the database for a category, the website will show the default hardcoded values.</p>
      </div>
    </div>
  )
}
