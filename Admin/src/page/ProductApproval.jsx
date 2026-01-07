import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductApproval = () => {
  const backend =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${backend}/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data?.data?.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `${backend}/products/admin/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        status === "ACTIVE"
          ? "Duyệt sản phẩm thành công"
          : "Từ chối sản phẩm thành công"
      );

      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Duyệt sản phẩm
      </h1>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">STT</th>
              <th className="p-4 text-left font-semibold">Tên sản phẩm</th>
              <th className="p-4 text-left font-semibold">Xuất xứ</th>
              <th className="p-4 text-left font-semibold">Giá</th>
              <th className="p-4 text-left font-semibold">Trạng thái</th>
              <th className="p-4 text-center font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Không có sản phẩm cần duyệt
                </td>
              </tr>
            ) : (
              products.map((p, index) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 text-left text-gray-700">
                    {index + 1}
                  </td>

                  <td className="p-4 text-left text-gray-800 font-medium">
                    {p.name}
                  </td>

                  <td className="p-4 text-left text-gray-600">
                    {p.origin}
                  </td>

                  <td className="p-4 text-left text-gray-700">
                    {(p.min_price || 0).toLocaleString()}₫
                  </td>
                  <td className="px-3 py-2 text-left text-gray-700">
                    {p.status === "ACTIVE"
                      ? "Đã duyệt"
                      : p.status === "BANNED"
                      ? "Cấm"
                      : "Chờ duyệt"}
                  </td>
                  <td className="px-3 py-2 space-x-3">
                    <button
                      onClick={() => updateStatus(p.id, "ACTIVE")}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "BANNED")}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Cấm
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductApproval;
