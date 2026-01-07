import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import chatService from "../../services/chatService";
import logo from "../../assets/home/logo.svg";
import Footer from "../../component-home-page/Footer";
import image from "../../../public/register.png";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Tên người dùng không được để trống";
    }
    if (username.length < 3) {
      return "Tên người dùng phải có ít nhất 3 ký tự";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email không được để trống";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không hợp lệ";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Số điện thoại không được để trống";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải là số và có 10 chữ số";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Mật khẩu không được để trống";
    }
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Xác nhận mật khẩu không được để trống";
    }
    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        if (!error) await checkEmailExists(value);
        break;
      case "phone":
        error = validatePhone(value);
        if (!error) await checkPhoneExists(value);
        break;
      case "password":
        error = validatePassword(value);
        if (form.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(
              value,
              form.confirmPassword
            ),
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(form.password, value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const checkEmailExists = async (email) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clients/register`, {
        username: "___temp___",
        password: "123456",
        phone: "0000000000",
        confirmPassword: "123456",
        email,
      });

      // Nếu API không báo lỗi ⇒ email không trùng
      setErrors((prev) => ({ ...prev, email: "" }));
    } catch (err) {
      const exist = err.response?.data?.errors?.find(
        (e) => e.param === "email"
      );
      if (exist) {
        setErrors((prev) => ({
          ...prev,
          email: "Email đã tồn tại",
        }));
      }
    }
  };

  const checkPhoneExists = async (phone) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clients/register`, {
        username: "___temp___",
        password: "123456",
        confirmPassword: "123456",
        phone,
        email: "temp@gmail.com",
      });

      setErrors((prev) => ({ ...prev, phone: "" }));
    } catch (err) {
      const exist = err.response?.data?.errors?.find(
        (e) => e.param === "phone"
      );
      if (exist) {
        setErrors((prev) => ({
          ...prev,
          phone: "Số điện thoại đã tồn tại",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate toàn bộ fields
    const newErrors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(
        form.password,
        form.confirmPassword
      ),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/clients/register`,
        form
      );

      if (res.data?.status === "success") {
        if (res.data?.data?.user && res.data?.token) {
          const user = res.data.data.user;
          await chatService.createUser(
            user.id,
            user.username || user.email
          );
        }
        navigate("/login");
      }
    } catch (err) {
      const backendError = err.response?.data?.errors?.[0];
      if (backendError) {
        setErrors((prev) => ({
          ...prev,
          [backendError.param]:
            backendError.param === "email"
              ? "Email đã tồn tại"
              : "Số điện thoại đã tồn tại",
        }));
      }
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
        <h1 className="text-lg md:text-2xl font-bold hidden sm:block">ĐĂNG KÝ</h1>
        <Link
          to="/contact"
          className="cursor-pointer hover:underline text-sm md:text-base"
        >
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <main className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Left side - Hình ảnh - Ẩn trên mobile */}
          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-white p-4">
            <img
              src={image}
              alt="Register"
              className="w-full h-full max-h-[650px] object-fill"
            />
          </div>

          {/* Right side - Form đăng ký */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-6 py-6 md:py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
              Đăng ký tài khoản
            </h2>
            <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">
              Điền thông tin chi tiết bên dưới
            </p>

            <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tên người dùng"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 text-sm md:text-base ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email (your@gmail.com)"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 text-sm md:text-base ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Số điện thoại"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 text-sm md:text-base ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Mật khẩu"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 text-sm md:text-base ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Xác nhận mật khẩu"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 text-sm md:text-base ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
              >
                Đăng ký
              </button>

              <button
                type="button"
                className="w-full border flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 text-sm md:text-base"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Đăng ký với Google
              </button>
            </form>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng nhập
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
      </main>

      <Footer />
    </div>
  );
};

export default Register;
