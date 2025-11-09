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
  const [appliedCoupons, setAppliedCoupons] = useState(JSON.parse(localStorage.getItem("appliedCoupons") || "{}"));

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
    if (orderItems.length === 0 && checkedItemsFromCart.length === 0) {
      navigate("/cart");
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
  const [selectedCartItemId, setSelectedCartItemId] = useState(null);

  // Mở modal Store Coupon
  const handleOpenStoreCouponModal = async (cartItemId, storeId) => {
    setSelectedCartItemId(cartItemId);
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
      const validCoupons = res.data?.data?.coupons?.filter(c => c.discount > 0 && c.quantity > 0) || [];
      setCouponList(validCoupons);
    } catch (err) {
      console.error("❌ Lỗi khi lấy mã giảm giá hệ thống:", err);
      setCouponList([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Áp dụng coupon
  const applyCoupon = async (code, cartItemId) => {
    const item = orderItems.find(i => i.id === cartItemId);
    if (!item) {
      alert("Không tìm thấy sản phẩm!");
      return;
    }

    try {
      const res = await axios.patch(
        `${backendURL}/carts/apply-coupon`,
        { couponCode: code, product_variantId: item.product_variantId },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        const discountValue = res.data.data?.discountedItem?.discount || 0;
        
        const newAppliedCoupons = {
          ...appliedCoupons,
          [cartItemId]: { code, discountValue: Number(discountValue) }
        };
        
        setAppliedCoupons(newAppliedCoupons);
        localStorage.setItem("appliedCoupons", JSON.stringify(newAppliedCoupons));
        
        toast.success("Áp dụng mã giảm giá thành công!");
        setShowStoreCouponModal(false);
        setShowSystemCouponModal(false);
      } else {
        alert(res.data.message || "Áp dụng mã giảm giá thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi áp mã:", err);
      alert(err.response?.data?.message || "Không thể áp dụng mã giảm giá!");
    }
  };

  // Xóa coupon
  const removeCoupon = (cartItemId) => {
    const newAppliedCoupons = { ...appliedCoupons };
    delete newAppliedCoupons[cartItemId];
    setAppliedCoupons(newAppliedCoupons);
    localStorage.setItem("appliedCoupons", JSON.stringify(newAppliedCoupons));
    toast.success("Đã loại bỏ mã giảm giá!");
  };

  // ------------------- LOGIC TÍNH TOÁN -------------------
  // 1. Tạm tính
  const productSubtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  // 2. Tính tổng giảm giá từ coupons đã áp dụng
  let totalDiscountValue = 0;
  orderItems.forEach(item => {
    const coupon = appliedCoupons[item.id];
    if (coupon && coupon.discountValue) {
      totalDiscountValue += Number(coupon.discountValue);
    }
  });
  
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
    
    const orderData = {
      shipping_address: defaultAddress, 
      order_items: (() => {
        const storeUsed = new Set();
        return orderItems.map(item => {
          const storeKey = item.storeId ?? `product-${item.product_variantId}`;
          const feeForItem = storeUsed.has(storeKey)
            ? 0
            : storeShippingMap.get(storeKey) ?? item.shippingFee ?? 30000;
          storeUsed.add(storeKey);
          return {
            product_variantId: item.product_variantId,
            quantity: item.qty,
            price_at_order: item.price,
            shipping_fee_at_order: feeForItem,
          };
        });
      })(),
      coupon_codes: Object.values(appliedCoupons).map(c => c.code).filter(Boolean),
      total_amount: totalPayment,
      total_shipping_fee: totalShippingFee,
      total_discount: totalDiscountValue,
      payment_method: "COD", 
    };

    try {
      const res = await axios.post(
        `${backendURL}/orders/checkout-cash`,
        orderData,
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );
      
      if (res.data.status === "success") {
        toast.success("Đơn hàng đã được đặt thành công!");
        await fetchMyCart(); 
        localStorage.removeItem("checkedItems");
        localStorage.removeItem("quantities");
        localStorage.removeItem("appliedCoupons");
        navigate(`/order-success/${res.data.data.doc.id}`);
      } else {
        alert(res.data.message || "Đặt hàng thất bại!");
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
              <div className="font-semibold text-lg border-b pb-2">
                🛍️ Sản phẩm đã chọn
              </div>
              <div className="divide-y">
                {orderItems.map((item) => {
                  const appliedCoupon = appliedCoupons[item.id];
                  
                  return (
                    <div key={item.id} className="flex items-start gap-4 py-4">
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
                        
                        {appliedCoupon && (
                          <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
                            <span className="text-xs font-semibold text-green-700">
                              🎉 {appliedCoupon.code}
                            </span>
                            <span className="text-xs text-red-600 font-medium">
                              (-{format(appliedCoupon.discountValue)}₫)
                            </span>
                            <button
                              onClick={() => removeCoupon(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold ml-1"
                              title="Hủy mã"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        
                        {!appliedCoupon && item.storeId && (
                          <button
                            onClick={() => handleOpenStoreCouponModal(item.id, item.storeId)}
                            className="mt-2 text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                          >
                            📋 Chọn mã giảm giá
                          </button>
                        )}
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
                  );
                })}
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
                {/* Mã giảm giá từ cửa hàng */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Mã từ cửa hàng</span>
                  </div>
                  
                  {Object.entries(appliedCoupons).filter(([cartItemId, _]) => {
                    const item = orderItems.find(i => i.id === Number(cartItemId));
                    return item && item.storeId;
                  }).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(appliedCoupons)
                        .filter(([cartItemId, _]) => {
                          const item = orderItems.find(i => i.id === Number(cartItemId));
                          return item && item.storeId;
                        })
                        .map(([cartItemId, coupon]) => {
                          const item = orderItems.find(i => i.id === Number(cartItemId));
                          return (
                            <div key={cartItemId} className="flex justify-between items-center bg-white border border-green-200 rounded px-3 py-2">
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-green-700">
                                  {coupon.code}
                                </span>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Cho: {item?.name}
                                </div>
                              </div>
                              <span className="text-sm text-red-600 font-medium mr-2">
                                -{format(coupon.discountValue)}₫
                              </span>
                              <button
                                onClick={() => removeCoupon(Number(cartItemId))}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Chưa áp dụng mã nào. Chọn mã ở phần sản phẩm bên trên.
                    </div>
                  )}
                </div>

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
                  
                  {Object.entries(appliedCoupons).filter(([cartItemId, _]) => {
                    const item = orderItems.find(i => i.id === Number(cartItemId));
                    return item && !item.storeId;
                  }).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(appliedCoupons)
                        .filter(([cartItemId, _]) => {
                          const item = orderItems.find(i => i.id === Number(cartItemId));
                          return item && !item.storeId;
                        })
                        .map(([cartItemId, coupon]) => (
                          <div key={cartItemId} className="flex justify-between items-center bg-white border border-green-200 rounded px-3 py-2">
                            <span className="text-sm font-semibold text-green-700">
                              {coupon.code}
                            </span>
                            <span className="text-sm text-red-600 font-medium mr-2">
                              -{format(coupon.discountValue)}₫
                            </span>
                            <button
                              onClick={() => removeCoupon(Number(cartItemId))}
                              className="text-red-500 hover:text-red-700 text-sm font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
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
                      onClick={() => applyCoupon(coupon.code, selectedCartItemId)}
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
                <p className="text-sm text-gray-600 mb-3">
                  Chọn sản phẩm để áp dụng mã:
                </p>
                
                {orderItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 mb-3">
                    <div className="font-medium text-gray-800 mb-2">{item.name}</div>
                    
                    {couponList
                      .filter((c) => c.code.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((coupon) => (
                        <div
                          key={coupon.id}
                          onClick={() => applyCoupon(coupon.code, item.id)}
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