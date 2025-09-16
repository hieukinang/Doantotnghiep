import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (v) => {
    // simple email validation
    return /^\S+@\S+\.\S+$/.test(v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      // giả lập gọi API
      await new Promise((res) => setTimeout(res, 1000));

      // nếu call API thành công
      setSuccess(true);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Illustration / left */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#116AD1] to-[#0f64b8] p-8">
          <div className="text-white max-w-[320px]">
            <svg
              className="w-20 h-20 mb-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.686 2 6 4.686 6 8v1.5C6 11.328 7.672 13 9.5 13H14.5C16.328 13 18 11.328 18 9.5V8C18 4.686 15.314 2 12 2z"
                fill="#fff"
                opacity="0.12"
              />
              <path
                d="M12 14c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"
                fill="#fff"
                opacity="0.08"
              />
              <path
                d="M12 6a3 3 0 100 6 3 3 0 000-6zM8 20a4 4 0 008 0H8z"
                fill="#fff"
              />
            </svg>

            <h3 className="text-2xl font-semibold">Quên mật khẩu?</h3>
            <p className="mt-3 text-sm leading-relaxed">
              Nhập email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi hướng
              dẫn để đặt lại mật khẩu vào email đó.
            </p>

            <div className="mt-6 bg-white/10 rounded-lg p-3 text-sm">
              <strong>Tip:</strong> Kiểm tra hộp thư đến và cả thư mục Spam nếu
              không thấy email trong vài phút.
            </div>
          </div>
        </div>

        {/* Form / right */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Nhập email để nhận đường dẫn đặt lại mật khẩu.
          </p>

          {success ? (
            <div className="mt-6 rounded-lg border border-green-100 bg-green-50 p-4">
              <h4 className="font-medium text-green-800">Đã gửi email</h4>
              <p className="text-sm text-green-700 mt-1">
                Vui lòng kiểm tra email{" "}
                <span className="font-medium">{email}</span> để hoàn tất quá
                trình đặt lại mật khẩu.
              </p>
              <div className="mt-4">
                <a
                  href="/login"
                  className="inline-block text-[#116AD1] text-sm font-medium"
                >
                  Quay về đăng nhập
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-lg border px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#116AD1] focus:border-transparent shadow-sm ${
                    error ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="you@gmail.com"
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>

              {error && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#116AD1] ${
                    loading ? "opacity-70 cursor-wait" : "bg-[#116AD1]"
                  }`}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>

                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:underline"
                >
                  Quay về đăng nhập
                </Link>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <a href="#" className="underline">
                  Điều khoản
                </a>{" "}
                và{" "}
                <a href="#" className="underline">
                  Chính sách bảo mật
                </a>{" "}
                của chúng tôi.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
