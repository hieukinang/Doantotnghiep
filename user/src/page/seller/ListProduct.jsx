import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SellerLayout from "../../component-seller-page/SellerLayout";

const backendURL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

const format = (v) => {
  if (typeof v !== "number") return "0";
  return v.toLocaleString("vi-VN");
};


const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        if (!token) {
          console.warn("⚠️ Không tìm thấy token trong localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${backendURL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(res.data?.data?.products || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow w-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
            <div className="flex items-center gap-3">
              <input
                className="border rounded px-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#116AD1]"
                placeholder="Tìm theo tên / mã"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
          {loading ? (
            <div className="p-4 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có sản phẩm nào phù hợp
            </div>
          ) : (
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
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-medium">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className="px-4 py-2 text-[#116AD1] font-semibold">
                      {format(p.price || 0)}₫
                    </td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/seller/update-product/${p.id}`}
                          className="px-3 py-1 border rounded text-[#116AD1] border-[#116AD1] hover:bg-[#116AD1] hover:text-white transition"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => console.log("Xóa sản phẩm:", p.id)}
                          className="px-3 py-1 border rounded text-red-600 border-red-300 hover:bg-red-600 hover:text-white transition"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
