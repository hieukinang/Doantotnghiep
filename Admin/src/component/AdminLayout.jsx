import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const navItem = (to, label, currentPath) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity ${
      currentPath === to ? 'bg-white bg-opacity-20 text-white' : 'text-white'
    }`}
  >
    {label}
  </Link>
)

const AdminLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full fixed top-0 left-0 z-50 bg-[#116AD1]">
        <div className="py-2">
          <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
            <div className="flex gap-5">
              <span className="text-white text-sm">Bảng quản trị</span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/login" className="text-white text-sm hover:opacity-80 transition-opacity">
                Đăng xuất
              </Link>
            </div>
          </div>
        </div>

        <div className="py-4 shadow-md pt-0 pb-[10px]">
          <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-white" />
                <h1 className="text-2xl font-bold text-white tracking-wide m-0">KOHI ADMIN</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2 bg-white max-w-4xl h-auto border border-gray-300 rounded-lg p-1">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="flex-1 px-4 py-2 border-none rounded-md text-base outline-none bg-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="text-white text-sm hover:opacity-80 transition-opacity">Trợ giúp</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 pt-28 pb-8 grid grid-cols-12 gap-6">
        <aside className="col-span-3 lg:col-span-2">
          <nav className="bg-white rounded-lg shadow p-3 flex flex-col gap-1 sticky top-28">
            {navItem('/dashboard', 'Tổng quan', pathname)}
            {navItem('/users', 'Quản lý người dùng', pathname)}
            {navItem('/product-approval', 'Duyệt sản phẩm', pathname)}
            {navItem('/complaints', 'Khiếu nại', pathname)}
            {navItem('/violations', 'Vi phạm', pathname)}
          </nav>
        </aside>
        <main className="col-span-9 lg:col-span-10">
          <div className="bg-white rounded-lg shadow p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout


