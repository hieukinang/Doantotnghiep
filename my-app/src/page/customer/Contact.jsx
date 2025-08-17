import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-5 shadow">
            <div className="font-semibold text-lg">Liên hệ</div>
            <form className="mt-4 grid grid-cols-1 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Họ và tên" />
              <input className="border rounded px-3 py-2" placeholder="Email" />
              <textarea className="border rounded px-3 py-2" rows="5" placeholder="Nội dung"></textarea>
              <button className="px-4 py-2 bg-[#116AD1] text-white rounded w-fit">Gửi</button>
            </form>
          </div>
          <div className="bg-white rounded-lg p-5 shadow">
            <div className="font-semibold text-lg">KOHI MALL</div>
            <div className="mt-2 text-sm text-gray-700">
              12 Nguyễn Trãi, P.5, Q.5, TP.HCM
              <br /> Email: support@kohimall.vn
              <br /> Hotline: 1900 1234
            </div>
            <div className="mt-4 h-48 bg-gray-100 rounded" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Contact