import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
const AddProduct = () => {
  const { backendURL, categories, getAllCategories, createProduct } = useContext(ShopContext);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    origin: "",
    categoryId: "",
  });

  const [variants, setVariants] = useState([]);
  const [main_image, setMainImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [slide_images, setslide_images] = useState([]);
  const [previewslide_images, setPreviewslide_images] = useState([]);
  const [message, setMessage] = useState("");
  const [createdProductId, setCreatedProductId] = useState(null);
  const [categoryAttributesValues, setCategoryAttributesValues] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setProduct((prev) => ({ ...prev, categoryId }));
    if (!categoryId) {
      setCategoryAttributesValues([]);
      return;
    }

    try {
      const token = localStorage.getItem("sellerToken");
      const res = await axios.get(`${backendURL}/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const attrs = res.data?.data?.doc?.CategoryAttributes || [];
      const formattedAttrs = attrs.map(attr => ({
        id: attr.id,
        name: attr.name,
        values: [],
      }));

      setCategoryAttributesValues(formattedAttrs);
    } catch (err) {
      console.error("Lỗi tải thuộc tính:", err);
    }
  };

  const handleAddValue = (index) => {
    const newAttrs = [...categoryAttributesValues];
    newAttrs[index].values.push("");
    setCategoryAttributesValues(newAttrs);
  };

  const handleRemoveValue = (attrIndex, valIndex) => {
    const newAttrs = [...categoryAttributesValues];
    newAttrs[attrIndex].values.splice(valIndex, 1);
    setCategoryAttributesValues(newAttrs);
  };

  const handleValueChange = (attrIndex, valIndex, val) => {
    const newAttrs = [...categoryAttributesValues];
    newAttrs[attrIndex].values[valIndex] = val;
    setCategoryAttributesValues(newAttrs);
  };

  const createVariants = () => {
    const validAttrs = categoryAttributesValues.filter(attr =>
      attr.values.some(v => v.trim() !== "")
    );
    if (validAttrs.length === 0) return [];

    const arrays = validAttrs.map(attr => attr.values.filter(v => v.trim() !== ""));
    const cartesian = (arr) =>
      arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

    return cartesian(arrays).map(combo => {
      const variant = {};
      validAttrs.forEach((attr, idx) => variant[attr.name] = combo[idx]);
      return { ...variant, price: "", stock: "" };
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const validateProduct = () => {
    if (product.name.trim().length < 3 || product.name.trim().length > 30)
      return "Tên sản phẩm phải từ 3–30 ký tự!";
    if (product.description.trim().length < 20 || product.description.trim().length > 255)
      return "Mô tả phải từ 20–255 ký tự!";
    if (product.origin.trim().length > 100)
      return "Xuất xứ không vượt quá 100 ký tự!";
    if (!product.categoryId)
      return "Vui lòng chọn danh mục!";
    if (!main_image)
      return "Vui lòng chọn ảnh chính!";
    if (categoryAttributesValues.length === 0 || categoryAttributesValues.every(attr => attr.values.length === 0))
      return "Danh mục này chưa có thuộc tính! Vui lòng thêm ít nhất 1 thuộc tính.";
    for (const attr of categoryAttributesValues) {
      if (attr.values.some(v => !v.trim()))
        return `Vui lòng nhập đầy đủ giá trị cho thuộc tính "${attr.name}"`;
    }
    return null;
  };

  // ✅ Gọi API tạo sản phẩm qua hàm context
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateProduct();
    if (error) {
      setMessage(error);
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    const combos = createVariants();
    if (combos.length > 0) {
      setVariants(combos);
      await submitToServer();
      setShowVariantModal(true);
    } else {
      submitToServer();
    }
  };

  const submitToServer = async () => {
    const formData = new FormData();
    formData.append("name", product.name.trim());
    formData.append("description", product.description.trim());
    formData.append("origin", product.origin.trim());
    formData.append("categoryId", product.categoryId || "");
    if (main_image) formData.append("main_image", main_image);
    slide_images.forEach(img => {
      if (img) formData.append("slide_images", img);
    });

    const res = await createProduct(formData);
    if (res?.data?.product?.id) {
      setCreatedProductId(res.data.product.id);
    }
  };

  // ✅ Các hàm xử lý popup, hủy sản phẩm, gửi biến thể giữ nguyên
  const handleCancelProduct = async () => {
    if (!createdProductId) {
      setShowVariantModal(false);
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc muốn hủy sản phẩm này không?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("sellerToken");
      await axios.delete(`${backendURL}/products/${createdProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Sản phẩm đã bị hủy!");
      setTimeout(() => setMessage(""), 3000);

      // Reset toàn bộ
      setProduct({ name: "", description: "", origin: "", categoryId: "" });
      setMainImage(null);
      setPreviewMainImage(null);
      setslide_images([]);
      setPreviewslide_images([]);
      setCategoryAttributesValues([]);
      setVariants([]);
      setCreatedProductId(null);
      setShowVariantModal(false);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const handleCloseModal = async () => {
    if (!createdProductId) {
      setShowVariantModal(false);
      return;
    }
    try {
      const token = localStorage.getItem("sellerToken");
      await axios.delete(`${backendURL}/products/${createdProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedProductId(null);
      setVariants([]);
      setShowVariantModal(false);
      setMessage("Sản phẩm hiện tại đã bị xóa khỏi DB.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const submitVariantsToServer = async () => {
    if (!createdProductId) {
      alert("Chưa có sản phẩm để tạo biến thể!");
      return;
    }

    try {
      const token = localStorage.getItem("sellerToken");
      const payload = variants.map((variant) => {
        const attributeIds = [];
        const values = [];

        categoryAttributesValues.forEach((attr) => {
          attributeIds.push(attr.id);
          values.push(variant[attr.name]);
        });

        return {
          price: Number(variant.price),
          stock_quantity: Number(variant.stock),
          variant_options: [
            { attributeIds, values },
          ],
        };
      });

      for (const variantData of payload) {
        await axios.post(
          `${backendURL}/product-variants/${createdProductId}`,
          variantData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Đã tạo tất cả biến thể thành công!", { autoClose: 2000 });
      setShowVariantModal(false);
      setProduct({ name: "", description: "", origin: "", categoryId: "" });
      setMainImage(null);
      setPreviewMainImage(null);
      setslide_images([]);
      setPreviewslide_images([]);
      setCategoryAttributesValues([]);
      setVariants([]);
      setCreatedProductId(null);
    } catch (err) {
      console.error("Lỗi khi tạo biến thể:", err);
      setMessage("Tạo biến thể thất bại!");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  return (
    <div className="p-8 flex gap-4 items-start text-sm mt-6">
      <div className="flex-[3] bg-white shadow rounded-lg p-4">
        <h2 className="text-base font-semibold mb-3">🛍️ Thêm sản phẩm mới</h2>
        {message && (
          <div className={`mb-2 text-center text-xs font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border rounded-lg p-3 space-y-2">
            <h3 className="font-medium text-gray-700 text-sm mb-2">📄 Thông tin chung</h3>
            <input
              placeholder="Tên sản phẩm"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="border rounded px-3 py-2 w-full text-sm"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Xuất xứ"
                value={product.origin}
                onChange={(e) => setProduct({ ...product, origin: e.target.value })}
                className="border rounded px-3 py-2 w-full text-sm"
                required
              />
              <select
                value={product.categoryId}
                onChange={handleCategoryChange}
                className="border rounded px-3 py-2 w-full text-sm"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cate => <option key={cate.id} value={cate.id}>{cate.name}</option>)}
              </select>
            </div>
          </div>

          {/* Ảnh chính & phụ */}
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1 text-center">Ảnh chính</label>
              <div
                className="border-2 border-dashed w-[100px] h-[100px] rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => document.getElementById("mainImageInput").click()}
              >
                {previewMainImage ? (
                  <img src={previewMainImage} alt="preview" className="mx-auto w-[85px] h-[85px] object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="text-gray-500 text-xs">📷 <br /> Chọn ảnh</div>
                )}
              </div>
              <input id="mainImageInput" type="file" accept="image/*"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) { setMainImage(file); setPreviewMainImage(URL.createObjectURL(file)); } }}
                className="hidden"
              />
            </div>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="col-span-1 text-center relative">
                <label className="block text-sm font-medium mb-1">Ảnh phụ {i + 1}</label>
                <div className="border-2 border-dashed rounded-lg w-[100px] h-[100px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition relative"
                  onClick={() => document.getElementById(`slideImageInput-${i}`).click()}>
                  {previewslide_images[i] ? (
                    <>
                      <img src={previewslide_images[i]} alt={`slide-${i}`} className="w-full h-full object-contain rounded-lg" />
                      <button type="button" className="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        onClick={(e) => { e.stopPropagation(); const newFiles = [...slide_images]; const newPreviews = [...previewslide_images]; newFiles[i] = null; newPreviews[i] = null; setslide_images(newFiles); setPreviewslide_images(newPreviews); }}>
                        <CloseIcon style={{ fontSize: '14px' }} />
                      </button>
                    </>
                  ) : <div className="text-gray-500 w-[85px] h-[85px] text-xs text-center">🖼️ <br /> Chọn ảnh</div>}
                </div>
                <input id={`slideImageInput-${i}`} type="file" accept="image/*"
                  onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const newFiles = [...slide_images]; const newPreviews = [...previewslide_images]; newFiles[i] = file; newPreviews[i] = URL.createObjectURL(file); setslide_images(newFiles); setPreviewslide_images(newPreviews); }}
                  className="hidden" />
              </div>
            ))}
          </div>

          <textarea rows="3" placeholder="Mô tả sản phẩm"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="border rounded px-3 py-2 w-full" required />

          <button type="submit"
            className="mt-2 bg-[#116AD1] text-white rounded px-3 py-2 hover:bg-[#0e57aa] w-full text-sm font-medium">
            Thêm sản phẩm
          </button>
        </form>
      </div>

      {/* Cột phải */}
      <div className="flex-[2] bg-white shadow rounded-lg p-4 max-h-[85vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Loại thuộc tính</h3>
        {categoryAttributesValues.length === 0 && <div className="text-gray-400 text-sm">Chọn danh mục để thêm thuộc tính</div>}
        {categoryAttributesValues.map((attr, index) => (
          <div key={attr.id} className="mb-4 bg-gray-50 p-3 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">{attr.name}</h4>
            {attr.values.map((val, i) => (
              <div key={i} className="flex items-center mb-2 gap-2">
                <input type="text" value={val} onChange={(e) => handleValueChange(index, i, e.target.value)}
                  className="border rounded px-2 py-1 w-full text-sm" placeholder="Nhập giá trị" />
                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveValue(index, i)}>
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded text-blue-700 font-medium text-sm"
              onClick={() => handleAddValue(index)}
            >
              <AddIcon fontSize="small" /> Thêm giá trị
            </button>
          </div>
        ))}
      </div>

      {showVariantModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg w-[60%] max-h-[90vh] overflow-y-auto relative shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Tổ hợp thuộc tính</h3>

            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={handleCloseModal}
            >
              ✖
            </button>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full table-auto border text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    {categoryAttributesValues.map(attr => (
                      <th key={attr.id} className="border px-3 py-2">{attr.name}</th>
                    ))}
                    <th className="border px-3 py-2">Giá</th>
                    <th className="border px-3 py-2">Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => (
                    <tr key={idx} className="text-center hover:bg-gray-50">
                      {categoryAttributesValues.map(attr => (
                        <td key={attr.id} className="border px-2 py-1">{variant[attr.name]}</td>
                      ))}
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={variant.price ?? ""}
                          onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                          className="border rounded px-2 py-1 w-full text-sm text-center"
                          placeholder="Nhập giá"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={variant.stock ?? ""}
                          onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                          className="border rounded px-2 py-1 w-full text-sm text-center"
                          placeholder="Nhập tồn kho"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nút hành động sát form hơn, bố cục đẹp hơn */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={handleCancelProduct}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={submitVariantsToServer}
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddProduct;
