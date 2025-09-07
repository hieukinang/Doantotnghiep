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
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl h-full border-r border-gray-200">
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚚</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Menu Shipper</h2>
          <p className="text-sm text-gray-500 mt-1">KOHI MALL</p>
        </div>
        
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${
                location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">📊</span>
            <span className="text-sm font-medium text-gray-700">Thống kê hôm nay</span>
          </div>
          <div className="text-xs text-gray-600">
            <p>• Đơn hàng: 12</p>
            <p>• Thành công: 10</p>
            <p>• Thu nhập: 250k</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperSidebar;
