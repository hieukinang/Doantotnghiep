import { useState, useEffect, useContext } from "react";
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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [wallet, setWallet] = useState(0);
    const [tab, setTab] = useState("deposit");

    const sellerToken = localStorage.getItem("sellerToken");

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
        if (startDate && endDate) fetchHistory();
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
    const handleWithdraw = () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Nhập số tiền muốn rút!");
        }
        console.log("Rút:", amount);
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

                    <button
                        onClick={tab === "deposit" ? handleTopUp : handleWithdraw}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow"
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
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {history.map((item, i) => (
                        <div key={i} className="p-3 border rounded-lg flex justify-between">
                            <div>
                                <div className="font-medium">{item.description}</div>
                                <div className="text-gray-500 text-xs">{formatDateTime(item.updatedAt)}</div>
                            </div>

                            <div
                                className={
                                    item.amount > 0
                                        ? "text-green-600 font-semibold"
                                        : "text-red-600 font-semibold"
                                }
                            >
                                {item.amount > 0 ? "+ " : "- "}
                                ₫{Math.abs(item.amount).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Phân trang */}
                <div className="mt-4 flex items-center justify-between">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Trước
                    </button>

                    <div>Trang {page} / {totalPages}</div>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
