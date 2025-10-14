import React from 'react'
import SellerLayout from '../../component-seller-page/SellerLayout'

const ratings = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  stars: 3 + (i % 3),
  comment: 'Sản phẩm tốt, giao nhanh, đóng gói cẩn thận.',
  product: 'Tai nghe Bluetooth Pro',
  date: '12/08/2025'
}))

const Star = ({ n }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-sm ${i < n ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ))}
  </div>
)

const Rating = () => {
  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="font-semibold">Phản hồi của khách hàng</div>
          <input className="border rounded px-3 py-1 text-sm" placeholder="Tìm theo sản phẩm/khách" />
        </div>
        <div className="divide-y">
          {ratings.map((r) => (
            <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.user}</div>
                  <Star n={r.stars} />
                </div>
                <div className="text-sm text-gray-600 mt-1">{r.comment}</div>
                <div className="text-xs text-gray-500 mt-1">Sản phẩm: {r.product} • {r.date}</div>
              </div>
              <div className="flex gap-2 md:ml-auto">
                <button className="px-3 py-1 border rounded text-sm">Trả lời</button>
                <button className="px-3 py-1 border rounded text-sm text-red-600 border-red-300">Ẩn</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rating