import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconView from "../assets/home/icon-view.svg";

const Complaints = () => {
  const backendURL = "http://127.0.0.1:5000/api";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", type: "", page: 1 });
  const [total, setTotal] = useState(0);

  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  const COMPLAINT_TYPES = {
    PRODUCT: "Sản phẩm",
    STORE: "Cửa hàng",
    SERVICE: "Dịch vụ",
    DELIVERY: "Vận chuyển",
    OTHER: "Khác",
  };

  const STATUS = {
    pending: { label: "Chờ xử lý", color: "#FACC15" },
    resolved: { label: "Đã xử lý", color: "#16A34A" },
    rejected: { label: "Từ chối", color: "#DC2626" },
  };

  const getCreator = (c) => {
    if (c.clientId) return "Khách hàng";
    if (c.storeId) return "Cửa hàng";
    if (c.shipperId) return "Shipper";
    if (c.adminId) return "Admin";
    return "N/A";
  };

  const getCreatorWithId = (c) => {
    if (c.clientId) return `Khách hàng (${c.clientId})`;
    if (c.storeId) return `Cửa hàng (${c.storeId})`;
    if (c.shipperId) return `Shipper (${c.shipperId})`;
    if (c.adminId) return `Admin (${c.adminId})`;
    return "N/A";
  };

  const handleChat = (c) => {
    const oderId = c.clientId || c.storeId || c.shipperId || c.adminId;
    const userName = c.clientId ? "Khach hang" 
                   : c.storeId ? "Cua hang" 
                   : c.shipperId ? "Shipper" 
                   : "Admin";
    if (!oderId) {
      toast.warn("Khong tim thay nguoi dung de nhan tin");
      return;
    }
    navigate('/chat-management', { 
      state: { 
        targetUserId: String(oderId),
        targetUserName: userName
      } 
    });
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const params = new URLSearchParams({
        page: filters.page,
      });
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);

      const res = await fetch(`${backendURL}/complaints?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === "success") {
        setComplaints(data.data || []);
        setTotal(data.total || data.results || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách khiếu nại");
    } finally {
      setLoading(false);
    }
  }, [filters, backendURL]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const fetchDetail = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${backendURL}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setDetail(data.data.complaint);
        setShowDetail(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải chi tiết khiếu nại");
    }
  };

  const handleApprove = async () => {
    if (!selected) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${backendURL}/complaints/reply/${selected.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success("Duyệt khiếu nại thành công");
        setShowConfirm(false);
        setSelected(null);
        fetchComplaints();
      } else {
        throw new Error(data.message || "Lỗi duyệt");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Duyệt khiếu nại thất bại");
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý khiếu nại</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4 justify-end">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="resolved">Đã xử lý</option>
          <option value="rejected">Từ chối</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value, page: 1 })
          }
        >
          <option value="">Tất cả loại</option>
          {Object.entries(COMPLAINT_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">STT</th>
              <th className="p-4 text-left font-semibold">Loại</th>
              <th className="p-4 text-left font-semibold">Người tạo</th>
              <th className="p-4 text-left font-semibold">Ngày tạo</th>
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
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              complaints.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 text-left text-gray-700">
                    {(filters.page - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="p-4 text-left text-gray-700 font-medium">
                    {COMPLAINT_TYPES[c.type]}
                  </td>
                  <td className="p-4 text-left text-gray-600">{getCreator(c)}</td>
                  <td className="p-4 text-left text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-left">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-white inline-block"
                      style={{ backgroundColor: STATUS[c.status].color }}
                    >
                      {STATUS[c.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        title="Xem chi tiết"
                        onClick={() => fetchDetail(c.id)}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <img src={IconView} alt="view" className="w-5 h-5" />
                      </button>

                      <button
                        title="Nhắn tin"
                        onClick={() => handleChat(c)}
                        className="px-3 py-1.5 bg-[#116AD1] text-white text-xs font-semibold rounded-lg hover:bg-[#0e57aa] transition-colors"
                      >
                        Nhắn tin
                      </button>

                      {c.status === "pending" && (
                        <button
                          onClick={() => {
                            setSelected(c);
                            setShowConfirm(true);
                          }}
                          className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Duyệt
                        </button>
                      )}
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
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Trước
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      filters.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === filters.page - 2 ||
                pageNum === filters.page + 2
              ) {
                return (
                  <span key={pageNum} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Sau
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && detail && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl max-h-[95vh] overflow-hidden flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    Chi tiết khiếu nại
                  </h2>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                    Mã số: <span className="font-semibold">#{detail.id}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-90 duration-300"
                >
                  <span className="text-3xl leading-none">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-8 space-y-6 bg-gray-50">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Loại khiếu nại
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {COMPLAINT_TYPES[detail.type]}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Trạng thái
                  </p>
                  <span
                    className="inline-block px-4 py-2 rounded-lg text-sm font-bold text-white shadow-md"
                    style={{ backgroundColor: STATUS[detail.status].color }}
                  >
                    {STATUS[detail.status].label}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Người tạo
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {getCreatorWithId(detail)}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Ngày tạo
                  </p>
                  <p className="font-semibold text-gray-700">
                    {new Date(detail.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Ngày xử lý
                  </p>
                  <p className="font-semibold text-gray-700">
                    {detail.resolved_at
                      ? new Date(detail.resolved_at).toLocaleString("vi-VN")
                      : "Chưa xử lý"}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Admin xử lý
                  </p>
                  <p className="font-semibold text-gray-700">
                    {detail.adminId || "Chưa có"}
                  </p>
                </div>
              </div>

              {/* Complaint Content */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <p className="font-bold text-gray-800 text-xl">
                    Nội dung khiếu nại
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap pl-13">
                  {detail.details}
                </p>
              </div>

              {/* Admin Reply */}
              {detail.answer && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">💬</span>
                    </div>
                    <p className="font-bold text-green-800 text-xl">
                      Phản hồi từ Admin
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap pl-13">
                    {detail.answer}
                  </p>
                </div>
              )}

              {/* Images */}
              {detail.ComplaintImages && detail.ComplaintImages.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🖼️</span>
                    </div>
                    <p className="font-bold text-gray-800 text-xl">
                      Hình ảnh đính kèm
                    </p>
                    <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {detail.ComplaintImages.length} ảnh
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {detail.ComplaintImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img.path)}
                        className="relative group overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-lg"
                      >
                        <img
                          src={img.path}
                          alt={`Ảnh ${i + 1}`}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            console.error("Image load error:", img.path);
                            e.target.onerror = null;
                            e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3EKhông tải được%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                          <span className="text-white text-sm font-semibold">
                            Nhấn để phóng to
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white px-8 py-5 flex justify-end">
              <button
                onClick={() => setShowDetail(false)}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-3xl transition-colors"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Phóng to"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              console.error("Image zoom error:", selectedImage);
              e.target.onerror = null;
            }}
          />
        </div>
      )}

      {/* Confirm Approve Modal */}
      {showConfirm && selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm"
          onClick={() => {
            setShowConfirm(false);
            setSelected(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Xác nhận duyệt khiếu nại
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn duyệt khiếu nại <br />
                <span className="font-bold text-blue-600">
                  #{selected.id}
                </span>{" "}
                này không?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelected(null);
                }}
                className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
