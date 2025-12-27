import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <aside className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100" className="w-10 md:w-12 h-10 md:h-12 rounded-full" />
              <div>
                <div className="font-semibold text-sm md:text-base">Nguyễn Văn A</div>
                <Link to="/update-profile" className="text-xs md:text-sm text-[#116AD1]">Sửa hồ sơ</Link>
              </div>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <nav className="space-y-2 text-xs md:text-sm">
              <Link to="/profile" className="block text-gray-700">Tài khoản của tôi</Link>
              <Link to="/profile" className="block text-gray-700">Địa chỉ</Link>
              <Link to="/orders" className="block text-gray-700">Đơn mua</Link>
              <Link to="/profile" className="block text-gray-700">Thông báo</Link>
            </nav>
          </aside>

          <section className="md:col-span-2 bg-white p-4 md:p-5 rounded-lg shadow">
            <div className="font-semibold text-base md:text-lg">Tổng quan</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
              <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-3 md:p-4">
                <div className="text-xl md:text-2xl font-bold">12</div>
                <div className="text-xs md:text-sm">Đơn đang xử lý</div>
              </div>
              <div className="bg-green-100 text-green-700 rounded p-3 md:p-4">
                <div className="text-xl md:text-2xl font-bold">8</div>
                <div className="text-xs md:text-sm">Đơn hoàn thành</div>
              </div>
              <div className="bg-yellow-100 text-yellow-700 rounded p-3 md:p-4 col-span-2 md:col-span-1">
                <div className="text-xl md:text-2xl font-bold">3</div>
                <div className="text-xs md:text-sm">Thông báo</div>
              </div>
            </div>

            <div className="mt-4 md:mt-6">
              <div className="font-semibold text-sm md:text-base">Thông tin</div>
              <div className="mt-2 text-xs md:text-sm text-gray-700">
                Email: user@example.com • SĐT: 0909xxxxxx
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile