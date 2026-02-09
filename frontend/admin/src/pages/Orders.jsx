import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders')
      const data = res.data.data || res.data || []
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load orders', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true)
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus })
      const updated = res.data.data || res.data
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
      if (selected?.id === orderId) setSelected(updated)
    } catch (err) {
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const markAsPaid = async (orderId) => {
    setUpdating(true)
    try {
      const res = await api.post(`/orders/${orderId}/mark-as-paid`)
      const updated = res.data.data || res.data
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
      if (selected?.id === orderId) setSelected(updated)
    } catch (err) {
      alert('Failed to mark as paid')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Orders List */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-500">No orders yet</div>
        ) : (
          <div className="space-y-2">
            {orders.map(o => (
              <div 
                key={o.id} 
                onClick={() => setSelected(o)}
                className={`p-3 rounded shadow cursor-pointer transition ${
                  selected?.id === o.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">Order #{o.order_number || o.id}</div>
                    <div className="text-sm text-gray-600">{o.customer_name}</div>
                    <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₦{(o.total || 0).toLocaleString()}</div>
                    <div className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                      {o.status || 'pending'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="col-span-1">
        {selected ? (
          <div className="bg-white p-4 rounded shadow sticky top-4">
            <h2 className="text-lg font-bold mb-3">Order Details</h2>
            
            {/* Customer Info */}
            <div className="mb-4 pb-3 border-b">
              <div className="text-sm text-gray-600">Customer</div>
              <div className="font-semibold">{selected.customer_name}</div>
              {selected.customer_email && <div className="text-sm">{selected.customer_email}</div>}
              <div className="text-sm">{selected.customer_phone}</div>
            </div>

            {/* Items */}
            {selected.items && selected.items.length > 0 && (
              <div className="mb-4 pb-3 border-b">
                <div className="text-sm font-semibold mb-2">Items ({selected.items.length})</div>
                {selected.items.map((item, idx) => (
                  <div key={idx} className="text-sm mb-1">
                    <div>{item.product_name || item.product?.name || 'Product'} x {item.quantity}</div>
                    <div className="text-gray-600">₦{(item.price || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="mb-4 pb-3 border-b">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{(selected.total || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4 pb-3 border-b">
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select 
                value={selected.status || 'pending'}
                onChange={e => updateStatus(selected.id, e.target.value)}
                disabled={updating}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="mb-4 pb-3 border-b">
              <div className="text-sm font-semibold mb-2">Payment: {selected.payment_status || 'pending'}</div>
              {selected.payment_status !== 'paid' && (
                <button
                  onClick={() => markAsPaid(selected.id)}
                  disabled={updating}
                  className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded disabled:opacity-50"
                >
                  Mark as Paid
                </button>
              )}
            </div>

            {/* Address */}
            {selected.shipping_address && (
              <div className="text-sm text-gray-600">
                <div className="font-semibold mb-1">Shipping Address</div>
                {selected.shipping_address.street && <div>{selected.shipping_address.street}</div>}
                {selected.shipping_address.city && <div>{selected.shipping_address.city}, {selected.shipping_address.state}</div>}
                {selected.shipping_address.postal_code && <div>{selected.shipping_address.postal_code}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
            Select an order to view details
          </div>
        )}
      </div>
    </div>
  )
}
