import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import logo from "../../assets/home/logo.svg";
import signinImage from "../../assets/home/signin-up.png";
import Footer from "../../component-home-page/Footer";

const Login = () => {
  const { authLogin } = useContext(ShopContext);
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { emailOrPhone, password } = form;
    const result = await authLogin(emailOrPhone, password);

    setLoading(false);
    if (result.success) {
      navigate("/"); // ✅ trở về trang chủ
    } else {
      setError("Sai thông tin đăng nhập, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-4 md:px-10 py-4 md:py-6">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-bold text-xl md:text-2xl">KOHI MALL</span>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold hidden sm:block">ĐĂNG NHẬP</h1>
        <Link
          to="/contact"
          className="cursor-pointer hover:underline text-sm md:text-base"
        >
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Hình ảnh bên trái - Ẩn trên mobile */}
          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-white p-4">
            <img
              src={signinImage}
              alt="Shopping"
              className="w-full h-full max-h-[500px] object-contain"
            />
          </div>

          {/* Form đăng nhập bên phải */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-6 py-6 md:py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
              Đăng nhập vào KOHI MALL
            </h2>
            <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">
              Điền thông tin chi tiết bên dưới
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="emailOrPhone"
                value={form.emailOrPhone}
                onChange={handleChange}
                placeholder="Email hoặc số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              />

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-60 text-sm md:text-base"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
