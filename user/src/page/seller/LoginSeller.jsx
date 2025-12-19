import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/home/logo.svg";
import signinImage from "../../assets/home/signin-up.png";
import Footer from "../../component-home-page/Footer";

const LoginSeller = () => {
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/stores/login`;
      const res = await axios.post(
        url,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Đăng nhập thành công!");
      localStorage.setItem("sellerToken", res.data.token);
      const username =
        res.data.data?.user?.name || res.data.data?.user?.email || "Store";
      localStorage.setItem("storeName", username);
      const storeId =
        res.data.data?.user?.id || "StoreID";
      localStorage.setItem("storeId", storeId);
      const sellerData = res.data.data?.user;
      localStorage.setItem("sellerUser",  JSON.stringify(sellerData));

      setTimeout(() => {
        window.location.replace("/seller/orders");
      }, 1000);
    } catch (err) {
      // Lấy thông báo lỗi từ server, nếu có
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold">ĐĂNG NHẬP NGƯỜI BÁN</h1>
        <Link to="/contact" className="cursor-pointer hover:underline text-base">
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

          {/* Form đăng nhập */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập người bán
            </h2>
            <p className="text-gray-500 mb-6">
              Điền thông tin Email/SĐT và mật khẩu để đăng nhập
            </p>

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
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <Link
                  to="/seller/forgot-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản người bán?{" "}
                <Link
                  to="/register-to-seller"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Hoặc{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng nhập khách hàng
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

export default LoginSeller;