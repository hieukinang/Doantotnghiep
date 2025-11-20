import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Assignment as OrderIcon,
  Inventory2 as ProductListIcon,
  AddBox as AddProductIcon,
  Edit as EditProductIcon,
  BarChart as ReportIcon,
  Star as RatingIcon,
  AccountBalanceWallet as FinanceIcon,
  Store as StoreIcon,
  People as UserIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Wallet,
} from "@mui/icons-material";

// Danh sách các mục trong sidebar cho Seller
const navItems = [
  { label: "Đơn hàng", icon: OrderIcon, href: "/seller/orders" },
  { label: "Danh sách sản phẩm", icon: ProductListIcon, href: "/seller/list-product" },
  { label: "Thêm sản phẩm", icon: AddProductIcon, href: "/seller/add-product" },
  { label: "Thêm mã giảm giá", icon: AddProductIcon, href: "/seller/add-coupon" },
  { label: "Ví tiền", icon: Wallet, href: "/seller/wallet" },
  { label: "Chỉnh sửa sản phẩm", icon: EditProductIcon, href: "/seller/update-product" },
  { label: "Báo cáo doanh số", icon: ReportIcon, href: "/seller/sales-report" },
  { label: "Đánh giá", icon: RatingIcon, href: "/seller/rating" },
  { label: "Tài chính", icon: FinanceIcon, href: "/seller/finance" },
  { label: "Hồ sơ cửa hàng", icon: StoreIcon, href: "/seller/edit-profile" },
  { label: "Quản lý người dùng", icon: UserIcon, href: "/seller/edit-user" },
];

const SellerSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 relative transition-all duration-200 ${
                  isActive
                    ? "text-white bg-blue-600"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <Icon
                  className={`flex-shrink-0 transition-all duration-300 ${
                    isSidebarOpen ? "mr-3" : "mx-auto"
                  }`}
                  style={{ fontSize: 20 }}
                />
                {isSidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip khi thu gọn */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
                    {item.label}
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

export default SellerSidebar;
