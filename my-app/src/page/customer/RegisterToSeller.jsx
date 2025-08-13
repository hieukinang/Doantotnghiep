import React from "react";
import logo from "../../assets/logo.svg";

const RegisterToSeller = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        {/* Logo + tên */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </div>

        {/* Chữ Đăng ký */}
        <h1 className="text-xl font-semibold">ĐĂNG KÝ LÀ NGƯỜI BÁN</h1>

        {/* Hỗ trợ */}
        <span className="cursor-pointer hover:underline text-sm">
          Hỗ trợ?
        </span>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex w-200 h-200 shadow-lg">
          {/* Left side */}
          <div className="w-5/12 flex flex-col justify-center px-10 py-8 bg-[#116AD1] text-white">
            <h2 className="text-3xl font-bold mb-6">
              Trở thành Người bán ngay hôm nay
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🏬</span>
                <span>
                  Nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌏</span>
                <span>Phát triển trở thành thương hiệu toàn cầu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <span>
                  Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam
                </span>
              </li>
            </ul>
          </div>

          {/* Middle gap */}
          <div className="w-2/12 bg-white"></div>

          {/* Right side */}
          <div className="w-5/12 flex flex-col justify-center px-10 py-8 bg-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Đăng ký</h2>

            <form className="space-y-4">
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#116AD1]"
              />

              <button
                type="submit"
                className="w-full bg-[#116AD1] text-white rounded-md py-2 font-semibold hover:bg-blue-800 transition"
              >
                Tiếp theo
              </button>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">HOẶC</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <button
                type="button"
                className="w-full border flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Đăng ký với Google
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-[#116AD1] hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              &{" "}
              <a href="#" className="text-[#116AD1] hover:underline">
                Chính sách bảo mật
              </a>
            </p>

            <p className="mt-4 text-sm">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-[#116AD1] font-semibold">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterToSeller;
