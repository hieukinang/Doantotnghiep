import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/home/logo.svg";
import signinImage from "../../assets/home/signin-up.png";
import Footer from "../../component-home-page/Footer";

const Login = () => {
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
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
      const url = `${import.meta.env.VITE_BACKEND_URL}/clients/login`;

      const res = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      setSuccess("Đăng nhập thành công!");
      localStorage.setItem("tokenClient", data.token);

      const username =
        data.data?.user?.username || data.data?.user?.email || "Client";
      localStorage.setItem("clientUsername", username);

      window.location.replace("/");

    } catch (err) {
      if (err.response) {
        // Lỗi từ server
        setError(err.response.data?.message || "Đăng nhập thất bại");
      } else {
        // Lỗi kết nối
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
        <h1 className="text-2xl font-bold">ĐĂNG NHẬP</h1>
        <Link
          to="/contact"
          className="cursor-pointer hover:underline text-base"
        >
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Hình ảnh bên trái */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
            <img
              src={signinImage}
              alt="Shopping"
              className="w-full h-full max-h-[500px] object-contain"
            />
          </div>

          {/* Form đăng nhập bên phải */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập vào KOHI MALL
            </h2>
            <p className="text-gray-500 mb-6">Điền thông tin chi tiết bên dưới</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="emailOrPhone"
                value={form.emailOrPhone}
                onChange={handleChange}
                placeholder="Email hoặc số điện thoại"
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Đăng nhập
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
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
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

export default Login;