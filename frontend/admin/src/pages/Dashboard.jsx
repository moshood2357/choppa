import React from 'react'

export default function Dashboard(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Total Sales: ₦0</div>
        <div className="p-4 bg-white rounded shadow">Orders: 0</div>
        <div className="p-4 bg-white rounded shadow">Products: 0</div>
      </div>
    </div>
  )
}
