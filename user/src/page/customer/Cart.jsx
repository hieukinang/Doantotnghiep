import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";

const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, fetchMyCart, removeFromCart, clientToken, backendURL } =
    useContext(ShopContext);

  const [checkedItems, setCheckedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductVariantId, setSelectedProductVariantId] = useState(null);

  // State lưu mã giảm giá đã áp dụng
  const [appliedCoupons, setAppliedCoupons] = useState({});

  // ==================== LOAD INITIAL DATA ====================
  useEffect(() => {
    fetchMyCart();

    // Load trạng thái từ localStorage
    const savedChecked = JSON.parse(localStorage.getItem("checkedItems") || "[]");
    const savedQuantities = JSON.parse(localStorage.getItem("quantities") || "{}");
    const savedCoupons = JSON.parse(localStorage.getItem("appliedCoupons") || "{}");
    
    if (savedChecked.length > 0) setCheckedItems(savedChecked);
    if (Object.keys(savedQuantities).length > 0) setQuantities(savedQuantities);
    if (Object.keys(savedCoupons).length > 0) {
      setAppliedCoupons(savedCoupons);
      console.log("🎟️ Loaded coupons from localStorage:", savedCoupons);
    }
  }, []);

  // ==================== ĐỒNG BỘ STATE KHI CART ITEMS THAY ĐỔI ====================
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const qtyObj = {};

      cartItems.forEach((item) => {
        // Đồng bộ số lượng
        qtyObj[item.id] = quantities[item.id] || item.quantity || 1;
      });

      setQuantities(qtyObj);

      // Cập nhật checkedItems (giữ nguyên các item đã check nếu vẫn còn trong cart)
      if (checkedItems.length === 0) {
        setCheckedItems(cartItems.map((item) => item.id));
      } else {
        setCheckedItems((prev) =>
          prev.filter((id) => cartItems.some((item) => item.id === id))
        );
      }

      // ✅ Dọn dẹp appliedCoupons: Xóa các coupon của item không còn trong cart
      setAppliedCoupons((prev) => {
        const cleanedCoupons = {};
        const currentCartItemIds = new Set(cartItems.map(item => item.id));
        
        Object.keys(prev).forEach(cartItemId => {
          if (currentCartItemIds.has(Number(cartItemId))) {
            cleanedCoupons[cartItemId] = prev[cartItemId];
          } else {
            console.log(`🧹 Removed coupon for deleted item ${cartItemId}`);
          }
        });
        
        return cleanedCoupons;
      });
    } else {
      setQuantities({});
      setCheckedItems([]);
      setAppliedCoupons({});
    }
  }, [cartItems]);

  // ==================== LƯU TRẠNG THÁI VÀO LOCALSTORAGE ====================
  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    localStorage.setItem("appliedCoupons", JSON.stringify(appliedCoupons));
    console.log("💾 Saved coupons to localStorage:", appliedCoupons);
  }, [appliedCoupons]);

  // ==================== XỬ LÝ SỐ LƯỢNG ====================
  const handleQtyChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleQtyBlur = (id, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    setQuantities((prev) => ({ ...prev, [id]: num }));
  };

  const increment = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Number(prev[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Number(prev[id] || 1) - 1),
    }));
  };

  // ==================== XÓA SẢN PHẨM ====================
  const handleRemove = async (productVariantId) => {
    const cartItem = cartItems.find(
      (item) => item.product_variantId === productVariantId
    );
    if (cartItem) {
      setCheckedItems((prev) => prev.filter((id) => id !== cartItem.id));
      
      // ✅ Xóa coupon của item này
      setAppliedCoupons((prev) => {
        const newState = { ...prev };
        delete newState[cartItem.id];
        console.log(`🗑️ Removed coupon for item ${cartItem.id}`);
        return newState;
      });
    }
    await removeFromCart(productVariantId);
  };

  // ==================== ĐẶT HÀNG ====================
  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
      return;
    }
    navigate("/place-order");
  };

  // ==================== CHỌN TẤT CẢ ====================
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(cartItems.map((item) => item.id));
    } else {
      setCheckedItems([]);
    }
  };

  // ==================== TÍNH TỔNG TIỀN ====================
  let subtotal = 0;
  let totalShippingFee = 0;
  let totalDiscountValue = 0;

  if (cartItems && cartItems.length > 0) {
    const storeShippingMap = new Map();

    cartItems.forEach((it) => {
      const isChecked = checkedItems.includes(it.id);
      if (!isChecked) return;

      const variant = it.CartItemProductVariant;
      const product = variant?.ProductVariantProduct;
      const price = variant?.price || 0;
      const qty = quantities[it.id] || it.quantity || 1;
      const appliedCoupon = appliedCoupons[it.id];

      // Tính tạm tính
      subtotal += price * qty;

      // ✅ Tính tổng giảm giá - CHỈ TÍNH 1 LẦN cho mỗi sản phẩm
      if (appliedCoupon && appliedCoupon.discountValue) {
        totalDiscountValue += Number(appliedCoupon.discountValue);
      }

      // Tính phí vận chuyển (theo shop)
      const storeId =
        variant?.storeId ??
        product?.storeId ??
        `product-${product?.id ?? variant?.productId ?? it.product_variantId ?? it.id}`;
      const storeShippingFee = variant?.shipping_fee ?? 30000;

      if (!storeShippingMap.has(storeId)) {
        storeShippingMap.set(storeId, storeShippingFee);
      } else {
        const currentFee = storeShippingMap.get(storeId) ?? 0;
        if (storeShippingFee > currentFee) {
          storeShippingMap.set(storeId, storeShippingFee);
        }
      }
    });

    totalShippingFee = Array.from(storeShippingMap.values()).reduce(
      (sum, fee) => sum + fee,
      0
    );
  }

  const totalAmount = subtotal + totalShippingFee - totalDiscountValue;

  // ==================== XỬ LÝ COUPON ====================
  const handleOpenStoreCouponModal = async (storeId, productVariantId) => {
    setSelectedProductVariantId(productVariantId);
    setIsModalOpen(true);
    setLoadingCoupons(true);
    setSearchTerm("");
    setCouponList([]);

    try {
      const res = await axios.get(`${backendURL}/coupons/from-store/${storeId}`);
      const validCoupons =
        res.data?.data?.coupons?.filter(
          (c) => c.discount > 0 && c.quantity > 0
        ) || [];
      setCouponList(validCoupons);
      console.log("📋 Danh sách coupon:", validCoupons);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách mã giảm giá:", err);
      setCouponList([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const applyCoupon = async (code, productVariantId) => {
    if (!productVariantId || !clientToken) {
      alert("Lỗi: Không đủ thông tin để áp dụng mã giảm giá!");
      return;
    }

    try {
      console.log("🎟️ Đang áp dụng coupon:", { code, productVariantId });
      
      const res = await axios.patch(
        `${backendURL}/carts/apply-coupon`,
        { couponCode: code, product_variantId: productVariantId },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      console.log("📦 Response từ API:", res.data);

      if (res.data.status === "success") {
        // ✅ Lấy discount value từ response
        const discountedItem = res.data.data?.discountedItem;
        const discountValue = discountedItem?.discount || 0;

        console.log("💰 Discount value:", discountValue);

        // ✅ Tìm cart item ID
        const cartItem = cartItems.find(
          (item) => item.product_variantId === productVariantId
        );

        if (cartItem) {
          // ✅ Cập nhật state appliedCoupons
          setAppliedCoupons((prev) => ({
            ...prev,
            [cartItem.id]: {
              code: code,
              discountValue: Number(discountValue),
            },
          }));
          
          console.log("✅ Đã cập nhật appliedCoupons:", {
            cartItemId: cartItem.id,
            code,
            discountValue,
          });

          alert("Áp dụng mã giảm giá thành công!");
        }

        handleCloseModal();
      } else {
        alert(
          "Áp dụng mã giảm giá thất bại: " +
            (res.data.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      console.error("❌ Lỗi áp mã:", err);
      const errorMsg =
        err.response?.data?.message || "Không thể áp dụng mã giảm giá!";
      alert(errorMsg);
    }
  };

  const removeCoupon = (cartItemId) => {
    // ✅ Xóa khỏi state local (và tự động lưu vào localStorage qua useEffect)
    setAppliedCoupons((prev) => {
      const newState = { ...prev };
      delete newState[cartItemId];
      console.log(`🗑️ Removed coupon for cart item ${cartItemId}`);
      return newState;
    });
    
    alert("Đã loại bỏ mã giảm giá!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCouponList([]);
    setSearchTerm("");
    setSelectedProductVariantId(null);
  };

  const isAllChecked =
    cartItems &&
    cartItems.length > 0 &&
    checkedItems.length === cartItems.length;

  // ==================== JSX ====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===================== GIỎ HÀNG ===================== */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b font-semibold text-lg flex items-center gap-3">
              Giỏ hàng của bạn
              {cartItems?.length > 0 && (
                <label className="text-sm font-normal flex items-center">
                  <input
                    type="checkbox"
                    className="accent-[#116AD1] w-4 h-4 mr-1"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                  Chọn tất cả
                </label>
              )}
            </div>

            {!cartItems || cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                🛒 Giỏ hàng trống.{" "}
                <Link to="/" className="text-[#116AD1] underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {cartItems.map((it) => {
                  const id = it.id;
                  const variant = it.CartItemProductVariant;
                  const product = variant?.ProductVariantProduct;
                  const name = product?.name || "Không có tên sản phẩm";
                  const img = product?.main_image;
                  const price = variant?.price || 0;
                  const shipping = variant?.shipping_fee || 30000;
                  const qty = quantities[id] || it.quantity || 1;

                  // ✅ Lấy coupon từ state (localStorage)
                  const appliedCoupon = appliedCoupons[id];

                  return (
                    <div
                      key={id}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#116AD1] w-5 h-5 mt-1"
                        checked={checkedItems.includes(id)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setCheckedItems((prev) => [...prev, id]);
                          else
                            setCheckedItems((prev) =>
                              prev.filter((x) => x !== id)
                            );
                        }}
                      />
                      <img
                        src={img}
                        alt={name}
                        className="w-20 h-20 rounded object-cover border"
                      />

                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {name}
                        </div>
                        <div className="text-sm text-gray-500 flex flex-wrap gap-x-2">
                          {variant?.options?.length > 0 ? (
                            variant.options
                              .filter(
                                (opt) =>
                                  opt.value !== null &&
                                  opt.value !== "" &&
                                  opt.value !== undefined
                              )
                              .map((opt, i, arr) => (
                                <span key={i}>
                                  {opt.name}:{" "}
                                  <span className="font-medium">
                                    {opt.value}
                                  </span>
                                  {i < arr.length - 1 && " | "}
                                </span>
                              ))
                          ) : (
                            <span>Không có tùy chọn</span>
                          )}
                        </div>

                        <div className="text-[#116AD1] font-semibold mt-1">
                          {format(price)}₫
                        </div>
                        <div className="text-sm text-gray-500">
                          Phí vận chuyển: {format(shipping)}₫
                        </div>

                        {/* ✅ Hiển thị mã giảm giá đã áp dụng */}
                        {appliedCoupon ? (
                          <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-fit">
                            <span className="text-sm font-semibold text-green-700">
                              🎉 {appliedCoupon.code}
                            </span>
                            <span className="text-sm text-red-600 font-medium">
                              (-{format(appliedCoupon.discountValue)}₫)
                            </span>
                            <button
                              onClick={() => removeCoupon(id)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold ml-1"
                              title="Hủy mã"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              const storeId =
                                variant?.storeId ??
                                product?.storeId ??
                                `product-${product?.id ?? variant?.productId ?? it.product_variantId ?? it.id}`;
                              handleOpenStoreCouponModal(
                                storeId,
                                it.product_variantId
                              );
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                          >
                            📋 Chọn mã giảm giá
                          </button>
                        )}
                      </div>

                      {/* Điều chỉnh số lượng */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrement(id)}
                          className="w-8 h-8 border rounded hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={qty}
                          onChange={(e) => handleQtyChange(id, e.target.value)}
                          onBlur={(e) => handleQtyBlur(id, e.target.value)}
                          className="w-12 text-center border rounded h-8"
                        />
                        <button
                          onClick={() => increment(id)}
                          className="w-8 h-8 border rounded hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(it.product_variantId)}
                        className="px-3 py-2 text-sm rounded text-white bg-red-500 hover:bg-red-600 transition mt-1"
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===================== TỔNG KẾT ===================== */}
          <div className="bg-white rounded-lg shadow p-5 h-fit sticky top-24">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Tổng đơn hàng
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Tạm tính</span>
                <span className="font-semibold">{format(subtotal)}₫</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển</span>
                <span className="font-semibold">
                  {totalShippingFee === 0
                    ? "Miễn phí"
                    : format(totalShippingFee) + "₫"}
                </span>
              </div>

              {totalDiscountValue > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Mã giảm giá</span>
                  <span className="text-green-600 font-semibold">
                    -{format(totalDiscountValue)}₫
                  </span>
                </div>
              )}

              <div className="h-px bg-gray-200 my-3" />

              <div className="flex justify-between text-lg">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-[#116AD1] font-bold text-xl">
                  {format(totalAmount)}₫
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-5 w-full text-center bg-[#116AD1] text-white py-3 rounded-lg hover:bg-[#0e57aa] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
              disabled={checkedItems.length === 0}
            >
              Đặt hàng ({checkedItems.length})
            </button>

            <Link
              to="/"
              className="mt-3 block text-center border border-[#116AD1] text-[#116AD1] py-3 rounded-lg hover:bg-[#116AD1] hover:text-white font-medium transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* ===================== MODAL COUPON ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[500px] p-6 relative flex flex-col max-h-[600px]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Chọn mã giảm giá
              </h2>
              <button
                onClick={handleCloseModal}
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
              <p className="text-center text-gray-500 py-8">
                Đang tải danh sách mã giảm giá...
              </p>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-3">
                {couponList
                  .filter((c) =>
                    c.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((coupon) => (
                    <div
                      key={coupon.id}
                      onClick={() =>
                        applyCoupon(coupon.code, selectedProductVariantId)
                      }
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
                              HSD:{" "}
                              {new Date(coupon.expire).toLocaleDateString(
                                "vi-VN"
                              )}
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
                    {searchTerm
                      ? "Không tìm thấy mã giảm giá phù hợp."
                      : "Không có mã giảm giá nào cho shop này."}
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

export default Cart;