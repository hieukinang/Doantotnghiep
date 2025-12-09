import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import IconView from '../assets/home/icon-view.svg'

const StoreManagement = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all"); // all | pending
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${backendURL}/stores/processing`, {
          headers: {
             Authorization: `Bearer ${token}` 
          }
        });

        if (res.data?.status === "success") {
          const all = res.data.data.docs || [];
          setStores(all);
        }
      } catch (err) {
        toast.error("Không thể tải danh sách cửa hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const storeList =
    tab === "all"
      ? stores
      : stores.filter((s) => s.status === tab);

  const filteredStores = storeList.filter((s) => {
    const key = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(key) ||
      (s.detail_address || "").toLowerCase().includes(key) ||
      (s.village || "").toLowerCase().includes(key) ||
      (s.city || "").toLowerCase().includes(key)
    );
  });

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  const currentStores = filteredStores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.patch(
        `${backendURL}/stores/update-status/${id}`,
        { status: "ACTIVE" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.status === "success") {
        toast.success("Duyệt cửa hàng thành công!");
        setStores((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "ACTIVE" } : s))
        );
      }
    } catch (err) {
      toast.error("Không thể duyệt cửa hàng");
    }
  };

  const handleDisapprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.patch(
        `${backendURL}/stores/update-status/${id}`,
        { status: "PROCESSING" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.status === "success") {
        toast.success("Bỏ duyệt cửa hàng thành công!");
        setStores((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "PROCESSING" } : s))
        );
      }
    } catch (err) {
      toast.error("Không thể bỏ duyệt cửa hàng");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý cửa hàng</h1>

      {/* TAB */}
      {/* <div className="flex gap-4 mt-4">
        <button
          className={`px-5 py-2 rounded-full font-medium ${
            tab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => { setTab("all"); setCurrentPage(1);}}
        >
          Tất cả cửa hàng
        </button>
        <button
          className={`px-5 py-2 rounded-full font-medium ${
            tab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => { setTab("pending"); setCurrentPage(1);}}
        >
          Cửa hàng chờ duyệt
        </button>
      </div> */}

      {/* Search */}
      <div className="flex justify-end mt-3 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          className="border border-gray-300 rounded-full px-5 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="border border-gray-300 rounded-full px-4 py-2 bg-white"
          value={tab}
          onChange={(e) => {
            setTab(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="BANNED">BANNED</option>
          <option value="DESTROYED">DESTROYED</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left w-[80px]">STT</th>
              <th className="p-3 text-left w-[250px]">Tên cửa hàng</th>
              <th className="p-3 text-left w-[300px]">Địa chỉ</th>
              <th className="p-3 text-left w-[120px]">Trạng thái</th>
              <th className="p-3 text-center w-[150px]">Hành động</th>

            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentStores.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              currentStores.map((store, index) => {
                const address =
                  store.detail_address ||
                  store.village ||
                  store.city ||
                  "Chưa có địa chỉ";

                const statusLabel = {
                  ACTIVE: "Đã duyệt",
                  PROCESSING: "Chờ duyệt",
                  BANNED: "Bị chặn"
                }[store.status] || store.status;

                return (
                  <tr key={store.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-left">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="p-3 text-left">{store.name}</td>
                    <td className="p-3 text-left">{address}</td>
                    <td className="p-3 text-left">
                      <select
                        className="border border-gray-300 rounded px-2 py-1"
                        style={{
                          backgroundColor:
                            store.status === "ACTIVE"
                              ? "#16A34A" 
                              : store.status === "INACTIVE"
                              ? "#6B7280"
                              : store.status === "BANNED"
                              ? "#DC2626"
                              : store.status === "PROCESSING"
                              ? "#FACC15"
                              : store.status === "DESTROYED"
                              ? "#000000"
                              : "#6B7280",
                          color:
                            store.status === "PROCESSING" ? "#000" : "#fff" // PROCESSING text black
                        }}
                        value={store.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;

                          try {
                            const token = localStorage.getItem("adminToken");
                            const res = await axios.patch(
                              `${backendURL}/stores/update-status/${store.id}`,
                              { status: newStatus },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );

                            if (res.data?.status === "success") {
                              toast.success("Cập nhật trạng thái thành công!");

                              setStores(prev =>
                                prev.map(s =>
                                  s.id === store.id ? { ...s, status: newStatus } : s
                                )
                              );
                            }
                          } catch (err) {
                            toast.error("Không thể cập nhật trạng thái");
                          }
                        }}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BANNED">BANNED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="DESTROYED">DESTROYED</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/store/profile-detail/${store.id}`)}
                          className="p-2 hover:bg-gray-200 rounded-full"
                          title="Chi tiết"
                        >
                          <img src={IconView} className="w-4" />
                        </button>
                        {/* {store.status === "PROCESSING" && (
                          <button
                            onClick={() => handleApprove(store.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Duyệt
                          </button>
                        )}
                        {store.status === "ACTIVE" && (
                          <button
                            onClick={() => handleDisapprove(store.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Bỏ duyệt
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-3 items-center">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ←
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;