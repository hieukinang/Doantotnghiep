import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import cartIcon from '../assets/cart.svg';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#116AD1]">
      {/* Top Header Bar */}
      <div className="py-2">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex gap-5">
            <Link to="/seller" className="text-white text-sm hover:opacity-80">
              Vào kênh người bán
            </Link>
            <Link to="/register-to-seller" className="text-white text-sm hover:opacity-80 transition-opacity">
              Đăng ký là người bán
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">🌐</span>
              <select
                defaultValue="vi"
                className="bg-transparent text-white text-sm border border-white/40 rounded px-2 py-1 focus:outline-none"
              >
                <option value="vi" className="text-black">Tiếng Việt</option>
                <option value="en" className="text-black">English</option>
              </select>
            </div>
            <Link to="/register" className="text-white text-sm hover:opacity-80 transition-opacity">
              Đăng ký
            </Link>
            <Link to="/login" className="text-white text-sm hover:opacity-80 transition-opacity">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="KOHI MALL Logo" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-white tracking-wide m-0">
                KOHI MALL
              </h1>
            </Link>
          </div>

          <div className="flex-1 bg-white max-w-lg mx-10 border border-gray-300 rounded-lg p-1">
            <form onSubmit={handleSearch} className="flex w-full items-center">
              <input
                type="text"
                placeholder="Tìm kiếm ngay"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border-none rounded-l-md text-base outline-none bg-white placeholder-gray-400"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#116AD1] border-none rounded-md cursor-pointer flex items-center justify-center hover:bg-[#0e57aa] transition-colors h-[36px]"
              >
              <span className="text-white text-sm">🔍</span>
              </button>
          </form>
          </div>

          <div className="flex items-center">
            <Link to="/cart">
              <img src={cartIcon} alt="Shopping Cart" className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
