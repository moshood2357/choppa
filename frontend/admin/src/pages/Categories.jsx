import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saveLoading, setSaveLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      const data = res.data.data || res.data || []
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load categories', err)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    try {
      const res = await api.post('/categories', form)
      const data = res.data.data || res.data
      setCategories([data, ...categories])
      setForm({ name: '', description: '' })
      setShowForm(false)
    } catch (err) {
      alert('Failed to create category: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Failed to delete category')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-2 bg-green-600 text-white rounded">
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
          <div className="mb-2">
            <label className="block text-sm">Name</label>
            <input 
              className="w-full p-2 border rounded" 
              value={form.name} 
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Description</label>
            <textarea 
              className="w-full p-2 border rounded" 
              value={form.description} 
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <button 
            type="submit" 
            disabled={saveLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {saveLoading ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-gray-500">No categories yet</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  {c.description && <p className="text-sm text-gray-600">{c.description}</p>}
                </div>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
