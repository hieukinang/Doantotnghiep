import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const statusOptions = ["Tất cả", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

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

const OrdersSeller = () => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
  // ✅ Gọi API orders/store
  const { ordersStore, getOrdersofStore } = useContext(ShopContext);

  useEffect(() => {
    getOrdersofStore();
  }, []);

  // 🔍 Lọc theo trạng thái + ngày
  const filteredOrders = (ordersStore || []).filter((o) => {
    const matchStatus = statusFilter === "Tất cả" || o.status === statusFilter;

    const date = new Date(o.order_date);
    const matchStart = startDate ? date >= new Date(startDate) : true;
    const matchEnd = endDate ? date <= new Date(endDate) : true;

    return matchStatus && matchStart && matchEnd;
  });

  // Format orders cho modal
  const formatOrderForModal = (o) => ({
    id: o.orderCode || `${o.id}`,
    rawStatus: o.status,
    status: STATUS_MAP[o.status] || o.status,
    total: o.total_price || 0,
    orderItems: o.OrderItems || [],
    shippingAddress: o.shipping_address || "",
    shippingFee: o.shipping_fee || 0,
    paymentMethod: o.payment_method || "Thanh toán khi nhận hàng",
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "",
    deliveredAt: o.delivered_at ? new Date(o.delivered_at).toLocaleDateString("vi-VN") : "",
    clientOrderId: o.id,
  });

  const handleViewDetail = (order) => {
    setSelectedOrder(formatOrderForModal(order));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  const handleUpdateOrderStatus = async (id) => {
    const token = localStorage.getItem("sellerToken");
    try {
      const res = await axios.post(`${backendURL}/orders/store/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        // 🔁 Fetch lại từ server để chắc chắn bảng reload
        await getOrdersofStore();
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-auto">
        {/* Bộ lọc */}
        <div className="p-4 flex items-center gap-3 border-b">

          {/* Filter trạng thái */}
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-sm 
                ${statusFilter === s ? "bg-[#116AD1] text-white" : "bg-gray-100"}
              `}
            >
              {s}
            </button>
          ))}

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
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Mã đơn</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredOrders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 font-medium">{o.id}</td>

                <td className="px-4 py-2">{o.order_date}</td>

                <td className="px-4 py-2 text-[#116AD1] font-semibold">
                  {o.total_price.toLocaleString("vi-VN")}₫
                </td>

                <td className="px-4 py-2">{STATUS_MAP[o.status] || o.status}</td>

                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewDetail(o)}
                      className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                    >
                      Chi tiết
                    </button>

                    <button
                      className="px-3 py-1 border rounded text-green-600 hover:bg-green-50"
                      onClick={() => handleUpdateOrderStatus(o.id)}
                    >
                      Xác nhận
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                    <span className="font-medium">
                      {selectedOrder.paymentMethod === "wallet"
                        ? "Thanh toán bằng ví Kohi"
                        : "Thanh toán khi nhận hàng"}
                    </span>
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
                {selectedOrder.rawStatus !== "DELIVERED" && selectedOrder.rawStatus !== "CANCELLED" && (
                  <button
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.clientOrderId);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Xác nhận đơn hàng
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
