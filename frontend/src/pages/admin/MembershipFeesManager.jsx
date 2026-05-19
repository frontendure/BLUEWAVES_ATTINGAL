import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const cats = [
  { key: 'swimming_coaching', label: 'Swimming (With Coaching)' },
  { key: 'swimming_public', label: 'Swimming (Without Coaching)' },
  { key: 'wellness', label: 'Wellness Classes' },
  { key: 'special', label: 'Special Passes' },
]

export default function MembershipFeesManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: 'swimming_coaching', name: '', price: '', note: '' })

  const load = () => supabase.from('membership_fees').select('*').order('order_val').then(({ data }) => setItems(data || []))
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.name || !form.price) return alert('Fill name and price')
    await supabase.from('membership_fees').insert([{ ...form, order_val: Date.now() }])
    setForm({ category: 'swimming_coaching', name: '', price: '', note: '' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('membership_fees').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h2>Membership Fees</h2>
      <div className="admin-card">
        <h5>Add Fee Entry</h5>
        <div className="admin-form-row">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {cats.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input type="text" placeholder="Name (e.g. Adult - 1st Month)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="text" placeholder="Price (e.g. ₹3,000)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <button className="btn-brand" onClick={add}>Add</button>
        </div>
      </div>
      {cats.map(cat => {
        const list = items.filter(i => i.category === cat.key)
        return (
          <div key={cat.key} className="admin-card">
            <h5>{cat.label} ({list.length})</h5>
            {list.length === 0 ? <p>No entries. Default values will be shown.</p> : (
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Price</th><th>Note</th><th>Action</th></tr></thead>
                <tbody>
                  {list.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td><td>{item.price}</td><td>{item.note || '-'}</td>
                      <td><button className="btn-delete" onClick={() => remove(item.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
      <div className="admin-card" style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)' }}>
        <p style={{ margin: 0, color: '#ffc107' }}>💡 If no fees exist for a category, defaults will be shown on the public page.</p>
      </div>
    </div>
  )
}
