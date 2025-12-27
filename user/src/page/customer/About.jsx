import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 md:p-6 shadow">
          <h1 className="text-lg md:text-xl font-semibold">Về KOHI MALL</h1>
          <p className="mt-3 text-sm md:text-base text-gray-700 leading-6 md:leading-7">
            KOHI MALL là nền tảng thương mại điện tử lấy người dùng làm trung tâm, cung cấp trải nghiệm mua sắm nhanh,
            an toàn, giao hàng miễn phí, nhiều ưu đãi mỗi ngày.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-3 md:p-4 text-sm md:text-base text-center">Miễn phí vận chuyển</div>
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-3 md:p-4 text-sm md:text-base text-center">Đổi trả dễ dàng</div>
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-3 md:p-4 text-sm md:text-base text-center">Hỗ trợ 24/7</div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-block px-5 md:px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-sm md:text-base">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About