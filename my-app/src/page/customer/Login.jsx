import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        {/* Logo + tên */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </Link>

        {/* Chữ ĐĂNG NHẬP */}
        <h1 className="text-2xl font-bold">ĐĂNG NHẬP</h1>

        {/* Hỗ trợ */}
        <Link to="/contact" className="cursor-pointer hover:underline text-base">
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex w-[80%] h-[80%] border border-gray-300 shadow-lg">
          {/* Left side - Hình ảnh */}
          <div className="w-1/2 bg-gray-100">
            <img
              src="https://media.tapchitaichinh.vn/w1480/images/upload/hoangthuviet/05182021/tai-sao-nen-chon-mua-sam-qua-mang--2.jpg"
              alt="Shopping"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Form đăng nhập */}
          <div className="w-1/2 flex flex-col justify-center px-10 py-8 border border-gray-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập vào KOHI MALL
            </h2>
            <p className="text-gray-500 mb-6">
              Điền thông tin chi tiết bên dưới
            </p>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email hoặc số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Log In
                </button>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Hoặc{" "}
                <Link to="/register-to-seller" className="text-blue-600 font-semibold hover:underline">
                  Đăng ký làm người bán
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
