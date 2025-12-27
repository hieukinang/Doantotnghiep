import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const Payment = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg p-4 md:p-5 shadow">
              <div className="font-semibold text-sm md:text-base">Xác nhận thanh toán</div>
              <div className="mt-3 text-xs md:text-sm text-gray-700">
                Đơn hàng #KOHI12345 • 3 sản phẩm • Tổng: <span className="font-bold text-[#116AD1]">1.697.000₫</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
                <button className="px-3 py-2 border rounded hover:bg-gray-50 text-sm md:text-base">Ví KOHI</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50 text-sm md:text-base">Thẻ tín dụng</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50 text-sm md:text-base">Chuyển khoản</button>
                <button className="px-3 py-2 border rounded hover:bg-gray-50 text-sm md:text-base">COD</button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 md:p-5 shadow">
              <div className="font-semibold mb-3 text-sm md:text-base">Nhập mã giảm giá</div>
              <div className="flex gap-2">
                <input className="flex-1 border rounded px-3 py-2 text-sm md:text-base" placeholder="Mã giảm giá" />
                <button className="px-3 md:px-4 py-2 bg-[#116AD1] text-white rounded text-sm md:text-base whitespace-nowrap">Áp dụng</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-5 h-fit">
            <div className="flex justify-between text-sm md:text-base">
              <span>Tổng đơn</span>
              <span className="font-semibold">1.697.000₫</span>
            </div>
            <div className="flex justify-between mt-2 text-sm md:text-base">
              <span>Giảm giá</span>
              <span className="font-semibold">- 50.000₫</span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-base md:text-lg">
              <span>Cần thanh toán</span>
              <span className="text-[#116AD1] font-bold">1.647.000₫</span>
            </div>
            <Link to="/orders" className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa] text-sm md:text-base">Thanh toán</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Payment