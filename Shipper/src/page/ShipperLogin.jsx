import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/react.svg";
import axios from "axios";
import { toast } from "react-toastify";

const ShipperLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // ví dụ http://localhost:5000

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendUrl}/api/shipper/login`, formData);

      if (res.data.success) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("shipperToken", res.data.token);
        localStorage.setItem("shipperName", res.data.shipper.name);

        toast.success("Đăng nhập thành công!");

        // ✅ Điều hướng tới dashboard shipper
        navigate("/shipper/dashboard");
      } else {
        toast.error(res.data.message || "Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server, thử lại sau!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </Link>

        <h1 className="text-2xl font-bold">ĐĂNG NHẬP SHIPPER</h1>

        <Link to="/contact" className="cursor-pointer hover:underline text-base">
          Hỗ trợ
        </Link>
      </header>

      {/* Container */}
      <div className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Left */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
            <div className="text-center">
              <div className="text-8xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Giao hàng chuyên nghiệp
              </h3>
              <p className="text-gray-600">
                Tham gia đội ngũ shipper của KOHI MALL
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập vào KOHI MALL
            </h2>
            <p className="text-gray-500 mb-6">Điền thông tin chi tiết bên dưới</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email hoặc số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Log In
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
                <Link
                  to="/shipper/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Hoặc{" "}
                <Link
                  to="/"
                  className="text-blue-600 font-semibold hover:underline"
                >
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
