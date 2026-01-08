import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import { IoClose, IoChevronDown, IoFilter, IoChevronBack, IoChevronForward, IoDownloadOutline, IoStar, IoStarOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const STATUS_MAP = {
  PENDING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã vận chuyển",
  CLIENT_CONFIRMED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED: "Lỗi",
  RETURNED: "Yêu cầu trả hàng",
  RETURN_CONFIRMED: "Đã trả hàng",
};

const statusOptions = ["Tất cả", ...Object.keys(STATUS_MAP)];

const ITEMS_PER_PAGE = 10;

// Các trạng thái được phép xem đánh giá
const REVIEWABLE_STATUSES = ["CLIENT_CONFIRMED","RETURNED","RETURN_CONFIRMED"];

const OrdersSeller = () => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef(null);
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Gọi API orders/store
  const { ordersStore, getOrdersofStore } = useContext(ShopContext);

  useEffect(() => {
    getOrdersofStore();
  }, []);

  // Lọc theo trạng thái + ngày
  const filteredOrders = (ordersStore || []).filter((o) => {
    const matchStatus = statusFilter === "Tất cả" || o.status === statusFilter;

    const date = new Date(o.order_date);
    const matchStart = startDate ? date >= new Date(startDate) : true;
    const matchEnd = endDate ? date <= new Date(endDate) : true;

    return matchStatus && matchStart && matchEnd;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate]);

  // Format orders cho modal
  const formatOrderForModal = (o) => {
    const shippingFee = o.shipping_fee || 0;
    // Tính tạm tính (tổng price * quantity của tất cả OrderItems)
    const subtotal = (o.OrderItems || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    return {
      id: o.orderCode || `${o.id}`,
      rawStatus: o.status,
      status: STATUS_MAP[o.status] || o.status,
      total: o.total_price || 0, // Tổng tiền
      subtotal: subtotal, // Tạm tính = tổng price * quantity
      orderItems: o.OrderItems || [],
      shippingAddress: o.shipping_address || "",
      shippingFee: shippingFee,
      paymentMethod: o.payment_method || "Thanh toán khi nhận hàng",
      createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "",
      deliveredAt: o.delivered_at ? new Date(o.delivered_at).toLocaleDateString("vi-VN") : "",
      clientOrderId: o.id,
      qrCode: o.qr_code || null,
    };
  };

  // Fetch review data
  const fetchReviewData = async (orderId) => {
    setLoadingReview(true);
    try {
      const token = localStorage.getItem("sellerToken");
      const res = await axios.get(`${backendURL}/reviews/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.status === "success") {
        setReviewData(res.data.data.review);
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      if (error.response?.status === 404) {
        toast.info("Đơn hàng này chưa có đánh giá");
      } else {
        toast.error("Không thể tải đánh giá");
      }
      setReviewData(null);
    } finally {
      setLoadingReview(false);
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <IoStar key={star} className="text-yellow-400" size={20} />
          ) : (
            <IoStarOutline key={star} className="text-gray-300" size={20} />
          )
        ))}
      </div>
    );
  };

  // Handle view review
  const handleViewReview = async (orderId) => {
    setShowReviewModal(true);
    await fetchReviewData(orderId);
  };

  // Tải xuống đơn hàng dưới dạng PDF
  const handleDownloadOrder = async (order) => {
    // Tạo element tạm để render nội dung
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.width = "800px";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "Arial, sans-serif";
    
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #116AD1; padding-bottom: 20px;">
        <h1 style="color: #116AD1; margin: 0; font-size: 24px;">ĐƠN HÀNG #${order.id}</h1>
        <p style="color: #666; margin-top: 8px;">Ngày đặt: ${order.createdAt}</p>
      </div>
      
      ${order.qrCode ? `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${order.qrCode}" alt="QR Code" style="width: 120px; height: 120px;" crossorigin="anonymous" />
        <p style="color: #666; font-size: 12px; margin-top: 8px;">Mã QR đơn hàng</p>
      </div>
      ` : ''}
      
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Thông tin đơn hàng</h3>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Mã đơn hàng</span>
            <span style="font-weight: 500;">${order.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Ngày đặt</span>
            <span style="font-weight: 500;">${order.createdAt}</span>
          </div>
          ${order.deliveredAt ? `
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Ngày giao</span>
            <span style="font-weight: 500;">${order.deliveredAt}</span>
          </div>
          ` : ''}
        </div>
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Thanh toán & Giao hàng</h3>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Địa chỉ</span>
            <span style="font-weight: 500; max-width: 150px; text-align: right;">${order.shippingAddress || 'Chưa có'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Thanh toán</span>
            <span style="font-weight: 500;">${order.paymentMethod === 'wallet' ? 'Ví Kohi' : 'COD'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px;">
            <span style="color: #666;">Phí vận chuyển</span>
            <span style="font-weight: 500;">${order.shippingFee.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
      </div>
      
      <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
        <h3 style="background: #f5f5f5; margin: 0; padding: 12px 15px; font-size: 14px; font-weight: 600;">Sản phẩm (${order.orderItems.length})</h3>
        ${order.orderItems.map(item => {
          const productName = item.OrderItemProductVariant?.ProductVariantProduct?.name || item.title || "Sản phẩm";
          return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-top: 1px solid #eee;">
            <div>
              <div style="font-weight: 500; margin-bottom: 4px;">${productName}</div>
              <div style="color: #666; font-size: 12px;">Số lượng: ${item.quantity}</div>
            </div>
            <div style="color: #116AD1; font-weight: 600;">${(item.price || 0).toLocaleString('vi-VN')}₫</div>
          </div>
        `}).join('')}
      </div>
      
      <div style="text-align: right; padding: 15px; background: #f9f9f9; border-radius: 8px;">
        <div style="margin-bottom: 8px; font-size: 14px;">Tạm tính: ${order.subtotal.toLocaleString('vi-VN')}₫</div>
        <div style="margin-bottom: 8px; font-size: 14px;">Phí vận chuyển: ${order.shippingFee.toLocaleString('vi-VN')}₫</div>
        <div style="font-size: 18px; color: #116AD1; font-weight: bold;">Tổng cộng: ${order.total.toLocaleString('vi-VN')}₫</div>
      </div>
    `;

    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`don-hang-${order.id}.pdf`);
      
      toast.success("Tải xuống đơn hàng thành công!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Có lỗi khi tải xuống đơn hàng!");
    } finally {
      document.body.removeChild(element);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(formatOrderForModal(order));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewData(null);
  };

  const handleUpdateOrderStatus = async (id) => {
    const token = localStorage.getItem("sellerToken");
    try {
      const res = await axios.post(`${backendURL}/orders/store/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        await getOrdersofStore();
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleConfirmReturn = async (id) => {
    const token = localStorage.getItem("sellerToken");
    try {
      const res = await axios.post(`${backendURL}/orders/store/${id}/confirm-return-order`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        toast.success("Xác nhận trả hàng thành công!");
        await getOrdersofStore();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xác nhận trả hàng thất bại!");
    }
  };

  // Xử lý nút xác nhận theo trạng thái
  const handleConfirmAction = (order) => {
    if (order.status === "RETURNED") {
      handleConfirmReturn(order.id);
    } else if (order.status === "PENDING") {
      handleUpdateOrderStatus(order.id);
    }
  };

  return (
    <div className="p-14 min-h-screen flex flex-col">
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
        {/* Bộ lọc */}
        <div className="p-4 flex items-center gap-3 border-b">

          {/* Filter trạng thái - Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IoFilter className="text-[#116AD1]" />
              <span className="text-sm">
                {statusFilter === "Tất cả" ? "Trạng thái" : STATUS_MAP[statusFilter] || statusFilter}
              </span>
              <IoChevronDown className={`transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-[200px] py-1 max-h-[300px] overflow-y-auto">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between
                      ${statusFilter === s ? "bg-blue-50 text-[#116AD1]" : "text-gray-700"}
                    `}
                  >
                    <span>{s === "Tất cả" ? "Tất cả" : STATUS_MAP[s]}</span>
                    {statusFilter === s && (
                      <span className="text-[#116AD1]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hiển thị trạng thái đang lọc */}
          {statusFilter !== "Tất cả" && (
            <span className="px-3 py-1 bg-blue-100 text-[#116AD1] rounded-full text-sm flex items-center gap-1">
              {STATUS_MAP[statusFilter]}
              <button
                onClick={() => setStatusFilter("Tất cả")}
                className="ml-1 hover:text-red-500"
              >
                <IoClose size={14} />
              </button>
            </span>
          )}

          {/* Lọc ngày */}
          <div className="ml-auto flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />

            <span>-</span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>
        </div>

        {/* Bảng đơn hàng */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2 w-[120px]">Mã đơn</th>
                <th className="px-4 py-2 w-[120px]">Ngày</th>
                <th className="px-4 py-2 w-[120px]">Tổng tiền</th>
                <th className="px-4 py-2 w-[140px]">Trạng thái</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-2 font-medium">{o.id}</td>

                  <td className="px-4 py-2">{o.order_date}</td>

                  <td className="px-4 py-2 text-[#116AD1] font-semibold">
                    {((o.total_price || 0) + (o.shipping_fee || 0)).toLocaleString("vi-VN")}₫
                  </td>

                  <td className="px-4 py-2">{STATUS_MAP[o.status] || o.status}</td>

                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      {(o.status === "PENDING" || o.status === "RETURNED") && (
                        <button
                          className="px-3 py-1 border rounded text-green-600 hover:bg-green-50"
                          onClick={() => handleConfirmAction(o)}
                        >
                          {o.status === "RETURNED" ? "Xác nhận trả hàng" : "Xác nhận"}
                        </button>
                      )}
                      {o.status === "PENDING" && (
                        <button
                          className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateOrderStatus(o.id)}
                        >
                          Từ chối
                        </button>
                      )}
                      {REVIEWABLE_STATUSES.includes(o.status) && (
                        <button
                          onClick={() => handleViewReview(o.id)}
                          className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50 flex items-center gap-2"
                        >
                          <IoStar size={16} />
                          Xem đánh giá
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadOrder(formatOrderForModal(o))}
                        className="px-3 py-1 border border-[#116AD1] text-[#116AD1] rounded hover:bg-blue-50 flex items-center gap-2"
                      >
                        <IoDownloadOutline size={18} />
                        Tải xuống
                      </button>
                      <button
                        onClick={() => handleViewDetail(o)}
                        className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} / {filteredOrders.length} đơn hàng
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoChevronBack size={16} />
              </button>
              
              {/* Số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Hiển thị trang đầu, cuối, và các trang gần trang hiện tại
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, arr) => (
                  <span key={page} className="flex items-center">
                    {/* Thêm dấu ... nếu có khoảng cách */}
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === page
                          ? "bg-[#116AD1] text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoChevronForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Đánh giá */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
                <IoStar size={24} />
                Đánh giá đơn hàng
              </h2>
              <button
                onClick={closeReviewModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-5">
              {loadingReview ? (
                <div className="text-center py-8 text-gray-500">
                  Đang tải đánh giá...
                </div>
              ) : reviewData ? (
                <div className="space-y-4">
                  {/* Thông tin người đánh giá */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <img
                      src={reviewData.ReviewClient?.image || "https://via.placeholder.com/50"}
                      alt={reviewData.ReviewClient?.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {reviewData.ReviewClient?.username || "Khách hàng"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(reviewData.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  {/* Đánh giá sao */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Đánh giá:</span>
                    {renderStars(reviewData.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({reviewData.rating}/5)
                    </span>
                  </div>

                  {/* Nội dung đánh giá */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Nội dung đánh giá:
                    </h4>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                      {reviewData.text || "Không có nội dung"}
                    </p>
                  </div>

                  {/* Hình ảnh đánh giá */}
                  {reviewData.images && reviewData.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Hình ảnh ({reviewData.images.length}):
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {reviewData.images.map((img) => (
                          <img
                            key={img.id}
                            src={img.url}
                            alt="Review"
                            className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(img.url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Đơn hàng này chưa có đánh giá
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[#116AD1]">
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-5">
              {/* QR Code */}
              {/* {selectedOrder.qrCode && (
                <div className="flex justify-center mb-5">
                  <div className="text-center">
                    <img 
                      src={selectedOrder.qrCode} 
                      alt="QR Code" 
                      className="w-32 h-32 mx-auto border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">Mã QR đơn hàng</p>
                  </div>
                </div>
              )} */}

              {/* Thông tin đơn hàng - 2 cột */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Cột trái - Trạng thái & thời gian */}
                <div className="border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="font-semibold text-[#116AD1]">{selectedOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-medium">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đặt hàng lúc</span>
                    <span>{selectedOrder.createdAt}</span>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giao hàng</span>
                      <span>{selectedOrder.deliveredAt}</span>
                    </div>
                  )}
                </div>

                {/* Cột phải - Địa chỉ & thanh toán */}
                <div className="border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="font-medium text-right max-w-[200px] truncate">
                      {selectedOrder.shippingAddress || "Chưa có"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thanh toán</span>
                    <span className="font-medium">
                      {selectedOrder.paymentMethod === "wallet"
                        ? "Thanh toán bằng ví Kohi"
                        : "Thanh toán khi nhận hàng"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium">{selectedOrder.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium">{selectedOrder.shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-700 font-medium">Tổng cộng</span>
                    <span className="font-bold text-[#116AD1]">{selectedOrder.total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm - 2 cột */}
              <div className="border rounded-lg overflow-hidden mb-5">
                <h3 className="font-semibold text-gray-700 p-3 bg-gray-50 border-b">
                  Sản phẩm ({selectedOrder.orderItems.length})
                </h3>
                {selectedOrder.orderItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {selectedOrder.orderItems.map((item, index) => {
                      const productImage = item.OrderItemProductVariant?.ProductVariantProduct?.main_image;
                      const productName = item.OrderItemProductVariant?.ProductVariantProduct?.name || "Sản phẩm";
                      return (
                        <div key={index} className="flex p-2 border rounded-lg">
                          <img
                            src={productImage || "https://via.placeholder.com/60"}
                            alt={productName}
                            className="w-14 h-14 object-cover rounded"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                              {productName}
                            </h4>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                            <p className="text-sm text-[#116AD1] font-semibold">
                              {(item.price || 0).toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-center">Không có sản phẩm</p>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3">
                {REVIEWABLE_STATUSES.includes(selectedOrder.rawStatus) && (
                  <button
                    onClick={() => {
                      closeModal();
                      handleViewReview(selectedOrder.clientOrderId);
                    }}
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50 flex items-center gap-2"
                  >
                    <IoStar size={18} />
                    Xem đánh giá
                  </button>
                )}
                <button
                  onClick={() => handleDownloadOrder(selectedOrder)}
                  className="px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-blue-50 flex items-center gap-2"
                >
                  <IoDownloadOutline size={18} />
                  Tải xuống
                </button>
                {(selectedOrder.rawStatus === "PENDING" || selectedOrder.rawStatus === "RETURNED") && (
                  <button
                    onClick={() => {
                      if (selectedOrder.rawStatus === "RETURNED") {
                        handleConfirmReturn(selectedOrder.clientOrderId);
                      } else {
                        handleUpdateOrderStatus(selectedOrder.clientOrderId);
                      }
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {selectedOrder.rawStatus === "RETURNED" ? "Xác nhận trả hàng" : "Xác nhận đơn hàng"}
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSeller;
