import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const cats = [
  { key: 'swimming_coaching', label: 'Swimming (With Coaching)' },
  { key: 'swimming_public', label: 'Swimming (Without Coaching)' },
  { key: 'wellness', label: 'Wellness Classes' },
  { key: 'special', label: 'Special Passes' },
]

const defaultMemberships = [
  { category: 'swimming_coaching', name: 'Adult - 1st Month', price: '₹3,000', note: '(+₹500 Admission)' },
  { category: 'swimming_coaching', name: 'Adult - 2nd Month', price: '₹3,000', note: '' },
  { category: 'swimming_coaching', name: 'Adult - 3rd Month', price: '₹2,500', note: '' },
  { category: 'swimming_coaching', name: 'Kids - 1st Month', price: '₹2,500', note: '(+₹500 Admission)' },
  { category: 'swimming_coaching', name: 'Kids - 2nd Month', price: '₹2,500', note: '' },
  { category: 'swimming_coaching', name: 'Advanced Coaching', price: '₹2,500', note: '' },
  { category: 'swimming_coaching', name: 'Personal Training (1 Month)', price: '₹6,000', note: '' },
  { category: 'swimming_public', name: 'Monthly Plus', price: '₹2,500', note: '(+₹500 Admission)' },
  { category: 'swimming_public', name: '6 Months Package', price: '₹10,000', note: '' },
  { category: 'swimming_public', name: '1 Year Package', price: '₹18,000', note: '' },
  { category: 'swimming_public', name: 'Family Package (4 Members)', price: '₹7,500', note: '' },
  { category: 'swimming_public', name: 'Public Pass (1 Hour)', price: '₹150', note: '' },
  { category: 'wellness', name: 'Zumba (Monthly)', price: '₹1,500', note: '(+₹500 Adm)' },
  { category: 'wellness', name: 'Yoga (Monthly)', price: '₹1,200', note: '(+₹500 Adm)' },
  { category: 'special', name: 'Student Pass', price: '₹100', note: 'Applicable for Std 8 to 12. Valid school ID required.' }
]

export default function MembershipFeesManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: 'swimming_coaching', name: '', price: '', note: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const load = async () => {
    const { data } = await supabase.from('membership_fees').select('*').order('order_val')
    if (!data || data.length === 0) {
      const defaultsWithOrder = defaultMemberships.map((p, i) => ({ ...p, order_val: i }))
      await supabase.from('membership_fees').insert(defaultsWithOrder)
      const { data: newData } = await supabase.from('membership_fees').select('*').order('order_val')
      setItems(newData || [])
    } else {
      setItems(data)
    }
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.name || !form.price) return alert('Fill name and price')
    await supabase.from('membership_fees').insert([{ ...form, order_val: Math.floor(Date.now() / 1000) }])
    setForm({ category: 'swimming_coaching', name: '', price: '', note: '' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('membership_fees').delete().eq('id', id)
    load()
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditForm({ name: item.name, price: item.price, note: item.note || '' })
  }

  const saveEdit = async (id) => {
    if (!editForm.name || !editForm.price) return alert('Fill name and price')
    await supabase.from('membership_fees').update(editForm).eq('id', id)
    setEditingId(null)
    load()
  }

  const restoreDefaults = async () => {
    if (!confirm('This will load the current hardcoded site data into the database so you can edit it. Any existing custom edits will be overwritten. Continue?')) return
    await supabase.from('membership_fees').delete().neq('id', 0)
    const defaultsWithOrder = defaultMemberships.map((p, i) => ({ ...p, order_val: i }))
    await supabase.from('membership_fees').insert(defaultsWithOrder)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Membership Fees</h2>
        <button className="btn-brand" style={{ background: '#007bff' }} onClick={restoreDefaults}>Load Current Site Data</button>
      </div>
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
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Price</th><th>Note</th><th>Action</th></tr></thead>
                  <tbody>
                    {list.map(item => (
                      <tr key={item.id}>
                        {editingId === item.id ? (
                          <>
                            <td><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} /></td>
                            <td><input type="text" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} /></td>
                            <td><input type="text" value={editForm.note} onChange={e => setEditForm({ ...editForm, note: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} /></td>
                            <td>
                              <button className="btn-brand" onClick={() => saveEdit(item.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', marginRight: '0.5rem' }}>Save</button>
                              <button className="btn-delete" onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}>Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.name}</td><td>{item.price}</td><td>{item.note || '-'}</td>
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
        )
      })}
      <div className="admin-card" style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)' }}>
        <p style={{ margin: 0, color: '#ffc107' }}>💡 If no fees exist for a category, defaults will be shown on the public page.</p>
      </div>
    </div>
  )
}
