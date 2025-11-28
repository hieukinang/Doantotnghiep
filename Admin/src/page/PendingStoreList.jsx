import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import IconView from "../assets/home/icon-view.svg";

const PendingStoreList = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Fetch stores with status PROCESSING
  useEffect(() => {
    const fetchPendingStores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${backendURL}/stores/processing`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data?.status === "success") {
          const allStores = res.data?.data?.docs || [];
          // Filter only PROCESSING status stores
          const pendingStores = allStores.filter(
            (store) => store.status === "PROCESSING"
          );
          setStores(pendingStores);
        }
      } catch (err) {
        console.error("Error fetching pending stores:", err);
        toast.error(err.response?.data?.message || "Không thể tải danh sách cửa hàng chờ duyệt");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStores();
  }, [backendURL]);

  // Handle approve store
  const handleApprove = async (storeId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.patch(
        `${backendURL}/stores/update-status/${storeId}`,
        { status: "ACTIVE" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data?.status === "success") {
        toast.success("Duyệt cửa hàng thành công!");
        // Remove approved store from list
        setStores(stores.filter((s) => s.id !== storeId));
      } else {
        toast.error(res.data?.message || "Duyệt cửa hàng thất bại");
      }
    } catch (err) {
      console.error("Error approving store:", err);
      toast.error(err.response?.data?.message || "Không thể duyệt cửa hàng");
    }
  };

  // Pagination
  const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);
  const paginatedStores = stores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Cửa hàng cần duyệt</h1>

      {loading ? (
        <div className="text-center p-8 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : paginatedStores.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          Không có cửa hàng nào chờ duyệt.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left w-[300px]">Tên cửa hàng</th>
                  <th className="p-3 text-left w-[250px]">Địa chỉ</th>
                  <th className="p-3 text-left w-[200px]">Email</th>
                  <th className="p-3 text-left w-[150px]">Số điện thoại</th>
                  <th className="p-3 text-center w-[200px]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((store) => {
                  const address = store.detail_address 
                    ? `${store.detail_address}, ${store.village || ""}, ${store.city || ""}`.replace(/^,\s*|,\s*$/g, "")
                    : store.village || store.city || store.address || "Chưa có địa chỉ";
                  
                  return (
                    <tr
                      key={store.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-left">{store.name || "Chưa có tên"}</td>
                      <td className="p-3 text-left">{address}</td>
                      <td className="p-3 text-left">{store.email || "Chưa có email"}</td>
                      <td className="p-3 text-left">{store.phone || "Chưa có SĐT"}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {/* Xem chi tiết */}
                          <div className="relative group">
                            <button
                              onClick={() => navigate(`/store/profile-detail/${store.id}`)}
                              className="p-2 rounded-full hover:bg-gray-200 transition"
                            >
                              <img src={IconView} alt="Xem chi tiết" className="w-4 h-4" />
                            </button>
                            <span
                              className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                              bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                              group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                            >
                              Xem chi tiết
                            </span>
                          </div>

                          {/* Nút Duyệt */}
                          <button
                            onClick={() => handleApprove(store.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                          >
                            Duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-4 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                ←
              </button>

              <span className="text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingStoreList;