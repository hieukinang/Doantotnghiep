import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageButton from "../../component-home-page/MessageButton";
const ProductDetail = () => {
  const { productId } = useParams();
  const { product, getProduct, backendURL } = useContext(ShopContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantStock, setSelectedVariantStock] = useState(0);
  const [variantAttributes, setVariantAttributes] = useState({});
  const [storeInfo, setStoreInfo] = useState(null);

  // Lấy sản phẩm theo ID
  useEffect(() => {
    if (productId) {
      getProduct(productId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

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
          const name = attributeMap[opt.attributeId] || `Thuộc tính ${opt.attributeId}`;
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
          const name = attributeMap[opt.attributeId] || `Thuộc tính ${opt.attributeId}`;
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

    // Tìm variant phù hợp
    const matched = product.ProductVariants?.find(v =>
      v.ProductVariantOptions?.every(opt => {
        if (opt.value === null) return true;
        const name = attributeMap[opt.attributeId] || `Thuộc tính ${opt.attributeId}`;
        if (!(name in newSelected)) return true;
        return newSelected[name] === opt.value;
      })
    );

    if (matched) {
      setSelectedVariantPrice(matched.price || 0);
      setSelectedVariantId(matched.id);
      setSelectedVariantStock(matched.stock_quantity || 0);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("clientToken");
    console.log("Token khi thêm giỏ hàng:", token);
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }


    if (!selectedVariantId) {
      alert("Vui lòng chọn đầy đủ thuộc tính!");
      return;
    }
    console.log("Thêm vào giỏ hàng với variantId:", selectedVariantId, "số lượng:", quantity);
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/carts",
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
      console.log("Thêm giỏ hàng thành công:", res.data);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi khi thêm giỏ hàng:", err.response?.data || err.message);

      // nếu server trả mảng errors
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(e => console.error("Chi tiết lỗi:", e));
        alert(err.response.data.errors[0]?.message || "Thêm giỏ hàng thất bại");
      } else {
        alert("Thêm giỏ hàng thất bại. Vui lòng thử lại.");
      }
    }
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
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

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
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  >‹</button>
                  <button
                    onClick={() => setActive(prev => (prev + 1) % gallery.length)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
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
                    className={`w-3 h-3 rounded-full ${i === active ? "bg-[#116AD1]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <div className="mt-2 text-sm text-gray-500">
              ⭐ {product.rating || "4.8"} • Đã bán {product.sold || 0} • Kho: {selectedVariantStock}
            </div>
            {product.shipping_free && (
              <div className="mt-3 bg-[#116AD1]/10 text-[#116AD1] inline-block px-3 py-1 rounded">
                Miễn phí vận chuyển
              </div>
            )}

            <div className="mt-4 text-2xl font-bold text-[#116AD1]">
              {selectedVariantPrice.toLocaleString()}₫
            </div>

            {/* Hiển thị ProductVariants nếu có */}
            {Object.values(variantAttributes).length > 0 && (
              <div className="mt-6 space-y-4">
                {Object.values(variantAttributes).map((attr, idx) => (
                  <div key={idx}>
                    <h3 className="font-medium mb-2">{attr.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {attr.options
                        .filter(opt => opt !== null)
                        .map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionChange(attr.name, opt)}
                            className={`px-3 py-1 border rounded ${selectedOptions[attr.name] === opt
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
            <div className="mt-6 flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-[#116AD1]/5"
              >
                Thêm vào giỏ hàng
              </button>
              <Link
                to="/place-order"
                className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
              >
                Mua ngay
              </Link>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Mô tả sản phẩm</h3>
              <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-line">
                {product.description || "Chưa có mô tả cho sản phẩm này."}
              </p>
            </div>

            {/* Thông tin cửa hàng và nút nhắn tin */}
            {storeInfo && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {storeInfo.image && (
                      <img 
                        src={storeInfo.image.startsWith('http') ? storeInfo.image : `${backendURL}/${storeInfo.image}`}
                        alt={storeInfo.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">{storeInfo.name}</h4>
                      <p className="text-sm text-gray-500">Cửa hàng</p>
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