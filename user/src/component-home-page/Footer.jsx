import React from 'react'
import { Link } from 'react-router-dom';
import facebookIcon from '../assets/home/Icon-Facebook.svg';
import twitterIcon from '../assets/home/Icon-Twitter.svg';
import instagramIcon from '../assets/home/icon-instagram.svg';
import linkedinIcon from '../assets/home/Icon-Linkedin.svg';
import googlePlay from '../assets/home/GooglePlay.svg';
import appStore from '../assets/home/AppStore.svg';
import qrcode from '../assets/home/QRCode.svg';
const Footer = () => {
  return (
    <footer className="bg-[#116AD1] text-white mt-20">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Exclusive */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Kohi Mall</h3>
          <p className="mb-2">Theo dõi</p>
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
            <li><Link to="/profile" className="hover:underline">Tài khoản của tôi</Link></li>
            <li><Link to="/login" className="hover:underline">Đăng nhập / Đăng ký</Link></li>
            <li><Link to="/cart" className="hover:underline">Giỏ hàng</Link></li>
            <li><Link to="/followed-shops" className="hover:underline">Yêu thích</Link></li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-white/90">
            <li><Link to="/privacy-policy" className="hover:underline">Chính sách bảo mật</Link></li>
            <li><Link to="/terms-of-use" className="hover:underline">Điều khoản sử dụng</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Download App */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Tải App</h3>
          <p className="text-xs text-white/80 mb-3">Nhận 10% giảm giá cho đơn hàng đầu tiên của bạn</p>
          <div className="flex items-center gap-3">
            <img src={qrcode} className="w-20 h-20 bg-white rounded" />
            <div className="flex flex-col gap-2">
              <img src={googlePlay} className="w-30 h-10 bg-white rounded" />
              <img src={appStore} className="w-30 h-10 bg-white rounded" />
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" className="hover:opacity-80">
              <img src={facebookIcon} />
            </a>
            <a href="#" className="hover:opacity-80"><img src={twitterIcon} /></a>
            <a href="#" className="hover:opacity-80"><img src={instagramIcon} /></a>
            <a href="#" className="hover:opacity-80"><img src={linkedinIcon} /></a>
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