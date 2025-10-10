import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IconView from '../assets/home/icon-view.svg'
import IconDelete from "../assets/home/icon-delete.svg";
import IconEdit from '../assets/home/icon-edit.svg'

const ShipperManagement = () => {
  const navigate = useNavigate();

  const [shippers, setShippers] = useState([
    {
      id: 1,
      fullname: "Phạm Minh Quân",
      phone: "0905123456",
      email: "quanpham@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "29A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Hoạt động",
    },
    {
      id: 2,
      fullname: "Nguyễn Thị Thu Trang",
      phone: "0916234567",
      email: "trangnguyen@gmail.com",
      vehicle_name: "Vision",
      license_plate: "30B-67890",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Tạm nghỉ",
    },
    {
      id: 3,
      fullname: "Lê Văn Hùng",
      phone: "0978456123",
      email: "hunglv@gmail.com",
      vehicle_name: "SH Mode",
      license_plate: "31C-54321",
      work_area_city: "Đà Nẵng",
      work_area_village: "Hải Châu",
      status: "Hoạt động",
    },
    {
      id: 4,
      fullname: "Trần Quốc Khánh",
      phone: "0987654321",
      email: "khanhtran@gmail.com",
      vehicle_name: "Exciter 155",
      license_plate: "43A-67812",
      work_area_city: "Đà Nẵng",
      work_area_village: "Thanh Khê",
      status: "Đang giao hàng",
    },
    {
      id: 5,
      fullname: "Đặng Hoàng Nam",
      phone: "0904345678",
      email: "namdh@gmail.com",
      vehicle_name: "Air Blade",
      license_plate: "50B-99887",
      work_area_city: "TP. Hồ Chí Minh",
      work_area_village: "Quận 1",
      status: "Hoạt động",
    },
    {
      id: 6,
      fullname: "Võ Thị Mai Linh",
      phone: "0936123987",
      email: "linhvo@gmail.com",
      vehicle_name: "Lead",
      license_plate: "51F-76543",
      work_area_city: "TP. Hồ Chí Minh",
      work_area_village: "Bình Thạnh",
      status: "Tạm nghỉ",
    },
    {
      id: 7,
      fullname: "Ngô Văn Phước",
      phone: "0908123987",
      email: "phuocngo@gmail.com",
      vehicle_name: "Future Neo",
      license_plate: "65B-43210",
      work_area_city: "Cần Thơ",
      work_area_village: "Ninh Kiều",
      status: "Đang giao hàng",
    },
    {
      id: 8,
      fullname: "Lý Thu Hằng",
      phone: "0917456789",
      email: "hangly@gmail.com",
      vehicle_name: "Grande",
      license_plate: "36A-98765",
      work_area_city: "Thanh Hóa",
      work_area_village: "Thành phố Thanh Hóa",
      status: "Hoạt động",
    },
    {
      id: 9,
      fullname: "Trịnh Công Dũng",
      phone: "0978345123",
      email: "dungtc@gmail.com",
      vehicle_name: "Wave RSX",
      license_plate: "35B-67854",
      work_area_city: "Ninh Bình",
      work_area_village: "TP Ninh Bình",
      status: "Đang giao hàng",
    },
    {
      id: 10,
      fullname: "Bùi Hải Yến",
      phone: "0936345678",
      email: "yenbui@gmail.com",
      vehicle_name: "Vision",
      license_plate: "30E-55677",
      work_area_city: "Hà Nội",
      work_area_village: "Tây Hồ",
      status: "Tạm nghỉ",
    },
    {
      id: 11,
      fullname: "Phạm Minh Quân",
      phone: "0905123456",
      email: "quanpham@gmail.com",
      vehicle_name: "Wave Alpha",
      license_plate: "29A-12345",
      work_area_city: "Hà Nội",
      work_area_village: "Cầu Giấy",
      status: "Hoạt động",
    },
    {
      id: 12,
      fullname: "Nguyễn Thị Thu Trang",
      phone: "0916234567",
      email: "trangnguyen@gmail.com",
      vehicle_name: "Vision",
      license_plate: "30B-67890",
      work_area_city: "Hà Nội",
      work_area_village: "Hoàn Kiếm",
      status: "Tạm nghỉ",
    },
    {
      id: 13,
      fullname: "Lê Văn Hùng",
      phone: "0978456123",
      email: "hunglv@gmail.com",
      vehicle_name: "SH Mode",
      license_plate: "31C-54321",
      work_area_city: "Đà Nẵng",
      work_area_village: "Hải Châu",
      status: "Hoạt động",
    },
    {
      id: 14,
      fullname: "Trần Quốc Khánh",
      phone: "0987654321",
      email: "khanhtran@gmail.com",
      vehicle_name: "Exciter 155",
      license_plate: "43A-67812",
      work_area_city: "Đà Nẵng",
      work_area_village: "Thanh Khê",
      status: "Đang giao hàng",
    },
    {
      id: 15,
      fullname: "Đặng Hoàng Nam",
      phone: "0904345678",
      email: "namdh@gmail.com",
      vehicle_name: "Air Blade",
      license_plate: "50B-99887",
      work_area_city: "TP. Hồ Chí Minh",
      work_area_village: "Quận 1",
      status: "Hoạt động",
    },
    {
      id: 16,
      fullname: "Võ Thị Mai Linh",
      phone: "0936123987",
      email: "linhvo@gmail.com",
      vehicle_name: "Lead",
      license_plate: "51F-76543",
      work_area_city: "TP. Hồ Chí Minh",
      work_area_village: "Bình Thạnh",
      status: "Tạm nghỉ",
    },
    {
      id: 17,
      fullname: "Ngô Văn Phước",
      phone: "0908123987",
      email: "phuocngo@gmail.com",
      vehicle_name: "Future Neo",
      license_plate: "65B-43210",
      work_area_city: "Cần Thơ",
      work_area_village: "Ninh Kiều",
      status: "Đang giao hàng",
    },
    {
      id: 18,
      fullname: "Lý Thu Hằng",
      phone: "0917456789",
      email: "hangly@gmail.com",
      vehicle_name: "Grande",
      license_plate: "36A-98765",
      work_area_city: "Thanh Hóa",
      work_area_village: "Thành phố Thanh Hóa",
      status: "Hoạt động",
    },
    {
      id: 19,
      fullname: "Trịnh Công Dũng",
      phone: "0978345123",
      email: "dungtc@gmail.com",
      vehicle_name: "Wave RSX",
      license_plate: "35B-67854",
      work_area_city: "Ninh Bình",
      work_area_village: "TP Ninh Bình",
      status: "Đang giao hàng",
    },
    {
      id: 20,
      fullname: "Bùi Hải Yến",
      phone: "0936345678",
      email: "yenbui@gmail.com",
      vehicle_name: "Vision",
      license_plate: "30E-55677",
      work_area_city: "Hà Nội",
      work_area_village: "Tây Hồ",
      status: "Tạm nghỉ",
    },
     {
      id: 21,
      fullname: "Vũ Thị Thanh Kim Hoàn",
      phone: "0936345678",
      email: "hoanvu@gmail.com",
      vehicle_name: "Vision",
      license_plate: "30E-55677",
      work_area_city: "Hà Nội",
      work_area_village: "Tây Hồ",
      status: "Tạm nghỉ",
    },
  ]);

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [openForm, setOpenForm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleMenuClick = (shipper, index) => {
    setSelectedShipper(shipper);
    setMenuOpen(menuOpen === index ? null : index);
  };

  const handleDetail = (id) => {
    navigate(`/shipper/profile-detail/${id}`);
    setMenuOpen(null);
  };

  // const handleUpdate = () => {
  //   setOpenUpdate(true);
  //   setMenuOpen(null);
  // };


  const handleUpdateSubmit = (updatedShipper) => {
    setShippers(
      shippers.map((s) => (s.id === updatedShipper.id ? updatedShipper : s))
    );
    setOpenUpdate(false);
  };

  // const handleDelete = () => {
  //   setOpenDelete(true);
  //   setMenuOpen(null);
  // };

  // --- Cập nhật handleUpdate và handleDelete ---
const handleUpdate = (shipper) => {
  setSelectedShipper(shipper); // Gán shipper hiện tại
  setOpenUpdate(true);
  setMenuOpen(null);
};

const handleDelete = (shipper) => {
  setSelectedShipper(shipper); // Gán shipper hiện tại
  setOpenDelete(true);
  setMenuOpen(null);
};


  const confirmDelete = () => {
    setShippers(shippers.filter((s) => s.id !== selectedShipper.id));
    setOpenDelete(false);
  };

  // Lọc shipper theo từ khóa
  const filteredShippers = shippers.filter(
    (s) =>
      s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredShippers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShippers = filteredShippers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4 space-y-6">
      {/* Thanh tìm kiếm + Nút Shipper cần duyệt */}
      <div className="flex justify-end items-center mb-4 gap-3 ">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, SĐT, email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset về trang 1 khi tìm kiếm
          }}
          className="border border-gray-300 rounded-full px-6 py-2.5 w-1/3 text-sm"
        />

        <Link to="/list-pending-shipper"
          onClick={() => setOpenForm(true)}
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
          <span className="relative z-10">🚚 Shipper cần duyệt</span>
        
        </Link>
      </div>

      {/* Bảng danh sách shipper */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left w-[250px]">Họ và tên</th>
              <th className="p-3 text-left w-[200px]">Số điện thoại</th>
              <th className="p-3 text-left w-[350px]">Email</th>
              <th className="p-3 text-left w-[200px]">Trạng thái</th>
              <th className="p-3 text-center w-[150px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentShippers.map((shipper, index) => (
              <tr
                key={`${shipper.id}-${index}`}
                className="border-t hover:bg-gray-50 transition relative"
              >
                <td className="p-3 text-left">{shipper.fullname}</td>
                <td className="p-3 text-left">{shipper.phone}</td>
                <td className="p-3 text-left">{shipper.email}</td>
                <td className="p-3 text-left">{shipper.status}</td>
                <td className="p-3 text-center flex justify-center gap-0.1">
                  {/* Xem chi tiết */}
                  <div className="relative group">
                    <button
                      onClick={() => handleDetail(shipper.id)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconView} alt="Xem chi tiết" className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                                    bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                                    group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Xem chi tiết
                    </span>
                  </div>

                  {/* Cập nhật */}
                  <div className="relative group">
                    <button
                      onClick={() => handleUpdate(shipper)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconEdit} alt="Cập nhật" className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                                    bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                                    group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Cập nhật
                    </span>
                  </div>

                  {/* Xóa */}
                  <div className="relative group">
                    <button
                      onClick={() => handleDelete(shipper)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconDelete} alt="Xóa" className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                                    bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                                    group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Xóa
                    </span>
                  </div>
                </td>

              </tr>
            ))}

            {currentShippers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Không tìm thấy shipper nào phù hợp.
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

      {/* Popup xác nhận xóa */}
      {openDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold text-red-600 mb-3">
              Xác nhận xóa
            </h2>
            <p>
              Bạn có chắc chắn muốn xóa shipper{" "}
              <b>{selectedShipper?.fullname}</b> không?
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
              Cập nhật Shipper
            </h2>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { key: "fullname", label: "Họ và tên" },
                { key: "phone", label: "Số điện thoại" },
                { key: "email", label: "Email" },
                { key: "vehicle_name", label: "Tên phương tiện" },
                { key: "license_plate", label: "Biển số xe" },
                { key: "work_area_city", label: "Thành phố" },
                { key: "work_area_village", label: "Xã/Phường" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={selectedShipper?.[field.key] || ""}
                    onChange={(e) =>
                      setSelectedShipper({
                        ...selectedShipper,
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
                onClick={() => handleUpdateSubmit(selectedShipper)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div> 
      )};
    </div>
  );
};

export default ShipperManagement;
