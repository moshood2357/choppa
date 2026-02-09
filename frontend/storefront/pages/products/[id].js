import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useCart } from '@/lib/CartContext'
import api from '@/lib/api'

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (!productId) return
    api.get(`/products/${productId}`)
      .then(res => setProduct(res.data.data || res.data))
      .catch(() => {})
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      alert('Added to cart!')
    }
  }

  if (!product) return <div><Header /><div className="text-center py-12">Loading...</div></div>

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 h-96 rounded flex items-center justify-center">
            <span className="text-gray-400">Product Image</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="text-2xl font-bold mb-6">₦{product.price}</div>
            <div className="flex gap-4 mb-6">
              <input 
                type="number" 
                min="1" 
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 p-2 border rounded"
              />
              <button 
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      productId: params.id,
    },
  }
}
