import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProgramsManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: 'pool', time_range: '', label: '', badge_type: 'default' })

  const load = () => supabase.from('programs').select('*').order('order_val').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.time_range || !form.label) return alert('Fill all fields')
    await supabase.from('programs').insert([{ ...form, order_val: Date.now() }])
    setForm({ category: 'pool', time_range: '', label: '', badge_type: 'default' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('programs').delete().eq('id', id)
    load()
  }

  const grouped = { pool: items.filter(i => i.category === 'pool'), yoga: items.filter(i => i.category === 'yoga'), zumba: items.filter(i => i.category === 'zumba') }

  return (
    <div>
      <h2>Programs & Schedule</h2>
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
            <table className="admin-table">
              <thead><tr><th>Time</th><th>Label</th>{cat === 'pool' && <th>Badge</th>}<th>Action</th></tr></thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.id}>
                    <td>{item.time_range}</td><td>{item.label}</td>
                    {cat === 'pool' && <td>{item.badge_type}</td>}
                    <td><button className="btn-delete" onClick={() => remove(item.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      <div className="admin-card" style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)' }}>
        <p style={{ margin: 0, color: '#ffc107' }}>💡 If no timings exist in the database for a category, the website will show the default hardcoded values.</p>
      </div>
    </div>
  )
}
