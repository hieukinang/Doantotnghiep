import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const STATUS_MAP = {
  PENDING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  IN_TRANSIT: "Đang vận chuyển",
  DELIVERED: "Đã vận chuyển",
  CLIENT_CONFIRMED: "Đã nhận hàng",
  CLIENT_NOT_CONFIRMED: "Không nhận được hàng",
  CANCELLED: "Đã hủy",
  FAILED: "Lỗi",
  RETURNED: "Yêu cầu trả hàng",
  RETURN_CONFIRMED: "Trả hàng thành công",
  RETURN_NOT_CONFIRMED: "Trả hàng không thành công",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Đang xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_TRANSIT", label: "Đang vận chuyển" },
  { value: "DELIVERED", label: "Đã vận chuyển" },
  { value: "CLIENT_CONFIRMED", label: "Đã nhận hàng" },
  { value: "CLIENT_NOT_CONFIRMED", label: "Không nhận được hàng" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "FAILED", label: "Lỗi" },
  { value: "RETURNED", label: "Yêu cầu trả hàng" },
  { value: "RETURN_CONFIRMED", label: "Trả hàng thành công" },
  { value: "RETURN_NOT_CONFIRMED", label: "Trả hàng không thành công" },
];

const Orders = () => {
  const { ordersClient, getOrderofClient, clientToken } = useContext(ShopContext);
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonModalType, setReasonModalType] = useState("");
  const [reasonOrderId, setReasonOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [returnImages, setReturnImages] = useState([]);
  
  // States cho Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewOrderItems, setReviewOrderItems] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [reviewImages, setReviewImages] = useState({});
  
  // States cho chọn sản phẩm (khi có nhiều sản phẩm)
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

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
    // Tính tổng số lượng sản phẩm (tổng quantity của tất cả OrderItems)
    const totalQuantity = (o.OrderItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    // Tính tạm tính (tổng price * quantity của tất cả OrderItems)
    const subtotal = (o.OrderItems || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    return {
      id: o.orderCode || `${o.id}`,
      rawStatus: o.status,
      status: statusUI,
      total: o.total_price || 0,
      subtotal: subtotal,
      items: totalQuantity,
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
    activeStatus === "ALL"
      ? formatOrders
      : formatOrders.filter((o) => o.rawStatus === activeStatus);

  // 🔹 Xác nhận đã nhận hàng hoặc chưa nhận được
  const handleConfirmReceived = async (orderId, isReceived = true) => {
    if (!clientToken) {
      toast.warning("⚠️ Vui lòng đăng nhập!");
      return;
    }

    try {
      // Truyền isReceived qua query param thay vì body
      const res = await axios.post(
        `${backendURL}/orders/client/${orderId}/confirmed-order?isReceived=${isReceived}`,
        {},
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        toast.success(isReceived ? "Xác nhận đã nhận hàng thành công!" : "Đã gửi thông báo chưa nhận được hàng!");
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

  // ==================== REVIEW FUNCTIONS ====================
  const handleOpenReview = async (order) => {
    try {
      const res = await axios.get(
        `${backendURL}/orders/client/${order.clientOrderId}`,
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        const orderItems = res.data.data.order.OrderItems || [];
        
        // Gom nhóm sản phẩm theo productId
        const uniqueProducts = [];
        const seenProductIds = new Set();
        
        orderItems.forEach(item => {
          const productId = item.OrderItemProductVariant?.productId;
          if (productId && !seenProductIds.has(productId)) {
            seenProductIds.add(productId);
            uniqueProducts.push(item);
          }
        });
        
        setReviewOrderId(order.clientOrderId);
        setReviewOrderItems(uniqueProducts);
        setReviewedProducts(new Set());
        
        // Nếu chỉ có 1 sản phẩm -> hiển thị form luôn
        if (uniqueProducts.length === 1) {
          const product = uniqueProducts[0];
          const productId = product.OrderItemProductVariant?.productId;
          
          setSelectedProductForReview(product);
          setReviewData({
            [productId]: { text: "", rating: 5 }
          });
          setReviewImages({
            [productId]: []
          });
          setShowReviewModal(true);
          setShowProductSelector(false);
        } else {
          // Nếu có 2+ sản phẩm -> hiển thị danh sách chọn
          setShowProductSelector(true);
          setShowReviewModal(false);
        }
      } else {
        toast.error("Không thể tải thông tin đơn hàng!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải thông tin đơn hàng!");
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setShowProductSelector(false);
    setReviewOrderId(null);
    setReviewOrderItems([]);
    setReviewData({});
    setReviewImages({});
    setSelectedProductForReview(null);
    setReviewedProducts(new Set());
  };
  
  const handleSelectProductToReview = (product) => {
    const productId = product.OrderItemProductVariant?.productId;
    
    setSelectedProductForReview(product);
    setReviewData({
      [productId]: { text: "", rating: 5 }
    });
    setReviewImages({
      [productId]: []
    });
    setShowProductSelector(false);
    setShowReviewModal(true);
  };

  const handleRatingChange = (productId, rating) => {
    setReviewData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating
      }
    }));
  };

  const handleTextChange = (productId, text) => {
    setReviewData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        text
      }
    }));
  };

  const handleReviewImageUpload = (productId, e) => {
    const files = Array.from(e.target.files);
    const currentImages = reviewImages[productId] || [];
    
    if (currentImages.length + files.length > 2) {
      toast.warning("Chỉ được tải tối đa 2 ảnh cho mỗi sản phẩm!");
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setReviewImages(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), ...newImages].slice(0, 2)
    }));
  };

  const removeReviewImage = (productId, index) => {
    setReviewImages(prev => {
      const images = [...(prev[productId] || [])];
      URL.revokeObjectURL(images[index].preview);
      images.splice(index, 1);
      return {
        ...prev,
        [productId]: images
      };
    });
  };

  const handleSubmitReview = async () => {
    const productId = selectedProductForReview?.OrderItemProductVariant?.productId;
    
    if (!productId || !reviewData[productId]?.text?.trim()) {
      toast.warning("Vui lòng nhập đánh giá!");
      return;
    }

    try {
      const formData = new FormData();
      const review = reviewData[productId];
      const images = reviewImages[productId] || [];

      formData.append('text', review.text);
      formData.append('rating', review.rating.toString());
      formData.append('productId', productId.toString());
      
      images.forEach(img => {
        formData.append('images', img.file);
      });

      const res = await axios.post(
        `${backendURL}/reviews/order/${reviewOrderId}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${clientToken}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );

      if (res.data.status === "success") {
        toast.success("Đánh giá thành công!");
        
        // Đánh dấu sản phẩm đã được review
        const newReviewedProducts = new Set(reviewedProducts);
        newReviewedProducts.add(productId);
        setReviewedProducts(newReviewedProducts);
        
        // Nếu có nhiều sản phẩm -> quay về danh sách chọn
        if (reviewOrderItems.length > 1) {
          setShowReviewModal(false);
          setShowProductSelector(true);
          setSelectedProductForReview(null);
          setReviewData({});
          setReviewImages({});
          
          // Nếu đã review hết tất cả sản phẩm -> đóng modal và reload
          if (newReviewedProducts.size === reviewOrderItems.length) {
            toast.success("Đã hoàn thành đánh giá tất cả sản phẩm!");
            closeReviewModal();
            await getOrderofClient();
          }
        } else {
          // Nếu chỉ có 1 sản phẩm -> đóng modal và reload
          closeReviewModal();
          await getOrderofClient();
        }
      } else {
        toast.error(res.data.message || "Đánh giá thất bại!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Đánh giá thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1 pb-4">
        <div className="max-w-7xl mx-auto">

          {/* Dropdown lọc trạng thái */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Trạng thái:</label>
            <div className="relative">
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value)}
                className="appearance-none px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#116AD1] focus:border-transparent w-[160px] sm:w-[200px] pr-8 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {activeStatus !== "ALL" && (
              <button
                onClick={() => setActiveStatus("ALL")}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Order list - Mobile card view */}
          <div className="mt-4 space-y-3 md:hidden">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-400">
                <div className="text-4xl mb-3">📦</div>
                <div>Không có đơn hàng nào</div>
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="bg-white rounded-xl shadow p-4 border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-[#116AD1] text-sm">{o.id}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        📅 {o.date} • 📦 {o.items} sản phẩm
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium
                      ${o.rawStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${o.rawStatus === 'CONFIRMED' ? 'bg-cyan-100 text-cyan-700' : ''}
                      ${o.rawStatus === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : ''}
                      ${o.rawStatus === 'DELIVERED' ? 'bg-blue-100 text-blue-700' : ''}
                      ${o.rawStatus === 'CLIENT_CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                      ${o.rawStatus === 'CLIENT_NOT_CONFIRMED' ? 'bg-red-100 text-red-700' : ''}
                      ${o.rawStatus === 'CANCELLED' ? 'bg-gray-100 text-gray-700' : ''}
                      ${o.rawStatus === 'FAILED' ? 'bg-red-100 text-red-700' : ''}
                      ${o.rawStatus === 'RETURNED' ? 'bg-orange-100 text-orange-700' : ''}
                      ${o.rawStatus === 'RETURN_CONFIRMED' ? 'bg-teal-100 text-teal-700' : ''}
                      ${o.rawStatus === 'RETURN_NOT_CONFIRMED' ? 'bg-pink-100 text-pink-700' : ''}
                    `}>
                      {o.status}
                    </span>
                  </div>
                  <div className="font-bold text-[#116AD1] text-base mb-3">
                    {o.total.toLocaleString("vi-VN")}₫
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {o.rawStatus === "CLIENT_CONFIRMED" && (
                      <button
                        onClick={() => openReasonModal(o.clientOrderId, "return")}
                        className="text-[10px] px-2 py-1 bg-red-50 border border-red-200 rounded-lg text-red-600"
                      >
                        Đổi/Trả
                      </button>
                    )}
                    {(o.rawStatus === "CONFIRMED" || o.rawStatus === "PENDING") && (
                      <button
                        onClick={() => openReasonModal(o.clientOrderId, "cancel")}
                        className="text-[10px] px-2 py-1 bg-red-50 border border-red-200 rounded-lg text-red-600"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {o.rawStatus === "DELIVERED" && (
                      <>
                        <button
                          onClick={() => handleConfirmReceived(o.clientOrderId, true)}
                          className="text-[10px] px-2 py-1 bg-green-50 border border-green-200 rounded-lg text-green-600"
                        >
                          ✓ Đã nhận
                        </button>
                        <button
                          onClick={() => handleConfirmReceived(o.clientOrderId, false)}
                          className="text-[10px] px-2 py-1 bg-red-50 border border-red-200 rounded-lg text-red-600"
                        >
                          ✗ Chưa nhận
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleOpenReview(o)}
                      className="text-[10px] px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg text-orange-600"
                    >
                      Đánh giá
                    </button>
                    <button
                      onClick={() => handleViewDetail(o)}
                      className="text-[10px] px-2 py-1 bg-[#116AD1] text-white rounded-lg"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order table - Desktop view */}
          <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#116AD1] to-[#1e88e5] text-white">
                    <th className="px-3 md:px-5 py-3 md:py-4 w-[200px] lg:w-[250px] text-left font-semibold text-xs md:text-sm">Đơn hàng</th>
                    <th className="px-3 md:px-5 py-3 md:py-4 w-[100px] lg:w-[130px] text-left font-semibold text-xs md:text-sm">Giá tiền</th>
                    <th className="px-3 md:px-5 py-3 md:py-4 w-[120px] lg:w-[150px] text-left font-semibold text-xs md:text-sm">Trạng thái</th>
                    <th className="px-3 md:px-5 py-3 md:py-4 text-right font-semibold text-xs md:text-sm">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 md:py-16 text-gray-400">
                      <div className="text-3xl md:text-4xl mb-3">📦</div>
                      <div className="text-sm md:text-base">Không có đơn hàng nào</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o, index) => (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      {/* Cột 1: Đơn hàng */}
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="font-bold text-[#116AD1] text-sm md:text-base">{o.id}</div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                          📅 {o.date} • 📦 {o.items} sản phẩm
                        </div>
                      </td>

                      {/* Cột 2: Giá tiền */}
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="font-bold text-[#116AD1] text-sm md:text-base">
                          {o.total.toLocaleString("vi-VN")}₫
                        </div>
                      </td>

                      {/* Cột 3: Trạng thái */}
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium
                          ${o.rawStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${o.rawStatus === 'CONFIRMED' ? 'bg-cyan-100 text-cyan-700' : ''}
                          ${o.rawStatus === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : ''}
                          ${o.rawStatus === 'DELIVERED' ? 'bg-blue-100 text-blue-700' : ''}
                          ${o.rawStatus === 'CLIENT_CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                          ${o.rawStatus === 'CLIENT_NOT_CONFIRMED' ? 'bg-red-100 text-red-700' : ''}
                          ${o.rawStatus === 'CANCELLED' ? 'bg-gray-100 text-gray-700' : ''}
                          ${o.rawStatus === 'FAILED' ? 'bg-red-100 text-red-700' : ''}
                          ${o.rawStatus === 'RETURNED' ? 'bg-orange-100 text-orange-700' : ''}
                          ${o.rawStatus === 'RETURN_CONFIRMED' ? 'bg-teal-100 text-teal-700' : ''}
                          ${o.rawStatus === 'RETURN_NOT_CONFIRMED' ? 'bg-pink-100 text-pink-700' : ''}
                        `}>
                          {o.status}
                        </span>
                      </td>

                      {/* Cột 4: Thao tác */}
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex gap-1 md:gap-2 flex-wrap justify-end">
                          {o.rawStatus === "CLIENT_CONFIRMED" && (
                            <button
                              onClick={() => openReasonModal(o.clientOrderId, "return")}
                              className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
                            >
                              Đổi/Trả
                            </button>
                          )}
                          
                          {(o.rawStatus === "CONFIRMED" || o.rawStatus === "PENDING") && (
                            <button
                              onClick={() => openReasonModal(o.clientOrderId, "cancel")}
                              className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
                            >
                              Hủy đơn
                            </button>
                          )}

                          {o.rawStatus === "DELIVERED" && (
                            <>
                              <button
                                onClick={() => handleConfirmReceived(o.clientOrderId, true)}
                                className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-600 hover:bg-green-100 transition-colors whitespace-nowrap"
                              >
                                ✓ Đã nhận
                              </button>
                              <button
                                onClick={() => handleConfirmReceived(o.clientOrderId, false)}
                                className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
                              >
                                ✗ Chưa nhận
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenReview(o)}
                            className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors whitespace-nowrap"
                          >
                            Đánh giá
                          </button>
                          <button
                            onClick={() => handleViewDetail(o)}
                            className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-[#116AD1] text-white rounded-lg hover:bg-[#0e57aa] transition-colors whitespace-nowrap"
                          >
                            Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="mt-4 md:mt-6 text-center">
            <Link
              to="/"
              className="inline-block px-5 md:px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-sm md:text-base"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal Chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base md:text-lg font-semibold text-[#116AD1]">
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-3 md:p-5">
              {/* Thông tin đơn hàng - 2 cột trên desktop, 1 cột trên mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
                {/* Cột trái - Trạng thái & thời gian & Phí vận chuyển */}
                <div className="border rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="font-semibold text-[#116AD1]">{selectedOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-medium text-right break-all ml-2">{selectedOrder.id}</span>
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium">{selectedOrder.shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                {/* Cột phải - Địa chỉ, Thanh toán, Tạm tính & Tổng tiền */}
                <div className="border rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="font-medium sm:text-right sm:max-w-[200px] break-words">
                      {selectedOrder.shippingAddress || "Chưa có"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thanh toán</span>
                    <span className="font-medium text-right">{selectedOrder.paymentMethod==='wallet'? "Ví Kohi" : "COD"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium">{selectedOrder.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tổng tiền</span>
                    <span className="font-bold text-[#116AD1]">{selectedOrder.total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="border rounded-lg overflow-hidden mb-4 md:mb-5">
                <h3 className="font-semibold text-gray-700 p-2 md:p-3 bg-gray-50 border-b text-sm md:text-base">
                  Sản phẩm ({selectedOrder.orderItems.length})
                </h3>
                {selectedOrder.orderItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 md:p-3">
                    {selectedOrder.orderItems.map((item, index) => {
                      const productImage = item.OrderItemProductVariant?.ProductVariantProduct?.main_image;
                      const productName = item.OrderItemProductVariant?.ProductVariantProduct?.name || "Sản phẩm";
                      return (
                        <div key={index} className="flex p-2 border rounded-lg">
                          <img
                            src={productImage || "https://via.placeholder.com/60"}
                            alt={productName}
                            className="w-12 h-12 md:w-14 md:h-14 object-cover rounded flex-shrink-0"
                          />
                          <div className="ml-2 md:ml-3 flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-xs md:text-sm line-clamp-1">
                              {productName}
                            </h4>
                            <p className="text-[10px] md:text-xs text-gray-500">x{item.quantity}</p>
                            <p className="text-xs md:text-sm text-[#116AD1] font-semibold">
                              {(item.price || 0).toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-center text-sm">Không có sản phẩm</p>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                {selectedOrder.rawStatus === "DELIVERED" && (
                  <>
                    <button
                      onClick={() => {
                        handleConfirmReceived(selectedOrder.clientOrderId, true);
                        closeModal();
                      }}
                      className="px-3 md:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Đã nhận hàng
                    </button>
                    <button
                      onClick={() => {
                        handleConfirmReceived(selectedOrder.clientOrderId, false);
                        closeModal();
                      }}
                      className="px-3 md:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Chưa nhận được
                    </button>
                  </>
                )}
                {selectedOrder.rawStatus === "CLIENT_CONFIRMED" && (
                  <Link
                    to="/exchange-request"
                    className="px-3 md:px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-sm text-center"
                    onClick={closeModal}
                  >
                    Yêu cầu Trả hàng / Hoàn tiền
                  </Link>
                )}
                <button
                  onClick={closeModal}
                  className="px-3 md:px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hủy đơn / Đổi trả */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b sticky top-0 bg-white">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                {reasonModalType === "cancel" ? "Lý do hủy đơn hàng" : "Lý do đổi/trả hàng"}
              </h2>
              <button
                onClick={closeReasonModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              {(reasonModalType === "cancel" ? CANCEL_REASONS : RETURN_REASONS).map((reason, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
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
                  <span className="text-xs md:text-sm text-gray-700">{reason}</span>
                </label>
              ))}

              {/* Upload ảnh - chỉ hiển thị khi đổi/trả */}
              {reasonModalType === "return" && (
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t">
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Tải ảnh minh họa (tối đa 3 ảnh)
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {returnImages.map((img, index) => (
                      <div key={index} className="relative w-16 h-16 md:w-20 md:h-20">
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {returnImages.length < 3 && (
                      <label className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#116AD1] hover:bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="text-xl md:text-2xl text-gray-400">+</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-3 md:p-4 border-t">
              <button
                onClick={closeReasonModal}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReason}
                disabled={!selectedReason}
                className={`px-3 md:px-4 py-2 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed text-sm ${
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

      {/* Modal Chọn sản phẩm để đánh giá */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-3 md:p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-sm md:text-lg font-semibold text-[#116AD1]">
                Chọn sản phẩm để đánh giá ({reviewedProducts.size}/{reviewOrderItems.length})
              </h2>
              <button onClick={closeReviewModal} className="p-1 hover:bg-gray-100 rounded-full">
                <IoClose size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-3 md:p-5 space-y-2 md:space-y-3">
              {reviewOrderItems.map((item, index) => {
                const productId = item.OrderItemProductVariant?.productId;
                const isReviewed = reviewedProducts.has(productId);
                
                return (
                  <div 
                    key={index} 
                    className={`flex gap-2 md:gap-3 p-3 md:p-4 border rounded-lg transition-all ${
                      isReviewed 
                        ? 'bg-green-50 border-green-200 opacity-60' 
                        : 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer'
                    }`}
                    onClick={() => !isReviewed && handleSelectProductToReview(item)}
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.title}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-xs md:text-base line-clamp-2">{item.title}</h4>
                      <p className="text-[10px] md:text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-xs md:text-sm text-[#116AD1] font-semibold">
                        {(item.price || 0).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                    {isReviewed ? (
                      <div className="self-center px-2 md:px-3 py-1 bg-green-500 text-white text-[10px] md:text-xs rounded-full whitespace-nowrap">
                        ✓ Đã đánh giá
                      </div>
                    ) : (
                      <div className="self-center px-2 md:px-3 py-1 bg-[#116AD1] text-white text-[10px] md:text-xs rounded-full hover:bg-[#0e57aa] whitespace-nowrap">
                        Đánh giá
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 md:gap-3 p-3 md:p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={closeReviewModal}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-xs md:text-sm"
              >
                {reviewedProducts.size === reviewOrderItems.length ? 'Hoàn thành' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Đánh giá sản phẩm */}
      {showReviewModal && selectedProductForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[#116AD1]">
                Đánh giá sản phẩm {reviewOrderItems.length > 1 && `(${reviewedProducts.size + 1}/${reviewOrderItems.length})`}
              </h2>
              <button 
                onClick={() => {
                  if (reviewOrderItems.length > 1) {
                    setShowReviewModal(false);
                    setShowProductSelector(true);
                  } else {
                    closeReviewModal();
                  }
                }} 
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-5">
              {(() => {
                const item = selectedProductForReview;
                const productId = item.OrderItemProductVariant?.productId;
                const currentRating = reviewData[productId]?.rating || 5;
                const currentText = reviewData[productId]?.text || "";
                const currentImages = reviewImages[productId] || [];

                return (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex gap-3 mb-4">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="text-sm text-[#116AD1] font-semibold">
                          {(item.price || 0).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Đánh giá sao <span className="text-red-500">*</span>
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(productId, star)}
                            className="transition-transform hover:scale-110"
                          >
                            <FaStar
                              size={28}
                              className={star <= currentRating ? "text-yellow-400" : "text-gray-300"}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600 self-center">
                          ({currentRating} sao)
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Nhận xét <span className="text-red-500">*</span>
                      </p>
                      <textarea
                        value={currentText}
                        onChange={(e) => handleTextChange(productId, e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#116AD1] resize-none"
                        rows={4}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Thêm hình ảnh (tối đa 2 ảnh)
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {currentImages.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <img
                              src={img.preview}
                              alt={`Review ${imgIndex + 1}`}
                              className="w-full h-full object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeReviewImage(productId, imgIndex)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {currentImages.length < 2 && (
                          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#116AD1] hover:bg-gray-50">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleReviewImageUpload(productId, e)}
                              className="hidden"
                            />
                            <span className="text-2xl text-gray-400">+</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  if (reviewOrderItems.length > 1) {
                    setShowReviewModal(false);
                    setShowProductSelector(true);
                  } else {
                    closeReviewModal();
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                {reviewOrderItems.length > 1 ? 'Quay lại' : 'Hủy bỏ'}
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
