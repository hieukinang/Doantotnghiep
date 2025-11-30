import { useRef } from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
    // Dùng useRef để lưu giá trị và chỉ đọc 1 lần (tránh Strict Mode render 2 lần)
    const sourceRef = useRef(null);
    
    if (sourceRef.current === null) {
        sourceRef.current = localStorage.getItem("paymentSource") || "customer";
        localStorage.removeItem("paymentSource");
    }
    
    const redirectPath = sourceRef.current === "seller" ? "/seller/wallet" : "/wallet";

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Thanh toán thành công!
                </h1>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn! Giao dịch đã được xử lý thành công.
                    Ví của bạn sẽ được cập nhật ngay lập tức.
                </p>

                <Link
                    to={redirectPath}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition"
                >
                    Về ví của tôi
                </Link>

            </div>
        </div>
    );
}
