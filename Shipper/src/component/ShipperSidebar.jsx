import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ShipperSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/shipper/orders',
      label: 'Đơn hàng cần giao',
      icon: '📦'
    },
    {
      path: '/shipper/update-status',
      label: 'Cập nhật trạng thái',
      icon: '✏️'
    },
    {
      path: '/shipper/history',
      label: 'Lịch sử giao hàng',
      icon: '📋'
    },
    {
      path: '/shipper/profile',
      label: 'Hồ sơ cá nhân',
      icon: '👤'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Shipper</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ShipperSidebar;
