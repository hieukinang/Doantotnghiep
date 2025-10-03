import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/home/logo.svg";

import {
  Home as HomeIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  PersonAdd as PersonAddIcon,
  ViewCarousel as BannerIcon,
  CheckCircleOutline as ApproveIcon,
  Gavel as ComplaintIcon,
  ReportProblem as ViolationIcon,
  BarChart as ReportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  ShoppingBag as LogoIcon,
} from "@mui/icons-material"; // Cần cài đặt @mui/icons-material và @mui/material

// Mảng chứa các mục điều hướng Sidebar
const navItems = [
  { name: "Tổng quan", icon: HomeIcon, path: "/dashboard" },
  { name: "Quản lý Store", icon: StoreIcon, path: "/stores-management" },
  { name: "Quản lý Shipper", icon: ShippingIcon, path: "/shippers-management" },
  { name: "Tạo tài khoản", icon: PersonAddIcon, path: "/create-account" },
  { name: "Quản lý Banner", icon: BannerIcon, path: "/banners" },
  { name: "Duyệt sản phẩm", icon: ApproveIcon, path: "/product-approval" },
  { name: "Khiếu nại", icon: ComplaintIcon, path: "/complaints" },
  { name: "Vi phạm", icon: ViolationIcon, path: "/violations" },
  { name: "Báo cáo hệ thống", icon: ReportIcon, path: "/reports" },
  { name: "Cài đặt", icon: SettingsIcon, path: "/settings" },
];

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const PRIMARY_COLOR = "#116AD1";

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-auto">
      {/* 1. SIDEBAR (NAVBAR) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white transition-all duration-300 z-30 shadow-xl 
          ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        style={{ width: isSidebarOpen ? "16rem" : "0" }} // 16rem = 64
      >
        <div
          className="flex items-center justify-center h-16"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          {/* Logo ở Sidebar (thường là nơi lý tưởng) */}
          <div className="flex items-center gap-2 text-white text-xl font-bold p-4">
            <img src={Logo} alt="KOHI Logo" className="h-8 w-auto" />
            <span className={isSidebarOpen ? "block" : "hidden"}>
              KOHI ADMIN
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 
                ${
                  window.location.pathname === item.path
                    ? "text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              style={{
                backgroundColor:
                  window.location.pathname === item.path ? PRIMARY_COLOR : "",
              }}
            >
              <item.icon className="mr-3" style={{ fontSize: 20 }} />
              <span className={isSidebarOpen ? "block" : "hidden"}>
                {item.name}
              </span>
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? "16rem" : "0" }}
      >
        {/* 2. HEADER */}
        <header
          className="flex items-center h-16 shadow-lg fixed top-0 w-full z-20"
          style={{
            backgroundColor: PRIMARY_COLOR,
            width: isSidebarOpen ? "calc(100% - 16rem)" : "100%",
            left: isSidebarOpen ? "16rem" : "0",
          }}
        >
          {/* Logo và Toggle Menu */}
          <div className="flex items-center text-white text-2xl font-bold ml-4 mr-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 mr-4"
            >
              <MenuIcon style={{ fontSize: 28 }} />
            </button>
          </div>

          {/* Thanh Tìm kiếm (Search Bar) */}
          <div className="flex-1 max-w-xl mx-auto">
            <div className="flex rounded-lg overflow-hidden border border-white">
              <input
                type="text"
                placeholder="Tìm kiếm trong hệ thống..."
                className="w-full px-4 py-2 text-gray-800 focus:outline-none"
              />
              <button
                className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Thông tin người dùng và Đăng xuất */}
          <div className="flex items-center text-white mr-4 space-x-4">
            <span className="text-lg">Xin chào</span>
            <button
              onClick={() => {
                console.log("Đăng xuất...");
                alert("Đăng xuất");
              }}
              className="flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-150"
            >
              <Link to="/" className="font-medium hidden sm:inline">
                Đăng xuất
              </Link>
              <LogoutIcon className="ml-1" style={{ fontSize: 20 }} />
            </button>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH (Content) */}
        <main className="flex-1 p-8" style={{ paddingTop: "4rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
