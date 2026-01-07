import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const DealsToday = () => {
  const { getAllProducts, allProducts } = useContext(ShopContext);
  const [randomProducts, setRandomProducts] = useState([]);

  // 🔥 dùng useRef để tránh random lại mỗi lần load trang
  const hasRandomized = useRef(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  // useEffect(() => {
  //   if (!hasRandomized.current && allProducts?.length > 0) {
  //     const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  //     setRandomProducts(shuffled.slice(0, 14));

  //     // đánh dấu: đã random rồi → không random lại nữa
  //     hasRandomized.current = true;
  //   }
  // }, [allProducts]);

  return (
    <div className="mx-4 lg:mx-[100px] mt-4 md:mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-xl font-semibold">Deal nổi bật hôm nay</h2>
        <Link to="/products" className="text-[#116AD1] text-xs md:text-sm hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-3 md:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {allProducts.map((p) => (
          <Link
            key={p.id || p._id}
            to={`/product/${p.id || p._id}`}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 border border-gray-200 transition-all duration-300"
          >
            <div className="aspect-[1/1] bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={
                  p.main_image ||
                  (p.images?.length ? p.images[0] : "") ||
                  "/no-image.png"
                }
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-2">
              <div className="line-clamp-2 text-xs md:text-sm font-medium text-gray-800">
                {p.name}
              </div>

              {p.min_price ? (
                <>
                  <div className="mt-1 text-[#116AD1] font-semibold text-sm md:text-base">
                    {formatPrice(p.min_price)}₫
                  </div>
                </>
              ) : (
                <div className="mt-1 text-gray-400 text-xs md:text-sm">Liên hệ</div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                Đã bán {p.sold?.toLocaleString("vi-VN") || "0"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DealsToday;
