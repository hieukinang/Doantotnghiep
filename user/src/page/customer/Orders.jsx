import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

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

const tabs = [
  "Tất cả",
  "Đang xử lý",
  "Đã xác nhận",
  "Đang giao",
  "Đã vận chuyển",
  "Hoàn thành",
  "Đã hủy",
  "Lỗi",
  "Yêu cầu trả hàng",
  "Đã trả hàng",
];

const Orders = () => {
  const { ordersClient, getOrderofClient, clientToken } = useContext(ShopContext);
  const [active, setActive] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonModalType, setReasonModalType] = useState(""); // "cancel" hoặc "return"
  const [reasonOrderId, setReasonOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [returnImages, setReturnImages] = useState([]);
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const CANCEL_REASONS = [
    "Tôi muốn thay đổi địa chỉ giao hàng",
    "Tôi muốn thay đổi sản phẩm (màu sắc, kích thước, ...)",
    "Tôi tìm thấy giá rẻ hơn ở nơi khác",
    "Tôi không còn nhu cầu mua nữa",
    "Thời gian giao hàng quá lâu",
    "Lý do khác",
  ];

  const RETURN_REASONS = [
    "Sản phẩm bị lỗi/hỏng",
    "Sản phẩm không đúng mô tả",
    "Sản phẩm không đúng kích thước/màu sắc",
    "Nhận sai sản phẩm",
    "Sản phẩm kém chất lượng",
    "Lý do khác",
  ];

  useEffect(() => {
    getOrderofClient();
  }, []);

  const formatOrders = (ordersClient || []).map((o) => {
    const statusUI = STATUS_MAP[o.status] || "Đang xử lý";
    return {
      id: o.orderCode || `${o.id}`,
      rawStatus: o.status,
      status: statusUI,
      total: o.total_price || 0,
      items: o.OrderItems?.length || 0,
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("vi-VN")
        : "",
      clientOrderId: o.id,
      // Thêm thông tin chi tiết cho modal
      orderItems: o.OrderItems || [],
      shippingAddress: o.shipping_address || "",
      shippingFee: o.shipping_fee || 0,
      paymentMethod: o.payment_method || "Thanh toán khi nhận hàng",
      paidAt: o.paid_at ? new Date(o.paid_at).toLocaleDateString("vi-VN") : "",
      deliveredAt: o.delivered_at ? new Date(o.delivered_at).toLocaleDateString("vi-VN") : "",
      createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "",
    };
  });

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const filteredOrders =
    active === "Tất cả"
      ? formatOrders
      : formatOrders.filter((o) => o.status === active);

  // 🔹 Xác nhận đã nhận hàng
  const handleConfirmReceived = async (orderId) => {
    const token = localStorage.getItem("clientToken");
    if (!clientToken) {
      toast.warning("⚠️ Vui lòng đăng nhập!");
      return;
    }

    try {
      const res = await axios.post(
        `${backendURL}/orders/client/${orderId}/confirmed-order-is-deliveried`,
        {},
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        await getOrderofClient();
      } else {
        toast.error(res.data.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  // Mở modal lý do (tái sử dụng cho cả hủy đơn và đổi/trả)
  const openReasonModal = (orderId, type) => {
    setReasonOrderId(orderId);
    setReasonModalType(type);
    setSelectedReason("");
    setReturnImages([]);
    setShowReasonModal(true);
  };

  // Đóng modal lý do
  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReasonOrderId(null);
    setReasonModalType("");
    setSelectedReason("");
    setReturnImages([]);
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (returnImages.length + files.length > 3) {
      toast.warning("Chỉ được tải tối đa 3 ảnh!");
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setReturnImages(prev => [...prev, ...newImages].slice(0, 3));
  };

  // Xóa ảnh
  const removeImage = (index) => {
    setReturnImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Xác nhận hủy đơn hoặc đổi/trả
  const handleConfirmReason = async () => {
    if (!selectedReason) {
      toast.warning(`Vui lòng chọn lý do ${reasonModalType === "cancel" ? "hủy đơn" : "đổi/trả"}!`);
      return;
    }

    try {
      if (reasonModalType === "cancel") {
        // API hủy đơn
        const res = await axios.post(
          `${backendURL}/orders/client/${reasonOrderId}/cancel-order`,
          { reason: selectedReason },
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );

        if (res.data.status === "success") {
          toast.success("Hủy đơn hàng thành công!");
          await getOrderofClient();
          closeReasonModal();
        } else {
          toast.error(res.data.message || "Hủy đơn thất bại!");
        }
      } else {
        // API đổi/trả với ảnh
        const formData = new FormData();
        formData.append("reason", selectedReason);
        returnImages.forEach((img) => {
          formData.append("images", img.file);
        });

        const res = await axios.post(
          `${backendURL}/orders/client/${reasonOrderId}/return-order`,
          formData,
          { 
            headers: { 
              Authorization: `Bearer ${clientToken}`,
              "Content-Type": "multipart/form-data"
            } 
          }
        );

        if (res.data.status === "success") {
          toast.success("Gửi yêu cầu đổi/trả thành công!");
          await getOrderofClient();
          closeReasonModal();
        } else {
          toast.error(res.data.message || "Gửi yêu cầu thất bại!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `${reasonModalType === "cancel" ? "Hủy đơn" : "Gửi yêu cầu đổi/trả"} thất bại!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-2 overflow-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-4 py-2 rounded-full border ${active === t
                  ? "bg-[#116AD1] text-white border-[#116AD1]"
                  : "border-gray-300 bg-white"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Order list */}
          <div className="mt-4 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500">
                Không có đơn hàng.
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-lg p-4 shadow flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{o.id}</div>
                    <div className="text-sm text-gray-500">
                      {o.date} • {o.items} sản phẩm
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#116AD1] font-bold">
                      {o.total.toLocaleString("vi-VN")}₫
                    </div>
                    <div className="text-sm">{o.status}</div>
                  </div>

                  <div className="flex gap-2 w-40 justify-end">

                    {o.rawStatus === "CLIENT_CONFIRMED" && (
                      <button
                        onClick={() => openReasonModal(o.clientOrderId, "return")}
                        className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-50 whitespace-nowrap"
                      >
                        Đổi/Trả
                      </button>
                    )}
                    
                    {(o.rawStatus === "CONFIRMED" || o.rawStatus === "PENDING") && (
                      <button
                        onClick={() => openReasonModal(o.clientOrderId, "cancel")}
                        className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-50 whitespace-nowrap"
                      >
                        Hủy đơn
                      </button>
                    )}

                    {o.rawStatus === "DELIVERED" && (
                      <button
                        onClick={() => handleConfirmReceived(o.clientOrderId)}
                        className="text-sm px-3 py-1 border rounded text-green-600 hover:bg-green-50 whitespace-nowrap"
                      >
                        Đã nhận
                      </button>
                    )}

                    <button
                      onClick={() => handleViewDetail(o)}
                      className="text-sm px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>

      <Footer />

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
                    <span className="font-medium">{selectedOrder.paymentMethod==='wallet'? "Thanh toán ngay bằng ví Kohi" : "Thanh toán khi nhận hàng"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium">{selectedOrder.shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tổng tiền</span>
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
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex p-2 border rounded-lg">
                        <img
                          src={item.image || "https://via.placeholder.com/60"}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                          <p className="text-sm text-[#116AD1] font-semibold">
                            {(item.price || 0).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-center">Không có sản phẩm</p>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3">
                {selectedOrder.rawStatus === "DELIVERED" && (
                  <button
                    onClick={() => {
                      handleConfirmReceived(selectedOrder.clientOrderId);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Xác nhận đã nhận hàng
                  </button>
                )}
                {selectedOrder.rawStatus === "CLIENT_CONFIRMED" && (
                  <Link
                    to="/exchange-request"
                    className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
                    onClick={closeModal}
                  >
                    Yêu cầu Trả hàng / Hoàn tiền
                  </Link>
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
      {/* Modal Hủy đơn / Đổi trả (tái sử dụng) */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                {reasonModalType === "cancel" ? "Lý do hủy đơn hàng" : "Lý do đổi/trả hàng"}
              </h2>
              <button
                onClick={closeReasonModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {(reasonModalType === "cancel" ? CANCEL_REASONS : RETURN_REASONS).map((reason, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedReason === reason ? "border-[#116AD1] bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-[#116AD1]"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}

              {/* Upload ảnh - chỉ hiển thị khi đổi/trả */}
              {reasonModalType === "return" && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tải ảnh minh họa (tối đa 3 ảnh)
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {returnImages.map((img, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {returnImages.length < 3 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#116AD1] hover:bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="text-2xl text-gray-400">+</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={closeReasonModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReason}
                disabled={!selectedReason}
                className={`px-4 py-2 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed ${
                  reasonModalType === "cancel" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-[#116AD1] hover:bg-[#0e57aa]"
                }`}
              >
                {reasonModalType === "cancel" ? "Xác nhận hủy đơn" : "Gửi yêu cầu đổi/trả"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
