import React from 'react'
import logo from '../assets/home/logo.svg'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Đơn hàng', href: '/seller/orders' },
  { label: 'Danh sách sản phẩm', href: '/seller/list-product' },
  { label: 'Thêm sản phẩm', href: '/seller/add-product' },
  { label: 'Chỉnh sửa sản phẩm', href: '/seller/update-product' },
  { label: 'Báo cáo doanh số', href: '/seller/sales-report' },
  { label: 'Đánh giá', href: '/seller/rating' },
  { label: 'Tài chính', href: '/seller/finance' },
  { label: 'Hồ sơ cửa hàng', href: '/seller/edit-profile' },
  { label: 'Quản lý người dùng', href: '/seller/edit-user' },
]

const SellerLayout = ({ title = 'Bảng điều khiển', children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r sticky top-0 h-screen hidden md:flex md:flex-col">
        <div className="bg-[#116AD1] h-16 px-4 flex items-center gap-3 border-b">
          <img src={logo} alt="KOHI MALL" className="h-8 w-8" />
          <div className="font-bold text-white">KOHI Seller</div>
        </div>
        <nav className="p-3 space-y-1 overflow-auto">
          {navItems.map((n) => (
            <NavLink
              key={n.href}
              to={n.href}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm transition-colors
                ${isActive
                  ? 'bg-[#116AD1] text-white font-medium'
                  : 'text-gray-700 hover:bg-[#116AD1]/10 hover:text-[#116AD1]'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 bg-[#116AD1] text-white flex items-center justify-between px-4 md:px-6 shadow">
          <div className="font-semibold truncate">{title}</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline"> {`Xin chào ${localStorage.getItem('storeName') || 'Store'}`}</span>
            <img src={logo} alt="avatar" className="w-7 h-7 bg-white rounded-full p-1" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default SellerLayout
