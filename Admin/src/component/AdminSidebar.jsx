import React from "react";
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
  LocalActivity as CreateCouponIcon,
  Inventory2 as CreateCategoryIcon,
} from "@mui/icons-material";

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

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 bg-white shadow-lg flex flex-col z-40 overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Nút thu gọn/mở rộng */}
      <div className="flex items-center justify-start px-3 py-3 border-b border-gray-100">
        <button
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition duration-200 text-gray-700"
          title={isSidebarOpen ? "Thu gọn" : "Mở rộng"}
        >
          <MenuIcon style={{ fontSize: 24 }} />
        </button>
        {isSidebarOpen && (
          <span className="text-base font-semibold text-gray-700 ml-2 select-none">
            Bảng điều khiển
          </span>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center rounded-lg px-3 py-2 relative transition-all duration-200 ${
                  isActive
                    ? "text-white bg-blue-600"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                title={!isSidebarOpen ? item.name : ""}
              >
                <Icon
                  className={`flex-shrink-0 transition-all duration-300 ${
                    isSidebarOpen ? "mr-3" : "mx-auto"
                  }`}
                  style={{ fontSize: 20 }}
                />
                {isSidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Tooltip khi thu gọn */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
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