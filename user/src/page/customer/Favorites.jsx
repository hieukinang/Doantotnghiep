import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const Favorites = () => {
  const { backendURL } = useContext(ShopContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceSort, setPriceSort] = useState("");
  const [discountSort, setDiscountSort] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const fetchFavorites = async () => {
      const clientToken = localStorage.getItem("clientToken");
      
      if (!clientToken || clientToken === "null" || clientToken === "undefined" || clientToken.trim() === "") {
        toast.warning("Bạn cần đăng nhập để xem danh sách yêu thích");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${backendURL}/favorites`, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        });

        console.log("Favorites response:", res.data);

        if (res.data.status === "success") {
          const favoritesList = res.data.data.docs || [];
          setFavorites(favoritesList);
          setDisplayFavorites(favoritesList);
        } else {
          toast.error("Không thể tải danh sách yêu thích");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        if (error.response?.status === 401) {
          toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          navigate("/login");
        } else {
          toast.error("Có lỗi xảy ra khi tải danh sách yêu thích");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [backendURL, navigate]);

  // SORT / FILTER
  useEffect(() => {
    let list = [...favorites];

    if (priceSort === "price-asc") {
      list.sort((a, b) => (a.FavoriteProduct?.min_price || 0) - (b.FavoriteProduct?.min_price || 0));
    }
    if (priceSort === "price-desc") {
      list.sort((a, b) => (b.FavoriteProduct?.min_price || 0) - (a.FavoriteProduct?.min_price || 0));
    }
    if (priceSort === "random") {
      list.sort(() => 0.5 - Math.random());
    }

    // SORT BY DISCOUNT
    if (discountSort === "discount-asc") {
      list.sort(
        (a, b) =>
          (a.FavoriteProduct?.discount || 0) - (b.FavoriteProduct?.discount || 0)
      );
    }
    if (discountSort === "discount-desc") {
      list.sort(
        (a, b) =>
          (b.FavoriteProduct?.discount || 0) - (a.FavoriteProduct?.discount || 0)
      );
    }

    setDisplayFavorites(list);
  }, [priceSort, discountSort, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#116AD1] mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm md:text-base">Đang tải danh sách yêu thích...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto px-2 md:px-6 py-4 md:py-8">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Sản phẩm yêu thích</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {favorites.length} sản phẩm trong danh sách yêu thích của bạn
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="text-5xl md:text-6xl mb-4">💔</div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                Chưa có sản phẩm yêu thích
              </h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                Hãy khám phá và thêm những sản phẩm bạn yêu thích vào danh sách này
              </p>
              <Link
                to="/"
                className="inline-block px-5 md:px-6 py-2.5 md:py-3 bg-[#116AD1] text-white rounded-lg hover:bg-[#0e57aa] transition text-sm md:text-base"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* SIDEBAR - Hidden on mobile, shown as dropdown or collapsible */}
              <div className="col-span-12 md:col-span-3 bg-white rounded-xl border p-3 md:p-4 h-fit">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Bộ lọc
                </h2>

                <div className="mt-4 md:mt-6">
                  <div className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo giá
                  </div>

                  {[
                    { label: "Thấp → Cao", value: "price-asc" },
                    { label: "Cao → Thấp", value: "price-desc" },
                    { label: "Ngẫu nhiên", value: "random" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={priceSort === opt.value}
                        onChange={() =>
                          setPriceSort(
                            priceSort === opt.value ? "" : opt.value
                          )
                        }
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>

                <div className="mt-4 md:mt-6">
                  <div className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Giảm giá
                  </div>

                  {[
                    { label: "Thấp → Cao", value: "discount-asc" },
                    { label: "Cao → Thấp", value: "discount-desc" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={discountSort === opt.value}
                        onChange={() =>
                          setDiscountSort(
                            discountSort === opt.value ? "" : opt.value
                          )
                        }
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="col-span-12 md:col-span-9">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {displayFavorites.map((fav) => {
                    const product = fav.FavoriteProduct;
                    if (!product) return null;

                    return (
                      <div
                        key={fav.id}
                        className="bg-white rounded-lg md:rounded-xl overflow-hidden border hover:shadow-lg transition relative group"
                      >

                        <Link to={`/product/${product.id}`}>
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src={product.main_image || "/no-image.png"}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition"
                            />
                          </div>

                          <div className="p-2 md:p-3">
                            <div className="text-xs md:text-sm font-medium line-clamp-2 text-gray-800 mb-1 md:mb-2">
                              {product.name}
                            </div>

                            <div className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-1 md:mb-2 hidden sm:block">
                              {product.description}
                            </div>

                            <div className="flex items-center justify-between mb-1 md:mb-2">
                              <div className="text-[#116AD1] font-semibold text-xs md:text-sm">
                                {formatPrice(product.min_price)}₫
                              </div>
                              {product.discount > 0 && (
                                <div className="bg-red-100 text-red-600 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                                  -{product.discount}%
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500">
                              <span>Đã bán {product.sold?.toLocaleString("vi-VN") || 0}</span>
                              <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span>{product.rating_average || 0}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;