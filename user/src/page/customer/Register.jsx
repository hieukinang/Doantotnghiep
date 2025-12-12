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
    setForm({ ...form, [name]: value });

    // Real-time validation
    let error = "";
    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "password":
        error = validatePassword(value);
        // Re-validate confirmPassword if it's already filled
        if (form.confirmPassword) {
          const confirmError = validateConfirmPassword(
            value,
            form.confirmPassword
          );
          setErrors((prev) => ({
            ...prev,
            confirmPassword: confirmError,
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(form.password, value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
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
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "password":
        error = validatePassword(value);
        if (form.confirmPassword) {
          const confirmError = validateConfirmPassword(
            value,
            form.confirmPassword
          );
          setErrors((prev) => ({
            ...prev,
            confirmPassword: confirmError,
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(form.password, value);
        break;
      default:
        break;
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
      toast.error(error);
    }

    if (name === "email") {
      await checkEmailExists(value);
    }

    if (name === "phone") {
      await checkPhoneExists(value);
    }
  };

  const checkEmailExists = async (email) => {
    if (!email) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clients/register`, {
        username: "___temp___",
        password: "123456",
        phone: "0000000000",
        confirmPassword: "123456",
        email: email,
      });

      // Nếu API không báo lỗi ⇒ email không trùng
      setErrors((prev) => ({ ...prev, email: "" }));
    } catch (err) {
      const errorItem = err.response?.data?.errors?.find(
        (e) => e.param === "email"
      );
      if (errorItem) {
        setErrors((prev) => ({ ...prev, email: "Email đã tồn tại" }));
        return true;
      }
    }

    return false;
  };

  const checkPhoneExists = async (phone) => {
    if (!phone) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clients/register`, {
        username: "___temp___",
        password: "123456",
        confirmPassword: "123456",
        phone: phone,
        email: "temp@gmail.com",
      });

      setErrors((prev) => ({ ...prev, phone: "" }));
    } catch (err) {
      const errorItem = err.response?.data?.errors?.find(
        (e) => e.param === "phone"
      );
      if (errorItem) {
        setErrors((prev) => ({ ...prev, phone: "Số điện thoại đã tồn tại" }));
        return true;
      }
    }

    return false;
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

    // 2. Nếu còn lỗi validate → chặn submit
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      const firstError = Object.values(newErrors).find((err) => err !== "");
      if (firstError) toast.error(firstError);
      return;
    }

    // 3. Nếu email hoặc phone đã được check và lỗi vẫn còn → chặn submit
    if (errors.email) {
      toast.error(errors.email);
      return;
    }

    if (errors.phone) {
      toast.error(errors.phone);
      return;
    }

    // 4. Gửi API đăng ký
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/clients/register`;

      const res = await axios.post(url, form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.status === "success") {
        // 🎯 Tạo user trong chat system ngay sau khi đăng ký thành công
        if (res.data?.token && res.data?.data?.user) {
          const userData = res.data.data.user;
          const username = userData.username || userData.email || "Client";
          const userId = userData.id;

          try {
            await chatService.createUser(userId, username);
            console.log("✅ User đã được tạo trong chat system");
          } catch (chatError) {
            console.warn("⚠️ Không thể tạo user trong chat system:", chatError);
            // Không hiển thị lỗi cho user vì đây không phải lỗi critical
          }
        }

        toast.success("Đăng ký thành công!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(res.data?.message || "Đăng ký thất bại");
      }
    } catch (err) {
      // Nhận lỗi từ backend (email hoặc phone trùng)
      const backendErrors = err.response?.data?.errors;
      if (backendErrors?.length > 0) {
        const field = backendErrors[0].param; // email / phone
        let msg = backendErrors[0].msg;
        if (msg.toLowerCase().includes("exist") && field === "email") {
          msg = "Email đã tồn tại";
        } else if (msg.toLowerCase().includes("exist") && field === "phone") {
          msg = "Số điện thoại đã tồn tại";
        }

        setErrors((prev) => ({ ...prev, [field]: msg }));
        toast.error(msg);
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại");
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
        <Link
          to="/contact"
          className="cursor-pointer hover:underline text-base"
        >
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
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng ký tài khoản
            </h2>
            <p className="text-gray-500 mb-6">
              Điền thông tin chi tiết bên dưới
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tên người dùng"
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
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
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
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
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
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
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
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
                  className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
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
