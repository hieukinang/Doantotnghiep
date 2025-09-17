import React from "react";
import logo from '../assets/home/logo.svg'

const HeaderPolicy = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#116AD1] to-[#1E88E5] shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-8">
        {/* Left: Logo + text */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Shopee" className="h-8" />
          <span className="text-sm text-white border-l border-white pl-2">
            Trung tâm trợ giúp Shopee VN
          </span>
        </div>

        {/* Right: Page title */}
        <div>
          <span className="text-sm font-medium text-white">
            Shopee Policies
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderPolicy;
