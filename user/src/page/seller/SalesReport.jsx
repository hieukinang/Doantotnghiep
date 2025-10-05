import React from 'react'
import SellerLayout from '../../component-seller-page/SellerLayout'

const Card = ({ label, value, sub }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
    {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
  </div>
)

const SalesReport = () => {
  return (
    <SellerLayout title="Báo cáo doanh số">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Doanh thu hôm nay" value="12.500.000₫" sub="+8% vs hôm qua" />
        <Card label="Đơn hàng hôm nay" value="86" sub="+12%" />
        <Card label="Tỷ lệ hủy" value="0,8%" sub="-0,2%" />
        <Card label="Sản phẩm bán chạy" value="Tai nghe Pro" />
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="font-semibold mb-2">Doanh thu 7 ngày</div>
        <div className="h-64 bg-gradient-to-b from-[#116AD1]/20 to-transparent rounded flex items-end gap-2 p-3">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div className="mx-auto w-6 bg-[#116AD1] rounded" style={{ height: `${30 + i * 8}px` }} />
              <div className="text-xs text-center mt-1 text-gray-500">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow overflow-auto">
        <div className="p-4 font-semibold border-b">Sản phẩm bán chạy</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2">Sản phẩm</th>
              <th className="px-4 py-2">Đã bán</th>
              <th className="px-4 py-2">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-2">Tai nghe Bluetooth Pro</td>
                <td className="px-4 py-2">{120 - i * 7}</td>
                <td className="px-4 py-2 text-[#116AD1] font-semibold">{(12500000 - i * 500000).toLocaleString('vi-VN')}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SellerLayout>
  )
}

export default SalesReport