import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import IconView from "../../assets/home/icon-view.svg";
import IconDelete from "../../assets/home/icon-delete.svg";
import IconEdit from "../../assets/home/icon-edit.svg";


const ListProduct = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 10;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendURL =
          import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
        const token = localStorage.getItem("sellerToken");
        const res = await axios.get(`${backendURL}/products`, {
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
  const handleDetail = (id) => navigate(`/seller/product-detail/${id}`);

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setOpenUpdate(true);
  };

  const handleUpdateSubmit = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setOpenUpdate(false);
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
    <div className="p-14 space-y-6">
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
              <th className="p-3 text-left w-[120px]">Ảnh</th>
              <th className="p-3 text-left w-[150px]">Tên sản phẩm</th>
              <th className="p-3 text-center [120px]">Đã bán</th>
              <th className="p-3 text-center [120px]">Đánh giá trung bình</th>
              <th className="p-3 text-center [120px]">Lượt đánh giá</th>
              <th className="p-3 text-center w-[150px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-gray-300/30 hover:bg-gray-50 transition">
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentProducts.length === 0 ? (
              <tr className="border-b border-gray-300/30 hover:bg-gray-50 transition">
                <td colSpan="8" className="text-center p-4 text-gray-500">
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
                  <td className="p-3 text-leftleft">{product.name}</td>
                  <td className="p-3 text-center">{product.sold || 0} </td>
                  <td className="p-3 text-center text-yellow-500">
                    {product.rating_average || 0} ⭐ 
                  </td>
                  <td className="p-3 text-center">{product.review_numbers || 0} </td>
                  <td className="p-3 text-center flex justify-center gap-1">
                    {/* Xem chi tiết */}
                    <button
                      onClick={() => handleDetail(product.id)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconView} alt="Xem" className="w-5 h-5" />
                    </button>

                    {/* Cập nhật */}
                    <button
                      onClick={() => handleUpdate(product)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconEdit} alt="Sửa" className="w-5 h-5" />
                    </button>

                    {/* Xóa */}
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <img src={IconDelete} alt="Xóa" className="w-5 h-5" />
                    </button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Cập nhật sản phẩm
            </h2>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { key: "name", label: "Tên sản phẩm" },
                { key: "description", label: "Mô tả" },
                { key: "origin", label: "Xuất xứ" },
                { key: "discount", label: "Giảm giá (%)" },
                { key: "sold", label: "Số lượng đã bán" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={selectedProduct?.[field.key] || ""}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenUpdate(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleUpdateSubmit(selectedProduct)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
