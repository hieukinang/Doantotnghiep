import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/react.svg";

const ShipperLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Shipper login:', formData);
    // Xử lý đăng nhập shipper
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        {/* Logo + tên */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL - SHIPPER</span>
        </Link>

        {/* Chữ ĐĂNG NHẬP */}
        <h1 className="text-2xl font-bold">ĐĂNG NHẬP SHIPPER</h1>

        {/* Hỗ trợ */}
        <Link to="/contact" className="cursor-pointer hover:underline text-base">
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 justify-center items-center py-12">
        <div className="flex w-[80%] max-w-4xl h-[80%] border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          {/* Left side - Hình ảnh */}
          <div className="w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-4">Giao hàng chuyên nghiệp</h3>
              <p className="text-lg opacity-90">
                Tham gia đội ngũ shipper của KOHI MALL và kiếm thu nhập ổn định
              </p>
            </div>
          </div>

          {/* Right side - Form đăng nhập */}
          <div className="w-1/2 flex flex-col justify-center px-10 py-8 bg-white">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập Shipper
            </h2>
            <p className="text-gray-500 mb-6">
              Điền thông tin đăng nhập của bạn
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors"
                >
                  Đăng nhập
                </button>
                <Link
                  to="/shipper/forgot-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản shipper?{" "}
                <Link to="/shipper/register" className="text-blue-600 font-semibold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Hoặc{" "}
                <Link to="/" className="text-blue-600 font-semibold hover:underline">
                  Về trang chủ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperLogin;
