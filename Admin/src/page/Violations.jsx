import React from 'react'

const items = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  shop: `Shop ${i + 1}`,
  type: i % 2 === 0 ? 'Bán hàng cấm' : 'Mô tả sai sự thật',
  penalty: i % 2 === 0 ? 'Khoá 7 ngày' : 'Cảnh cáo',
}))

const Violations = () => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Vi phạm người bán</h2>
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">Cửa hàng</th>
              <th className="px-3 py-2 font-medium">Loại vi phạm</th>
              <th className="px-3 py-2 font-medium">Hình phạt</th>
              <th className="px-3 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b last:border-0">
                <td className="px-3 py-2 text-sm text-gray-700">{it.shop}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{it.type}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{it.penalty}</td>
                <td className="px-3 py-2 space-x-3">
                  <button className="text-blue-600 hover:underline text-sm">Xem</button>
                  <button className="text-red-600 hover:underline text-sm">Khoá shop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Violations


