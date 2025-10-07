import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  Menu as MenuIcon,
} from "@mui/icons-material";

// Navigation items configuration
const navItems = [
  { name: "Tổng quan", icon: HomeIcon, path: "/dashboard" },
  { name: "Quản lý Store", icon: StoreIcon, path: "/stores-management" },
  { name: "Quản lý Shipper", icon: ShippingIcon, path: "/shippers-management" },
  { name: "Tạo tài khoản", icon: PersonAddIcon, path: "/create-account" },
  { name: "Quản lý Banner", icon: BannerIcon, path: "/banners" },
  { name: "Tạo mã giảm giá", icon: CreateCouponIcon, path: "/create-coupon" },
  { name: "Thêm danh mục", icon: CreateCategoryIcon, path: "/create-category" },
  { name: "Duyệt sản phẩm", icon: ApproveIcon, path: "/product-approval" },
  { name: "Khiếu nại", icon: ComplaintIcon, path: "/complaints" },
  { name: "Vi phạm", icon: ViolationIcon, path: "/violations" },
  { name: "Báo cáo hệ thống", icon: ReportIcon, path: "/reports" },
  { name: "Cài đặt", icon: SettingsIcon, path: "/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const PRIMARY_COLOR = "#116AD1";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out z-40 overflow-hidden ${isSidebarOpen ? "w-64" : "w-16"
        }`}
    >
      {/* Nút thu gọn/mở rộng sidebar */}
      <div className="flex items-center p-2">
        <button
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition duration-200 text-gray-700"
          title={isSidebarOpen ? "Thu gọn" : "Mở rộng"}
        >
          <MenuIcon style={{ fontSize: 24 }} />
        </button>
      </div>
      {/* Navigation Menu */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                  ? "text-white font-semibold shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
                style={{
                  backgroundColor: isActive ? PRIMARY_COLOR : "",
                }}
                title={!isSidebarOpen ? item.name : ""}
              >
                <item.icon
                  className={`flex-shrink-0 ${
                    isSidebarOpen ? "mr-3" : "mx-auto"
                  } transition-all duration-200`}
                  style={{ fontSize: 20 }}
                />
                <span
                  className={`transition-all duration-300 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.name}
                </span>


                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
