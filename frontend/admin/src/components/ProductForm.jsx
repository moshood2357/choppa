import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function ProductForm({ product = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category_id: null,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [catLoading, setCatLoading] = useState(true)
  const [catError, setCatError] = useState('')

  useEffect(() => {
    if (product) setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      quantity: product.quantity || 0,
      category_id: product.category_id || product.category?.id || null,
    })
    else setForm({ name: '', description: '', price: 0, quantity: 0, category_id: null })

    // Fetch categories
    setCatLoading(true)
    setCatError('')
    api.get('/categories')
      .then(res => {
        const data = res.data.data || res.data
        console.log('Categories fetched:', data)
        setCategories(Array.isArray(data) ? data : [])
        if (!Array.isArray(data) || data.length === 0) {
          setCatError('No categories found. Create one first.')
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err)
        setCatError(err.response?.data?.message || 'Failed to load categories')
        setCategories([])
      })
      .finally(() => setCatLoading(false))
  }, [product])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const submit = async (e) => {
    e && e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let res
      if (product && product.id) {
        res = await api.put(`/products/${product.id}`, form)
      } else {
        res = await api.post('/products', form)
      }
      const data = res.data.data || res.data
      onSave && onSave(data)
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error saving product'
      console.error('Product save error', err)
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      <div className="mb-2">
        <label className="block text-sm">Name</label>
        <input className="w-full p-2 border rounded" value={form.name} onChange={e => update('name', e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Description</label>
        <textarea className="w-full p-2 border rounded" value={form.description} onChange={e => update('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="block text-sm">Price</label>
          <input type="number" className="w-full p-2 border rounded" value={form.price} onChange={e => update('price', Number(e.target.value) || 0)} required />
        </div>
        <div>
          <label className="block text-sm">Quantity</label>
          <input type="number" className="w-full p-2 border rounded" value={form.quantity} onChange={e => update('quantity', Number(e.target.value) || 0)} required />
        </div>
        <div>
          <label className="block text-sm">Category</label>
          {catLoading ? (
            <div className="w-full p-2 border rounded bg-gray-100 text-sm">Loading...</div>
          ) : catError ? (
            <div className="w-full p-2 border rounded bg-red-50 text-red-600 text-sm">{catError}</div>
          ) : categories.length === 0 ? (
            <div className="w-full p-2 border rounded bg-yellow-50 text-yellow-700 text-sm">No categories</div>
          ) : (
            <select className="w-full p-2 border rounded" value={form.category_id || ''} onChange={e => update('category_id', e.target.value || null)}>
              <option value="">— Select —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}
