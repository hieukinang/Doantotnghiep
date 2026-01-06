import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";

// Format thời gian sang GMT+7
const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
};

export default function Wallet() {
    const { backendURL } = useContext(ShopContext);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("stripe");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [wallet, setWallet] = useState(0);
    const [tab, setTab] = useState("deposit");

    const sellerToken = localStorage.getItem("sellerToken");
    const sellerUser = JSON.parse(localStorage.getItem('sellerUser') || '{}');
    const hasBankInfo =
        sellerUser?.bank_name && sellerUser?.bank_account_number && sellerUser?.bank_account_holder_name;

    // ================= LẤY SỐ DƯ =================
    const fetchWallet = async () => {
        try {
            const res = await axios.get(
                `${backendURL}/transactions/get-wallet`,
                { headers: { Authorization: `Bearer ${sellerToken}` } }
            );
            console.log(res.data);
            setWallet(res.data.wallet);
        } catch (err) {
            console.error("Lỗi lấy ví:", err);
        }
    };

    // ================= LẤY LỊCH SỬ =================
    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${backendURL}/transactions/`, {
                params: { startDate, endDate, page },
                headers: { Authorization: `Bearer ${sellerToken}` },
            });

            setHistory(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            setPage(res.data.pagination.currentPage);
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

    // ================= NẠP TIỀN =================
    const handleTopUp = async () => {
        if (!amount || Number(amount) <= 0)
            return toast.error("Vui lòng nhập số tiền!");

        try {
            let url = "";

            if (method === "stripe") {
                const res = await axios.post(
                    `${backendURL}/transactions/checkout-session/stripe`,
                    { amount: Number(amount) },
                    { headers: { Authorization: `Bearer ${sellerToken}` } }
                );
                url = res.data.session.url;
            } else {
                const res = await axios.post(
                    `${backendURL}/transactions/checkout-session/momo`,
                    { amount: Number(amount) },
                    { headers: { Authorization: `Bearer ${sellerToken}` } }
                );
                url = res.data.shortLink;
            }

            if (!url) return toast.error("Không lấy được URL!");

            // Lưu nguồn để redirect về đúng trang sau khi thanh toán
            localStorage.setItem("paymentSource", "seller");

            window.location.href = url;
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi xảy ra!");
        }
    };

    // ================= RÚT TIỀN =================
    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Vui lòng nhập số tiền muốn rút!");
        }
        if (!password) {
            return toast.error("Vui lòng nhập mật khẩu!");
        }

        try {
            const res = await axios.post(
                `${backendURL}/transactions/withdraw`,
                { amount: Number(amount), password },
                { headers: { Authorization: `Bearer ${sellerToken}` } }
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
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm mt-6">

            {/* ================== MAIN CONTENT ================== */}
            <div className="flex-[3] bg-white shadow rounded-lg p-4">
                <h2 className="text-base font-semibold mb-3">💳 Ví của bạn</h2>

                {/* TAB */}
                <div className="flex gap-4 mb-4 border-b pb-2">
                    <button
                        className={`pb-2 font-semibold ${tab === "deposit"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                            }`}
                        onClick={() => setTab("deposit")}
                    >
                        Nạp tiền
                    </button>

                    <button
                        className={`pb-2 font-semibold ${tab === "withdraw"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                            }`}
                        onClick={() => setTab("withdraw")}
                    >
                        Rút tiền
                    </button>
                </div>

                {/* BOX */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                    {/* Số dư */}
                    <p className="text-gray-500 text-sm">Số dư khả dụng</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">₫ {wallet.toLocaleString()}</p>

                    {/* Nhập số tiền */}
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số tiền"
                        className="border border-blue-300 rounded-lg px-3 py-2 w-full mt-5"
                    />

                    {/* Phương thức nếu tab = nạp */}
                    {tab === "deposit" && (
                        <div className="mt-6">
                            <p className="font-medium mb-2">Chọn phương thức:</p>

                            <label className="flex items-center gap-3 mb-3 cursor-pointer">
                                <input
                                    type="radio"
                                    value="stripe"
                                    checked={method === "stripe"}
                                    onChange={() => setMethod("stripe")}
                                />
                                <span>Nạp qua Stripe</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    value="momo"
                                    checked={method === "momo"}
                                    onChange={() => setMethod("momo")}
                                />
                                <span>Nạp qua MoMo</span>
                            </label>
                        </div>
                    )}

                    {/* Xác nhận rút tiền */}
                    {tab === "withdraw" && (
                        <div className="mt-6">
                            {!hasBankInfo ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="font-medium text-yellow-800 mb-2">⚠️ Chưa có thông tin ngân hàng</p>
                                    <p className="text-xs text-yellow-700 mb-3">Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền.</p>
                                    <Link
                                        to="/seller/edit-profile"
                                        className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs font-medium"
                                    >
                                        Cập nhật ngay
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Thông tin ngân hàng */}
                                    <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                                        <p className="text-xs text-gray-500 mb-1">Tài khoản nhận tiền</p>
                                        <p className="font-medium">{sellerUser.bank_name}</p>
                                        <p className="text-xs">{sellerUser.bank_account_number}</p>
                                        <p className="text-xs text-gray-600">{sellerUser.bank_account_holder_name}</p>
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
                                            style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Nhập mật khẩu đăng nhập để xác nhận giao dịch</p>
                                </>
                            )}
                        </div>
                    )}

                    <button
                        onClick={tab === "deposit" ? handleTopUp : handleWithdraw}
                        disabled={tab === "withdraw" && !hasBankInfo}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {tab === "deposit" ? "Nạp tiền" : "Rút tiền"}
                    </button>
                </div>

                {/* ================= LỊCH SỬ ================= */}
                

            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Lịch sử giao dịch</h3>
                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
                        <span className="text-gray-500 text-xs">Từ</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-blue-400"
                        />
                        <span className="text-gray-400 text-xs">→</span>
                        <span className="text-gray-500 text-xs">Đến</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-blue-400"
                        />
                    </div>
                </div>

                {/* Danh sách */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[350px] lg:max-h-none">
                    {history.map((item, i) => {
                        const isDebit = item.type === "WITHDRAW" || item.type === "PAY_ORDER";
                        return (
                            <div key={i} className="p-3 border rounded-lg flex justify-between">
                                <div>
                                    <div className="font-medium text-sm md:text-base">{item.description}</div>
                                    <div className="text-gray-500 text-xs">{formatDateTime(item.updatedAt)}</div>
                                </div>

                                <div className={`text-sm md:text-base ${isDebit ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}`}>
                                    {isDebit ? "- " : "+ "}
                                    ₫{Math.abs(item.amount).toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Phân trang */}
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
                                        className={`w-8 h-8 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'border hover:bg-gray-100'}`}
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
            </div>
        </div>
    );
}
