import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:5000/api";
const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, clientToken, fetchMyCart, backendURL } = useContext(ShopContext) || { cartItems: [] };

  // Lấy dữ liệu từ localStorage
  const checkedItemsFromCart = JSON.parse(localStorage.getItem("checkedItems") || "[]");
  const [quantities, setQuantities] = useState(JSON.parse(localStorage.getItem("quantities") || "{}"));
  const [appliedStoreCoupons, setAppliedStoreCoupons] = useState(JSON.parse(localStorage.getItem("appliedStoreCoupons") || "{}"));
  const [appliedCartCoupon, setAppliedCartCoupon] = useState(JSON.parse(localStorage.getItem("appliedCartCoupon") || "null"));

  // Chuẩn bị orderItems
  const orderItems = cartItems?.filter(item => checkedItemsFromCart.includes(item.id))
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

  useEffect(() => {
    if (!clientToken) {
      navigate("/login");
      return;
    }
  }, [clientToken, cartItems, navigate]);

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
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", city: "", ward: "", address: "", isDefault: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("defaultAddress");
    if (saved) {
      const addr = JSON.parse(saved);
      setDefaultAddress(addr);
    } else {
      setShowAddressForm(true);
    }
  }, []);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Vui lòng điền đủ thông tin địa chỉ.");
      return;
    }
    setDefaultAddress(formData);
    setShowAddressForm(false);
    if (formData.isDefault) {
      localStorage.setItem("defaultAddress", JSON.stringify(formData));
    }
  };

  // ------------------- LOGIC COUPON (API CALL) -------------------
  const [showStoreCouponModal, setShowStoreCouponModal] = useState(false);
  const [showSystemCouponModal, setShowSystemCouponModal] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // Mở modal Store Coupon
  const handleOpenStoreCouponModal = async (storeId) => {
    setSelectedStoreId(storeId);
    setShowStoreCouponModal(true);
    setLoadingCoupons(true);
    setSearchTerm("");
    setCouponList([]);

    try {
      const res = await axios.get(`${API_BASE_URL}/coupons/from-store/${storeId}`);
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

    try {
      const res = await axios.get(`${API_BASE_URL}/coupons/from-system`);
      const validCoupons = res.data.data.docs || [];
      setCouponList(validCoupons);
      console.log(validCoupons);
    } catch (err) {
      console.error("❌ Lỗi khi lấy mã giảm giá hệ thống:", err);
      setCouponList([]);
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

  const totalShippingFee = Array.from(storeShippingMap.values()).reduce((sum, fee) => sum + fee, 0);

  // 4. Tổng thanh toán cuối cùng
  const totalPayment = productSubtotal - totalDiscountValue + totalShippingFee;

  // ==================== NHÓM SẢN PHẨM THEO STORE ====================
  const groupItemsByStore = () => {
    if (!orderItems || orderItems.length === 0) return {};

    const grouped = {};
    orderItems.forEach((item) => {
      const storeId = item.storeId || `product-${item.product_variantId}`;
      const storeName = item.storeName || "Cửa hàng không xác định";

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
    if (!defaultAddress || showAddressForm) {
      alert("Vui lòng xác nhận địa chỉ nhận hàng.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Không có sản phẩm nào được chọn để đặt hàng.");
      return;
    }

    // Format địa chỉ
    const shippingAddressString = `${defaultAddress.address}, ${defaultAddress.ward}, ${defaultAddress.city}`;

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
            shipping_code_id: null, // Có thể thêm logic cho shipping code sau
            quantities: storeData.quantities
          },
          shipping_address: shippingAddressString
        };

        console.log("📦 Order payload:", JSON.stringify(orderPayload, null, 2));

        const res = await axios.post(
          `${backendURL}/orders/checkout-cash`,
          orderPayload,
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );

        return res.data;
      });

      const results = await Promise.all(orderPromises);

      // Kiểm tra tất cả orders đều thành công
      const allSuccess = results.every(res => res.status === "success");

      if (allSuccess) {
        toast.success(`Đã đặt ${results.length} đơn hàng thành công!`);
        await fetchMyCart();
        localStorage.removeItem("checkedItems");
        localStorage.removeItem("quantities");
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

  // ------------------- RETURN JSX -------------------
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
              {defaultAddress && !showAddressForm ? (
                <div className="mt-3 text-sm">
                  <div className="font-medium">
                    {defaultAddress.name} • {defaultAddress.phone}{" "}
                    {localStorage.getItem("defaultAddress") && (
                      <span className="text-xs text-green-600 border border-green-600 px-1 rounded ml-1">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    {defaultAddress.address}, {defaultAddress.ward},{" "}
                    {defaultAddress.city}
                  </div>
                  <button
                    className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1] hover:bg-[#116AD1] hover:text-white transition-colors"
                    onClick={() => {
                      setShowAddressForm(true);
                      setFormData(defaultAddress);
                    }}
                  >
                    Thay đổi / Thêm địa chỉ khác
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3 text-sm">
                  {defaultAddress && (
                    <button
                      className="text-sm text-red-500 underline mb-2"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Hủy và dùng địa chỉ mặc định
                    </button>
                  )}
                  <input
                    name="name" placeholder="Họ và tên" value={formData.name} onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="city" placeholder="Tỉnh/Thành phố" value={formData.city} onChange={handleAddressChange}
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      name="ward" placeholder="Xã/Phường" value={formData.ward} onChange={handleAddressChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <input
                    name="address" placeholder="Số nhà, tên đường" value={formData.address} onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleAddressChange}
                      className="accent-[#116AD1]"
                    />
                    Đặt làm địa chỉ mặc định
                  </label>
                  <button
                    onClick={handleSaveAddress}
                    className="mt-2 px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] disabled:bg-gray-400"
                    disabled={!formData.name || !formData.phone || !formData.address}
                  >
                    Lưu địa chỉ
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
                🏷️ Mã giảm giá
              </div>

              <div className="space-y-4">
                {/* Mã giảm giá hệ thống */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Mã toàn hệ thống</span>
                    <button
                      onClick={handleOpenSystemCouponModal}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Chọn mã
                    </button>
                  </div>

                  {appliedCartCoupon ? (
                    <div className="space-y-2">
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
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Chưa áp dụng.</div>
                  )}
                </div>
              </div>
            </div>

            {/* ===================== PHƯƠNG THỨC THANH TOÁN ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg border-b pb-2">
                💳 Phương thức thanh toán
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:border-[#116AD1]">
                  <input name="pm" type="radio" defaultChecked className="accent-[#116AD1]" />
                  COD - Thanh toán khi nhận
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:border-[#116AD1]">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
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
              <span className="font-medium">{format(totalShippingFee)}₫</span>
            </div>

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
              disabled={orderItems.length === 0 || !defaultAddress || showAddressForm}
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
                      onClick={() => applyCouponCart(coupon)}
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all mb-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {coupon.code}
                          </p>
                          <p className="text-sm text-red-600 font-medium">
                            Giảm: {format(coupon.discount)}₫
                          </p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            <span>Còn: {coupon.quantity}</span>
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
    </div>
  );
};

export default PlaceOrder;