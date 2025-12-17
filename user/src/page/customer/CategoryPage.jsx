import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const cateRes = await axios.get(
        `http://127.0.0.1:5000/api/categories/${id}`
      );
      setCategory(cateRes.data.data.doc);

      const productRes = await axios.get(
        `http://127.0.0.1:5000/api/recommendations/by-category`,
        {
          params: { name: cateRes.data.data.doc.name },
        }
      );

      setProducts(productRes.data.data || []);
      setDisplayProducts(productRes.data.data || []);
    };

    fetchData();
  }, [id]);

  // SORT / FILTER
  useEffect(() => {
    let list = [...products];

    switch (sortType) {
      case "price-asc":
        list.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
        break;
      case "discount-asc":
        list.sort(
          (a, b) =>
            (a.discount_percent || 0) - (b.discount_percent || 0)
        );
        break;
      case "discount-desc":
        list.sort(
          (a, b) =>
            (b.discount_percent || 0) - (a.discount_percent || 0)
        );
        break;
      case "random":
        list.sort(() => 0.5 - Math.random());
        break;
      default:
        break;
    }

    setDisplayProducts(list);
  }, [sortType, products]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-xl border p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-800">
            {category?.name}
          </h2>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Sắp xếp theo giá
            </div>

            {[
              { label: "Thấp → Cao", value: "price-asc" },
              { label: "Cao → Thấp", value: "price-desc" },
              { label: "Ngẫu nhiên", value: "random" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={sortType === opt.value}
                  onChange={() => setSortType(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Giảm giá
            </div>

            {[
              { label: "Thấp → Cao", value: "discount-asc" },
              { label: "Cao → Thấp", value: "discount-desc" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={sortType === opt.value}
                  onChange={() => setSortType(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-xl overflow-hidden border hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={p.main_image || "/no-image.png"}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                <div className="p-2">
                  <div className="text-sm font-medium line-clamp-2 text-gray-800">
                    {p.name}
                  </div>

                  <div className="mt-1 text-[#116AD1] font-semibold">
                    {formatPrice(p.min_price)}₫
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    Đã bán {p.sold?.toLocaleString("vi-VN") || 0}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
