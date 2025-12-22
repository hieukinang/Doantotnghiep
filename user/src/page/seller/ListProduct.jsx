import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import IconView from "../../assets/home/icon-view.svg";
import IconDelete from "../../assets/home/icon-delete.svg";
import IconEdit from "../../assets/home/icon-edit.svg";
import { ShopContext} from "../../context/ShopContext"

const ListProduct = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [slideImages, setSlideImages] = useState([]);
  const [updating, setUpdating] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const itemsPerPage = 10;
  const { backendURL } = useContext(ShopContext);
  const token = localStorage.getItem("sellerToken");

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/products/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data?.data?.products || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- FETCH PRODUCT DETAIL ---
  const fetchProductDetail = async (productId) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`${backendURL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductDetail(res.data?.data?.doc || null);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- SEARCH & PAGINATION ---
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage-1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // --- HANDLERS ---
  const handleDetail = async (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
    await Promise.all([
      fetchProductDetail(product.id),
      fetchProductReviews(product.id),
    ]);
  };

  const handleUpdate = async (product) => {
    setSelectedProduct({ ...product });
    setMainImage(null);
    setSlideImages([]);
    setOpenUpdate(true);
    // Fetch chi tiết để có đầy đủ thông tin
    await fetchProductDetail(product.id);
  };

  const handleUpdateSubmit = async () => {
    const backendURL =
      import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
    const token = localStorage.getItem("sellerToken");
    if (!productDetail) return;

    setUpdating(true);
    try {
      const formData = new FormData();

      // Chỉ append các trường có giá trị
      if (productDetail.name) formData.append("name", productDetail.name);
      if (productDetail.description)
        formData.append("description", productDetail.description);
      if (productDetail.origin) formData.append("origin", productDetail.origin);

      if (mainImage) {
        formData.append("main_image", mainImage);
      }

      if (slideImages.length > 0) {
        slideImages.forEach((file) => {
          formData.append("slide_images", file);
        });
      }

      const res = await axios.patch(
        `${backendURL}/products/store/${productDetail.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProduct = res.data?.data?.doc;

      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      alert("Cập nhật sản phẩm thành công!");
      setOpenUpdate(false);
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      alert(
        "Cập nhật sản phẩm thất bại: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `${backendURL}/reviews/product/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
      setReviews(res.data?.data?.reviews || []);
    } catch (err) {
      console.error("Lỗi khi tải review sản phẩm:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setOpenDelete(false);
  };

  return (
    <div className="p-16">
      {/* --- TÌM KIẾM + THÊM SẢN PHẨM --- */}
      <div className="flex justify-end items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-full px-6 py-2.5 w-1/3 text-sm"
        />

        <Link
          to="/seller/add-product"
          className="px-6 py-2.5 bg-gradient-to-r from-[#116AD1] to-[#1E88E5] text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* --- BẢNG DANH SÁCH SẢN PHẨM --- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-blue-600 text-white">
            <tr className="border-b border-gray-300/30 transition">
              <th className="p-3 text-left w-[50px]">STT</th>
              <th className="p-3 text-left w-[100px]">Ảnh</th>
              <th className="p-3 text-left w-[120px]">Tên sản phẩm</th>
              <th className="p-3 text-center [120px]">Xuất xứ</th>
              <th className="p-3 text-center [100px]">Đã bán</th>
              <th className="p-3 text-center [120px]">Giảm giá</th>
              <th className="p-3 text-center [120px]">Đánh giá trung bình</th>
              <th className="p-3 text-center [120px]">Lượt đánh giá</th>
              <th className="p-3 text-center w-[150px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-gray-300/30 hover:bg-gray-50 transition">
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentProducts.length === 0 ? (
              <tr className="border-b border-gray-300/30 hover:bg-gray-50 transition">
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  Không có sản phẩm nào phù hợp
                </td>
              </tr>
            ) : (
              currentProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-300/30 hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-center relative">{startIndex + index + 1}</td>
                  <td className="p-3">
                    <img
                      src={product.main_image || "product-5-1760409467076-main.jpeg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="p-3 text-left">{product.name}</td>
                  <td className="p-3 text-center">{product.origin} </td>
                  <td className="p-3 text-center">{product.sold || 0} </td>
                  <td className="p-3 text-center">{product.discount || 0} </td>
                  <td className="p-3 text-center text-yellow-500">
                    {product.rating_average || 5} ⭐
                  </td>
                  <td className="p-3 text-center">{product.review_numbers || 0} </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-0.1">
                      {/* Xem chi tiết */}
                      <div className="relative group">
                        <button
                          onClick={() => handleDetail(product)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <img src={IconView} alt="Xem chi tiết" className="w-5 h-5" />
                        </button>
                        <span
                          className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                          bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                          group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          Xem chi tiết
                        </span>
                      </div>

                      {/* Cập nhật */}
                      <div className="relative group">
                        <button
                          onClick={() => handleUpdate(product)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <img src={IconEdit} alt="Cập nhật" className="w-5 h-5" />
                        </button>
                        <span
                          className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                          bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                          group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          Cập nhật
                        </span>
                      </div>

                      {/* Xóa */}
                      <div className="relative group">
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <img src={IconDelete} alt="Xóa" className="w-5 h-5" />
                        </button>
                        <span
                          className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
                          bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                          group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          Xóa
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ←
          </button>
          <span className="text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p+1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            →
          </button>
        </div>
      )}

      {/* --- POPUP CHI TIẾT SẢN PHẨM --- */}
      {openDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
              <h2 className="text-xl font-bold">
                Chi tiết sản phẩm
              </h2>
              <button
                onClick={() => setOpenDetail(false)}
                className="text-white hover:text-gray-200 text-3xl font-light leading-none transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">

            {loadingDetail ? (
              <div className="text-center py-8 text-gray-500">
                Đang tải chi tiết...
              </div>
            ) : productDetail ? (
              <div className="space-y-5">

                {/* DÒNG 1: TÊN */}
                <h1 className="text-2xl font-bold text-gray-800">
                  {productDetail.name}
                </h1>

                {/* DÒNG 2: ẢNH CHÍNH + ẢNH PHỤ */}
                <div className="flex gap-4">
                  {/* Ảnh chính */}
                  <img
                    src={productDetail.main_image}
                    alt={productDetail.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  {/* Ảnh phụ */}
                  {productDetail.ProductImages?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {productDetail.ProductImages.map((img) => (
                        <img
                          key={img.id}
                          src={img.image_url}
                          alt="Product"
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* DÒNG 3: BIẾN THỂ */}
                {productDetail.ProductVariants?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Biến thể sản phẩm
                    </h3>
                    <div className="space-y-2">
                      {productDetail.ProductVariants.map((variant) => (
                        <div
                          key={variant.id}
                          className="border rounded-lg p-2 bg-gray-50 text-sm"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="font-medium">Giá</span>
                              <p className="text-blue-600 font-semibold">
                                {variant.price?.toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Tồn kho</span>
                              <p>{variant.stock_quantity}</p>
                            </div>
                            <div>
                              {variant.ProductVariantOptions?.map((opt) => (
                                <p key={opt.id}>
                                {opt.VariantOptionAttribute?.name}: {opt.value}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DÒNG 4: TRẠNG THÁI + ĐÃ BÁN */}
                <div className="flex gap-8 text-sm">
                  <div>
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    {productDetail.status}
                  </div>
                  <div>
                    <span className="font-semibold">Đã bán:</span>{" "}
                    {productDetail.sold || 0}
                  </div>
                </div>

                {/* DÒNG 5: ĐÁNH GIÁ – XUẤT XỨ – GIẢM GIÁ */}
                <div className="flex gap-8 text-sm">
                  <div className="text-yellow-600">
                    <span className="font-semibold">Đánh giá:</span>{" "}
                    {productDetail.rating_average || 0} ⭐ (
                    {productDetail.review_numbers || 0})
                  </div>
                  <div>
                    <span className="font-semibold">Xuất xứ:</span>{" "}
                    {productDetail.origin || "Không có"}
                  </div>
                  {productDetail.discount > 0 && (
                    <div className="text-red-600 font-semibold">
                      Giảm giá: {productDetail.discount}%
                    </div>
                  )}
                </div>

                {/* DÒNG 6: MÔ TẢ */}
                <div>
                  <span className="font-semibold text-gray-700">Mô tả</span>
                  <p className="text-gray-600 mt-1">
                    {productDetail.description || "Không có mô tả"}
                  </p>
                </div>

                {/* ===== DÒNG 7: REVIEW KHÁCH HÀNG ===== */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Đánh giá từ khách hàng ({reviews.length})
                  </h3>

                  {loadingReviews ? (
                    <div className="text-sm text-gray-500">Đang tải đánh giá...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-sm text-gray-500">Chưa có đánh giá nào</div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rv) => (
                        <div
                          key={rv.id}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          {/* HEADER */}
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={rv.ReviewClient?.image}
                              alt={rv.ReviewClient?.username}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                            <div>
                              <p className="text-sm font-semibold">
                                {rv.ReviewClient?.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(rv.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                            <div className="ml-auto text-yellow-500 text-sm">
                              {"⭐".repeat(rv.rating)}
                            </div>
                          </div>

                          {/* CONTENT */}
                          <p className="text-sm text-gray-700 mb-2">
                            {rv.text}
                          </p>

                          {/* REVIEW IMAGES */}
                          {rv.ReviewImages?.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {rv.ReviewImages.map((img) => (
                                <img
                                  key={img.id}
                                  src={img.url}
                                  alt="Review"
                                  className="w-16 h-16 object-cover rounded-md border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không thể tải chi tiết sản phẩm
              </div>
            )}
            </div>

          {/* Footer */}
          <div className="flex justify-center mt-4 mb-2">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setOpenDetail(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP XÁC NHẬN XÓA --- */}
      {openDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold text-red-600 mb-3">
              Xác nhận xóa
            </h2>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <b>{selectedProduct?.name}</b> không?
            </p>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenDelete(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP CẬP NHẬT --- */}
      {openUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
              <h2 className="text-xl font-bold">
                Cập nhật sản phẩm
              </h2>
              <button
                onClick={() => setOpenUpdate(false)}
                className="text-white hover:text-gray-200 text-3xl font-light leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">

            {loadingDetail ? (
              <div className="text-center py-8 text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : productDetail ? (
              <div className="space-y-4">
                {/* Tên sản phẩm */}
                {productDetail.name !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productDetail.name || ""}
                      onChange={(e) =>
                        setProductDetail({
                          ...productDetail,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Mô tả */}
                {productDetail.description !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={productDetail.description || ""}
                      onChange={(e) =>
                        setProductDetail({
                          ...productDetail,
                          description: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Xuất xứ */}
                {productDetail.origin !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Xuất xứ
                    </label>
                    <input
                      type="text"
                      value={productDetail.origin || ""}
                      onChange={(e) =>
                        setProductDetail({
                          ...productDetail,
                          origin: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Ảnh chính hiện tại */}
                {productDetail.main_image && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Ảnh chính hiện tại
                    </label>
                    <img
                      src={productDetail.main_image}
                      alt="Main"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

                {/* Upload ảnh chính mới */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Thay đổi ảnh chính{" "}
                    {mainImage && (
                      <span className="text-green-600">
                        (Đã chọn file mới)
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImage(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  {mainImage && (
                    <p className="text-xs text-gray-500 mt-1">
                      File: {mainImage.name}
                    </p>
                  )}
                </div>

                {/* Ảnh phụ hiện tại */}
                {productDetail.ProductImages &&
                  productDetail.ProductImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Ảnh phụ hiện tại
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {productDetail.ProductImages.map((img) => (
                          <img
                            key={img.id}
                            src={img.image_url}
                            alt="Slide"
                            className="w-20 h-20 object-cover rounded-md border border-gray-300"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Upload ảnh phụ mới */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Thêm ảnh phụ mới{" "}
                    {slideImages.length > 0 && (
                      <span className="text-green-600">
                        ({slideImages.length} file)
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setSlideImages([...e.target.files])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  {slideImages.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {slideImages.map((f) => f.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không thể tải thông tin sản phẩm
              </div>
            )}
            </div>

            <div className="flex justify-center mt-4 mb-2 space-x-3">
              <button
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                onClick={() => setOpenUpdate(false)}
              >
                Hủy
              </button>
              <button
                disabled={updating}
                className={`px-5 py-2 text-white rounded-lg transition-colors ${
                  updating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleUpdateSubmit}
              >
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
