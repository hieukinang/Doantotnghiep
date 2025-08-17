import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const items = [
  { id: 1, name: 'Tai nghe Bluetooth Pro', price: 399000, qty: 1 },
  { id: 2, name: 'Bàn phím cơ', price: 899000, qty: 2 },
]

const format = (v) => v.toLocaleString('vi-VN')

const PlaceOrder = () => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold">Địa chỉ nhận hàng</div>
              <div className="mt-3 text-sm">
                <div className="font-medium">Nguyễn Văn A • 0909xxxxxx</div>
                <div>12 Nguyễn Trãi, Phường 5, Q.5, TP.HCM</div>
              </div>
              <button className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1]">Thay đổi</button>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold">Phương thức thanh toán</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" defaultChecked className="accent-[#116AD1]" />
                  Ví KOHI
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  Thẻ tín dụng/Ghi nợ
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  COD - Thanh toán khi nhận
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  Chuyển khoản
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold mb-3">Sản phẩm</div>
              <div className="divide-y">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between py-3">
                    <div>{i.name} x{i.qty}</div>
                    <div className="font-semibold">{format(i.price * i.qty)}₫</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold">{format(subtotal)}₫</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Vận chuyển</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-lg">
              <span>Tổng thanh toán</span>
              <span className="text-[#116AD1] font-bold">{format(subtotal)}₫</span>
            </div>
            <a href="/payment" className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]">
              Đặt hàng
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PlaceOrder