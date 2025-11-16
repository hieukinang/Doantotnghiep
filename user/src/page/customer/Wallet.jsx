import { useState, useEffect } from "react";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import axios from "axios";

export default function Wallet() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("stripe");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (startDate && endDate) fetchHistory();
    }, [startDate, endDate, page]);
    const clientToken = localStorage.getItem("clientToken");
    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/transactions", {
                params: { startDate, endDate, page }, headers: { Authorization: `Bearer ${clientToken}` },
            });

            setHistory(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            setPage(res.data.pagination.currentPage);
        } catch (err) {
            console.error(err);
        }
    };

    const accountBalance = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/transactions/get-wallet", {
                headers: { Authorization: `Bearer ${clientToken}` },
            })
        } catch (error) {

        }
    }

    const handleTopUp = () => {
        if (!amount || Number(amount) <= 0) {
            alert("Vui lòng nhập số tiền muốn nạp!");
            return;
        }
        console.log("Nạp:", amount, "qua:", method);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="pt-32 px-5 flex-1">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ===== CỘT TRÁI ===== */}
                    <section className="bg-white p-6 rounded-xl shadow min-h-[500px] flex flex-col">
                        <div className="font-semibold text-xl mb-4">Nạp tiền</div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex-1 flex flex-col">
                            <p className="text-gray-500 text-sm">Số dư khả dụng</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">₫ 1,250,000</p>

                            {/* Input số tiền */}
                            <div className="mt-5">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Nhập số tiền"
                                    className="border border-blue-300 rounded-lg px-3 py-2 w-full"
                                />
                            </div>

                            {/* PHƯƠNG THỨC THANH TOÁN */}
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

                            <button
                                onClick={handleTopUp}
                                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow"
                            >
                                Nạp tiền
                            </button>
                        </div>
                    </section>

                    {/* ===== CỘT PHẢI ===== */}
                    <section className="bg-white p-6 rounded-xl shadow min-h-[500px] flex flex-col">
                        {/* title + date filter */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="font-semibold text-xl">Lịch sử giao dịch</div>

                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    placeholder="Từ ngày"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border px-2 py-1 rounded-lg w-32 text-sm"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    placeholder="Đến ngày"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border px-2 py-1 rounded-lg w-32 text-sm"
                                />
                            </div>
                        </div>

                        {/* danh sách */}
                        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                            {history.map((item, i) => (
                                <div key={i} className="p-3 border rounded-lg flex justify-between">
                                    <div>
                                        <div className="font-medium">{item.type}</div>
                                        <div className="text-gray-500 text-xs">{item.date}</div>
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

                        {/* phân trang */}
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
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
