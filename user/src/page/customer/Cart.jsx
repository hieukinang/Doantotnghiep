import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";

const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    fetchMyCart,
    removeFromCart,
  } = useContext(ShopContext);

  const [checkedItems, setCheckedItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // 🔹 Load giỏ hàng khi component mount
  useEffect(() => {
    fetchMyCart();
    
    // LẤY DỮ LIỆU CŨ TỪ LOCALSTORAGE (Nếu có, để giữ trạng thái sau khi refresh)
    const savedChecked = JSON.parse(localStorage.getItem("checkedItems") || "[]");
    const savedQuantities = JSON.parse(localStorage.getItem("quantities") || "{}");
    if (savedChecked.length > 0) setCheckedItems(savedChecked);
    if (Object.keys(savedQuantities).length > 0) setQuantities(savedQuantities);
    
  }, []);

  // 🔹 Khi giỏ hàng thay đổi, cập nhật state tạm để nhập số lượng
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const qtyObj = {};
      
      // Khởi tạo số lượng từ dữ liệu Context, ưu tiên số lượng đã lưu trong state local
      cartItems.forEach((item) => {
        qtyObj[item.id] = quantities[item.id] || item.quantity || 1;
      });
      
      setQuantities(qtyObj);
      
      // Mặc định tick tất cả nếu chưa có trạng thái lưu (hoặc tick lại những cái đã có)
      if (checkedItems.length === 0) {
          setCheckedItems(cartItems.map(item => item.id));
      } else {
          // Loại bỏ ID không còn trong giỏ hàng
          setCheckedItems(prev => prev.filter(id => cartItems.some(item => item.id === id)));
      }
    } else {
      setQuantities({});
      setCheckedItems([]);
    }
  // Thêm dependencies quantities để đồng bộ số lượng khi cartItems thay đổi
  }, [cartItems]); 
  
  // 🎯 LƯU TRỮ TRẠNG THÁI TÍCH CHỌN VÀ SỐ LƯỢNG NGAY KHI CHÚNG THAY ĐỔI
  useEffect(() => {
      localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);
  
  useEffect(() => {
      localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  // 🧮 Xử lý thay đổi số lượng (local)
  const handleQtyChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 🧮 Khi blur: chuẩn hoá số lượng tối thiểu = 1
  const handleQtyBlur = (id, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    setQuantities((prev) => ({ ...prev, [id]: num }));
  };

  // ➕ / ➖ tăng giảm local
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

  // ❌ Xoá sản phẩm khỏi giỏ
  const handleRemove = async (id) => {
    await removeFromCart(id);
    // Cập nhật lại state checkedItems sau khi xóa khỏi server
    setCheckedItems(prev => prev.filter(itemId => itemId !== id));
  };
  
  // 🎯 HÀM XỬ LÝ CHUYỂN TRANG ĐẶT HÀNG
  const handleCheckout = () => {
    if (checkedItems.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
        return;
    }
    
    // ⚠️ LƯU Ý: Vì đã sử dụng useEffect để lưu trữ ngay khi state thay đổi, 
    // việc này không hoàn toàn cần thiết, nhưng an toàn hơn.
    // Tuy nhiên, chúng ta chỉ cần navigate (chuyển hướng) ở đây.
    
    navigate("/place-order");
  };

  // 🧮 Xử lý thay đổi trạng thái Tích chọn TẤT CẢ
  const handleCheckAll = (e) => {
      if (e.target.checked) {
          setCheckedItems(cartItems.map(item => item.id));
      } else {
          setCheckedItems([]);
      }
  }


  // 🧮 Tính subtotal và shippingFee dựa trên sản phẩm được tick
  const { subtotal, totalShippingFee } =
    cartItems?.reduce(
      (acc, it) => {
        const variant = it.CartItemProductVariant;
        const product = variant?.ProductVariantProduct;
        const price = variant?.price || 0;
        const productShippingFee = variant?.shipping_fee || 30000;
        // Lấy số lượng mới nhất từ state quantities
        const qty = quantities[it.id] || it.quantity || 1; 
        const isChecked = checkedItems.includes(it.id);

        if (isChecked) {
          acc.subtotal += price * qty;
          acc.totalShippingFee += productShippingFee;
        }
        return acc;
      },
      { subtotal: 0, totalShippingFee: 0 }
    ) || { subtotal: 0, totalShippingFee: 0 };
    
    // Kiểm tra xem đã tick chọn tất cả chưa
    const isAllChecked = cartItems && cartItems.length > 0 && checkedItems.length === cartItems.length;


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

            {/* ... (Hiển thị sản phẩm) ... */}
            {/* Giữ nguyên logic map cartItems và checkbox */}
            
            {/* ... (Code của bạn) ... */}
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
                  const img =
                    product?.main_image ||
                    "https://via.placeholder.com/80x80?text=No+Image";
                  const price = variant?.price || 0;
                  const stockQty = variant?.stock_quantity || 0;
                  // const color = variant?.color || "Không có";
                  // const size = variant?.size || "Không có";
                  const shipping = variant?.shipping_fee || 30000;
                  // Lấy số lượng từ state local
                  const qty = quantities[id] || it.quantity || 1;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#116AD1] w-5 h-5"
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
                              .filter((opt) => opt.value !== null && opt.value !== "" && opt.value !== undefined)
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
                          {format(price)}₫
                        </div>
                        <div className="text-sm text-gray-500">
                          Phí vận chuyển: {format(shipping)}₫
                        </div>
                      </div>

                      {/* Điều chỉnh số lượng */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrement(id)}
                          className="w-8 h-8 border rounded"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={qty}
                          onChange={(e) =>
                            handleQtyChange(id, e.target.value)
                          }
                          onBlur={(e) => handleQtyBlur(id, e.target.value)}
                          className="w-12 text-center border rounded h-8"
                        />
                        <button
                          onClick={() => increment(id)}
                          className="w-8 h-8 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* Xóa sản phẩm */}
                      <button
                        onClick={() => handleRemove(id)}
                        className="ml-3 px-3 py-2 text-sm rounded text-white bg-[#116AD1] hover:bg-[#FF4500] transition"
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
          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold">{format(subtotal)}₫</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Phí vận chuyển</span>
              <span className="font-semibold">
                {totalShippingFee === 0
                  ? "Miễn phí"
                  : format(totalShippingFee) + "₫"}
              </span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-lg">
              <span>Tổng cộng</span>
              <span className="text-[#116AD1] font-bold">
                {format(subtotal + totalShippingFee)}₫
              </span>
            </div>
            {/* 🎯 THAY THẺ LINK BẰNG BUTTON VÀ GỌI HÀM handleCheckout */}
            <button
              onClick={handleCheckout}
              className="mt-4 w-full text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa] disabled:bg-gray-400"
              disabled={checkedItems.length === 0}
            >
              Đặt hàng ({checkedItems.length})
            </button>

            <Link
              to="/"
              className="mt-3 block text-center border border-[#116AD1] text-[#116AD1] py-2 rounded hover:bg-[#116AD1] hover:text-white"
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

export default Cart;