import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, clientToken, fetchMyCart, backendURL } = useContext(ShopContext) || { cartItems: [] };

  // Lấy dữ liệu từ localStorage
  const checkedItemsFromCart = JSON.parse(localStorage.getItem("checkedItems") || "[]");
  const [quantities, setQuantities] = useState(JSON.parse(localStorage.getItem("quantities") || "{}"));
  const [appliedStoreCoupons, setAppliedStoreCoupons] = useState(JSON.parse(localStorage.getItem("appliedStoreCoupons") || "{}"));
  const [appliedCartCoupon, setAppliedCartCoupon] = useState(JSON.parse(localStorage.getItem("appliedCartCoupon") || "null"));
  const [appliedShippingCode, setAppliedShippingCode] = useState(JSON.parse(localStorage.getItem("appliedShippingCode") || "null"));

  const buyNowItems = JSON.parse(localStorage.getItem("buyNowItems") || "[]");
  const isBuyNowMode = buyNowItems.length > 0;

  // State cho tên cửa hàng
  const [storeNames, setStoreNames] = useState({});
  const [loadingStores, setLoadingStores] = useState(true);

  // Chuẩn bị orderItems
  let orderItems = [];
  
  if (isBuyNowMode) {
    // Nếu là chế độ "Mua ngay", sử dụng buyNowItems
    orderItems = buyNowItems.map(item => ({
      id: item.id,
      productId: item.productId, // Lưu productId để quay lại
      name: item.name,
      image: item.image ? (item.image.startsWith("http") 
        ? item.image 
        : item.image.startsWith("/")
        ? `${backendURL.replace('/api', '')}${item.image}`
        : `${backendURL.replace('/api', '')}/products/${item.image}`) : null,
      price: item.price || 0,
      shippingFee: item.shippingFee || 30000,
      qty: quantities[item.id] || item.qty || 1,
      variantOptions: item.variantOptions || [],
      product_variantId: item.product_variantId,
      storeId: item.storeId,
      storeName: item.storeName || "Cửa hàng",
    }));
  } else {
    // Nếu là từ Cart, sử dụng cartItems như cũ
    orderItems = cartItems?.filter(item => checkedItemsFromCart.includes(item.id))
      .map(it => {
        const variant = it.CartItemProductVariant;
        const product = variant?.ProductVariantProduct || { name: "Sản phẩm không rõ tên" };
        const storeId = variant?.storeId ?? product.storeId ?? null;

        return {
          id: it.id,
          name: product.name,
          image: product?.main_image,
          price: variant?.price || 0,
          shippingFee: variant?.shipping_fee || 30000,
          qty: quantities[it.id] || it.quantity || 1,
          variantOptions: variant?.options,
          product_variantId: it.product_variantId,
          storeId,
          storeName: variant?.storeName || it.storeName || null,
        };
      }) || [];
  }

  useEffect(() => {
    if (!clientToken) {
      navigate("/login");
      return;
    }
  }, [clientToken, cartItems, navigate]);

   useEffect(() => {
    return () => {
      const timer = setTimeout(() => {
        if (!window.location.pathname.includes('/place-order')) {
          localStorage.removeItem("quantities");
          localStorage.removeItem("buyNowItems");
        }
      }, 0);
      
      return () => clearTimeout(timer);
    };
  }, []);

  // ------------------- FETCH TÊN CỬA HÀNG (SỬA LẠI) -------------------
  useEffect(() => {
    const fetchStoreNames = async () => {
      // Lấy danh sách storeId duy nhất
      const storeIds = [...new Set(orderItems.map(item => item.storeId).filter(Boolean))];
      
      if (storeIds.length === 0) {
        setLoadingStores(false);
        return;
      }

      setLoadingStores(true);
      const newStoreNames = {};
      
      // Fetch tất cả store names song song
      await Promise.all(
        storeIds.map(async (storeId) => {
          try {
            const res = await axios.get(`${backendURL}/stores/${storeId}`);
            const storeName = res.data?.data?.name || "Cửa hàng không xác định";
            newStoreNames[storeId] = storeName;
          } catch (err) {
            console.error(`❌ Lỗi khi lấy tên cửa hàng ${storeId}:`, err);
            newStoreNames[storeId] = "Cửa hàng không xác định";
          }
        })
      );
      
      setStoreNames(newStoreNames);
      setLoadingStores(false);
    };

    if (orderItems.length > 0) {
      fetchStoreNames();
    }
  }, [orderItems.length, backendURL]); // Chỉ chạy lại khi số lượng orderItems thay đổi

  // ------------------- LOGIC QUANTITY -------------------
  const handleQtyChange = (id, value) => {
    const newQuantities = { ...quantities, [id]: value };
    setQuantities(newQuantities);
    localStorage.setItem("quantities", JSON.stringify(newQuantities));
  };

  const handleQtyBlur = (id, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    const newQuantities = { ...quantities, [id]: num };
    setQuantities(newQuantities);
    localStorage.setItem("quantities", JSON.stringify(newQuantities));
  };

  const increment = (id) => {
    const newQuantities = { ...quantities, [id]: Number(quantities[id] || 1) + 1 };
    setQuantities(newQuantities);
    localStorage.setItem("quantities", JSON.stringify(newQuantities));
  };

  const decrement = (id) => {
    const newQuantities = { ...quantities, [id]: Math.max(1, Number(quantities[id] || 1) - 1) };
    setQuantities(newQuantities);
    localStorage.setItem("quantities", JSON.stringify(newQuantities));
  };

  // ------------------- LOGIC ADDRESS -------------------
  const [mainAddress, setMainAddress] = useState(null);
  const [allAddresses, setAllAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    village: "",
    detail_address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD hoặc WALLET

  // Lấy thông tin user từ localStorage
  const clientUser = JSON.parse(localStorage.getItem("clientUser") || "{}");

  // Fetch địa chỉ chính khi component mount
  useEffect(() => {
    const initAddresses = async () => {
      await fetchAllAddresses();
      await fetchMainAddress();
    };
    initAddresses();
  }, []);

  const fetchMainAddress = async () => {
    try {
      const res = await axios.get(`${backendURL}/addresses/main`, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      
      if (res.data.status === "success" && res.data.data?.doc) {
        setMainAddress(res.data.data.doc);
        setShowAddressForm(false);
      } else {
        setMainAddress(null);
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy địa chỉ chính:", err);
      setMainAddress(null);
      setShowAddressForm(true);
    }
  };

  const fetchAllAddresses = async () => {
    try {
      const res = await axios.get(`${backendURL}/addresses`, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      
      if (res.data.status === "success") {
        setAllAddresses(res.data.data?.docs || []);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách địa chỉ:", err);
      setAllAddresses([]);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    if (!formData.city || !formData.detail_address) {
      alert("Vui lòng điền đủ thông tin địa chỉ (Tỉnh/Thành phố và Địa chỉ chi tiết).");
      return;
    }

    const addressPayload = {
      city: formData.city,
      village: formData.village || "",
      detail_address: formData.detail_address
    };

    try {
      if (editingAddressId) {
        await axios.patch(
          `${backendURL}/addresses/${editingAddressId}`,
          addressPayload,
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        const res = await axios.post(
          `${backendURL}/addresses`,
          addressPayload,
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );
        toast.success("Thêm địa chỉ mới thành công!");
        
        if (allAddresses.length === 0 && res.data.data?.doc?.id) {
          await handleSetMainAddress(res.data.data.doc.id);
        }
      }

      await fetchAllAddresses();
      await fetchMainAddress();
      setShowAddressForm(false);
      setEditingAddressId(null);
      setFormData({ city: "", village: "", detail_address: "" });
    } catch (err) {
      console.error("❌ Lỗi khi lưu địa chỉ:", err);
      alert(err.response?.data?.message || "Không thể lưu địa chỉ!");
    }
  };

  const handleSetMainAddress = async (addressId) => {
    try {
      await axios.patch(
        `${backendURL}/addresses/main/${addressId}`,
        {},
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );
      toast.success("Đã đặt làm địa chỉ mặc định!");
      await fetchMainAddress();
      await fetchAllAddresses();
      setShowAddressList(false);
    } catch (err) {
      console.error("❌ Lỗi khi đặt địa chỉ mặc định:", err);
      alert(err.response?.data?.message || "Không thể đặt địa chỉ mặc định!");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      await axios.delete(`${backendURL}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      toast.success("Đã xóa địa chỉ!");
      
      if (mainAddress?.id === addressId) {
        await fetchMainAddress();
      }
      await fetchAllAddresses();
    } catch (err) {
      console.error("❌ Lỗi khi xóa địa chỉ:", err);
      alert(err.response?.data?.message || "Không thể xóa địa chỉ!");
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      city: address.city || "",
      village: address.village || "",
      detail_address: address.detail_address || ""
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setShowAddressList(false);
  };

  const handleShowAddressList = () => {
    setShowAddressList(true);
    setShowAddressForm(false);
  };

  const handleShowAddressForm = () => {
    setFormData({ city: "", village: "", detail_address: "" });
    setEditingAddressId(null);
    setShowAddressForm(true);
    setShowAddressList(false);
  };

  // ------------------- LOGIC COUPON (API CALL) -------------------
  const [showStoreCouponModal, setShowStoreCouponModal] = useState(false);
  const [showSystemCouponModal, setShowSystemCouponModal] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [shippingCodeList, setShippingCodeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [systemCouponTab, setSystemCouponTab] = useState("coupon"); // "coupon" | "shipping"

  // Mở modal Store Coupon
  const handleOpenStoreCouponModal = async (storeId) => {
    setSelectedStoreId(storeId);
    setShowStoreCouponModal(true);
    setLoadingCoupons(true);
    setSearchTerm("");
    setCouponList([]);

    try {
      const res = await axios.get(`${backendURL}/coupons/from-store/${storeId}`);
      const validCoupons = res.data?.data?.coupons?.filter(c => c.discount > 0 && c.quantity > 0) || [];
      setCouponList(validCoupons);
    } catch (err) {
      console.error("❌ Lỗi khi lấy mã giảm giá cửa hàng:", err);
      setCouponList([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Mở modal System Coupon
  const handleOpenSystemCouponModal = async () => {
    setShowSystemCouponModal(true);
    setLoadingCoupons(true);
    setSearchTerm("");
    setCouponList([]);
    setShippingCodeList([]);
    setSystemCouponTab("coupon");

    try {
      // Lấy cả 2 loại coupon song song
      const [res1, res2] = await Promise.all([
        axios.get(`${backendURL}/coupons/from-system`),
        axios.get(`${backendURL}/shipping-codes/client`, {
          headers: { Authorization: `Bearer ${clientToken}` }
        })
      ]);
      
      const validCoupons = res1.data?.data?.docs || [];
      const validShippingCodes = res2.data?.data?.codes || [];
      
      setCouponList(validCoupons);
      setShippingCodeList(validShippingCodes);
    } catch (err) {
      console.error("❌ Lỗi khi lấy mã giảm giá hệ thống:", err);
      setCouponList([]);
      setShippingCodeList([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Áp dụng coupon cho store
  const applyStoreCoupon = async (coupon) => {
    if (!selectedStoreId || !clientToken) {
      alert("Lỗi: Không đủ thông tin để áp dụng mã giảm giá!");
      return;
    }

    try {
      // Lấy một productVariantId bất kỳ của store để validate coupon
      const storeItems = orderItems.filter((item) => item.storeId === selectedStoreId);

      if (storeItems.length === 0) {
        alert("Không tìm thấy sản phẩm của cửa hàng này!");
        return;
      }

      const firstItem = storeItems[0];
      const res = await axios.patch(
        `${backendURL}/carts/apply-coupon`,
        { couponCode: coupon.code, product_variantId: firstItem.product_variantId },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        const discountValue = res.data.data?.discountedItem?.discount || 0;

        const newAppliedStoreCoupons = {
          ...appliedStoreCoupons,
          [selectedStoreId]: {
            code: coupon.code,
            couponId: coupon.id, // Lưu coupon ID
            discountValue: Number(discountValue)
          }
        };

        setAppliedStoreCoupons(newAppliedStoreCoupons);
        localStorage.setItem("appliedStoreCoupons", JSON.stringify(newAppliedStoreCoupons));

        toast.success("Áp dụng mã giảm giá thành công cho toàn bộ cửa hàng!");
        setShowStoreCouponModal(false);
      } else {
        alert(res.data.message || "Áp dụng mã giảm giá thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi áp mã:", err);
      alert(err.response?.data?.message || "Không thể áp dụng mã giảm giá!");
    }
  };
  const applyCouponCart = (coupon) => {
    const discountValue = coupon.discount;
    const cartCouponData = {
      code: coupon.code,
      couponId: coupon.id, // Lưu coupon ID
      discountValue: Number(discountValue)
    };

    setAppliedCartCoupon(cartCouponData);
    localStorage.setItem("appliedCartCoupon", JSON.stringify(cartCouponData));

    toast.success("Áp dụng mã giảm giá thành công!");
    setShowSystemCouponModal(false);
  };

  // Xóa coupon của store
  const removeStoreCoupon = (storeId) => {
    const newAppliedStoreCoupons = { ...appliedStoreCoupons };
    delete newAppliedStoreCoupons[storeId];
    setAppliedStoreCoupons(newAppliedStoreCoupons);
    localStorage.setItem("appliedStoreCoupons", JSON.stringify(newAppliedStoreCoupons));
    toast.success("Đã loại bỏ mã giảm giá!");
  };

  // Xóa cart coupon
  const removeCartCoupon = () => {
    setAppliedCartCoupon(null);
    localStorage.removeItem("appliedCartCoupon");
    toast.success("Đã loại bỏ mã giảm giá!");
  };

  // Áp dụng shipping code
  const applyShippingCode = (code) => {
    const shippingCodeData = {
      code: code.code,
      shippingCodeId: code.id,
      discountValue: Number(code.discount || 0)
    };

    setAppliedShippingCode(shippingCodeData);
    localStorage.setItem("appliedShippingCode", JSON.stringify(shippingCodeData));

    toast.success("Áp dụng mã giảm phí ship thành công!");
    setShowSystemCouponModal(false);
  };

  // Xóa shipping code
  const removeShippingCode = () => {
    setAppliedShippingCode(null);
    localStorage.removeItem("appliedShippingCode");
    toast.success("Đã loại bỏ mã giảm phí ship!");
  };

  // ------------------- LOGIC TÍNH TOÁN -------------------
  // 1. Tạm tính
  const productSubtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  // 2. Tính tổng giảm giá từ coupons đã áp dụng
  let totalDiscountValue = 0;
  // Tính discount theo store (mỗi store chỉ tính 1 lần)
  const storeDiscountMap = new Map();
  orderItems.forEach(item => {
    const storeId = item.storeId;
    if (storeId && !storeDiscountMap.has(storeId)) {
      const storeCoupon = appliedStoreCoupons[storeId];
      if (storeCoupon && storeCoupon.discountValue) {
        storeDiscountMap.set(storeId, Number(storeCoupon.discountValue));
        totalDiscountValue += Number(storeCoupon.discountValue);
      }
    }
  });
  // Giảm giá từ coupon cart (hệ thống)
  if (appliedCartCoupon && appliedCartCoupon.discountValue) {
    totalDiscountValue += Number(appliedCartCoupon.discountValue);
  }

  // 3. Tính Phí vận chuyển (theo từng cửa hàng - lấy phí cao nhất)
  const storeShippingMap = new Map();
  orderItems.forEach((item) => {
    const storeKey = item.storeId ?? `product-${item.product_variantId}`;
    const fee = item.shippingFee ?? 30000;
    if (!storeShippingMap.has(storeKey) || fee > (storeShippingMap.get(storeKey) ?? 0)) {
      storeShippingMap.set(storeKey, fee);
    }
  });

  let totalShippingFee = Array.from(storeShippingMap.values()).reduce((sum, fee) => sum + fee, 0);
  
  // Giảm phí ship từ shipping code
  const shippingDiscount = appliedShippingCode?.discountValue || 0;
  totalShippingFee = Math.max(0, totalShippingFee - shippingDiscount);

  // 4. Tổng thanh toán cuối cùng
  const totalPayment = productSubtotal - totalDiscountValue + totalShippingFee;

  // ==================== NHÓM SẢN PHẨM THEO STORE ====================
  const groupItemsByStore = () => {
    if (!orderItems || orderItems.length === 0) return {};

    const grouped = {};
    orderItems.forEach((item) => {
      const storeId = item.storeId || `product-${item.product_variantId}`;
      const storeName = storeNames[storeId] || item.storeName || "Đang tải tên cửa hàng...";

      if (!grouped[storeId]) {
        grouped[storeId] = {
          storeId,
          storeName,
          items: [],
        };
      }
      grouped[storeId].items.push(item);
    });

    return grouped;
  };

  const groupedStores = groupItemsByStore();

  // ------------------- LOGIC ĐẶT HÀNG (API) -------------------
  const handlePlaceOrder = async () => {
    if (!mainAddress) {
      alert("Vui lòng chọn địa chỉ nhận hàng.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Không có sản phẩm nào được chọn để đặt hàng.");
      return;
    }

    const shippingAddressString = `${mainAddress.detail_address}${mainAddress.village ? `, ${mainAddress.village}` : ""}, ${mainAddress.city}`;

    // Nhóm orderItems theo store và tạo payload cho mỗi store
    const ordersByStore = {};
    orderItems.forEach(item => {
      const storeId = item.storeId || `product-${item.product_variantId}`;
      if (!ordersByStore[storeId]) {
        ordersByStore[storeId] = {
          product_variantIds: [],
          quantities: [],
          items: []
        };
      }
      ordersByStore[storeId].product_variantIds.push(item.product_variantId);
      ordersByStore[storeId].quantities.push(item.qty);
      ordersByStore[storeId].items.push(item);
    });

    // Chọn endpoint dựa trên phương thức thanh toán
    const checkoutEndpoint = paymentMethod === "WALLET"
      ? `${backendURL}/orders/checkout-wallet`
      : `${backendURL}/orders/checkout-cash`;

    try {
      // Tạo order cho từng store
      const orderPromises = Object.entries(ordersByStore).map(async ([storeId, storeData]) => {
        // Lấy coupon IDs: 1 coupon store + 1 coupon system (nếu có)
        const storeCoupon = appliedStoreCoupons[storeId];
        const couponIds = [];

        // 1. Thêm coupon của store (nếu có)
        if (storeCoupon && storeCoupon.couponId) {
          couponIds.push(storeCoupon.couponId);
        }

        // 2. Thêm coupon hệ thống (nếu có)
        if (appliedCartCoupon && appliedCartCoupon.couponId) {
          couponIds.push(appliedCartCoupon.couponId);
        }

        const orderPayload = {
          products: {
            product_variantIds: storeData.product_variantIds,
            storeId: storeId,
            coupon_ids: couponIds,
            shipping_code_id: null,
            quantities: storeData.quantities
          },
          shipping_address: shippingAddressString
        };

        console.log(`📦 Order payload (${paymentMethod}):`, JSON.stringify(orderPayload, null, 2));

        const res = await axios.post(
          checkoutEndpoint,
          orderPayload,
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );

        return res.data;
      });

      const results = await Promise.all(orderPromises);

      // Kiểm tra tất cả orders đều thành công
      const allSuccess = results.every(res => res.status === "success");

      if (allSuccess) {
        const methodText = paymentMethod === "WALLET" ? "thanh toán qua Ví KOHI" : "COD";
        toast.success(`Đã đặt ${results.length} đơn hàng thành công (${methodText})!`);
        await fetchMyCart();
        localStorage.removeItem("checkedItems");
        localStorage.removeItem("quantities");
        localStorage.removeItem("buyNowItems");
        localStorage.removeItem("appliedStoreCoupons");
        localStorage.removeItem("appliedCartCoupon");
        navigate("/");
      } else {
        const failedOrders = results.filter(res => res.status !== "success");
        alert(`Có ${failedOrders.length} đơn hàng đặt thất bại!`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi đặt hàng:", error);
      alert(error.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* ===================== ĐỊA CHỈ NHẬN HÀNG ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg text-[#116AD1] border-b pb-2">
                🏠 Địa chỉ nhận hàng
              </div>

              {/* Hiển thị địa chỉ chính */}
              {mainAddress && !showAddressForm && !showAddressList ? (
                <div className="mt-3 text-sm">
                  <div className="font-medium">
                    {clientUser.username || "Người nhận"} • {clientUser.phone || "Số điện thoại"}{" "}
                    <span className="text-xs text-green-600 border border-green-600 px-1 rounded ml-1">
                      Mặc định
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {mainAddress.detail_address}
                    {mainAddress.village && `, ${mainAddress.village}`}
                    {mainAddress.city && `, ${mainAddress.city}`}
                  </div>
                  <button
                    className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1] hover:bg-[#116AD1] hover:text-white transition-colors"
                    onClick={handleShowAddressList}
                  >
                    Đổi địa chỉ
                  </button>
                </div>
              ) : null}

              {/* Hiển thị form thêm/sửa địa chỉ */}
              {showAddressForm && (
                <div className="mt-3 space-y-3 text-sm">
                  {mainAddress && (
                    <button
                      className="text-sm text-red-500 underline mb-2"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                        setFormData({ city: "", village: "", detail_address: "" });
                      }}
                    >
                      Hủy và quay lại
                    </button>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Người nhận: <span className="font-medium">{clientUser.username || "Chưa có tên"}</span> • {clientUser.phone || "Chưa có SĐT"}
                  </div>

                  <input
                    name="city"
                    placeholder="Tỉnh/Thành phố *"
                    value={formData.city}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="village"
                    placeholder="Quận/Huyện/Xã"
                    value={formData.village}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <textarea
                    name="detail_address"
                    placeholder="Địa chỉ chi tiết (Số nhà, tên đường) *"
                    value={formData.detail_address}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2 min-h-[80px]"
                  />
                  <button
                    onClick={handleSaveAddress}
                    className="mt-2 px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] disabled:bg-gray-400"
                    disabled={!formData.city || !formData.detail_address}
                  >
                    {editingAddressId ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
                  </button>
                </div>
              )}

              {/* Hiển thị danh sách địa chỉ */}
              {showAddressList && (
                <div className="mt-3 space-y-3">
                  <div className="text-sm font-medium mb-2">Chọn địa chỉ giao hàng:</div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {allAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          addr.id === mainAddress?.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => {
                          if (addr.id !== mainAddress?.id) {
                            handleSetMainAddress(addr.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {clientUser.full_name || "Người nhận"} • {clientUser.phone || "SĐT"}
                              {addr.id === mainAddress?.id && (
                                <span className="ml-2 text-xs text-green-600 border border-green-600 px-1 rounded">
                                  Đang sử dụng
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {addr.detail_address}
                              {addr.village && `, ${addr.village}`}
                              {addr.city && `, ${addr.city}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                            className="px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Sửa
                          </button>
                          {addr.id !== mainAddress?.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="px-2 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {allAddresses.length === 0 && (
                      <p className="text-center text-gray-500 py-4 text-sm">
                        Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleShowAddressForm}
                    className="w-full py-2 border-2 border-dashed border-[#116AD1] text-[#116AD1] rounded hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    + Thêm địa chỉ mới
                  </button>
                </div>
              )}
            </div>

            {/* ===================== SẢN PHẨM ĐÃ CHỌN ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg border-b pb-2 mb-4">
                🛍️ Sản phẩm đã chọn
              </div>
              <div className="divide-y divide-gray-200">
                {Object.values(groupedStores).map((storeGroup, storeIndex) => (
                  <div
                    key={storeGroup.storeId}
                    className={`${storeIndex > 0 ? "border-t-2 border-gray-300" : ""}`}
                  >
                    {/* Header của Store */}
                    <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏪</span>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-base">
                              {storeGroup.storeName}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {storeGroup.items.length} sản phẩm
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mã giảm giá của Store */}
                      <div className="mt-2 flex items-center gap-2">
                        {appliedStoreCoupons[storeGroup.storeId] ? (
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                            <span className="text-sm font-semibold text-green-700">
                              🎉 {appliedStoreCoupons[storeGroup.storeId].code}
                            </span>
                            <span className="text-sm text-red-600 font-medium">
                              (-{format(appliedStoreCoupons[storeGroup.storeId].discountValue)}₫)
                            </span>
                            <button
                              onClick={() => removeStoreCoupon(storeGroup.storeId)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold ml-1"
                              title="Hủy mã"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenStoreCouponModal(storeGroup.storeId)}
                            className="text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                          >
                            📋 Chọn mã giảm giá của {storeGroup.storeName}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sản phẩm của Store */}
                    <div className="divide-y divide-gray-100">
                      {storeGroup.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 py-4 px-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded object-cover border"
                          />

                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{item.name}</div>

                            <div className="text-sm text-gray-500 flex flex-wrap gap-x-2 mt-1">
                              {item.variantOptions?.length > 0 ? (
                                item.variantOptions
                                  .filter(opt => opt.value !== null && opt.value !== "" && opt.value !== undefined)
                                  .map((opt, i, arr) => (
                                    <span key={i}>
                                      {opt.name}: <span className="font-medium">{opt.value}</span>
                                      {i < arr.length - 1 && " | "}
                                    </span>
                                  ))
                              ) : (
                                <span>Không có tùy chọn</span>
                              )}
                            </div>

                            <div className="text-[#116AD1] font-semibold mt-1">
                              {format(item.price)}₫
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrement(item.id)}
                              className="w-8 h-8 border rounded hover:bg-gray-100 transition"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.qty}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              onBlur={(e) => handleQtyBlur(item.id, e.target.value)}
                              className="w-12 text-center border rounded h-8"
                            />
                            <button
                              onClick={() => increment(item.id)}
                              className="w-8 h-8 border rounded hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>

                          <div className="font-semibold text-gray-800">
                            {format(item.price * item.qty)}₫
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {orderItems.length === 0 && (
                  <div className="py-3 text-gray-500 text-sm">
                    Không có sản phẩm nào được chọn để đặt hàng.
                  </div>
                )}
              </div>
              <Link to="/cart" className="mt-3 text-sm text-[#116AD1] underline block">
                Chỉnh sửa sản phẩm
              </Link>
            </div>

            {/* ===================== MÃ GIẢM GIÁ ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg border-b pb-2 mb-4">
                🏷️ Mã giảm giá hệ thống
              </div>

              <div className="space-y-4">
                {/* Mã giảm giá hệ thống */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Mã giảm giá</span>
                    <button
                      onClick={handleOpenSystemCouponModal}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Chọn mã
                    </button>
                  </div>

                  {appliedCartCoupon ? (
                    <div className="flex justify-between items-center bg-white border border-green-200 rounded px-3 py-2">
                      <span className="text-sm font-semibold text-green-700">
                        {appliedCartCoupon.code}
                      </span>
                      <span className="text-sm text-red-600 font-medium mr-2">
                        -{format(appliedCartCoupon.discountValue)}₫
                      </span>
                      <button
                        onClick={removeCartCoupon}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Chưa áp dụng mã giảm giá.</div>
                  )}
                </div>

                {/* Mã giảm phí ship */}
                {/* <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Mã giảm phí ship</span>
                    <button
                      onClick={handleOpenSystemCouponModal}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Chọn mã
                    </button>
                  </div>

                  {appliedShippingCode ? (
                    <div className="flex justify-between items-center bg-white border border-green-200 rounded px-3 py-2">
                      <span className="text-sm font-semibold text-green-700">
                        {appliedShippingCode.code}
                      </span>
                      <span className="text-sm text-red-600 font-medium mr-2">
                        -{format(appliedShippingCode.discountValue)}₫
                      </span>
                      <button
                        onClick={removeShippingCode}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Chưa áp dụng mã giảm phí ship.</div>
                  )}
                </div> */}
              </div>
            </div>

            {/* ===================== PHƯƠNG THỨC THANH TOÁN ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg border-b pb-2">
                💳 Phương thức thanh toán
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <label className={`flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:border-[#116AD1] ${paymentMethod === "COD" ? "border-[#116AD1] bg-blue-50" : ""}`}>
                  <input
                    name="pm"
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#116AD1]"
                  />
                  COD - Thanh toán khi nhận
                </label>
                <label className={`flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:border-[#116AD1] ${paymentMethod === "WALLET" ? "border-[#116AD1] bg-blue-50" : ""}`}>
                  <input
                    name="pm"
                    type="radio"
                    checked={paymentMethod === "WALLET"}
                    onChange={() => setPaymentMethod("WALLET")}
                    className="accent-[#116AD1]"
                  />
                  Ví KOHI
                </label>
              </div>
            </div>
          </div>

          {/* ===================== TỔNG KẾT THANH TOÁN ===================== */}
          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="font-semibold text-lg border-b pb-2 mb-3">
              💰 Chi tiết thanh toán
            </div>

            {/* Tạm tính */}
            <div className="flex justify-between text-sm py-1">
              <span>Tạm tính</span>
              <span className="font-medium">{format(productSubtotal)}₫</span>
            </div>

            {/* Phí vận chuyển */}
            <div className="flex justify-between text-sm py-1">
              <span>Phí vận chuyển</span>
              <span className="font-medium">{format(totalShippingFee + shippingDiscount)}₫</span>
            </div>

            {/* Giảm phí ship */}
            {shippingDiscount > 0 && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-green-500">Giảm phí ship</span>
                <span className="font-medium text-green-500">
                  -{format(shippingDiscount)}₫
                </span>
              </div>
            )}

            {/* Giảm giá */}
            {totalDiscountValue > 0 && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-red-500">Giảm giá</span>
                <span className="font-medium text-red-500">
                  -{format(totalDiscountValue)}₫
                </span>
              </div>
            )}

            <div className="h-px bg-gray-200 my-3" />

            {/* Tổng thanh toán */}
            <div className="flex justify-between text-xl">
              <span className="font-bold">Tổng thanh toán</span>
              <span className="text-[#116AD1] font-bold">
                {format(Math.round(totalPayment))}₫
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-4 w-full text-center bg-[#116AD1] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#0e57aa] disabled:bg-gray-400"
              disabled={orderItems.length === 0 || !mainAddress || showAddressForm}
            >
              Đặt hàng
            </button>
            <Link
              to="/"
              className="mt-3 block text-center border border-[#116AD1] text-[#116AD1] py-2 rounded-lg hover:bg-[#116AD1] hover:text-white transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* ===================== MODAL STORE COUPON ===================== */}
      {showStoreCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[500px] p-6 relative flex flex-col max-h-[600px]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Mã giảm giá cửa hàng
              </h2>
              <button
                onClick={() => setShowStoreCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Tìm kiếm mã giảm giá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {loadingCoupons ? (
              <p className="text-center text-gray-500 py-8">Đang tải...</p>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-3">
                {couponList
                  .filter((c) => c.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((coupon) => (
                    <div
                      key={coupon.id}
                      onClick={() => applyStoreCoupon(coupon)}
                      className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-lg">
                            {coupon.code}
                          </p>
                          <p className="text-sm text-red-600 font-medium mt-1">
                            Giảm: {format(coupon.discount)}₫
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span>Còn lại: {coupon.quantity}</span>
                            <span>•</span>
                            <span>
                              HSD: {new Date(coupon.expire).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        <span className="text-blue-600 font-medium text-sm whitespace-nowrap ml-3">
                          Áp dụng →
                        </span>
                      </div>
                    </div>
                  ))}

                {couponList.filter((c) =>
                  c.code.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">
                      {searchTerm ? "Không tìm thấy mã phù hợp." : "Không có mã nào."}
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== MODAL SYSTEM COUPON ===================== */}
      {showSystemCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[500px] p-6 relative flex flex-col max-h-[600px]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Mã giảm giá hệ thống
              </h2>
              <button
                onClick={() => setShowSystemCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSystemCouponTab("coupon")}
                className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                  systemCouponTab === "coupon"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🏷️ Mã giảm giá
              </button>
              <button
                onClick={() => setSystemCouponTab("shipping")}
                className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                  systemCouponTab === "shipping"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🚚 Mã giảm phí ship
              </button>
            </div>

            <input
              type="text"
              placeholder="Tìm kiếm mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {loadingCoupons ? (
              <p className="text-center text-gray-500 py-8">Đang tải...</p>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-3">
                {/* Tab Mã giảm giá */}
                {systemCouponTab === "coupon" && (
                  <>
                    {couponList
                      .filter((c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((coupon) => (
                        <div
                          key={coupon.id}
                          onClick={() => applyCouponCart(coupon)}
                          className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{coupon.code}</p>
                              <p className="text-sm text-red-600 font-medium">
                                Giảm: {format(coupon.discount)}₫
                              </p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                <span>Còn: {coupon.quantity}</span>
                                <span>•</span>
                                <span>HSD: {new Date(coupon.expire).toLocaleDateString("vi-VN")}</span>
                              </div>
                            </div>
                            <span className="text-blue-600 font-medium text-sm whitespace-nowrap ml-3">
                              Áp dụng →
                            </span>
                          </div>
                        </div>
                      ))}
                    {couponList.filter((c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-8">
                        {searchTerm ? "Không tìm thấy mã phù hợp." : "Không có mã giảm giá nào."}
                      </p>
                    )}
                  </>
                )}

                {/* Tab Mã giảm phí ship */}
                {systemCouponTab === "shipping" && (
                  <>
                    {shippingCodeList
                      .filter((c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((code) => (
                        <div
                          key={code.id}
                          onClick={() => applyShippingCode(code)}
                          className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{code.code}</p>
                              <p className="text-sm text-green-600 font-medium">
                                Giảm phí ship: {format(code.discount)}₫
                              </p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                <span>Còn: {code.quantity}</span>
                                <span>•</span>
                                <span>HSD: {new Date(code.expire).toLocaleDateString("vi-VN")}</span>
                              </div>
                            </div>
                            <span className="text-green-600 font-medium text-sm whitespace-nowrap ml-3">
                              Áp dụng →
                            </span>
                          </div>
                        </div>
                      ))}
                    {shippingCodeList.filter((c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-8">
                        {searchTerm ? "Không tìm thấy mã phù hợp." : "Không có mã giảm phí ship nào."}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;