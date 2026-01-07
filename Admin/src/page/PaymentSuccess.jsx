import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("paymentSource");
  }, []);

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        {/* Icon success */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Thanh toán thành công!
        </h1>

        <p className="text-gray-600 mb-6">
          Giao dịch đã được xử lý thành công. Ví của bạn sẽ được cập nhật ngay
          lập tức.
        </p>

        <Link
          to="/wallet"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition"
        >
          Về ví của tôi
        </Link>
      </div>
    </div>
  );
}
