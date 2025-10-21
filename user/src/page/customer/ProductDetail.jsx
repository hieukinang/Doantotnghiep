import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const { product, getProduct, backendURL } = useContext(ShopContext);

  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  // 🟦 Lấy sản phẩm theo ID
  useEffect(() => {
    if (productId) {
      getProduct(productId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);


  // 🟦 Tạo danh sách ảnh hiển thị
  const gallery = [
    product.main_image,
    ...(product.ProductImages?.map((img) => img.image_url) || []),
  ];

  // 🟦 Tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    if (!gallery.length) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const attributes = product.attributes || [];

  const handleOptionChange = (attrName, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attrName]: option,
    }));
  };

  const handleAddToCart = () => {
    console.log("🛒 Đặt hàng với thuộc tính:", selectedOptions);
  };

  // 🟦 Khi dữ liệu sản phẩm chưa load xong
  if (!product || !product.id) {
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
          {/* 🟩 Ảnh sản phẩm */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow relative">
              <img
                src={
                  gallery[active]?.startsWith("http")
                    ? gallery[active]
                    : `${backendURL}/${gallery[active]}`
                }
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
              />

              {/* Nút chuyển ảnh trái phải */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActive((prev) =>
                        prev === 0 ? gallery.length - 1 : prev - 1
                      )
                    }
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActive((prev) => (prev + 1) % gallery.length)
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dot nhỏ hiển thị ảnh */}
            {gallery.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-3 h-3 rounded-full ${i === active ? "bg-[#116AD1]" : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 🟦 Chi tiết sản phẩm */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <div className="mt-2 text-sm text-gray-500">
              ⭐ {product.rating || "4.8"} • Đã bán {product.sold || 0} • Kho:{" "}
              {product.stock || 0}
            </div>

            {product.shipping_free && (
              <div className="mt-3 bg-[#116AD1]/10 text-[#116AD1] inline-block px-3 py-1 rounded">
                Miễn phí vận chuyển
              </div>
            )}

            {/* Giá */}
            <div className="mt-4">
              <div className="text-2xl font-bold text-[#116AD1]">
                {product.price
                  ? `${product.price.toLocaleString()}₫`
                  : "Liên hệ"}
              </div>
              {product.original_price && (
                <div className="text-sm line-through text-gray-400">
                  {product.original_price.toLocaleString()}₫
                </div>
              )}
            </div>

            {/* 🟦 Thuộc tính (size, màu...) */}
            {attributes.length > 0 && (
              <div className="mt-6 space-y-4">
                {attributes.map((attr, idx) => (
                  <div key={idx}>
                    <h3 className="font-medium mb-2">{attr.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {attr.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            handleOptionChange(attr.name, option)
                          }
                          className={`px-3 py-1 border rounded ${selectedOptions[attr.name] === option
                            ? "bg-[#116AD1] text-white border-[#116AD1]"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🟩 Thêm giỏ hàng + Mua ngay */}
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

            {/* 🟦 Mô tả sản phẩm */}
            <div className="mt-6">
              <h3 className="font-semibold">Mô tả sản phẩm</h3>
              <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-line">
                {product.description || "Chưa có mô tả cho sản phẩm này."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
