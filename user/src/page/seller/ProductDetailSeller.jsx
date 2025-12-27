import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import { IoClose, IoAdd, IoTrash, IoPencil, IoArrowBack } from "react-icons/io5";

const ProductDetailSeller = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { backendURL } = useContext(ShopContext);
  const token = localStorage.getItem("sellerToken");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]); // Danh sách attributes của category

  // Modal states
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [showEditVariant, setShowEditVariant] = useState(false);
  const [showDeleteVariant, setShowDeleteVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state cho variant
  const [variantForm, setVariantForm] = useState({
    price: "",
    stock_quantity: "",
    options: [], // [{attributeId, attributeName, value}]
  });

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendURL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data?.doc;
        setProduct(data);
        setVariants(data?.ProductVariants || []);
        
        // Fetch attributes của category
        if (data?.categoryId) {
          const catRes = await axios.get(`${backendURL}/categories/${data.categoryId}`);
          const categoryAttributes = catRes.data?.data?.doc?.CategoryAttributes || [];
          setAttributes(categoryAttributes);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, backendURL, token]);

  // Reset form
  const resetForm = () => {
    setVariantForm({
      price: "",
      stock_quantity: "",
      options: attributes.map(attr => ({
        attributeId: attr.id,
        attributeName: attr.name,
        value: ""
      })),
    });
  };

  // Cập nhật option value
  const updateOptionValue = (index, value) => {
    const newOptions = [...variantForm.options];
    newOptions[index].value = value;
    setVariantForm({ ...variantForm, options: newOptions });
  };

  // Mở modal thêm variant
  const handleOpenAddVariant = () => {
    setVariantForm({
      price: "",
      stock_quantity: "",
      options: attributes.map(attr => ({
        attributeId: attr.id,
        attributeName: attr.name,
        value: ""
      })),
    });
    setShowAddVariant(true);
  };

  // Mở modal sửa variant
  const handleOpenEditVariant = (variant) => {
    setSelectedVariant(variant);
    setVariantForm({
      price: variant.price || "",
      stock_quantity: variant.stock_quantity || "",
      options: variant.ProductVariantOptions?.map((opt) => ({
        attributeId: opt.attributeId,
        attributeName: opt.VariantOptionAttribute?.name || "",
        value: opt.value || "",
      })) || [],
    });
    setShowEditVariant(true);
  };

  // Mở modal xóa variant
  const handleOpenDeleteVariant = (variant) => {
    setSelectedVariant(variant);
    setShowDeleteVariant(true);
  };


  // Thêm variant mới
  const handleAddVariant = async () => {
    if (!variantForm.price || Number(variantForm.price) <= 0) {
      toast.warning("Vui lòng nhập giá hợp lệ (> 0)");
      return;
    }
    if (!variantForm.stock_quantity || Number(variantForm.stock_quantity) < 0) {
      toast.warning("Vui lòng nhập số lượng tồn kho hợp lệ (>= 0)");
      return;
    }

    // Lọc các options có value
    const filledOptions = variantForm.options.filter(opt => opt.value && opt.value.trim());
    if (filledOptions.length === 0) {
      toast.warning("Vui lòng nhập ít nhất một thuộc tính");
      return;
    }

    setSaving(true);
    try {
      // Chuyển đổi sang format API yêu cầu
      const payload = {
        price: Number(variantForm.price),
        stock_quantity: Number(variantForm.stock_quantity),
        variant_options: [{
          attributeIds: filledOptions.map(opt => opt.attributeId),
          values: filledOptions.map(opt => opt.value)
        }]
      };

      const res = await axios.post(
        `${backendURL}/product-variants/${productId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Thêm biến thể thành công!");
        // Refresh variants
        const productRes = await axios.get(`${backendURL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVariants(productRes.data?.data?.doc?.ProductVariants || []);
        setShowAddVariant(false);
        resetForm();
      }
    } catch (err) {
      console.error("Lỗi thêm variant:", err);
      toast.error(err.response?.data?.message || "Thêm biến thể thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật variant
  const handleUpdateVariant = async () => {
    if (!variantForm.price || Number(variantForm.price) <= 0) {
      toast.warning("Vui lòng nhập giá hợp lệ (> 0)");
      return;
    }
    if (!variantForm.stock_quantity || Number(variantForm.stock_quantity) < 0) {
      toast.warning("Vui lòng nhập số lượng tồn kho hợp lệ (>= 0)");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        price: Number(variantForm.price),
        stock_quantity: Number(variantForm.stock_quantity),
      };

      const res = await axios.patch(
        `${backendURL}/product-variants/${selectedVariant.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Cập nhật biến thể thành công!");
        // Refresh variants
        const productRes = await axios.get(`${backendURL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVariants(productRes.data?.data?.doc?.ProductVariants || []);
        setShowEditVariant(false);
        setSelectedVariant(null);
        resetForm();
      }
    } catch (err) {
      console.error("Lỗi cập nhật variant:", err);
      toast.error(err.response?.data?.message || "Cập nhật biến thể thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Xóa variant
  const handleDeleteVariant = async () => {
    setSaving(true);
    try {
      const res = await axios.delete(
        `${backendURL}/product-variants/${selectedVariant.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Xóa biến thể thành công!");
        setVariants(variants.filter((v) => v.id !== selectedVariant.id));
        setShowDeleteVariant(false);
        setSelectedVariant(null);
      }
    } catch (err) {
      console.error("Lỗi xóa variant:", err);
      toast.error(err.response?.data?.message || "Xóa biến thể thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center items-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-16 flex justify-center items-center">
        <div className="text-gray-500">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  return (
    <div className="p-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/seller/list-product")}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <IoArrowBack size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-6">
          <img
            src={product.main_image}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.description || "Không có mô tả"}</p>
            <div className="flex gap-6 text-sm">
              <span><b>Xuất xứ:</b> {product.origin || "N/A"}</span>
              <span><b>Đã bán:</b> {product.sold || 0}</span>
              <span className="text-yellow-600"><b>Đánh giá:</b> {product.rating_average || 0} ⭐</span>
            </div>
          </div>
        </div>
      </div>


      {/* Danh sách biến thể */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Biến thể sản phẩm ({variants.length})
          </h3>
          <button
            onClick={handleOpenAddVariant}
            className="flex items-center gap-2 px-4 py-2 bg-[#116AD1] text-white rounded-lg hover:bg-[#0e5bbc] transition"
          >
            <IoAdd size={20} />
            Thêm biến thể
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có biến thể nào. Nhấn "Thêm biến thể" để tạo mới.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Thuộc tính</th>
                  <th className="p-3 text-right">Giá</th>
                  <th className="p-3 text-center">Tồn kho</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">#{variant.id}</td>
                    <td className="p-3">
                      {variant.ProductVariantOptions?.filter(opt => opt.value).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {variant.ProductVariantOptions.filter(opt => opt.value).map((opt) => (
                            <span
                              key={opt.id}
                              className="px-2 py-1 bg-blue-100 text-[#116AD1] rounded text-xs"
                            >{opt.value}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Mặc định</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-semibold text-[#116AD1]">
                      {variant.price?.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          variant.stock_quantity > 10
                            ? "bg-green-100 text-green-700"
                            : variant.stock_quantity > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {variant.stock_quantity}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditVariant(variant)}
                          className="p-2 text-[#116AD1] hover:bg-blue-50 rounded-full transition"
                          title="Sửa"
                        >
                          <IoPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteVariant(variant)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                          title="Xóa"
                        >
                          <IoTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Modal Thêm Variant */}
      {showAddVariant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-[#116AD1] text-white rounded-t-xl">
              <h2 className="text-lg font-bold">Thêm biến thể mới</h2>
              <button onClick={() => setShowAddVariant(false)}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Nhập giá"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={variantForm.stock_quantity}
                  onChange={(e) => setVariantForm({ ...variantForm, stock_quantity: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Nhập số lượng"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Thuộc tính</label>
                {attributes.length === 0 ? (
                  <p className="text-gray-500 text-sm">Danh mục này chưa có thuộc tính nào.</p>
                ) : (
                  <div className="space-y-3">
                    {variantForm.options.map((opt, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <label className="w-32 text-sm text-gray-700 font-medium">
                          {opt.attributeName}:
                        </label>
                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => updateOptionValue(index, e.target.value)}
                          className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowAddVariant(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddVariant}
                  disabled={saving}
                  className="px-4 py-2 bg-[#116AD1] text-white rounded-lg hover:bg-[#0e5bbc] disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal Sửa Variant */}
      {showEditVariant && selectedVariant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-[#116AD1] text-white rounded-t-xl">
              <h2 className="text-lg font-bold">Sửa biến thể #{selectedVariant.id}</h2>
              <button onClick={() => setShowEditVariant(false)}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Nhập giá"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={variantForm.stock_quantity}
                  onChange={(e) => setVariantForm({ ...variantForm, stock_quantity: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Nhập số lượng"
                />
              </div>

              {/* Hiển thị thuộc tính hiện tại (chỉ đọc) */}
              {variantForm.options.length > 0 && variantForm.options[0].attributeName && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Thuộc tính hiện tại</label>
                  <div className="flex flex-wrap gap-2">
                    {variantForm.options.map((opt, index) => (
                      opt.attributeName && opt.value && (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        > {opt.value}
                        </span>
                      )
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    * Không thể sửa thuộc tính. Hãy xóa và tạo biến thể mới nếu cần thay đổi.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowEditVariant(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateVariant}
                  disabled={saving}
                  className="px-4 py-2 bg-[#116AD1] text-white rounded-lg hover:bg-[#0e5bbc] disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Cập nhật"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xóa Variant */}
      {showDeleteVariant && selectedVariant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[400px]">
            <div className="p-5">
              <h2 className="text-lg font-bold text-red-600 mb-3">Xác nhận xóa</h2>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa biến thể <b>#{selectedVariant.id}</b> không?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Giá: {selectedVariant.price?.toLocaleString("vi-VN")}đ | 
                Tồn kho: {selectedVariant.stock_quantity}
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteVariant(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteVariant}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailSeller;
