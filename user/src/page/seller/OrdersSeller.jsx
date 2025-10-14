import React, { useState } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../component-seller-page/SellerLayout";

const mock = [
  {
    id: "KOHI12345",
    customer: "Nguyễn Văn A",
    total: 699000,
    status: "Đang xử lý",
    date: "12/08/2025",
  },
  {
    id: "KOHI12346",
    customer: "Trần Thị B",
    total: 1299000,
    status: "Đang giao",
    date: "11/08/2025",
  },
  {
    id: "KOHI12347",
    customer: "Lê Văn C",
    total: 349000,
    status: "Hoàn thành",
    date: "10/08/2025",
  },
];

const statuses = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"];

const OrdersSeller = () => {
  const [active, setActive] = useState("Tất cả");

  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-auto">
        <div className="p-4 flex items-center gap-2 border-b">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-3 py-1 rounded-full text-sm ${active === s ? "bg-[#116AD1] text-white" : "bg-gray-100"
                }`}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto">
            <input
              className="border rounded px-3 py-1 text-sm"
              placeholder="Tìm mã đơn/khách hàng"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Mã đơn</th>
              <th className="px-4 py-2">Khách hàng</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mock
              .filter((o) => active === "Tất cả" || o.status === active)
              .map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-2 font-medium">{o.id}</td>
                  <td className="px-4 py-2">{o.customer}</td>
                  <td className="px-4 py-2">{o.date}</td>
                  <td className="px-4 py-2 text-[#116AD1] font-semibold">
                    {o.total.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/seller/order-detail"
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersSeller;
