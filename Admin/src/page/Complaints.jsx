import React from 'react'

const items = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  order: `DH${1000 + i}`,
  buyer: `Buyer ${i + 1}`,
  content: 'Hàng nhận không đúng mô tả',
  status: i % 2 === 0 ? 'Mới' : 'Đang xử lý',
}))

const Complaints = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Khiếu nại người mua</h2>
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">Mã đơn</th>
              <th className="px-3 py-2 font-medium">Người mua</th>
              <th className="px-3 py-2 font-medium">Nội dung</th>
              <th className="px-3 py-2 font-medium">Trạng thái</th>
              <th className="px-3 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b last:border-0">
                <td className="px-3 py-2 text-sm text-gray-700">{it.order}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{it.buyer}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{it.content}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{it.status}</td>
                <td className="px-3 py-2 space-x-3">
                  <button className="text-blue-600 hover:underline text-sm">Xem</button>
                  <button className="text-green-600 hover:underline text-sm">Đánh dấu xử lý</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Complaints


