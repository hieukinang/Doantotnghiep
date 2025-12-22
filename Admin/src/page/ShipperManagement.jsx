import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import IconView from "../assets/home/icon-view.svg";

const ShipperManagement = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStatusSelect, setShowStatusSelect] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        };

        if (tab !== "all") {
          params.status = tab;
        }

        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }

        if (startDate) {
          params.startdate = startDate;
        }

        if (endDate) {
          params.enddate = endDate;
        }

        const res = await axios.get(`${backendURL}/shippers/get-all`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.status === "success") {
          const data = res.data.data;
          setShippers(data.docs || data || []);
          setTotalPages(data.totalPages || Math.ceil((data.totalDocs || data.length || 0) / ITEMS_PER_PAGE) || 1);
        }
      } catch (err) {
        console.error("Fetch shippers error:", err);
        toast.error("Không thể tải danh sách shipper");
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, [currentPage, tab, searchTerm, startDate, endDate]);


  const fetchShipperDetail = async (shipperId) => {
    try {
      setLoadingDetail(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${backendURL}/shippers/${shipperId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.status === "success") {
        setSelectedShipper(res.data.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      toast.error("Không thể tải thông tin shipper");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (shipperId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.patch(
        `${backendURL}/shippers/update-status/${shipperId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.status === "success") {
        toast.success("Cập nhật trạng thái thành công!");
        setShippers((prev) =>
          prev.map((s) => (s.id === shipperId ? { ...s, status: newStatus } : s))
        );
        setShowStatusSelect(null);
      }
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: "Đã duyệt",
      PROCESSING: "Chờ duyệt",
      BANNED: "Bị chặn",
      INACTIVE: "Không hoạt động",
      DESTROYED: "Đã xóa",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "#16A34A",
      PROCESSING: "#FACC15",
      BANNED: "#DC2626",
      INACTIVE: "#6B7280",
      DESTROYED: "#000000",
    };
    return colors[status] || "#6B7280";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Quản lý Shipper</h1>

      {/* Search & Filters */}
      <div className="flex justify-end mt-3 gap-3 flex-wrap">
        <input
          type="date"
          className="border border-gray-300 rounded-full px-4 py-2"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Từ ngày"
        />
        <input
          type="date"
          className="border border-gray-300 rounded-full px-4 py-2"
          value={endDate}
          onChange={(e) => {
            const newEndDate = e.target.value;
            if (startDate && newEndDate && new Date(newEndDate) < new Date(startDate)) {
              toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
              return;
            }
            setEndDate(newEndDate);
            setCurrentPage(1);
          }}
          placeholder="Đến ngày"
        />
        <input
          type="text"
          placeholder="Tìm kiếm shipper..."
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
          <option value="ACTIVE">Đã duyệt</option>
          <option value="PROCESSING">Chờ duyệt</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="BANNED">Bị chặn</option>
          <option value="DESTROYED">Đã xóa</option>
        </select>
      </div>


      {/* Table */}
      <div className="overflow-visible bg-white rounded-xl shadow-md mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left w-[60px]">STT</th>
              <th className="p-3 text-left w-[180px]">Tên Shipper</th>
              <th className="p-3 text-left w-[130px]">Số điện thoại</th>
              <th className="p-3 text-left w-[200px]">Email</th>
              <th className="p-3 text-left w-[150px]">Khu vực</th>
              <th className="p-3 text-left w-[120px]">Trạng thái</th>
              <th className="p-3 text-center w-[120px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : shippers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              shippers.map((shipper, index) => (
                <tr key={shipper.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-left">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-3 text-left">{shipper.fullname}</td>
                  <td className="p-3 text-left">{shipper.phone || "-"}</td>
                  <td className="p-3 text-left truncate max-w-[200px]">
                    {shipper.email || "-"}
                  </td>
                  <td className="p-3 text-left">
                    {shipper.work_area_city || shipper.city || "-"}
                  </td>
                  <td className="p-3 text-left">
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs font-semibold inline-block"
                      style={{
                        backgroundColor: getStatusColor(shipper.status),
                        color: shipper.status === "PROCESSING" ? "#000" : "#fff",
                      }}
                    >
                      {getStatusLabel(shipper.status)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => fetchShipperDetail(shipper.id)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                        title="Chi tiết"
                      >
                        <img src={IconView} className="w-4" alt="View" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowStatusSelect(
                              showStatusSelect === shipper.id ? null : shipper.id
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-full"
                          title="Thay đổi trạng thái"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        {showStatusSelect === shipper.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setShowStatusSelect(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-30">
                              <div className="p-2">
                                {/* PROCESSING -> chỉ hiện Duyệt */}
                                {shipper.status === "PROCESSING" && (
                                  <button
                                    onClick={() => handleStatusChange(shipper.id, "ACTIVE")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                    style={{ color: getStatusColor("ACTIVE") }}
                                  >
                                    Duyệt
                                  </button>
                                )}
                                {/* ACTIVE -> chỉ hiện Cấm */}
                                {shipper.status === "ACTIVE" && (
                                  <button
                                    onClick={() => handleStatusChange(shipper.id, "BANNED")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                    style={{ color: getStatusColor("BANNED") }}
                                  >
                                    Cấm
                                  </button>
                                )}
                                {/* BANNED -> hiện Mở lại (chuyển về ACTIVE) */}
                                {shipper.status === "BANNED" && (
                                  <button
                                    onClick={() => handleStatusChange(shipper.id, "ACTIVE")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                    style={{ color: getStatusColor("ACTIVE") }}
                                  >
                                    Mở lại
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
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

      {/* Detail Modal */}
      {showDetailModal && selectedShipper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl flex-shrink-0">
              <h2 className="text-xl font-bold">Chi tiết Shipper</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:bg-blue-700 rounded-full p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Ảnh đại diện</p>
                  <img
                    src={selectedShipper.profile_image || "/placeholder.png"}
                    alt="Profile"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Ảnh CMND/CCCD</p>
                  <img
                    src={selectedShipper.id_image || "/placeholder.png"}
                    alt="ID"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Ảnh phương tiện</p>
                  <img
                    src={selectedShipper.image || "/placeholder.png"}
                    alt="Vehicle"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Giấy khám SK</p>
                  <img
                    src={selectedShipper.health_image || "/placeholder.png"}
                    alt="Health"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Mã Shipper</p>
                  <p className="font-semibold">{selectedShipper.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Họ và tên</p>
                  <p className="font-semibold">{selectedShipper.fullname}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Số CMND/CCCD</p>
                  <p className="font-semibold">{selectedShipper.citizen_id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Số điện thoại</p>
                  <p className="font-semibold">{selectedShipper.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold">{selectedShipper.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Trạng thái</p>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-semibold inline-block"
                    style={{
                      backgroundColor: getStatusColor(selectedShipper.status),
                      color: selectedShipper.status === "PROCESSING" ? "#000" : "#fff",
                    }}
                  >
                    {getStatusLabel(selectedShipper.status)}
                  </span>
                </div>
              </div>

              {/* Work Area */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3">Khu vực làm việc</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Tỉnh/Thành phố</p>
                    <p className="font-semibold">{selectedShipper.work_area_city || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Xã/Phường</p>
                    <p className="font-semibold">{selectedShipper.work_area_village || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3">Thông tin phương tiện</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Loại phương tiện</p>
                    <p className="font-semibold">{selectedShipper.vehicle_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Biển số xe</p>
                    <p className="font-semibold">{selectedShipper.license_plate || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3">Thông tin ngân hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Ngân hàng</p>
                    <p className="font-semibold">{selectedShipper.bank_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Số tài khoản</p>
                    <p className="font-semibold">{selectedShipper.bank_account_number || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">Tên chủ tài khoản</p>
                    <p className="font-semibold">{selectedShipper.bank_account_holder_name || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-gray-600 text-xs">Đánh giá</p>
                  <p className="font-bold text-xl text-blue-600">
                    {selectedShipper.rating || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-gray-600 text-xs">Ví tiền</p>
                  <p className="font-bold text-xl text-green-600">
                    {(selectedShipper.wallet || 0).toLocaleString()}đ
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-gray-600 text-xs">Ngày đăng ký</p>
                  <p className="font-bold text-sm text-purple-600">
                    {formatDate(selectedShipper.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperManagement;
