import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/home/logo.svg";
import Footer from "../../component-home-page/Footer";
import image from "../../../public/register.png";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // URL đăng ký
      const url = `${import.meta.env.VITE_BACKEND_URL}/clients/register`;

      const res = await axios.post(url, form, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Đăng ký thành công!");
      setForm({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Đăng ký thất bại");
      } else {
        setError("Lỗi kết nối máy chủ");
      }
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
        <h1 className="text-2xl font-bold item-center text-center">ĐĂNG KÝ</h1>
        <Link to="/contact" className="cursor-pointer hover:underline text-base">
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <main className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Left side - Hình ảnh */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
            <img
              src={image}
              alt="Register"
              className="w-full h-full max-h-[650px] object-fill"
            />
          </div>

          {/* Right side - Form đăng ký */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-500 mb-6">Điền thông tin chi tiết bên dưới</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Tên người dùng"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email (your@gmail.com)"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Đăng ký
              </button>

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

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Đăng nhập
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
      </main>

      <Footer />
    </div>
  );
};

export default Register;