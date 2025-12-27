import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import MessageButton from "../../component-home-page/MessageButton";
import { ShopContext } from "../../context/ShopContext";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) : "0";

const StoreProfile = () => {
  const { storeId } = useParams();
  const { backendURL, clientUser, clientToken } = useContext(ShopContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) {
        setError("Không tìm thấy thông tin cửa hàng");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/stores/${storeId}`);
        const storeData = res.data?.data?.doc || res.data?.data;
        if (res.data?.status === "success" && storeData) {
          const storeInfo = {
            id: storeData.id || `STORE${storeData.id}`,
            name: storeData.name || "Cửa hàng",
            email: storeData.email || "",
            phone: storeData.phone || "",
            image: storeData.image || null,
            address: storeData.detail_address 
              ? `${storeData.detail_address}, ${storeData.village || ""}, ${storeData.city || ""}`.replace(/^,\s*|,\s*$/g, "")
              : storeData.village || storeData.city || storeData.address || "",
            description: storeData.description || "",
          };
          setStore(storeInfo);

          // Kiểm tra xem user đã follow shop chưa
          if (clientUser?.id && clientToken) {
            try {
              const config = { headers: { Authorization: `Bearer ${clientToken}` } };
              const followRes = await axios.get(`${backendURL}/follows/client/followed-stores`, config);
              const followedStores = followRes.data?.data?.stores || [];
              const isFollowed = followedStores.some(s => s.id === storeData.id);
              setIsFollowing(isFollowed);
            } catch (followErr) {
              console.error("Error checking follow status:", followErr);
            }
          }
        } else {
          setError("Không tìm thấy thông tin cửa hàng");
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setError("Không thể tải thông tin cửa hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId, backendURL, clientUser, clientToken]);

  // Fetch products by store
  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) return;
      
      try {
        setProductsLoading(true);
        // Fetch all products and filter by storeId
        const res = await axios.get(`${backendURL}/products`);
        if (res.data?.status === "success") {
          const allProducts = res.data?.data?.products || [];
          // Filter products by storeId
          const storeProducts = allProducts.filter(
            (product) => product.storeId === storeId
          );
          setProducts(storeProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    if (storeId) {
      fetchProducts();
    }
  }, [storeId, backendURL]);

  const handleFollowToggle = async () => {
    if (!clientUser || !clientUser.id) {
      alert("Bạn cần đăng nhập để theo dõi cửa hàng");
      return;
    }

    setFollowLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      };

      if (!isFollowing) {
        // Follow shop
        await axios.post(`${backendURL}/follows/${store.id}`, {}, config);
        setIsFollowing(true);
      } else {
        // Unfollow shop
        await axios.delete(`${backendURL}/follows/${store.id}`, config);
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Error following/unfollowing store:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setFollowLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1 flex items-center justify-center">
          <div className="text-gray-500">Đang tải thông tin...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1 flex items-center justify-center">
          <div className="text-red-500">{error || "Không tìm thấy cửa hàng"}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                {store.image ? (
                  <img
                    src={
                      store.image.startsWith("http") 
                        ? store.image 
                        : store.image.startsWith("/")
                        ? `${backendURL.replace('/api', '')}${store.image}`
                        : `${backendURL.replace('/api', '')}/${store.image}`
                    }
                    alt={store.name}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl md:text-3xl text-gray-400">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-800">{store.name}</h1>
                  <p className="text-gray-500 text-sm md:text-base mt-1">Cửa hàng</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageButton
                  userId={store.id}
                  userType="STORE"
                  userName={store.name}
                  userImage={store.image}
                />
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-3 md:px-4 py-2 rounded text-sm md:text-base ${
                    isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {followLoading
                    ? "Đang xử lý..."
                    : isFollowing
                    ? "Hủy theo dõi"
                    : "Theo dõi"}
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3 md:space-y-4 text-sm md:text-base">
              {store.description && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Mô tả:</span>
                  <p className="mt-1 text-gray-800">{store.description}</p>
                </div>
              )}
              {store.email && (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="sm:ml-2 text-gray-800 break-all">{store.email}</span>
                </div>
              )}
              {store.phone && (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                  <span className="sm:ml-2 text-gray-800">{store.phone}</span>
                </div>
              )}
              {store.address && (
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <span className="text-sm font-medium text-gray-600">Địa chỉ:</span>
                  <span className="sm:ml-2 text-gray-800">{store.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
              Sản phẩm của cửa hàng
            </h2>
            
            {productsLoading ? (
              <div className="text-center p-6 md:p-8 text-gray-500 text-sm md:text-base">
                Đang tải sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-6 md:p-8 text-gray-500 bg-white rounded-lg shadow text-sm md:text-base">
                Cửa hàng chưa có sản phẩm nào
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {products.map((product) => {
                  const productImage = product.main_image 
                    ? (product.main_image.startsWith("http") 
                        ? product.main_image 
                        : product.main_image.startsWith("/")
                        ? `${backendURL.replace('/api', '')}/${product.main_image}`
                        : `${backendURL.replace('/api', '')}/products/${product.main_image}`)
                    : (product.ProductImages && product.ProductImages.length > 0
                        ? (product.ProductImages[0].image.startsWith("http")
                            ? product.ProductImages[0].image
                            : `${backendURL.replace('/api', '')}/products/${product.ProductImages[0].image}`)
                        : null);
                  
                  const discountPercent = product.discount || 0;
                  const minPrice = product.min_price || 0;
                  const originalPrice = discountPercent > 0 
                    ? minPrice / (1 - discountPercent / 100)
                    : minPrice;
                  
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
                    >
                      {/* Hình ảnh sản phẩm */}
                      <div className="aspect-[1/1] bg-gray-100 flex items-center justify-center">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">Không có ảnh</div>
                        )}
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="p-1.5 md:p-2">
                        <div className="line-clamp-2 text-xs md:text-sm font-medium text-gray-800 min-h-[2rem] md:min-h-[2.5rem]">
                          {product.name}
                        </div>

                        {minPrice > 0 ? (
                          <>
                            {discountPercent > 0 && (
                              <div className="mt-1 text-[10px] md:text-xs text-gray-500 line-through">
                                {formatPrice(originalPrice)}₫
                              </div>
                            )}
                            <div className="mt-1 text-[#116AD1] font-semibold text-xs md:text-sm">
                              {formatPrice(minPrice)}₫
                            </div>
                            {discountPercent > 0 && (
                              <div className="mt-1 text-[10px] md:text-xs text-red-500 font-medium">
                                -{discountPercent}%
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="mt-1 text-gray-400 text-xs md:text-sm">Liên hệ</div>
                        )}

                        <div className="mt-1 text-[10px] md:text-xs text-gray-500">
                          Đã bán {product.sold ? formatPrice(product.sold) : "0"}
                        </div>

                        {product.rating_average && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-[10px] md:text-xs text-gray-600">
                              {product.rating_average.toFixed(1)}
                            </span>
                            {product.review_numbers && (
                              <span className="text-[10px] md:text-xs text-gray-500">
                                ({product.review_numbers})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoreProfile;
