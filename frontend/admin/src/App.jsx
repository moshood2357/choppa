import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { clearToken, isAuthenticated } from './utils/auth'
import "./styles.css";

export default function App() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Choppa.shop Admin</div>
          <div className="space-x-4 ">
            <Link to="/dashboard" className="text-gray-700">Dashboard</Link>
            <Link to="/categories" className="text-gray-700">Categories</Link>
            <Link to="/products" className="text-gray-700">Products</Link>
            <Link to="/orders" className="text-gray-700">Orders</Link>
            {isAuthenticated() ? (
              <button onClick={handleLogout} className="ml-4 text-red-600">Logout</button>
            ) : (
              <Link to="/login" className="ml-4 text-gray-700">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
