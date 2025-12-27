import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const ExchangeRequest = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-4 md:p-5 shadow">
          <div className="font-semibold text-base md:text-lg">Yêu cầu đổi/trả</div>
          <form className="mt-4 grid grid-cols-1 gap-3">
            <input className="border rounded px-3 py-2 text-sm md:text-base" placeholder="Mã đơn hàng (VD: KOHI12345)" />
            <input className="border rounded px-3 py-2 text-sm md:text-base" placeholder="Sản phẩm cần đổi/trả" />
            <select className="border rounded px-3 py-2 text-sm md:text-base">
              <option>Lý do: Không đúng mô tả</option>
              <option>Hàng lỗi/thiếu phụ kiện</option>
              <option>Giao sai mẫu/màu</option>
              <option>Khác</option>
            </select>
            <textarea className="border rounded px-3 py-2 text-sm md:text-base" rows="4" placeholder="Mô tả chi tiết"></textarea>
            <div className="border rounded p-3">
              <div className="text-xs md:text-sm text-gray-600">Hình ảnh minh họa</div>
              <input type="file" className="mt-2 text-sm" multiple />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="mt-2 px-4 py-2 bg-[#116AD1] text-white rounded w-full sm:w-fit text-sm md:text-base">Gửi yêu cầu</button>
              <Link to="/orders" className="mt-2 px-4 py-2 border rounded w-full sm:w-fit text-center text-sm md:text-base">Quay lại</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ExchangeRequest