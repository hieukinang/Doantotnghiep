import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";


// Mapping API status -> UI status
const STATUS_MAP = {
  PENDING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã vận chuyển",
  CLIENT_CONFIRMED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED: "Lỗi",
  RETURNED: "Yêu cầu trả hàng",
  RETURN_CONFIRMED: "Đã trả hàng",
};

// Tabs UI
const tabs = [
  "Tất cả",
  "Đang xử lý",
  "Đã xác nhận",
  "Đang giao",
  "Đã vận chuyển",
  "Hoàn thành",
  "Đã hủy",
  "Lỗi",
  "Yêu cầu trả hàng",
  "Đã trả hàng",
];

const Orders = () => {
  const { ordersClient, getOrderofClient } = useContext(ShopContext);

  const [active, setActive] = useState("Tất cả");

  useEffect(() => {
    getOrderofClient();
  }, []);

  // Chuẩn hóa dữ liệu API -> UI
  const formatOrders = (ordersClient || []).map((o) => {
    const statusUI = STATUS_MAP[o.status] || "Đang xử lý";

    return {
      id: o.orderCode || `ORDER-${o.id}`,
      status: statusUI,
      total: o.total_price || 0,
      items: o.items?.length || 0,
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("vi-VN")
        : "",
    };
  });

  const filteredOrders =
    active === "Tất cả"
      ? formatOrders
      : formatOrders.filter((o) => o.status === active);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-2 overflow-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-4 py-2 rounded-full border ${active === t
                  ? "bg-[#116AD1] text-white border-[#116AD1]"
                  : "border-gray-300 bg-white"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Order list */}
          <div className="mt-4 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500">
                Không có đơn hàng.
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-lg p-4 shadow flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{o.id}</div>
                    <div className="text-sm text-gray-500">
                      {o.date} • {o.items} sản phẩm
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#116AD1] font-bold">
                      {o.total.toLocaleString("vi-VN")}₫
                    </div>
                    <div className="text-sm">{o.status}</div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/order-detail/${o.id}`}
                      className="text-sm text-[#116AD1] hover:underline"
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to="/exchange-request"
                      className="text-sm text-[#116AD1] hover:underline"
                    >
                      Đổi trả
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
