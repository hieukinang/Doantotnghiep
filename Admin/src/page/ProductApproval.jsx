import React, { useState } from 'react'

const mockProducts = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  vendor: `Shop ${i + 1}`,
  price: (i + 1) * 100000,
}))

const ProductApproval = () => {
  const [products] = useState(mockProducts)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Duyệt sản phẩm</h2>
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">Tên</th>
              <th className="px-3 py-2 font-medium">Người bán</th>
              <th className="px-3 py-2 font-medium">Giá</th>
              <th className="px-3 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-3 py-2 text-sm text-gray-700">{p.name}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{p.vendor}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{p.price.toLocaleString()}₫</td>
                <td className="px-3 py-2 space-x-3">
                  <button className="text-green-600 hover:underline text-sm">Duyệt</button>
                  <button className="text-red-600 hover:underline text-sm">Từ chối</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductApproval


