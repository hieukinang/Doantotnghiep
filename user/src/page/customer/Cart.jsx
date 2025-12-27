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
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // State lưu mã giảm giá đã áp dụng theo storeId (thay vì cartItemId)
  const [appliedStoreCoupons, setAppliedStoreCoupons] = useState({});

  // State cho tên cửa hàng
  const [storeNames, setStoreNames] = useState({});
  const [loadingStores, setLoadingStores] = useState(true);

  // ==================== LOAD INITIAL DATA ====================
  useEffect(() => {
    fetchMyCart();

    // Load trạng thái từ localStorage
    const savedChecked = JSON.parse(localStorage.getItem("checkedItems") || "[]");
    const savedQuantities = JSON.parse(localStorage.getItem("quantities") || "{}");
    const savedStoreCoupons = JSON.parse(localStorage.getItem("appliedStoreCoupons") || "{}");

    if (savedChecked.length > 0) setCheckedItems(savedChecked);
    if (Object.keys(savedQuantities).length > 0) setQuantities(savedQuantities);
    if (Object.keys(savedStoreCoupons).length > 0) {
      setAppliedStoreCoupons(savedStoreCoupons);
      console.log("🎟️ Loaded store coupons from localStorage:", savedStoreCoupons);
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

      // ✅ Dọn dẹp appliedStoreCoupons: Xóa các coupon của store không còn sản phẩm trong cart
      setAppliedStoreCoupons((prev) => {
        const cleanedCoupons = {};
        const currentStoreIds = new Set();

        cartItems.forEach((item) => {
          const variant = item.CartItemProductVariant;
          const product = variant?.ProductVariantProduct;
          const storeId = variant?.storeId ?? product?.storeId ?? null;
          if (storeId) currentStoreIds.add(storeId);
        });

        Object.keys(prev).forEach(storeId => {
          if (currentStoreIds.has(storeId)) {
            cleanedCoupons[storeId] = prev[storeId];
          } else {
            console.log(`🧹 Removed coupon for deleted store ${storeId}`);
          }
        });

        return cleanedCoupons;
      });
    } else {
      setQuantities({});
      setCheckedItems([]);
      setAppliedStoreCoupons({});
    }
  }, [cartItems]);

  // ==================== FETCH TÊN CỬA HÀNG ====================
  useEffect(() => {
    const fetchStoreNames = async () => {
      if (!cartItems || cartItems.length === 0) {
        setLoadingStores(false);
        return;
      }

      // Lấy danh sách storeId duy nhất từ cartItems
      const storeIds = new Set();
      cartItems.forEach((item) => {
        const variant = item.CartItemProductVariant;
        const product = variant?.ProductVariantProduct;
        const storeId = variant?.storeId ?? product?.storeId ?? null;
        if (storeId) storeIds.add(storeId);
      });

      const uniqueStoreIds = Array.from(storeIds);

      if (uniqueStoreIds.length === 0) {
        setLoadingStores(false);
        return;
      }

      setLoadingStores(true);
      const newStoreNames = {};

      // Fetch tất cả store names song song
      await Promise.all(
        uniqueStoreIds.map(async (storeId) => {
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

    if (cartItems && cartItems.length > 0) {
      fetchStoreNames();
    }
  }, [cartItems?.length, backendURL]);

  // ==================== LƯU TRẠNG THÁI VÀO LOCALSTORAGE ====================
  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    localStorage.setItem("appliedStoreCoupons", JSON.stringify(appliedStoreCoupons));
    console.log("💾 Saved store coupons to localStorage:", appliedStoreCoupons);
  }, [appliedStoreCoupons]);

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

  // Chọn tất cả sản phẩm của một store
  const handleCheckAllStore = (storeItems, e) => {
    const storeItemIds = storeItems.map((item) => item.id);
    if (e.target.checked) {
      // Thêm tất cả sản phẩm của store vào checkedItems
      setCheckedItems((prev) => {
        const newChecked = [...prev];
        storeItemIds.forEach((id) => {
          if (!newChecked.includes(id)) {
            newChecked.push(id);
          }
        });
        return newChecked;
      });
    } else {
      // Xóa tất cả sản phẩm của store khỏi checkedItems
      setCheckedItems((prev) => prev.filter((id) => !storeItemIds.includes(id)));
    }
  };

  // Kiểm tra xem tất cả sản phẩm của store đã được chọn chưa
  const isAllStoreItemsChecked = (storeItems) => {
    if (storeItems.length === 0) return false;
    return storeItems.every((item) => checkedItems.includes(item.id));
  };

  // ==================== TÍNH TỔNG TIỀN ====================
  let subtotal = 0;
  let totalShippingFee = 0;
  let totalDiscountValue = 0;

  if (cartItems && cartItems.length > 0) {
    const storeShippingMap = new Map();

    // Tính discount theo store (mỗi store chỉ tính 1 lần)
    const storeDiscountMap = new Map();

    cartItems.forEach((it) => {
      const isChecked = checkedItems.includes(it.id);
      if (!isChecked) return;

      const variant = it.CartItemProductVariant;
      const product = variant?.ProductVariantProduct;
      const price = variant?.price || 0;
      const qty = quantities[it.id] || it.quantity || 1;

      const storeId =
        variant?.storeId ??
        product?.storeId ??
        `product-${product?.id ?? variant?.productId ?? it.product_variantId ?? it.id}`;

      // Tính tạm tính
      subtotal += price * qty;

      // ✅ Tính tổng giảm giá theo store (mỗi store chỉ tính 1 lần)
      if (storeId && !storeDiscountMap.has(storeId)) {
        const storeCoupon = appliedStoreCoupons[storeId];
        if (storeCoupon && storeCoupon.discountValue) {
          storeDiscountMap.set(storeId, Number(storeCoupon.discountValue));
          totalDiscountValue += Number(storeCoupon.discountValue);
        }
      }

      // Tính phí vận chuyển (theo shop)
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
  const handleOpenStoreCouponModal = async (storeId) => {
    setSelectedStoreId(storeId);
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

  const applyCoupon = async (code) => {
    if (!selectedStoreId || !clientToken) {
      alert("Lỗi: Không đủ thông tin để áp dụng mã giảm giá!");
      return;
    }

    try {
      console.log("🎟️ Đang áp dụng coupon cho store:", { code, storeId: selectedStoreId });

      // Lấy một productVariantId bất kỳ của store để validate coupon
      const storeItems = cartItems.filter((item) => {
        const variant = item.CartItemProductVariant;
        const product = variant?.ProductVariantProduct;
        const storeId = variant?.storeId ?? product?.storeId ?? null;
        return storeId === selectedStoreId;
      });

      if (storeItems.length === 0) {
        alert("Không tìm thấy sản phẩm của cửa hàng này!");
        return;
      }

      const firstItem = storeItems[0];
      const res = await axios.patch(
        `${backendURL}/carts/apply-coupon`,
        { couponCode: code, product_variantId: firstItem.product_variantId },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      console.log("📦 Response từ API:", res.data);

      if (res.data.status === "success") {
        // ✅ Lấy discount value từ response
        const discountedItem = res.data.data?.discountedItem;
        const discountValue = discountedItem?.discount || 0;

        console.log("💰 Discount value:", discountValue);

        // ✅ Cập nhật state appliedStoreCoupons theo storeId
        setAppliedStoreCoupons((prev) => ({
          ...prev,
          [selectedStoreId]: {
            code: code,
            discountValue: Number(discountValue),
          },
        }));

        console.log("✅ Đã cập nhật appliedStoreCoupons:", {
          storeId: selectedStoreId,
          code,
          discountValue,
        });

        alert("Áp dụng mã giảm giá thành công cho toàn bộ cửa hàng!");
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

  const removeStoreCoupon = (storeId) => {
    // ✅ Xóa khỏi state local (và tự động lưu vào localStorage qua useEffect)
    setAppliedStoreCoupons((prev) => {
      const newState = { ...prev };
      delete newState[storeId];
      console.log(`🗑️ Removed coupon for store ${storeId}`);
      return newState;
    });

    alert("Đã loại bỏ mã giảm giá!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCouponList([]);
    setSearchTerm("");
    setSelectedStoreId(null);
  };

  const isAllChecked =
    cartItems &&
    cartItems.length > 0 &&
    checkedItems.length === cartItems.length;

  // ==================== NHÓM SẢN PHẨM THEO STORE ====================
  const groupItemsByStore = () => {
    if (!cartItems || cartItems.length === 0) return {};

    const grouped = {};
    cartItems.forEach((it) => {
      const variant = it.CartItemProductVariant;
      const product = variant?.ProductVariantProduct;
      const storeId =
        variant?.storeId ??
        product?.storeId ??
        `product-${product?.id ?? variant?.productId ?? it.product_variantId ?? it.id}`;
      const storeName = storeNames[storeId] || "Đang tải tên cửa hàng...";

      if (!grouped[storeId]) {
        grouped[storeId] = {
          storeId,
          storeName,
          items: [],
        };
      }
      grouped[storeId].items.push(it);
    });

    return grouped;
  };

  const groupedStores = groupItemsByStore();

  // ==================== JSX ====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ===================== GIỎ HÀNG ===================== */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-3 md:px-5 py-3 md:py-4 border-b font-semibold text-base md:text-lg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
              <div className="p-4 md:p-6 text-center text-gray-500 text-sm md:text-base">
                🛒 Giỏ hàng trống.{" "}
                <Link to="/" className="text-[#116AD1] underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {Object.values(groupedStores).map((storeGroup, storeIndex) => (
                  <div
                    key={storeGroup.storeId}
                    className={`${storeIndex > 0 ? "border-t-2 border-gray-300" : ""
                      }`}
                  >
                    {/* Header của Store */}
                    <div className="px-3 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base md:text-lg">🏪</span>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                              {storeGroup.storeName}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {storeGroup.items.length} sản phẩm
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-xs md:text-sm text-gray-700 cursor-pointer hover:text-[#116AD1] transition-colors">
                          <input
                            type="checkbox"
                            className="accent-[#116AD1] w-4 h-4"
                            checked={isAllStoreItemsChecked(storeGroup.items)}
                            onChange={(e) => handleCheckAllStore(storeGroup.items, e)}
                          />
                          <span className="font-medium">Chọn tất cả</span>
                        </label>
                      </div>

                      {/* Mã giảm giá của Store */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {appliedStoreCoupons[storeGroup.storeId] ? (
                          <div className="flex flex-wrap items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-2 md:px-3 py-1 md:py-1.5">
                            <span className="text-xs md:text-sm font-semibold text-green-700">
                              🎉 {appliedStoreCoupons[storeGroup.storeId].code}
                            </span>
                            <span className="text-xs md:text-sm text-red-600 font-medium">
                              (-{format(appliedStoreCoupons[storeGroup.storeId].discountValue)}₫)
                            </span>
                            <button
                              onClick={() => removeStoreCoupon(storeGroup.storeId)}
                              className="text-red-500 hover:text-red-700 text-xs md:text-sm font-bold ml-1"
                              title="Hủy mã"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenStoreCouponModal(storeGroup.storeId)}
                            className="text-blue-600 hover:text-blue-700 underline text-xs md:text-sm font-medium"
                          >
                            📋 Chọn mã giảm giá
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sản phẩm của Store */}
                    <div className="divide-y divide-gray-100">
                      {storeGroup.items.map((it) => {
                        const id = it.id;
                        const variant = it.CartItemProductVariant;
                        const product = variant?.ProductVariantProduct;
                        const name = product?.name || "Không có tên sản phẩm";
                        const img = product?.main_image;
                        const price = variant?.price || 0;
                        const shipping = variant?.shipping_fee || 30000;
                        const qty = quantities[id] || it.quantity || 1;

                        return (
                          <div
                            key={id}
                            className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4 p-3 md:p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <input
                                type="checkbox"
                                className="accent-[#116AD1] w-4 md:w-5 h-4 md:h-5 mt-1 flex-shrink-0"
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
                                className="w-16 h-16 md:w-20 md:h-20 rounded object-cover border flex-shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                                  {name}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500 flex flex-wrap gap-x-2 mt-1">
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

                                <div className="text-[#116AD1] font-semibold mt-1 text-sm md:text-base">
                                  {format(price)}₫
                                </div>
                                <div className="text-xs md:text-sm text-gray-500">
                                  Phí vận chuyển: {format(shipping)}₫
                                </div>
                              </div>
                            </div>

                            {/* Điều chỉnh số lượng và nút xóa */}
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                              <div className="flex items-center gap-1 md:gap-2">
                                <button
                                  onClick={() => decrement(id)}
                                  className="w-7 h-7 md:w-8 md:h-8 border rounded hover:bg-gray-100 transition text-sm"
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={qty}
                                  onChange={(e) => handleQtyChange(id, e.target.value)}
                                  onBlur={(e) => handleQtyBlur(id, e.target.value)}
                                  className="w-10 md:w-12 text-center border rounded h-7 md:h-8 text-sm"
                                />
                                <button
                                  onClick={() => increment(id)}
                                  className="w-7 h-7 md:w-8 md:h-8 border rounded hover:bg-gray-100 transition text-sm"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemove(it.product_variantId)}
                                className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded text-white bg-red-500 hover:bg-red-600 transition"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===================== TỔNG KẾT ===================== */}
          <div className="bg-white rounded-lg shadow p-4 md:p-5 h-fit sticky top-20 md:top-24">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4 text-gray-800">
              Tổng đơn hàng
            </h3>

            <div className="space-y-2 md:space-y-3 text-sm md:text-base">
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

              <div className="h-px bg-gray-200 my-2 md:my-3" />

              <div className="flex justify-between text-base md:text-lg">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-[#116AD1] font-bold text-lg md:text-xl">
                  {format(totalAmount)}₫
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-4 md:mt-5 w-full text-center bg-[#116AD1] text-white py-2.5 md:py-3 rounded-lg hover:bg-[#0e57aa] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition text-sm md:text-base"
              disabled={checkedItems.length === 0}
            >
              Đặt hàng ({checkedItems.length})
            </button>

            <Link
              to="/"
              className="mt-2 md:mt-3 block text-center border border-[#116AD1] text-[#116AD1] py-2.5 md:py-3 rounded-lg hover:bg-[#116AD1] hover:text-white font-medium transition text-sm md:text-base"
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
                      onClick={() => applyCoupon(coupon.code)}
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