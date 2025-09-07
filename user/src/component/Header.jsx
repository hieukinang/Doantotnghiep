import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/home/logo.svg';
import cartIcon from '../assets/home/cart.svg';
import languageIcon from '../assets/language.svg';
import searchIcon from '../assets/home/search.svg';

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
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
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
              <img src={languageIcon} alt="Language" className="h-4 w-auto" />
              <select
                defaultValue="vi"
                className="bg-transparent text-white text-sm rounded px-2 py-1 focus:outline-none "
              >
                <option value="vi" className="text-black border-0">Tiếng Việt</option>
                <option value="en" className="text-black border-0">English</option>
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
      <div className="py-4 shadow-md pt-0 pb-[10px]">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="KOHI MALL Logo" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-white tracking-wide m-0">
                KOHI MALL
              </h1>
            </Link>
          </div>

          <div className="flex-1 bg-white max-w-4xl h-auto border border-gray-300 rounded-lg p-1 items-center">
            <form onSubmit={handleSearch} className="flex w-full ">
              <input
                type="text"
                placeholder="Tìm kiếm ngay"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border-none rounded-l-md text-base outline-none bg-white placeholder-gray-400"
              />
              <img src={searchIcon} alt="Search" onClick={handleSearch} />
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
