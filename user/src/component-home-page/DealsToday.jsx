import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const DealsToday = () => {
  const { getAllProducts, allProducts } = useContext(ShopContext);
  const [randomProducts, setRandomProducts] = useState([]);

  // 🔹 Gọi API lấy tất cả sản phẩm khi load
  useEffect(() => {
    getAllProducts();
  }, []);

  // 🔹 Khi có dữ liệu, random chọn 14 sản phẩm
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      console.log("🧩 allProducts trong DealsToday:", allProducts);
      setRandomProducts(shuffled.slice(0, 14));
    }
  }, [allProducts]);

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deal nổi bật hôm nay</h2>
        <Link to="/products" className="text-[#116AD1] text-sm">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {randomProducts.map((p) => (
          <Link
            key={p.id || p._id}
            to={`/product/${p.id || p._id}`}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
          >
            {/* Hình ảnh sản phẩm */}
            <div className="aspect-[1/1] bg-gray-100 flex items-center justify-center">
              <img
                src={
                  p.main_image ||
                  (p.images && p.images.length > 0 ? p.images[0] : "") ||
                  "/no-image.png"
                }
                alt={p.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-2">
              <div className="line-clamp-2 text-sm font-medium">{p.name}</div>

              {p.min_price ? (
                <>
                  <div className="mt-1 text-sm text-gray-500 line-through">
                    {formatPrice(p.min_price * 1.1)}₫
                  </div>
                  <div className="mt-1 text-[#116AD1] font-semibold">
                    {formatPrice(p.min_price)}₫
                  </div>
                </>
              ) : (
                <div className="mt-1 text-gray-400 text-sm">Liên hệ</div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                Đã bán {p.sold ? p.sold.toLocaleString("vi-VN") : "0"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DealsToday;
