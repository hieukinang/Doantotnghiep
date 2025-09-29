// import React from 'react'
// import { Link, Outlet, useLocation } from 'react-router-dom'
// import logo from '../assets/home/logo.svg'
// import searchIcon from '../assets/home/search.svg'

// const navItem = (to, label, currentPath) => (
//   <Link
//     to={to}
//     className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
//       currentPath === to
//         ? 'bg-[#0E5AB6] text-white shadow-sm'
//         : 'text-gray-700 hover:bg-gray-100'
//     }`}
//   >
//     {label}
//   </Link>
// )

// const AdminLayout = () => {
//   const { pathname } = useLocation()

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="w-full fixed top-0 left-0 z-50 bg-[#116AD1] shadow-md">
//         {/* Top bar */}
//         <div className="py-2 border-b border-blue-700">
//           <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
//             <span className="text-white text-sm font-medium">Ban quản trị</span>
//             <Link
//               to="/login"
//               className="text-white text-sm hover:opacity-80 transition-opacity"
//             >
//               Đăng xuất
//             </Link>
//           </div>
//         </div>

//         {/* Main header bar */}
//         <div className="py-3">
//           <div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-5">
//             {/* Logo */}
//             <Link to="/dashboard" className="flex items-center gap-3">
//               <img src={logo} alt="KOHI ADMIN Logo" className="h-8 w-auto" />
//               <h1 className="text-2xl font-bold text-white tracking-wide">
//                 KOHI ADMIN
//               </h1>
//             </Link>

//             {/* Search box */}
//             <div className="flex-1 flex justify-center">
//               <div className="w-full max-w-lg flex bg-white border border-gray-300 rounded-lg overflow-hidden">
//                 <input
//                   type="text"
//                   placeholder="Tìm kiếm trong hệ thống..."
//                   className="flex-1 px-4 py-2 text-sm outline-none placeholder-gray-400"
//                 />
//                 <button className="px-4 bg-[#116AD1] hover:bg-[#0E5AB6] transition">
//                   <img
//                     src={searchIcon}
//                     alt="Search"
//                     className="h-5 w-5 text-white"
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* Help */}
//             <Link
//               to="/dashboard"
//               className="text-white text-sm hover:opacity-80 transition-opacity"
//             >
//               Trợ giúp
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Layout content */}
//       <div className="max-w-7xl mx-auto px-5 pt-32 pb-8 grid grid-cols-12 gap-6">
//         {/* Sidebar */}
//         <aside className="col-span-3 lg:col-span-2">
//           <nav className="bg-white rounded-lg shadow p-3 flex flex-col gap-2 sticky top-32">
//             {navItem('/dashboard', 'Tổng quan', pathname)}
//             {navItem('/users', 'Quản lý người dùng', pathname)}
//             {navItem('/product-approval', 'Duyệt sản phẩm', pathname)}
//             {navItem('/complaints', 'Khiếu nại', pathname)}
//             {navItem('/violations', 'Vi phạm', pathname)}
//           </nav>
//         </aside>

//         {/* Main content */}
//         <main className="col-span-9 lg:col-span-10">
//           <div className="bg-white rounded-lg shadow p-5">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default AdminLayout;


import React from 'react'
import logo from '../assets/home/logo.svg'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Tổng quan', href: '/dashboard' },
  { label: 'Quản lý người dùng', href: '/users' },
  { label: 'Duyệt sản phẩm', href: '/product-approval' },
  { label: 'Khiếu nại', href: '/complaints' },
  { label: 'Vi phạm', href: '/violations' },
  { label: 'Báo cáo hệ thống', href: '/reports' },
  { label: 'Cài đặt', href: '/settings' },
]

const AdminLayout = ({ title = 'Bảng quản trị', children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r sticky top-0 h-screen hidden md:flex md:flex-col">
        <div className="bg-[#116AD1] h-16 px-4 flex items-center gap-3 border-b">
          <img src={logo} alt="KOHI ADMIN" className="h-8 w-8" />
          <div className="font-bold text-white">KOHI Admin</div>
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
            <span className="hidden sm:inline">Xin chào, Admin</span>
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

export default AdminLayout;
