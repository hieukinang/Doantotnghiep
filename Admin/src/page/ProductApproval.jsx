import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductApproval = () => {
  const backend =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${backend}/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend returns { status, results, data: { products } }
      console.log(res.data.data.docs);
      setProducts(res.data?.data?.docs || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (id, status) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      // 1) refresh list first to ensure we have latest data
      await axios.get(`${backend}/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2) then update status
      await axios.patch(
        `${backend}/products/admin/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3) refresh list after update
      await fetchPending();
    } catch (err) {
      console.error(err);
      setError("Cập nhật trạng thái thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Duyệt sản phẩm</h2>

      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">Tên</th>
              <th className="px-3 py-2 font-medium">Người bán</th>
              <th className="px-3 py-2 font-medium">Giá</th>
              <th className="px-3 py-2 font-medium">Trạng thái</th>
              <th className="px-3 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center">
                  Không có sản phẩm cần duyệt
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-2 text-sm text-gray-700">{p.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {p.Store?.name || p.storeId}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {(p.min_price || 0).toLocaleString()}₫
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {p.status}
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
                      Từ chối
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
