import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";

const format = (v) => (v ? v.toLocaleString("vi-VN") : "0");

const Cart = () => {
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
  }, []);

  // 🔹 Khi giỏ hàng thay đổi, cập nhật state tạm để nhập số lượng
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const qtyObj = {};
      const ids = [];
      cartItems.forEach((item) => {
        qtyObj[item.id] = item.quantity || 1;
        ids.push(item.id);
      });
      setQuantities(qtyObj);
      setCheckedItems(ids); // tick hết mặc định
    } else {
      setQuantities({});
      setCheckedItems([]);
    }
  }, [cartItems]);

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
    console.log("Xoá sản phẩm với variantId:", id);
    await removeFromCart(id);
  };

  // 🧮 Tính subtotal và shippingFee dựa trên sản phẩm được tick
  const { subtotal, totalShippingFee } =
    cartItems?.reduce(
      (acc, it) => {
        const variant = it.CartItemProductVariant;
        const product = variant?.ProductVariantProduct;
        const price = variant?.price || 0;
        const productShippingFee = variant?.shipping_fee || 30000;
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===================== GIỎ HÀNG ===================== */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b font-semibold text-lg">
              Giỏ hàng của bạn
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
                  const img =
                    product?.main_image ||
                    "https://via.placeholder.com/80x80?text=No+Image";
                  const price = variant?.price || 0;
                  const shipping = variant?.shipping_fee || 30000;
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
                        onClick={() => handleRemove(it.product_variantId)}
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
            <Link
              to="/place-order"
              className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]"
            >
              Đặt hàng
            </Link>

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
