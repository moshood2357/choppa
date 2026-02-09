import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import ProductForm from '../components/ProductForm'

export default function Products(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try{
      const res = await api.get('/products')
      setProducts(res.data.data || res.data || [])
    }catch(err){
      console.error('Failed to load products', err)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ fetchProducts() },[])

  const handleCreate = () => { setEditing(null); setShowForm(true) }

  const handleEdit = (p) => { setEditing(p); setShowForm(true) }

  const handleDelete = async (p) => {
    if (!confirm('Delete this product?')) return
    try{
      await api.delete(`/products/${p.id}`)
      setProducts(prev => prev.filter(x => x.id !== p.id))
    }catch(err){
      alert('Failed to delete')
    }
  }

  const handleSave = (saved) => {
    setShowForm(false)
    setEditing(null)
    // merge updated or new
    setProducts(prev => {
      const exists = prev.find(p => p.id === saved.id)
      if (exists) return prev.map(p => p.id === saved.id ? saved : p)
      return [saved, ...prev]
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div>
          <button onClick={handleCreate} className="px-3 py-2 bg-green-600 text-white rounded">Add Product</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <ProductForm product={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map(p=> (
            <div key={p.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-gray-600">₦{p.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(p)} className="text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
