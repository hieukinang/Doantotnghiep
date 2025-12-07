import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const backendURL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  // Lấy tên category theo ID (nếu backend của bạn trả category list đầy đủ)
  const fetchCategoryName = async () => {
    try {
      const res = await axios.get(`${backendURL}/categories`);
      const found = res.data.data?.find(
        (c) => c._id === id || c.id === id
      );
      if (found) setCategoryName(found.name);
    } catch {}
  };

  // Lấy danh sách sản phẩm theo category
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/api/recommendations/by-category?page=1&name=${encodeURIComponent(
          categoryName
        )}`
      );
      setProducts(res.data.data.docs || []);
    } catch (err) {
      console.error("Fetch category products error:", err);
    }
  };

  useEffect(() => {
    fetchCategoryName();
  }, [id]);

  useEffect(() => {
    if (categoryName) fetchProducts();
  }, [categoryName]);

  return (
    <div className="mx-[100px] mt-6">

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
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
              <div className="line-clamp-2 text-sm font-medium text-gray-800">
                {p.name}
              </div>

              {p.min_price ? (
                <>
                  <div className="mt-1 text-xs text-gray-500 line-through">
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
                Đã bán {p.sold?.toLocaleString("vi-VN") || "0"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
