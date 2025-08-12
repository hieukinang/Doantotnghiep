import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#116AD1] text-white mt-20">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Exclusive */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Kohi Mall</h3>
          <p className="mb-2">Đăng ký</p>
          <p className="text-white/80 mb-4">Nhận 10% giảm giá cho đơn hàng đầu tiên của bạn</p>
          <div className="flex items-center bg-white rounded-md overflow-hidden w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 flex-1 text-sm text-gray-800 outline-none"
            />
            <button className="px-3 py-2 text-[#116AD1] font-semibold">→</button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Hỗ trợ</h3>
          <p className="text-white/80">km10 Nguyễn Trãi, Hà Đông, Hà Nội</p>
          <p className="mb-2">kohimall@gmail.com</p>
          <p>0123456789</p>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Tài khoản</h3>
          <ul className="space-y-2 text-white/90">
            <li><a href="#" className="hover:underline">Tài khoản của tôi</a></li>
            <li><a href="#" className="hover:underline">Đăng nhập / Đăng ký</a></li>
            <li><a href="#" className="hover:underline">Giỏ hàng</a></li>
            <li><a href="#" className="hover:underline">Yêu thích</a></li>
            <li><a href="#" className="hover:underline">Cửa hàng</a></li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-white/90">
            <li><a href="#" className="hover:underline">Chính sách riêng tư</a></li>
            <li><a href="#" className="hover:underline">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        {/* Download App */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Tải App</h3>
          <p className="text-xs text-white/80 mb-3">Nhận 10% giảm giá cho đơn hàng đầu tiên của bạn</p>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-white rounded" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-10 bg-white rounded" />
              <div className="w-32 h-10 bg-white rounded" />
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" className="hover:opacity-80">facebook</a>
            <a href="#" className="hover:opacity-80">twitter</a>
          </div>
          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" className="hover:opacity-80">instagram</a>
            <a href="#" className="hover:opacity-80">linkedin</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-5 py-4 text-center text-white/80 text-sm">
          © Copyright Kohi Mall 2025. All right reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer