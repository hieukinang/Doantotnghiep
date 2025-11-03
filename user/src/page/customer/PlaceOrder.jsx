import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
// 🎯 Import ShopContext từ file bạn vừa gửi
import { ShopContext } from "../../context/ShopContext"; 

// Định nghĩa base URL của API (dùng cho coupon)
const API_BASE_URL = "http://127.0.0.1:5000/api/coupons";
const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const PlaceOrder = () => {
  const navigate = useNavigate();
  // 🎯 Lấy dữ liệu từ ShopContext
  const { cartItems, clientToken, fetchMyCart } = useContext(ShopContext) || { cartItems: [] };

  // Lấy dữ liệu sản phẩm đã chọn và số lượng từ localStorage
  const checkedItemsFromCart = JSON.parse(localStorage.getItem("checkedItems") || "[]");
  const quantitiesFromCart = JSON.parse(localStorage.getItem("quantities") || "{}");

  // 1. Lọc và chuẩn bị danh sách sản phẩm đặt hàng (orderItems)
  const orderItems = cartItems?.filter(item => checkedItemsFromCart.includes(item.id))
    .map(it => {
      // Dữ liệu variant đã được làm giàu trong ShopContext
      const variant = it.CartItemProductVariant; 
      // Giả định product info nằm trong variant (hoặc bạn cần điều chỉnh theo cấu trúc API thật)
      const product = variant?.ProductVariantProduct || { name: "Sản phẩm không rõ tên" }; 
      const storeId = variant?.storeId ?? product.storeId ?? null;
      
      return {
        // ID của CartItem, dùng để xác định sản phẩm đặt hàng
        id: it.id, 
        name: product.name,
        // Lấy giá và phí ship từ variant đã được làm giàu
        price: variant?.price || 0,
        shippingFee: variant?.shipping_fee || 30000, 
        // Lấy số lượng từ localStorage (hoặc mặc định là số lượng trong cartItem nếu không có trong local)
        qty: quantitiesFromCart[it.id] || it.quantity || 1, 
        variantOptions: variant?.options,
        product_variantId: it.product_variantId, // Cần thiết cho API đặt hàng
        storeId, // Cần thiết để xử lý mã Store Coupon
        storeName: variant?.storeName || it.storeName || null,
      };
    }) || [];
    
    // 🔔 Gợi ý: Nếu orderItems rỗng, nên chuyển hướng người dùng về trang giỏ hàng
    useEffect(() => {
        if (!clientToken) {
            navigate("/login");
            return;
        }
        if (orderItems.length === 0 && checkedItemsFromCart.length > 0) {
            // Trường hợp dữ liệu giỏ hàng bị mất đồng bộ
            fetchMyCart(); 
        } else if (orderItems.length === 0 && checkedItemsFromCart.length === 0) {
             // navigate("/cart"); // Có thể cân nhắc chuyển về trang giỏ hàng
        }
    }, [clientToken, cartItems]);


  // ------------------- LOGIC ADDRESS -------------------
  // ... (Giữ nguyên logic địa chỉ từ phiên bản trước)
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
  const [appliedStoreCoupon, setAppliedStoreCoupon] = useState(null);
  const [appliedSystemCoupon, setAppliedSystemCoupon] = useState(null);
  const [appliedShipCoupon, setAppliedShipCoupon] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  
  // Sử dụng axios để gọi API giống trong ShopContext
  const fetchCouponByCode = async (code) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/find-by-code?code=${code}`);
      
      if (res.data.status !== "success" || !res.data.data?.doc) {
        throw new Error("Mã giảm giá không hợp lệ, không tồn tại hoặc đã hết hạn.");
      }
      return res.data.data.doc;
    } catch (error) {
      console.error("Lỗi khi tìm mã giảm giá:", error);
      alert(error.message || "Đã xảy ra lỗi khi áp dụng mã.");
      return null;
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput) return;
    const code = couponCodeInput.trim().toUpperCase();
    const coupon = await fetchCouponByCode(code);

    if (coupon) {
      // ⚠️ Cần điều chỉnh logic phân loại dựa trên cấu trúc API thật của bạn
      const type = coupon.is_shipping_coupon ? 'SHIP' : 
                   (coupon.stores && coupon.stores.length > 0) ? 'STORE' : 
                   'SYSTEM'; 

      // Kiểm tra Store Coupon có áp dụng được cho sản phẩm đã chọn không
      if (type === 'STORE') {
        // Lấy ID cửa hàng của sản phẩm đầu tiên được chọn (giả định Store Coupon chỉ áp dụng cho 1 cửa hàng)
        const selectedStoreId = orderItems[0]?.storeId; 
        
        // Giả định: Coupon có danh sách `stores`
        if (!coupon.stores?.includes(selectedStoreId)) {
            alert("Mã này chỉ áp dụng cho cửa hàng khác.");
            return;
        }
        setAppliedStoreCoupon(coupon);

      } else if (type === 'SYSTEM') {
        setAppliedSystemCoupon(coupon);
      } else if (type === 'SHIP') {
        setAppliedShipCoupon(coupon);
      }
      
      alert(`Áp dụng thành công mã: ${coupon.code}`);
      setCouponCodeInput("");
    }
  };

  // ------------------- LOGIC TÍNH TOÁN -------------------

  // 1. Tạm tính (Subtotal)
  const productSubtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  // 2. Tính giảm giá hàng hóa (STORE + SYSTEM)
  let productDiscount = 0;
  
  // Giảm giá từ mã STORE 
  if (appliedStoreCoupon) {
      // **Chỉ áp dụng cho các sản phẩm của cửa hàng tương ứng**
      const applicableSubtotal = orderItems.filter(i => i.storeId === appliedStoreCoupon.stores[0])
                                            .reduce((s, i) => s + i.price * i.qty, 0);
      
      if (appliedStoreCoupon.is_percent) {
          let discountAmount = applicableSubtotal * (appliedStoreCoupon.discount_value / 100);
          productDiscount += Math.min(discountAmount, appliedStoreCoupon.max_discount || Infinity);
      } else {
          productDiscount += appliedStoreCoupon.discount_value || 0;
      }
  }
  
  // Giảm giá từ mã SYSTEM 
  if (appliedSystemCoupon) {
      if (appliedSystemCoupon.is_percent) {
          let discountRate = appliedSystemCoupon.discount_value / 100;
          let discountAmount = productSubtotal * discountRate;
          productDiscount += Math.min(discountAmount, appliedSystemCoupon.max_discount || Infinity);
      } else {
          productDiscount += appliedSystemCoupon.discount_value || 0;
      }
  }
  
  // 3. Tính Phí vận chuyển gốc (theo từng cửa hàng)
  const storeShippingMap = new Map();
  orderItems.forEach((item) => {
      const storeKey = item.storeId ?? `product-${item.product_variantId}`;
      const fee = item.shippingFee ?? 30000;
      if (!storeShippingMap.has(storeKey) || fee > (storeShippingMap.get(storeKey) ?? 0)) {
          storeShippingMap.set(storeKey, fee);
      }
  });

  const baseShippingFee = Array.from(storeShippingMap.values()).reduce(
      (sum, fee) => sum + fee,
      0
  );
  let finalShippingFee = baseShippingFee;
  let shipDiscount = 0;

  // 4. Tính giảm giá vận chuyển (SHIP)
  if (appliedShipCoupon) {
      if (appliedShipCoupon.is_free_shipping) {
          shipDiscount = baseShippingFee;
          finalShippingFee = 0;
      } else if (appliedShipCoupon.discount_value) {
          shipDiscount = appliedShipCoupon.discount_value;
          finalShippingFee = Math.max(0, baseShippingFee - shipDiscount);
      }
  }

  // Tổng giảm giá (Hàng hóa + Ship)
  const totalDiscount = productDiscount + shipDiscount;

  // 5. Tổng thanh toán cuối cùng
  const totalPayment = productSubtotal - productDiscount + finalShippingFee;

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
    
    // Chuẩn bị dữ liệu để gửi lên API đặt hàng
    const orderData = {
        // Địa chỉ nhận hàng
        shipping_address: defaultAddress, 
        
        // Chi tiết sản phẩm
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
        
        // Mã giảm giá
        coupon_codes: [
            appliedStoreCoupon?.code,
            appliedSystemCoupon?.code,
            appliedShipCoupon?.code,
        ].filter(Boolean),
        
        // Tính toán tổng tiền
        total_amount: totalPayment,
        total_shipping_fee: finalShippingFee,
        total_discount: totalDiscount,
        
        // Phương thức thanh toán (cần lấy từ input người dùng)
        payment_method: "COD", 
    };

    try {
        const res = await axios.post(
            `${backendURL}/orders/checkout-cash`, // Giả định API đặt hàng là /api/orders
            orderData,
            { headers: { Authorization: `Bearer ${clientToken}` } }
        );
        
        if (res.data.status === "success") {
            toast.success("Đơn hàng đã được đặt thành công!");
            // 🎯 Sau khi đặt hàng thành công, gọi lại fetchMyCart để làm mới giỏ hàng
            await fetchMyCart(); 
            // Xóa checkedItems và quantities khỏi localStorage
            localStorage.removeItem("checkedItems");
            localStorage.removeItem("quantities");
            navigate(`/order-success/${res.data.data.doc.id}`); // Chuyển hướng đến trang thành công
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
                    **{defaultAddress.name}** • {defaultAddress.phone}{" "}
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
                🛍️ Sản phẩm
              </div>
              <div className="divide-y">
                {orderItems.map((i) => (
                  <div key={i.id} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex-1 pr-4">
                        <span className="font-medium text-gray-800">{i.name}</span> x{i.qty}
                        <div className="text-xs text-gray-500">
                            {i.variantOptions?.length > 0 && 
                                i.variantOptions
                                .filter(opt => opt.value)
                                .map((opt, idx) => (
                                    <span key={idx} className="mr-2">
                                        {opt.name}: {opt.value}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="font-semibold">{format(i.price * i.qty)}₫</div>
                  </div>
                ))}
                {orderItems.length === 0 && (
                    <div className="py-3 text-gray-500 text-sm">Không có sản phẩm nào được chọn để đặt hàng.</div>
                )}
              </div>
              <Link to="/cart" className="mt-3 text-sm text-[#116AD1] underline block">
                Chỉnh sửa sản phẩm
              </Link>
            </div>

            {/* ===================== MÃ GIẢM GIÁ (API) ===================== */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold text-lg border-b pb-2">
                🏷️ Mã giảm giá
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
                    disabled={!couponCodeInput}
                >
                    Áp dụng
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="text-gray-700 font-medium">Mã đã áp dụng:</div>
                
                <div className="border p-3 rounded bg-gray-50">
                    <div className="font-medium">Mã từ cửa hàng:</div>
                    {appliedStoreCoupon ? (
                        <div className="flex justify-between items-center text-green-600 mt-1">
                            <span>**{appliedStoreCoupon.code}** (Giảm: {appliedStoreCoupon.is_percent ? appliedStoreCoupon.discount_value + "%" : format(appliedStoreCoupon.discount_value) + "₫"})</span>
                            <button onClick={() => setAppliedStoreCoupon(null)} className="text-red-500 text-xs underline">Hủy</button>
                        </div>
                    ) : (
                        <div className="text-gray-500 mt-1">Chưa áp dụng.</div>
                    )}
                </div>
                
                <div className="border p-3 rounded bg-gray-50">
                    <div className="font-medium">Mã toàn hệ thống (sản phẩm):</div>
                    {appliedSystemCoupon ? (
                        <div className="flex justify-between items-center text-green-600 mt-1">
                            <span>**{appliedSystemCoupon.code}** (Giảm: {appliedSystemCoupon.is_percent ? appliedSystemCoupon.discount_value + "%" : format(appliedSystemCoupon.discount_value) + "₫"})</span>
                            <button onClick={() => setAppliedSystemCoupon(null)} className="text-red-500 text-xs underline">Hủy</button>
                        </div>
                    ) : (
                        <div className="text-gray-500 mt-1">Chưa áp dụng.</div>
                    )}
                </div>

                <div className="border p-3 rounded bg-gray-50">
                    <div className="font-medium">Mã vận chuyển:</div>
                    {appliedShipCoupon ? (
                        <div className="flex justify-between items-center text-green-600 mt-1">
                            <span>**{appliedShipCoupon.code}** (Giảm: {appliedShipCoupon.is_free_shipping ? "Miễn phí" : format(appliedShipCoupon.discount_value) + "₫"})</span>
                            <button onClick={() => setAppliedShipCoupon(null)} className="text-red-500 text-xs underline">Hủy</button>
                        </div>
                    ) : (
                        <div className="text-gray-500 mt-1">Chưa áp dụng.</div>
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
                {/* ⚠️ Cần thêm logic lưu trữ phương thức thanh toán đã chọn */}
                <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:border-[#116AD1]">
                  <input name="pm" type="radio" defaultChecked className="accent-[#116AD1]" />
                  **COD** - Thanh toán khi nhận
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
              <span>Tạm tính (Giá gốc)</span>
              <span className="font-medium">{format(productSubtotal)}₫</span>
            </div>
            
            {/* Giảm giá hàng hóa */}
            <div className="flex justify-between text-sm py-1">
                <span className={productDiscount > 0 ? "text-red-500" : ""}>Giảm giá hàng hóa</span>
                <span className={`font-medium ${productDiscount > 0 ? "text-red-500" : ""}`}>
                    - {format(Math.round(productDiscount))}₫
                </span>
            </div>
            
            {/* Phí vận chuyển gốc */}
            <div className="flex justify-between text-sm py-1">
              <span>Phí vận chuyển (Gốc)</span>
              <span className="font-medium">{format(baseShippingFee)}₫</span>
            </div>
            
            {/* Giảm phí vận chuyển */}
            <div className="flex justify-between text-sm py-1">
                <span className={shipDiscount > 0 ? "text-red-500" : ""}>Giảm phí vận chuyển</span>
                <span className={`font-medium ${shipDiscount > 0 ? "text-red-500" : ""}`}>
                    - {format(Math.round(shipDiscount))}₫
                </span>
            </div>
            
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
    </div>
  );
};

export default PlaceOrder;