import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";


const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("sellerToken");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Component hiển thị sao
const Star = ({ n }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) =>
      i < n ? (
        <StarIcon
          key={i}
          className="text-yellow-400"
          fontSize="small"
        />
      ) : (
        <StarBorderIcon
          key={i}
          className="text-gray-300"
          fontSize="small"
        />
      )
    )}
  </div>
);

// Component chọn sản phẩm với ảnh
const ProductSelector = ({ value, onChange, show, setShow, products, selected }) => (
  <div className="relative">
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 min-w-[200px] sm:min-w-[280px] shadow-sm"
    >
      {selected ? (
        <>
          <img
            src={selected.main_image}
            alt={selected.name}
            className="w-10 h-10 object-cover rounded"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
          <div className="flex-1 text-left min-w-0">
            <p className="font-medium truncate">{selected.name}</p>
            <p className="text-xs text-gray-500">{selected.min_price?.toLocaleString()}đ</p>
          </div>
        </>
      ) : (
        <span className="text-gray-500">-- Chọn sản phẩm để xem đánh giá --</span>
      )}
      <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {show && (
      <div className="absolute z-20 mt-1 w-full sm:w-[320px] bg-white border rounded-lg shadow-lg max-h-[350px] overflow-y-auto">
        <div
          onClick={() => {
            onChange("");
            setShow(false);
          }}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
        >
          <span className="text-gray-500 text-sm">-- Bỏ chọn --</span>
        </div>
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              onChange(String(p.id));
              setShow(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer ${
              value === String(p.id) ? "bg-blue-50 border-l-4 border-[#116AD1]" : ""
            }`}
          >
            <img
              src={p.main_image}
              alt={p.name}
              className="w-12 h-12 object-cover rounded border"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-gray-500">{p.min_price?.toLocaleString()}đ</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-xs text-gray-600">
                  {p.rating_average?.toFixed(1) || "0"} ({p.review_numbers || 0} đánh giá)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Rating = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 = tất cả
  const [searchText, setSearchText] = useState("");

  // Fetch danh sách sản phẩm của store
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/store`, getAuthHeaders());
      setProducts(res.data?.data?.products || res.data?.data?.docs || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch reviews của sản phẩm đã chọn
  const fetchReviews = async () => {
    if (!productId) {
      setReviews([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reviews/product/${productId}`);
      setReviews(res.data?.data?.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Lấy sản phẩm đã chọn
  const selectedProduct = products.find((p) => p.id === Number(productId));

  // Filter reviews theo rating và search text
  const filteredReviews = reviews.filter((r) => {
    const matchRating = filterRating === 0 || r.rating === filterRating;
    const matchSearch =
      !searchText ||
      r.text?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.ReviewClient?.username?.toLowerCase().includes(searchText.toLowerCase());
    return matchRating && matchSearch;
  });

  // Thống kê rating
  const ratingStats = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-14 space-y-4">
      {/* Header gọn: Tiêu đề + Chọn sản phẩm */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Đánh giá sản phẩm</h2>
          <ProductSelector
            value={productId}
            onChange={setProductId}
            show={showProductDropdown}
            setShow={setShowProductDropdown}
            products={products}
            selected={selectedProduct}
          />
        </div>
        {/* Thống kê nhanh khi đã chọn sản phẩm */}
        {selectedProduct && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="font-semibold">{avgRating}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">{reviews.length} đánh giá</span>
            <span className="text-gray-300">|</span>
            <div className="flex gap-1">
              {[5,4,3,2,1].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterRating(filterRating === s ? 0 : s)}
                  className={`px-2 py-0.5 rounded text-xs ${filterRating === s ? "bg-[#116AD1] text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {s}★
                </button>
              ))}
            </div>
            {filterRating > 0 && (
              <button onClick={() => setFilterRating(0)} className="text-xs text-red-500 hover:underline">✕</button>
            )}
          </div>
        )}
      </div>

      {/* Placeholder khi chưa chọn */}
      {!productId && (
        <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-500">Chọn sản phẩm để xem đánh giá</p>
        </div>
      )}

      {/* Danh sách đánh giá */}
      {productId && (
        <>
          {/* Tìm kiếm và danh sách đánh giá */}
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b bg-gray-50">
              <div className="font-semibold text-gray-700">
                Danh sách đánh giá ({filteredReviews.length})
              </div>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-[250px] focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                placeholder="Tìm theo nội dung/tên khách..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500">
                  {reviews.length === 0
                    ? "Chưa có đánh giá nào cho sản phẩm này"
                    : "Không tìm thấy đánh giá phù hợp"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredReviews.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-3">
                      {/* Avatar và thông tin khách */}
                      <div className="flex items-center gap-3">
                        <img
                          src={r.ReviewClient?.image || "https://via.placeholder.com/40"}
                          alt={r.ReviewClient?.username}
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {r.ReviewClient?.username || "Khách hàng"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {r.createdAt
                              ? format(new Date(r.createdAt), "dd/MM/yyyy HH:mm")
                              : ""}
                          </div>
                        </div>
                      </div>

                      {/* Rating và nội dung */}
                      <div className="flex-1">
                        <Star n={r.rating} />
                        <p className="text-gray-700 mt-2">{r.text}</p>

                        {/* Ảnh đánh giá */}
                        {r.ReviewImages && r.ReviewImages.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {r.ReviewImages.map((img, idx) => (
                              <img
                                key={idx}
                                src={`${API_BASE.replace("/api", "")}/reviewImages/${img.url}`}
                                alt={`Review image ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                                onClick={() => window.open(`${API_BASE.replace("/api", "")}/reviewImages/${img.url}`, "_blank")}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Rating;