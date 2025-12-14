import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

// Format thời gian sang GMT+7
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
};

export default function Wallet() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("stripe");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [wallet, setWallet] = useState(0);
  const [tab, setTab] = useState("deposit");
  const [password, setPassword] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  // ================= LẤY SỐ DƯ =================
  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/transactions/get-wallet`,
        getAuthHeaders()
      );
      setWallet(res.data.wallet || 0);
    } catch (err) {
      console.error("Lỗi lấy ví:", err);
    }
  };

  // ================= LẤY LỊCH SỬ =================
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/transactions/`, {
        params: { startDate, endDate, page },
        ...getAuthHeaders(),
      });

      setHistory(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setPage(res.data.pagination?.currentPage || 1);
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
          `${API_BASE}/transactions/checkout-session/stripe`,
          { amount: Number(amount) },
          getAuthHeaders()
        );
        url = res.data.session?.url;
      } else {
        const res = await axios.post(
          `${API_BASE}/transactions/checkout-session/momo`,
          { amount: Number(amount) },
          getAuthHeaders()
        );
        url = res.data.shortLink;
      }

      if (!url) return toast.error("Không lấy được URL!");

      // Lưu nguồn để redirect về đúng trang sau khi thanh toán
      localStorage.setItem("paymentSource", "admin");

      window.location.href = url;
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xảy ra!");
    }
  };

  // ================= RÚT TIỀN =================
  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      return toast.error("Nhập số tiền muốn rút!");
    }
    if (Number(amount) > wallet) {
      return toast.error("Số dư không đủ!");
    }
    if (!password) {
      return toast.error("Vui lòng nhập mật khẩu xác nhận!");
    }
    try {
      await axios.post(
        `${API_BASE}/transactions/withdraw`,
        { amount: Number(amount), password },
        getAuthHeaders()
      );
      toast.success("Rút tiền thành công!");
      setAmount("");
      setPassword("");
      fetchWallet();
      fetchHistory();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
      {/* ================== VÍ & NẠP/RÚT ================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">💳 Ví Admin</h2>

        {/* TAB */}
        <div className="flex gap-4 mb-4 border-b pb-2">
          <button
            className={`pb-2 font-semibold ${
              tab === "deposit"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("deposit")}
          >
            Nạp tiền
          </button>

          <button
            className={`pb-2 font-semibold ${
              tab === "withdraw"
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
          <p className="text-3xl font-bold text-blue-600 mt-1">
            ₫ {wallet.toLocaleString()}
          </p>

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

          {/* Nhập mật khẩu nếu tab = rút */}
          {tab === "withdraw" && (
            <div className="mt-4">
              <p className="font-medium mb-2">Xác nhận mật khẩu:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu admin"
                className="border border-blue-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
          )}

          <button
            onClick={tab === "deposit" ? handleTopUp : handleWithdraw}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow"
          >
            {tab === "deposit" ? "Nạp tiền" : "Rút tiền"}
          </button>
        </div>
      </div>


      {/* ================== LỊCH SỬ GIAO DỊCH ================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-4">Lịch sử giao dịch</h3>

        {/* Bộ lọc */}
        <div className="flex gap-2 mb-5">
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

        {/* Danh sách */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có giao dịch nào</p>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{item.description}</div>
                  <div className="text-gray-500 text-xs">
                    {formatDateTime(item.updatedAt)}
                  </div>
                </div>

                <div
                  className={
                    item.amount > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {item.amount > 0 ? "+ " : "- "}₫
                  {Math.abs(item.amount).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trước
            </button>

            <div>
              Trang {page} / {totalPages}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
