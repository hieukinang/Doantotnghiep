import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendURL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const RanDom = () => {
  const [products, setProducts] = useState([]);

  const fetchTopSold = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/recommendations/random?page=1`
      );
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching top sold:", err);
    }
  };

  useEffect(() => {
    fetchTopSold();
  }, []);

  return (
    <div className="mx-4 lg:mx-[100px] mt-4 md:mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-xl font-semibold">Sản phẩm</h2>
        <Link to="/products" className="text-[#116AD1] text-xs md:text-sm hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-3 md:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {products.map((p) => (
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
                  <div className="mt-1 text-xs text-gray-500 line-through hidden sm:block">
                    {formatPrice(p.min_price * 1.1)}₫
                  </div>
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

export default RanDom;
