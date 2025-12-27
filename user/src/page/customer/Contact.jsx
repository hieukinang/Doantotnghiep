import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg p-4 md:p-5 shadow">
            <div className="font-semibold text-base md:text-lg">Liên hệ</div>
            <form className="mt-4 grid grid-cols-1 gap-3">
              <input className="border rounded px-3 py-2 text-sm md:text-base" placeholder="Họ và tên" />
              <input className="border rounded px-3 py-2 text-sm md:text-base" placeholder="Email" />
              <textarea className="border rounded px-3 py-2 text-sm md:text-base" rows="5" placeholder="Nội dung"></textarea>
              <button className="px-4 py-2 bg-[#116AD1] text-white rounded w-fit text-sm md:text-base">Gửi</button>
            </form>
          </div>
          <div className="bg-white rounded-lg p-4 md:p-5 shadow">
            <div className="font-semibold text-base md:text-lg">KOHI MALL</div>
            <div className="mt-2 text-xs md:text-sm text-gray-700">
              12 Nguyễn Trãi, P.5, Q.5, TP.HCM
              <br /> Email: support@kohimall.vn
              <br /> Hotline: 1900 1234
            </div>
            <div className="mt-4 h-36 md:h-48 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 text-center">
          <Link to="/" className="inline-block px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-sm md:text-base">
            Về trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Contact