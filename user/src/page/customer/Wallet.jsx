import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// Format thời gian sang GMT+7
const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
};

export default function Wallet() {
    const { clientUser } = useContext(ShopContext);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("stripe");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [wallet, setWallet] = useState(0);
    const [tab, setTab] = useState("deposit"); // deposit | withdraw
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const clientToken = localStorage.getItem("clientToken");

    // Kiểm tra thông tin ngân hàng
    const hasBankInfo = clientUser?.bank_name && clientUser?.bank_account_number && clientUser?.bank_account_holder_name;

    // Lấy số dư ví
    const fetchWallet = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/transactions/get-wallet", {
                headers: { Authorization: `Bearer ${clientToken}` },
            });
            console.log(res.data.wallet)
            setWallet(res.data.wallet);
        } catch (err) {
            console.error("Lỗi lấy số dư:", err);
        }
    };

    // Lấy lịch sử giao dịch
    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/transactions/", {
                params: { startDate, endDate, page },
                headers: { Authorization: `Bearer ${clientToken}` },
            });

            setHistory(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWallet();
        fetchHistory();
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [startDate, endDate, page]);

    // Nạp tiền
    const handleTopUp = async () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Vui lòng nhập số tiền muốn nạp!");
        }
        try {
            let url = "";
            if (method === "stripe") {
                const res = await axios.post(
                    "http://localhost:5000/api/transactions/checkout-session/stripe",
                    { amount: Number(amount) },
                    {
                        headers: { Authorization: `Bearer ${clientToken}` },
                        "Content-Type": "application/json"
                    }
                );
                url = res.data.session.url;  // backend trả về { url: "https://checkout.stripe.com/..." }
            } else {
                const res = await axios.post(
                    "http://127.0.0.1:5000/api/transactions/checkout-session/momo",
                    { amount: Number(amount) },
                    {
                        headers: { Authorization: `Bearer ${clientToken}` },
                        "Content-Type": "application/json"
                    }
                );
                url = res.data.shortLink;  // momo trả về link thanh toán
            }

            if (!url) {
                return toast.error("Không lấy được URL thanh toán!");
            }

            // Lưu nguồn để redirect về đúng trang sau khi thanh toán
            localStorage.setItem("paymentSource", "customer");

            // 🚀 Redirect sang trang thanh toán
            window.location.href = url;

        } catch (err) {
            console.log(err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };


    // Rút tiền
    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Vui lòng nhập số tiền muốn rút!");
        }
        if (!password) {
            return toast.error("Vui lòng nhập mật khẩu!");
        }
        if (Number(amount) > wallet) {
            return toast.error("Số dư không đủ!");
        }

        try {
            const res = await axios.post(
                "http://127.0.0.1:5000/api/transactions/withdraw",
                { amount: Number(amount), password },
                { headers: { Authorization: `Bearer ${clientToken}` } }
            );

            if (res.data.status === "success") {
                toast.success("Rút tiền thành công!");
                setAmount("");
                setPassword("");
                fetchWallet();
                fetchHistory();
            } else {
                toast.error(res.data.message || "Rút tiền thất bại!");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="pt-32 px-5 pb-10 flex-1">
                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8" style={{ height: '570px' }}>

                    {/* ===== CỘT THAO TÁC ===== */}
                    <section className="bg-white p-6 rounded-xl shadow flex flex-col overflow-hidden">

                        {/* TAB */}
                        <div className="flex gap-4 mb-4 border-b pb-2">
                            <button
                                className={`pb-2 font-semibold ${tab === "deposit" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                                onClick={() => setTab("deposit")}
                            >
                                Nạp tiền
                            </button>

                            <button
                                className={`pb-2 font-semibold ${tab === "withdraw" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                                onClick={() => setTab("withdraw")}
                            >
                                Rút tiền
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex-1 flex flex-col">

                            {/* Số dư */}
                            <p className="text-gray-500 text-sm">Số dư khả dụng</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                ₫ {wallet.toLocaleString()}
                            </p>

                            {/* Input số tiền */}
                            <div className="mt-5">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Nhập số tiền"
                                    className="border border-blue-300 rounded-lg px-3 py-2 w-full"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Nếu đang ở tab nạp thì show phương thức */}
                            {tab === "deposit" && (
                                <div className="mt-6">
                                    <p className="font-medium mb-2">Chọn phương thức thanh toán:</p>

                                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="stripe"
                                            checked={method === "stripe"}
                                            onChange={() => setMethod("stripe")}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">Nạp qua Stripe</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="momo"
                                            checked={method === "momo"}
                                            onChange={() => setMethod("momo")}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">Nạp qua MoMo</span>
                                    </label>
                                </div>
                            )}
                            {tab === "withdraw" && (
                                <div className="mt-6">
                                    {!hasBankInfo ? (
                                        // Chưa có thông tin ngân hàng
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="font-medium text-yellow-800 mb-2">⚠️ Chưa có thông tin ngân hàng</p>
                                            <p className="text-sm text-yellow-700 mb-3">
                                                Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền.
                                            </p>
                                            <Link
                                                to="/update-profile"
                                                className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                                            >
                                                Cập nhật ngay
                                            </Link>
                                        </div>
                                    ) : (
                                        // Đã có thông tin ngân hàng
                                        <>
                                            {/* Hiển thị thông tin ngân hàng */}
                                            <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                                                <p className="text-sm text-gray-500 mb-1">Tài khoản nhận tiền</p>
                                                <p className="font-medium">{clientUser.bank_name}</p>
                                                <p className="text-sm">{clientUser.bank_account_number}</p>
                                                <p className="text-sm text-gray-600">{clientUser.bank_account_holder_name}</p>
                                            </div>

                                            <p className="font-medium mb-2">Xác nhận rút tiền</p>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Nhập mật khẩu tài khoản"
                                                    className="border border-blue-300 rounded-lg px-3 py-2 w-full pr-10"
                                                    autoComplete="off"
                                                    style={{
                                                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? "🙈" : "👁️"}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Nhập mật khẩu đăng nhập để xác nhận giao dịch
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}


                            {/* BUTTON */}
                            <button
                                onClick={tab === "deposit" ? handleTopUp : handleWithdraw}
                                disabled={tab === "withdraw" && !hasBankInfo}
                                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {tab === "deposit" ? "Nạp tiền" : "Rút tiền"}
                            </button>
                        </div>
                    </section>

                    {/* ===== CỘT LỊCH SỬ ===== */}
                    <section className="bg-white p-6 rounded-xl shadow flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-5">
                            <div className="font-semibold text-xl">Lịch sử giao dịch</div>

                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border px-2 py-1 rounded-lg w-32 text-sm"
                                />

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border px-2 py-1 rounded-lg w-32 text-sm"
                                />
                            </div>
                        </div>

                        {/* danh sách */}
                        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                            {history.map((item, i) => {
                                const isDebit = item.type === "WITHDRAW" || item.type === "PAY_ORDER";
                                return (
                                    <div key={i} className="p-3 border rounded-lg flex justify-between">
                                        <div>
                                            <div className="font-medium">{item.description}</div>
                                            <div className="text-gray-500 text-xs">{formatDateTime(item.updatedAt)}</div>
                                        </div>

                                        <div
                                            className={
                                                isDebit
                                                    ? "text-red-600 font-semibold"
                                                    : "text-green-600 font-semibold"
                                            }
                                        >
                                            {isDebit ? "- " : "+ "}
                                            ₫{Math.abs(item.amount).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* phân trang */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .map((p, index, arr) => (
                                        <span key={p} className="flex items-center">
                                            {index > 0 && arr[index - 1] !== p - 1 && (
                                                <span className="px-1 text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 rounded text-sm ${
                                                    page === p
                                                        ? "bg-blue-600 text-white"
                                                        : "border hover:bg-gray-100"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </span>
                                    ))}

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
