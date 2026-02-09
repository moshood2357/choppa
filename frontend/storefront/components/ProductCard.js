import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">₦{product.price}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.stock} in stock</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
