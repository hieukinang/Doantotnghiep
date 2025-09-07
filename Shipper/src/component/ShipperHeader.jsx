import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/react.svg';

const ShipperHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#116AD1] to-blue-600 shadow-lg">
      {/* Top Header Bar */}
      <div className="py-2 bg-black bg-opacity-10">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
          <div className="flex gap-6">
            <Link to="/shipper/orders" className="text-white text-sm hover:text-blue-200 transition-colors duration-200 flex items-center gap-1">
              <span>📦</span>
              Đơn hàng cần giao
            </Link>
            <Link to="/shipper/history" className="text-white text-sm hover:text-blue-200 transition-colors duration-200 flex items-center gap-1">
              <span>📋</span>
              Lịch sử giao hàng
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <select
                defaultValue="vi"
                className="bg-transparent text-white text-sm rounded-lg px-3 py-1 focus:outline-none border border-white border-opacity-30"
              >
                <option value="vi" className="text-black">Tiếng Việt</option>
                <option value="en" className="text-black">English</option>
              </select>
            </div>
            <Link to="/shipper/profile" className="text-white text-sm hover:text-blue-200 transition-colors duration-200 flex items-center gap-1">
              <span>👤</span>
              Hồ sơ
            </Link>
            <Link to="/shipper/login" className="text-white text-sm hover:text-blue-200 transition-colors duration-200 flex items-center gap-1">
              <span>🚪</span>
              Đăng xuất
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/shipper/orders" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src={logo} alt="KOHI MALL Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-white tracking-wide m-0">
                KOHI MALL - SHIPPER
              </h1>
            </Link>
          </div>

          <div className="flex-1 bg-white max-w-4xl h-auto border border-gray-300 rounded-xl p-1 items-center shadow-sm">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border-none rounded-l-xl text-base outline-none bg-white placeholder-gray-400"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors duration-200 font-medium">
                🔍 Tìm
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="text-white text-sm font-medium">🚚 Xin chào, Shipper!</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShipperHeader;
