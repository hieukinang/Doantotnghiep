import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import MessageButton from "../../component-home-page/MessageButton";

const ProductDetail = () => {
  const { productId } = useParams();
  const { product, getProduct, backendURL, fetchMyCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantStock, setSelectedVariantStock] = useState(0);
  const [variantAttributes, setVariantAttributes] = useState({});
  const [storeInfo, setStoreInfo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // REVIEW
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Lấy sản phẩm theo ID
  useEffect(() => {
    if (productId) {
      getProduct(productId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

  // Kiểm tra trạng thái favorite khi load sản phẩm
  useEffect(() => {
    console.log("check favorite effect", product);

    const clientToken = localStorage.getItem("clientToken");
    
    if (!product?.id || !clientToken || clientToken === "null" || clientToken === "undefined" || clientToken.trim() === "") {
      console.log("Missing product or token:", { productId: product?.id, hasToken: !!clientToken });
      return;
    }

    const checkFavoriteStatus = async () => {
      try {
        console.log("Checking favorite status for product:", product.id);
        
        const res = await axios.get(`${backendURL}/favorites`, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        });

        console.log("favorite response:", res.data);

        const favorites = res.data?.data?.docs || [];
        const isFav = favorites.some(
          (f) => f.productId === product.id
        );

        console.log("Is favorite:", isFav, "Favorites list:", favorites);
        setIsFavorite(isFav);
      } catch (e) {
        console.error("favorite check error", e);
      }
    };

    checkFavoriteStatus();
  }, [product?.id, backendURL]);

  const handleToggleFavorite = async () => {
    const clientToken = localStorage.getItem("clientToken");
    
    console.log("Toggle favorite clicked", { 
      productId: product?.id, 
      currentIsFavorite: isFavorite,
      hasToken: !!clientToken 
    });
    
    if (!clientToken || clientToken === "null" || clientToken === "undefined" || clientToken.trim() === "") {
      toast.warning("Bạn cần đăng nhập để thêm vào yêu thích");
      navigate("/login");
      return;
    }

    if (!product?.id) {
      console.log("No product ID");
      return;
    }

    setFavoriteLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      };

      if (!isFavorite) {
        //THÊM YÊU THÍCH
        console.log("Adding to favorites:", product.id);
        await axios.post(
          `${backendURL}/favorites/${product.id}`,
          {},
          config
        );
        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        //BỎ YÊU THÍCH
        console.log("Removing from favorites:", product.id);
        await axios.delete(
          `${backendURL}/favorites/${product.id}`,
          config
        );
        setIsFavorite(false);
        toast.success("Đã bỏ khỏi danh sách yêu thích");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 429) {
        toast.error("Server đang quá tải, vui lòng khởi động lại server backend");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };


  // Lấy thông tin store từ product
  useEffect(() => {
    // Lấy storeId từ product hoặc từ variant đầu tiên
    const storeId = product?.storeId || 
                    product?.ProductStore?.id ||
                    product?.ProductVariants?.[0]?.storeId ||
                    product?.ProductVariants?.[0]?.ProductVariantProduct?.storeId;
    
    if (storeId) {
      const fetchStoreInfo = async () => {
        try {
          const res = await axios.get(`${backendURL}/stores/${storeId}`);
          if (res.data?.status === 'success' && res.data?.data?.doc) {
            const store = res.data.data.doc;
            setStoreInfo({
              id: store.id || `STORE${store.id}`,
              name: store.name || 'Cửa hàng',
              image: store.image || null
            });
          }
        } catch (error) {
          console.error('Error fetching store info:', error);
        }
      };
      fetchStoreInfo();
    }
  }, [product?.storeId, product?.ProductStore, product?.ProductVariants, backendURL]);

  // Lấy review + filter rating
  const fetchReviews = async (rating = null) => {
    if (!product?.id) return;

    try {
      setLoadingReviews(true);

      const url = rating
        ? `${backendURL}/reviews/rating/${rating}?productId=${product.id}`
        : `${backendURL}/reviews/product/${product.id}`;

      const res = await axios.get(url);
      const list = res.data?.data?.reviews || [];

      const productReviews = list.filter(
        (rv) => rv.productId === product.id
      );

      setReviews(productReviews);

      if (list.length > 0) {
        const avg =
          list.reduce((sum, r) => sum + r.rating, 0) / list.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.error("Lỗi lấy đánh giá:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Đếm số lượng rating 1–5 sao
  const fetchRatingCounts = async () => {
    if (!product?.id) return;

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    try {
      await Promise.all(
        [1, 2, 3, 4, 5].map(async (star) => {
          const res = await axios.get(
            `${backendURL}/reviews/rating/${star}?productId=${product.id}`
          );
          const reviews = res.data?.data?.reviews || [];

          const productReviews = reviews.filter(
            (rv) => rv.productId === product.id
          );
          counts[star] = productReviews.length;
        })
      );

      setRatingCounts(counts);
    } catch (err) {
      console.error("Lỗi lấy số lượng rating:", err);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchReviews();
      fetchRatingCounts();
    }
  }, [product?.id]);

  const handleFilterRating = (rating) => {
    setSelectedRating(rating);
    fetchReviews(rating);
  };

  const handleClearFilter = () => {
    setSelectedRating(null);
    fetchReviews();
  };

  // Tạo gallery
  const gallery = [
    product?.main_image,
    ...(product?.ProductImages?.map(img => img.image_url) || [])
  ];

  // Auto slide ảnh
  useEffect(() => {
    if (!gallery.length) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  // Map attributeId -> name
  const attributeMap = {};
  (product?.attributes || []).forEach(attr => {
    attributeMap[attr.id] = attr.name;
  });

  // Khởi tạo default options, variantAttributes, giá, variantId
  useEffect(() => {
    console.log(product)
    if (product?.ProductVariants?.length > 0) {
      const firstVariant = product.ProductVariants[0];
      const defaultOptions = {};
      firstVariant?.ProductVariantOptions?.forEach(opt => {
        if (opt.value !== null) {
          const name = opt.VariantOptionAttribute?.name || `Thuộc tính ${opt.attributeId}`;
          defaultOptions[name] = opt.value;
        }
      });
      setSelectedOptions(defaultOptions);
      setSelectedVariantPrice(firstVariant.price || 0);
      setSelectedVariantId(firstVariant.id);
      setSelectedVariantStock(firstVariant.stock_quantity || 0);

      // Tạo variantAttributes an toàn
      const attrObj = {};
      product.ProductVariants.forEach(v => {
        v.ProductVariantOptions?.forEach(opt => {
          if (opt.value === null) return;
          const name = opt.VariantOptionAttribute?.name || `Thuộc tính ${opt.attributeId}`;
          if (!attrObj[opt.attributeId]) attrObj[opt.attributeId] = { name, options: [] };
          if (!attrObj[opt.attributeId].options.includes(opt.value)) {
            attrObj[opt.attributeId].options.push(opt.value);
          }
        });
      });
      setVariantAttributes(attrObj);
    } else {
      setSelectedVariantPrice(product?.price || 0);
      setSelectedVariantId(product?.id || null);
      setVariantAttributes({});
    }
  }, [product]);

  // Chọn option và update variant
  const handleOptionChange = (attrName, value) => {
    const newSelected = { ...selectedOptions, [attrName]: value };
    setSelectedOptions(newSelected);

    // Tìm variant phù hợp - variant phải match TẤT CẢ options đã chọn
    const matched = product.ProductVariants?.find(v => {
      const variantOpts = v.ProductVariantOptions?.filter(opt => opt.value !== null) || [];
      
      // Kiểm tra: mỗi option đã chọn phải có trong variant
      const allSelectedMatch = Object.entries(newSelected).every(([selName, selValue]) => {
        return variantOpts.some(opt => {
          const optName = opt.VariantOptionAttribute?.name || `Thuộc tính ${opt.attributeId}`;
          return optName === selName && opt.value === selValue;
        });
      });

      // Kiểm tra: mỗi option của variant phải có trong đã chọn
      const allVariantMatch = variantOpts.every(opt => {
        const optName = opt.VariantOptionAttribute?.name || `Thuộc tính ${opt.attributeId}`;
        return newSelected[optName] === opt.value;
      });

      return allSelectedMatch && allVariantMatch;
    });

    if (matched) {
      console.log("Matched variant:", matched.id, matched);
      setSelectedVariantPrice(matched.price || 0);
      setSelectedVariantId(matched.id);
      setSelectedVariantStock(matched.stock_quantity || 0);
    } else {
      console.log("⚠️ No variant matched for:", newSelected);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("clientToken");
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (!selectedVariantId) {
      toast.warning("Vui lòng chọn đầy đủ thuộc tính sản phẩm");
      return;
    }

    try {
      await axios.post(
        `${backendURL}/carts`,
        {
          product_variantId: selectedVariantId,
          quantity: quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Fetch lại giỏ hàng để cập nhật số lượng trên header
      await fetchMyCart();
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } catch (err) {
      console.error("Lỗi khi thêm giỏ hàng:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.errors?.[0]?.message 
        || err.response?.data?.message 
        || "Không thể thêm vào giỏ hàng";
      toast.error(errorMsg);
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("clientToken");
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      toast.warning("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    if (!selectedVariantId) {
      toast.warning("Vui lòng chọn đầy đủ thuộc tính sản phẩm");
      return;
    }

    // Lấy thông tin variant đã chọn
    const selectedVariant = product?.ProductVariants?.find(v => v.id === selectedVariantId);
    if (!selectedVariant) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    // Lấy storeId
    const storeId = product?.storeId || 
                   product?.ProductStore?.id ||
                   selectedVariant?.storeId ||
                   selectedVariant?.ProductVariantProduct?.storeId ||
                   storeInfo?.id;

    // Tạo variant options từ selectedOptions
    const variantOptions = [];
    if (selectedVariant?.ProductVariantOptions) {
      selectedVariant.ProductVariantOptions.forEach(opt => {
        if (opt.value !== null) {
          const attrName = attributeMap[opt.attributeId] || `Thuộc tính ${opt.attributeId}`;
          variantOptions.push({
            name: attrName,
            value: opt.value
          });
        }
      });
    }

    // Lấy hình ảnh sản phẩm
    let productImage = product.main_image || (product.ProductImages && product.ProductImages[0]?.image_url) || null;
    // Xử lý URL hình ảnh
    if (productImage && !productImage.startsWith("http")) {
      if (productImage.startsWith("/")) {
        productImage = `${backendURL.replace('/api', '')}${productImage}`;
      } else {
        productImage = `${backendURL.replace('/api', '')}/products/${productImage}`;
      }
    }

    // Tạo buy now item
    const buyNowItem = {
      id: `buy-now-${Date.now()}`, // ID tạm thời
      productId: product.id, // Lưu productId để quay lại
      name: product.name,
      image: productImage,
      price: selectedVariantPrice,
      shippingFee: selectedVariant?.shipping_fee || 30000,
      qty: quantity,
      variantOptions: variantOptions,
      product_variantId: selectedVariantId,
      storeId: storeId,
      storeName: storeInfo?.name || "Cửa hàng",
    };

    // Lưu vào localStorage
    localStorage.setItem("buyNowItems", JSON.stringify([buyNowItem]));
    localStorage.setItem("checkedItems", JSON.stringify([buyNowItem.id]));
    localStorage.setItem("quantities", JSON.stringify({ [buyNowItem.id]: quantity }));
    
    // Clear các coupon cũ (nếu có)
    localStorage.removeItem("appliedStoreCoupons");
    localStorage.removeItem("appliedCartCoupon");

    // Navigate to place-order
    navigate("/place-order");
  };

  if (!product?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Ảnh sản phẩm */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow relative">
              <img
                src={gallery[active]?.startsWith("http") ? gallery[active] : `${backendURL}/${gallery[active]}`}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActive(prev => prev === 0 ? gallery.length - 1 : prev - 1)}
                    className="absolute top-1/2 left-2 md:left-3 -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50"
                  >‹</button>
                  <button
                    onClick={() => setActive(prev => (prev + 1) % gallery.length)}
                    className="absolute top-1/2 right-2 md:right-3 -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50"
                  >›</button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full ${i === active ? "bg-[#116AD1]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="bg-white rounded-lg p-4 md:p-5 shadow">
            {/* Tiêu đề và icon yêu thích */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-lg md:text-xl font-semibold flex-1">{product.name}</h1>
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className={`transition-all duration-200 ${
                  favoriteLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                }`}
              >
                <svg
                  className={`w-6 md:w-7 h-6 md:h-7 ${
                    isFavorite
                      ? "fill-red-500 stroke-red-500"
                      : "fill-none stroke-gray-400 hover:stroke-red-500"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              </button>

            </div>

            <div className="mt-2 text-xs md:text-sm text-gray-500">
              ⭐ {avgRating || "Chưa có"} • {reviews.length} đánh giá • Đã bán {product.sold || 0} • Kho: {selectedVariantStock}
            </div>
            {product.shipping_free && (
              <div className="mt-3 bg-[#116AD1]/10 text-[#116AD1] inline-block px-3 py-1 rounded text-sm">
                Miễn phí vận chuyển
              </div>
            )}

            <div className="mt-4 text-xl md:text-2xl font-bold text-[#116AD1]">
              {selectedVariantPrice.toLocaleString()}₫
            </div>

            {/* Hiển thị ProductVariants nếu có */}
            {Object.values(variantAttributes).length > 0 && (
              <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                {Object.values(variantAttributes).map((attr, idx) => (
                  <div key={idx}>
                    <h3 className="font-medium mb-2 text-sm md:text-base">{attr.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {attr.options
                        .filter(opt => opt !== null)
                        .map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionChange(attr.name, opt)}
                            className={`px-2 md:px-3 py-1 border rounded text-sm ${selectedOptions[attr.name] === opt
                              ? "bg-[#116AD1] text-white border-[#116AD1]"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Thêm giỏ hàng + Mua ngay */}
            <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-2 md:gap-3">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-14 md:w-16 border rounded px-2 py-1 text-sm md:text-base"
              />
              <button
                onClick={handleAddToCart}
                className="px-3 md:px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-[#116AD1]/5 text-sm md:text-base"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="px-3 md:px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-sm md:text-base"
              >
                Mua ngay
              </button>
            </div>

            <div className="mt-4 md:mt-6">
              <h3 className="font-semibold text-sm md:text-base">Mô tả sản phẩm</h3>
              <p className="mt-2 text-xs md:text-sm text-gray-700 leading-6 whitespace-pre-line">
                {product.description || "Chưa có mô tả cho sản phẩm này."}
              </p>
            </div>

            <div
              onClick={() => setShowReviews(!showReviews)}
              className="mt-4 text-[#116AD1] font-medium cursor-pointer hover:underline text-sm md:text-base"
            >
              Đánh giá ({reviews.length})
            </div>

            {showReviews && (
              <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-sm">Chưa có đánh giá nào</p>
                )}

                {/* FILTER RATING */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <button
                    onClick={handleClearFilter}
                    className={`px-2 md:px-3 py-1 border rounded text-xs md:text-sm
                      ${selectedRating === null
                        ? "bg-[#116AD1] text-white border-[#116AD1]"
                        : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    Tất cả
                  </button>

                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFilterRating(star)}
                      className={`px-2 md:px-3 py-1 border rounded text-xs md:text-sm
                        ${selectedRating === star
                          ? "bg-[#116AD1] text-white border-[#116AD1]"
                          : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {star} ⭐ ({ratingCounts[star]})
                    </button>
                  ))}
                </div>
                
                {reviews.map((rv) => (
                  <div key={rv.id} className="border-b pb-4 md:pb-5">
                    {/* User */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <img
                        src={rv.ReviewClient?.image}
                        alt={rv.ReviewClient?.username}
                        className="w-8 md:w-10 h-8 md:h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm md:text-base">
                          {rv.ReviewClient?.username}
                        </p>
                        <div className="text-[#f59e0b] text-xs md:text-sm">
                          {"⭐".repeat(rv.rating)}
                        </div>
                      </div>
                    </div>

                    {/* Nội dung */}
                    <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700">{rv.text}</p>

                    {/* Ảnh */}
                    {rv.ReviewImages?.length > 0 && (
                      <div className="mt-2 md:mt-3 flex gap-2 flex-wrap">
                        {rv.ReviewImages.map((img) => (
                          <img
                            key={img.id}
                            src={img.url}
                            alt="review"
                            className="w-16 md:w-20 h-16 md:h-20 rounded object-cover border"
                          />
                        ))}
                      </div>
                    )}

                    {/* Thời gian */}
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(rv.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                ))}
              </div>
            )}


            {/* Thông tin cửa hàng và nút nhắn tin */}
            {storeInfo && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    {storeInfo.image && (
                      <img 
                        src={storeInfo.image.startsWith('http') ? storeInfo.image : `${backendURL}/${storeInfo.image}`}
                        alt={storeInfo.name}
                        className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base">{storeInfo.name}</h4>
                      <p className="text-xs md:text-sm text-gray-500">Cửa hàng</p>
                    </div>
                  </div>
                  <MessageButton
                    userId={storeInfo.id}
                    userType="STORE"
                    userName={storeInfo.name}
                    userImage={storeInfo.image}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;