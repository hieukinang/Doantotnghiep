import React from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../component-seller-page/SellerLayout";

const mockProducts = [
  {
    id: "SP001",
    name: "Tai nghe Bluetooth Pro",
    price: 399000,
    stock: 120,
    category: "Âm thanh",
  },
  {
    id: "SP002",
    name: "Bàn phím cơ RGB",
    price: 899000,
    stock: 45,
    category: "PC Gear",
  },
  {
    id: "SP003",
    name: "Giày chạy bộ Ultra",
    price: 599000,
    stock: 80,
    category: "Thể thao",
  },
];

const format = (v) => v.toLocaleString("vi-VN");

const ListProduct = () => {
  return (
    <SellerLayout title="Sản phẩm">
      <div className="bg-white rounded-lg shadow w-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
            <div className="flex items-center gap-3">
              {/* Ô tìm kiếm */}
              <input
                className="border rounded px-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#116AD1]"
                placeholder="Tìm theo tên / mã"
              />
              {/* Nút thêm sản phẩm */}
              <Link
                to="/seller/add-product"
                className="bg-[#116AD1] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0e57aa] transition"
              >
                + Thêm sản phẩm
              </Link>
            </div>
          </div>
        </div>

        {/* Bảng danh sách sản phẩm */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2">Mã</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Danh mục</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Tồn kho</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockProducts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-medium">{p.id}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2 text-[#116AD1] font-semibold">
                    {format(p.price)}₫
                  </td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/seller/update-product"
                        className="px-3 py-1 border rounded text-[#116AD1] border-[#116AD1] hover:bg-[#116AD1] hover:text-white transition"
                      >
                        Sửa
                      </Link>
                      <button className="px-3 py-1 border rounded text-red-600 border-red-300 hover:bg-red-600 hover:text-white transition">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ListProduct;
