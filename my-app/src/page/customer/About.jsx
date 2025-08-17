import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
          <h1 className="text-xl font-semibold">Về KOHI MALL</h1>
          <p className="mt-3 text-gray-700 leading-7">
            KOHI MALL là nền tảng thương mại điện tử lấy người dùng làm trung tâm, cung cấp trải nghiệm mua sắm nhanh,
            an toàn, giao hàng miễn phí, nhiều ưu đãi mỗi ngày.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-4">Miễn phí vận chuyển</div>
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-4">Đổi trả dễ dàng</div>
            <div className="bg-[#116AD1]/10 text-[#116AD1] rounded p-4">Hỗ trợ 24/7</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About