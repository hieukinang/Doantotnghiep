import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconView from '../assets/home/icon-view.svg'
import IconDelete from "../assets/home/icon-delete.svg";
import IconEdit from '../assets/home/icon-edit.svg'

const StoreManagement = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([
    { id: 1, name: "Cửa hàng Minh Quân Mobile", address: "Cầu Giấy, Hà Nội", owner: "Phạm Minh Quân" },
    { id: 2, name: "Tạp hóa Thu Trang", address: "Hoàn Kiếm, Hà Nội", owner: "Nguyễn Thị Thu Trang" },
    { id: 3, name: "Shop Thời Trang Hùng", address: "Hải Châu, Đà Nẵng", owner: "Lê Văn Hùng" },
    { id: 4, name: "Cửa hàng Xe Máy Khánh", address: "Thanh Khê, Đà Nẵng", owner: "Trần Quốc Khánh" },
    { id: 5, name: "Bách Hóa Nam Đặng", address: "Quận 1, TP. Hồ Chí Minh", owner: "Đặng Hoàng Nam" },
    { id: 6, name: "Minimart Mai Linh", address: "Bình Thạnh, TP. Hồ Chí Minh", owner: "Võ Thị Mai Linh" },
    { id: 7, name: "Điện Thoại Phước Ngô", address: "Ninh Kiều, Cần Thơ", owner: "Ngô Văn Phước" },
    { id: 8, name: "Tiệm Mỹ Phẩm Thu Hằng", address: "Thành phố Thanh Hóa, Thanh Hóa", owner: "Lý Thu Hằng" },
    { id: 9, name: "Cửa hàng Dũng Store", address: "TP Ninh Bình, Ninh Bình", owner: "Trịnh Công Dũng" },
    { id: 10, name: "Quán Ăn Hải Yến", address: "Tây Hồ, Hà Nội", owner: "Bùi Hải Yến" },
    { id: 11, name: "Cửa hàng Văn Phòng Phúc", address: "Hồng Bàng, Hải Phòng", owner: "Nguyễn Văn Phúc" },
    { id: 12, name: "Tiệm Giày Thanh Hòa", address: "Lê Chân, Hải Phòng", owner: "Trần Thị Hòa" },
    { id: 13, name: "Siêu Thị Bắc An", address: "TP Bắc Ninh, Bắc Ninh", owner: "Hoàng Văn An" },
    { id: 14, name: "Cửa hàng Nội Thất Lan", address: "Thủ Dầu Một, Bình Dương", owner: "Phan Thị Lan" },
    { id: 15, name: "Cà phê & Tiệm Bánh Tuấn", address: "Biên Hòa, Đồng Nai", owner: "Nguyễn Tuấn" },
    { id: 16, name: "Nhà Thuốc Đức Hòa", address: "Vinh, Nghệ An", owner: "Đỗ Đức Hòa" },
    { id: 17, name: "Siêu Thị Huế Central", address: "TP Huế, Thừa Thiên Huế", owner: "Lê Thị Hương" },
    { id: 18, name: "Cửa hàng Hải Sản Hương", address: "Nha Trang, Khánh Hòa", owner: "Phạm Thị Hương" },
    { id: 19, name: "Shop Thời Trang Vân", address: "Vũng Tàu, Bà Rịa - Vũng Tàu", owner: "Nguyễn Thị Vân" },
    { id: 20, name: "Tạp Hóa Minh Tâm", address: "Nam Định, Nam Định", owner: "Lưu Minh Tâm" },
    { id: 21, name: "Cửa hàng Điện Gia Dụng Hùng Sơn", address: "Hải Dương, Hải Dương", owner: "Trương Hùng Sơn" },
    { id: 22, name: "MiniMart Thanh Kiều", address: "Thủ đô Hà Nội, Hà Nội", owner: "Vũ Thị Thanh Kiều" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [newStore, setNewStore] = useState({ name: "", address: "", owner: "" });

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

  const handleUpdateSubmit = (updatedStore) => {
    setStores(stores.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
    setOpenUpdate(false);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setOpenDelete(true);
    setMenuOpen(null);
  };

  const confirmDelete = () => {
    setStores(stores.filter((s) => s.id !== selectedStore.id));
    setOpenDelete(false);
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAddSubmit = () => {
    if (!newStore.name || !newStore.address || !newStore.owner) return;
    setStores([...stores, { ...newStore, id: Date.now() }]);
    setNewStore({ name: "", address: "", owner: "" });
    setOpenAdd(false);
  };

  // Lọc cửa hàng theo từ khóa
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <Link to="/list-pending-store"
          onClick={handleAdd}
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
            {currentStores.map((store, index) => (
              <tr
                key={store.id}
                className="border-t hover:bg-gray-50 transition relative"
              >
                <td className="p-3 text-left">{store.name}</td>
                <td className="p-3 text-left">{store.address}</td>
                <td className="p-3 text-left">{store.owner}</td>
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
            ))}

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
              {[
                { key: "name", label: "Tên cửa hàng" },
                { key: "address", label: "Địa chỉ" },
                { key: "owner", label: "Chủ cửa hàng" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={selectedStore?.[field.key] || ""}
                    onChange={(e) =>
                      setSelectedStore({
                        ...selectedStore,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
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

      {/* Popup thêm mới */}
      {openAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Thêm cửa hàng mới
            </h2>

            <div className="grid grid-cols-1 gap-4 text-left">
              {[
                { key: "name", label: "Tên cửa hàng" },
                { key: "address", label: "Địa chỉ" },
                { key: "owner", label: "Chủ cửa hàng" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={newStore[field.key]}
                    onChange={(e) =>
                      setNewStore({ ...newStore, [field.key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenAdd(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddSubmit}
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
