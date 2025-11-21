import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SellerLayout from "../../component-seller-page/SellerLayout";
import { ShopContext } from "../../context/ShopContext";

const statusOptions = ["Tất cả", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

const OrdersSeller = () => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Gọi API orders/store
  const { orders, getOrdersofStore } = useContext(ShopContext);

  useEffect(() => {
    getOrdersofStore();
  }, []);

  // 🔍 Lọc theo trạng thái + ngày
  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === "Tất cả" || o.status === statusFilter;

    const date = new Date(o.order_date);
    const matchStart = startDate ? date >= new Date(startDate) : true;
    const matchEnd = endDate ? date <= new Date(endDate) : true;

    return matchStatus && matchStart && matchEnd;
  });

  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-auto">
        {/* Bộ lọc */}
        <div className="p-4 flex items-center gap-3 border-b">

          {/* Filter trạng thái */}
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-sm 
                ${statusFilter === s ? "bg-[#116AD1] text-white" : "bg-gray-100"}
              `}
            >
              {s}
            </button>
          ))}

          {/* Lọc ngày */}
          <div className="ml-auto flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />

            <span>-</span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>
        </div>

        {/* Bảng đơn hàng */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Mã đơn</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredOrders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 font-medium">{o.id}</td>

                <td className="px-4 py-2">{o.order_date}</td>

                <td className="px-4 py-2 text-[#116AD1] font-semibold">
                  {o.total_price.toLocaleString("vi-VN")}₫
                </td>

                <td className="px-4 py-2">{o.status}</td>

                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/seller/order-detail/${o.id}`}
                      className="px-3 py-1 border rounded"
                    >
                      Chi tiết
                    </Link>

                    <button className="px-3 py-1 border rounded">
                      Cập nhật
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersSeller;
