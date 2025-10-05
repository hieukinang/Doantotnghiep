import React from 'react'
import { Link } from 'react-router-dom'
import SellerLayout from '../../component-seller-page/SellerLayout'

const cards = [
  { label: 'Doanh thu hôm nay', value: 12500000, color: 'bg-[#116AD1]/10 text-[#116AD1]' },
  { label: 'Doanh thu tháng', value: 389000000, color: 'bg-green-100 text-green-700' },
  { label: 'Số dư ví', value: 8750000, color: 'bg-yellow-100 text-yellow-700' },
]

const format = (v) => v.toLocaleString('vi-VN') + '₫'

const Finance = () => {
  return (
    <SellerLayout title="Tài chính">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <div key={i} className={`rounded p-4 ${c.color}`}>
            <div className="text-sm">{c.label}</div>
            <div className="text-2xl font-bold mt-1">{format(c.value)}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow mt-6 overflow-auto">
        <div className="p-4 font-semibold border-b">Giao dịch gần đây</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Mã GD</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Nội dung</th>
              <th className="px-4 py-2">Số tiền</th>
              <th className="px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-2">GD00{i + 1}</td>
                <td className="px-4 py-2">12/08/2025</td>
                <td className="px-4 py-2">Rút ví KOHI</td>
                <td className="px-4 py-2 text-[#116AD1] font-semibold">{format(500000)}</td>
                <td className="px-4 py-2"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Thành công</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-[#116AD1] text-white rounded">Rút tiền</button>
        <Link to="/seller/sales-report" className="px-4 py-2 border rounded">Xem báo cáo</Link>
      </div>
    </SellerLayout>
  )
}

export default Finance