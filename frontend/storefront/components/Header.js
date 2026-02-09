import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function Header() {
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Chopify</Link>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <Link href="/cart" className="text-gray-700 hover:text-gray-900 relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
