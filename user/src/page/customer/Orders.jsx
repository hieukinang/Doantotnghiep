import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const mock = [
  { id: 'KOHI12345', status: 'Đang xử lý', total: 699000, items: 2, date: '12/08/2025' },
  { id: 'KOHI12346', status: 'Đang giao', total: 1299000, items: 1, date: '05/08/2025' },
  { id: 'KOHI12347', status: 'Hoàn thành', total: 349000, items: 3, date: '29/07/2025' },
]

const tabs = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy']

const Orders = () => {
  const [active, setActive] = useState('Tất cả')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-auto pb-2">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActive(t)}
                className={`px-4 py-2 rounded-full border ${active===t?'bg-[#116AD1] text-white border-[#116AD1]':'border-gray-300 bg-white'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {mock
              .filter(o => active==='Tất cả' || o.status===active)
              .map((o) => (
              <div key={o.id} className="bg-white rounded-lg p-4 shadow flex items-center justify-between">
                <div>
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-sm text-gray-500">{o.date} • {o.items} sản phẩm</div>
                </div>
                <div className="text-right">
                  <div className="text-[#116AD1] font-bold">{o.total.toLocaleString('vi-VN')}₫</div>
                  <div className="text-sm">{o.status}</div>
                </div>
                <div className="flex gap-2">
                  <Link to="/order-detail" className="text-sm text-[#116AD1] hover:underline">Chi tiết</Link>
                  <Link to="/exchange-request" className="text-sm text-[#116AD1] hover:underline">Đổi trả</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="inline-block px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Orders