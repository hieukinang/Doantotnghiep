import React from "react";
import { Link } from "react-router-dom";

const format = (v) => v.toLocaleString("vi-VN");

const DealsToday = ({ products }) => {
  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deal nổi bật hôm nay</h2>
        <Link to="/products" className="text-[#116AD1] text-sm">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            to="/product/:productId"
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
          >
            <div className="aspect-[1/1] bg-gray-100">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-2">
              <div className="line-clamp-2 text-sm">{p.name}</div>
              <div className="mt-1 text-sm text-gray-500 line-through">
                {format(p.price * 1.1)}₫
              </div>
              <div className="mt-1 text-[#116AD1] font-semibold">
                {format(p.price)}₫
              </div>
              <div className="mt-1 text-xs text-gray-500">Đã bán 1,2k</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DealsToday;
