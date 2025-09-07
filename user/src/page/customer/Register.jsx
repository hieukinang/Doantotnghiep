import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/home/logo.svg";
import Footer from "../../component/Footer";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        {/* Logo + tên */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </Link>
        {/* Title chính giữa */}
        <h1 className="text-2xl font-bold item-center text-center">ĐĂNG KÝ</h1>

        {/* Hỗ trợ */}
        <Link
          to="/contact"
          className="cursor-pointer hover:underline text-base"
        >
          Hỗ trợ
        </Link>
      </header>



      {/* Container chính */}
      <div className="flex flex-1 justify-center items-center mt-5 px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl border border-gray-300 shadow-xl rounded-2xl overflow-hidden">

          {/* Left side - Hình ảnh */}
          <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center">
            <img
              src="https://media.tapchitaichinh.vn/w1480/images/upload/hoangthuviet/05182021/tai-sao-nen-chon-mua-sam-qua-mang--2.jpg"
              alt="Shopping"
              className="w-full h-full object-cover md:object-contain"
            />
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 w-full flex flex-col justify-center px-8 py-10 bg-white">
            <h2 className="text-3xl font-bold text-blue-600 mb-3">
              Đăng ký tài khoản
            </h2>
            <p className="text-gray-500 mb-8">
              Điền thông tin chi tiết bên dưới
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tên"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email hoặc số điện thoại"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
              >
                Đăng ký
              </button>

              <button
                type="button"
                className="w-full border flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Đăng ký với Google
              </button>
            </form>

            {/* Link phụ */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
              <p className="text-sm">
                Hoặc{" "}
                <Link
                  to="/register-to-seller"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng ký làm người bán
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default Register;
