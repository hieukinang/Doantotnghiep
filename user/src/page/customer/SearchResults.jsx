import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'stores'

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      const [productRes, storeRes] = await Promise.all([
        axios.get(
          `http://127.0.0.1:5000/api/products?nameString=${query}&page=1`
        ),
        axios.get(
          `http://127.0.0.1:5000/api/stores/search?name=${query}&page=1`
        ),
      ]);

      const productData = productRes.data?.data?.products || [];
      const storeData = storeRes.data?.data || [];

      setProducts(productData);
      setStores(storeData);
    } catch (err) {
      console.error("❌ Lỗi khi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-32 px-5 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề */}
          <h1 className="text-2xl font-bold mb-6">
            Kết quả tìm kiếm cho: <span className="text-[#116AD1]">"{query}"</span>
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-2 px-4 font-medium transition-colors ${
                activeTab === "products"
                  ? "text-[#116AD1] border-b-2 border-[#116AD1]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sản phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`pb-2 px-4 font-medium transition-colors ${
                activeTab === "stores"
                  ? "text-[#116AD1] border-b-2 border-[#116AD1]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cửa hàng ({stores.length})
            </button>
          </div>

          {/* Nội dung */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#116AD1]"></div>
            </div>
          ) : (
            <>
              {/* Tab Sản phẩm */}
              {activeTab === "products" && (
                <div>
                  {products.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={product.main_image}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.discount > 0 && (
                              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <p className="text-[#116AD1] font-bold text-base">
                                ₫{product.min_price?.toLocaleString()}
                              </p>
                              {product.sold > 0 && (
                                <p className="text-xs text-gray-500">
                                  Đã bán {product.sold}
                                </p>
                              )}
                            </div>
                            {product.rating_average > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <span className="text-yellow-400">★</span>
                                <span className="text-xs text-gray-600">
                                  {product.rating_average} ({product.review_numbers})
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Cửa hàng */}
              {activeTab === "stores" && (
                <div>
                  {stores.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-500 text-lg">Không tìm thấy cửa hàng nào</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stores.map((item) => {
                        const store = item.store;
                        return (
                          <Link
                            key={store.id}
                            to={`/store/${store.id}`}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={store.image || "/default-store.png"}
                                alt={store.name}
                                className="w-20 h-20 object-cover rounded-full"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {store.detail_address}, {store.village}, {store.city}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center text-sm">
                              <div>
                                <p className="text-gray-500">Sản phẩm</p>
                                <p className="font-semibold">{store.number_of_products}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Đánh giá</p>
                                <p className="font-semibold">{store.rating || 0} ★</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Theo dõi</p>
                                <p className="font-semibold">{store.followers}</p>
                              </div>
                            </div>
                            {store.is_mall && (
                              <div className="mt-3 flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                                  Mall chính hãng
                                </span>
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;