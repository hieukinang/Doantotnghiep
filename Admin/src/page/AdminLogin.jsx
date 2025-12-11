import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = `${import.meta.env.VITE_BACKEND_URL}/admins/login`;

    try {
      const res = await axios.post(url, {
        username,
        password,
      });

      if (res.status === 200 && res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);

        // Lưu username vào localStorage
        const usernameValue =
          res.data.data?.user?.username ||
          res.data.data?.user?.email ||
          "Admin";
        localStorage.setItem("adminUsername", usernameValue);
        localStorage.setItem("adminId", res.data.data?.user?.id)

        window.location.href = "/dashboard";

      } else {
        setError(res.data?.message || "Sai tên đăng nhập hoặc mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Lỗi kết nối máy chủ");
    }

  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Đăng nhập Quản trị
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hệ thống Thương mại Điện tử DO AN MALL
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Email hoặc Số điện thoại
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your@gmail.com hoặc số điện thoại"
                className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-50 bg-opacity-30 
                  focus:ring-[#116AD1] 
                  ${username ? "border-[#116AD1]" : ""}
                `}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Mật khẩu
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-50 bg-opacity-30 
                  focus:ring-[#116AD1]
                  ${password ? "border-[#116AD1]" : ""}
                `}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium hover:text-opacity-80 transition duration-150 ease-in-out text-[#116AD1]"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:scale-[1.00] 
                bg-[#116AD1] focus:ring-[#116AD1]"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2025 DO AN. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;