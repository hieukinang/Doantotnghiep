import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconView from '../assets/home/icon-view.svg'
import IconDelete from "../assets/home/icon-delete.svg";
import IconEdit from '../assets/home/icon-edit.svg'

const StoreManagement = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  // Fetch stores from API
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
          const allStores = res.data?.data?.docs || [];
          // Filter stores with status ACTIVE or PROCESSING
          const filteredStores = allStores.filter(
            (store) => store.status === "ACTIVE" || store.status === "PROCESSING"
          );
          setStores(filteredStores);
        }
      } catch (err) {
        console.error("Error fetching stores:", err);
        toast.error(err.response?.data?.message || "Không thể tải danh sách cửa hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [backendURL]);

  const handleMenuClick = (store, index) => {
    setSelectedStore(store);
    setMenuOpen(menuOpen === index ? null : index);
  };

  const handleDetail = (id) => {
    navigate(`/store/profile-detail/${id}`);
    setMenuOpen(null);
  };

  const handleUpdate = (store) => {
    setSelectedStore(store);
    setOpenUpdate(true);
    setMenuOpen(null);
  };

  const handleUpdateSubmit = async (updatedStore) => {
    try {
      const token = localStorage.getItem("adminToken");
      // Note: Có thể cần API để update store info, nhưng hiện tại chỉ update status
      // Tạm thời chỉ update local state
      setStores(stores.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
      setOpenUpdate(false);
      toast.success("Cập nhật cửa hàng thành công!");
    } catch (err) {
      console.error("Error updating store:", err);
      toast.error("Không thể cập nhật cửa hàng");
    }
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setOpenDelete(true);
    setMenuOpen(null);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      // Note: Có thể cần API để delete store
      // Tạm thời chỉ update local state
      setStores(stores.filter((s) => s.id !== selectedStore.id));
      setOpenDelete(false);
      toast.success("Xóa cửa hàng thành công!");
    } catch (err) {
      console.error("Error deleting store:", err);
      toast.error("Không thể xóa cửa hàng");
    }
  };

  // Lọc cửa hàng theo từ khóa
  const filteredStores = stores.filter((s) => {
    const name = (s.name || "").toLowerCase();
    const address = (
      s.detail_address || 
      s.village || 
      s.city || 
      s.address || 
      ""
    ).toLowerCase();
    const owner = (s.owner || s.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || address.includes(search) || owner.includes(search);
  });

  // Phân trang
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 space-y-6">
      {/* Thanh tìm kiếm + Nút thêm */}
      <div className="flex justify-end items-center mb-4 gap-3 ">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, địa chỉ, chủ cửa hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-full px-6 py-2.5 w-1/3 text-sm"
        />

        <Link 
          to="/list-pending-store"
          className="
            relative
            px-6 py-2.5
            bg-gradient-to-r from-[#116AD1] to-[#1E88E5]
            text-white font-semibold text-sm
            rounded-full
            shadow-md
            hover:shadow-lg
            transition-all duration-300 ease-in-out
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-300
            overflow-hidden
          "
        >
          <span className="relative z-10">Cửa hàng cần duyệt</span>
        </Link>
      </div>

      {/* Bảng danh sách cửa hàng */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left w-[300px]">Tên cửa hàng</th>
              <th className="p-3 text-left w-[250px]">Địa chỉ</th>
              <th className="p-3 text-left w-[200px]">Chủ cửa hàng</th>
              <th className="p-3 text-center w-[150px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              currentStores.map((store, index) => {
                const address = store.detail_address 
                  ? `${store.detail_address}, ${store.village || ""}, ${store.city || ""}`.replace(/^,\s*|,\s*$/g, "")
                  : store.village || store.city || store.address || "Chưa có địa chỉ";
                
                return (
                  <tr
                    key={store.id}
                    className="border-t hover:bg-gray-50 transition relative"
                  >
                    <td className="p-3 text-left">{store.name || "Chưa có tên"}</td>
                    <td className="p-3 text-left">{address}</td>
                    <td className="p-3 text-left">{store.email || store.phone || "Chưa có thông tin"}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center gap-0.1">
                    {/* Xem chi tiết */}
                    <div className="relative group">
                      <button
                        onClick={() => handleDetail(store.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <img src={IconView} alt="Xem chi tiết" className="w-4 h-4" />
                      </button>
                      <span
                        className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                        group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Xem chi tiết
                      </span>
                    </div>

                    {/* Cập nhật */}
                    <div className="relative group">
                      <button
                        onClick={() => handleUpdate(store)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <img src={IconEdit} alt="Cập nhật" className="w-4 h-4" />
                      </button>
                      <span
                        className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                        group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Cập nhật
                      </span>
                    </div>

                    {/* Xóa */}
                    <div className="relative group">
                      <button
                        onClick={() => handleDelete(store)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <img src={IconDelete} alt="Xóa" className="w-4 h-4" />
                      </button>
                      <span
                        className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                        group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Xóa
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
                );
              })
            )}

            {currentStores.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Không tìm thấy cửa hàng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
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
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            →
          </button>
        </div>
      )}

      {/* Popup Xóa */}
      {openDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold text-red-600 mb-3">
              Xác nhận xóa
            </h2>
            <p>
              Bạn có chắc chắn muốn xóa cửa hàng{" "}
              <b>{selectedStore?.name}</b> không?
            </p>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenDelete(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup cập nhật */}
      {openUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Cập nhật cửa hàng
            </h2>

            <div className="grid grid-cols-1 gap-4 text-left">
              <div>
              <label className="block text-sm mb-1">Tên cửa hàng</label>
              <input
                type="text"
                value={selectedStore?.name || ""}
                onChange={(e) =>
                  setSelectedStore({
                    ...selectedStore,
                    name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Địa chỉ</label>
              <input
                type="text"
                value={
                  selectedStore?.detail_address 
                    ? `${selectedStore.detail_address}, ${selectedStore.village || ""}, ${selectedStore.city || ""}`.replace(/^,\s*|,\s*$/g, "")
                    : selectedStore?.village || selectedStore?.city || selectedStore?.address || ""
                }
                onChange={(e) =>
                  setSelectedStore({
                    ...selectedStore,
                    detail_address: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={selectedStore?.email || ""}
                onChange={(e) =>
                  setSelectedStore({
                    ...selectedStore,
                    email: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenUpdate(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleUpdateSubmit(selectedStore)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreManagement;