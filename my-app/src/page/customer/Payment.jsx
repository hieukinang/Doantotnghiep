import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const Payment = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold">Xác nhận thanh toán</div>
              <div className="mt-3 text-sm text-gray-700">
                Đơn hàng #KOHI12345 • 3 sản phẩm • Tổng: <span className="font-bold text-[#116AD1]">1.697.000₫</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="px-3 py-2 border rounded hover:bg-gray-50">Ví KOHI</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50">Thẻ tín dụng</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50">Chuyển khoản</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50">COD</button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold mb-3">Nhập mã giảm giá</div>
              <div className="flex gap-2">
                <input className="flex-1 border rounded px-3" placeholder="Mã giảm giá" />
                <button className="px-4 bg-[#116AD1] text-white rounded">Áp dụng</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="flex justify-between">
              <span>Tổng đơn</span>
              <span className="font-semibold">1.697.000₫</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Giảm giá</span>
              <span className="font-semibold">- 50.000₫</span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-lg">
              <span>Cần thanh toán</span>
              <span className="text-[#116AD1] font-bold">1.647.000₫</span>
            </div>
            <a href="/orders" className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]">Thanh toán</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Payment