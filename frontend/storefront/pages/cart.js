import Header from '@/components/Header'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

export default function Cart() {
  const { cart, removeItem, updateQuantity, total } = useCart()

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">Your cart is empty</p>
            <Link href="/" className="text-blue-600">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-white border rounded">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">₦{item.price}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 p-2 border rounded"
                    />
                    <div className="w-24 text-right">₦{(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 px-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="block w-full bg-blue-600 text-white text-center py-3 rounded">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  )
}
