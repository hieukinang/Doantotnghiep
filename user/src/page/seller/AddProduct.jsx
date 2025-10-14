// import React, { useState, useEffect } from "react";
// import SellerLayout from "../../component-seller-page/SellerLayout";
// import axios from "axios";

// const AddProduct = () => {
//     const backendURL =
//         import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

//     const [product, setProduct] = useState({
//         name: "",
//         description: "",
//         origin: "",
//         categoryId: "",
//     });

//     const [slideImages, setSlideImages] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [mainImage, setMainImage] = useState(null);
//     const [previewMainImage, setPreviewMainImage] = useState(null);
//     const [previewSlideImages, setPreviewSlideImages] = useState([]);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const res = await axios.get(`${backendURL}/categories`);
//                 const docs = res.data?.data?.docs || [];
//                 setCategories(docs);
//             } catch (err) {
//                 // Handle error silently
//             }
//         };
//         fetchCategories();
//     }, [backendURL]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleMainImageChange = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setMainImage(file);
//             setPreviewMainImage(URL.createObjectURL(file));
//         }
//     };

//     const handleSlideImagesChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length === 0) return;

//         const newFiles = [...slideImages, ...files];

//         if (newFiles.length > 5) {
//             setMessage("Chỉ được chọn tối đa 5 ảnh phụ!");
//             setTimeout(() => setMessage(""), 3000);
//             return;
//         }

//         setSlideImages(newFiles);

//         const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//         setPreviewSlideImages(newPreviews);

//         e.target.value = "";
//     };

//     const removeSlideImage = (index) => {
//         const newFiles = slideImages.filter((_, i) => i !== index);
//         setSlideImages(newFiles);

//         const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//         setPreviewSlideImages(newPreviews);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!mainImage) {
//             setMessage("Vui lòng chọn ảnh chính!");
//             setTimeout(() => setMessage(""), 3000);
//             return;
//         }

//         if (product.description.length < 20) {
//             setMessage("Mô tả sản phẩm phải có ít nhất 20 ký tự!");
//             setTimeout(() => setMessage(""), 3000);
//             return;
//         }

//         if (product.description.length > 255) {
//             setMessage("Mô tả sản phẩm không được quá 255 ký tự!");
//             setTimeout(() => setMessage(""), 3000);
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append("name", product.name.trim());
//             formData.append("description", product.description.trim());
//             formData.append("origin", product.origin.trim());
//             formData.append("categoryId", product.categoryId);

//             if (mainImage) {
//                 formData.append("main_image", mainImage);
//             }

//             slideImages.forEach((file) => {
//                 formData.append("slide_images", file);
//             });

//             const token = localStorage.getItem("sellerToken");

//             const res = await axios.post(`${backendURL}/products`, formData, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setMessage("Thêm sản phẩm thành công!");

//             setProduct({
//                 name: "",
//                 description: "",
//                 origin: "",
//                 categoryId: "",
//             });
//             setMainImage(null);
//             setSlideImages([]);
//             setPreviewMainImage(null);
//             setPreviewSlideImages([]);

//             setTimeout(() => setMessage(""), 2500);
//         } catch (err) {
//             if (err.response?.data?.errors) {
//                 const errorMessages = err.response.data.errors.map(error => error.msg).join(", ");
//                 setMessage(`${errorMessages}`);
//             } else if (err.response?.data?.message) {
//                 setMessage(`${err.response.data.message}`);
//             } else {
//                 setMessage("Thêm sản phẩm thất bại!");
//             }
//         }
//     };

//     return (
//         <div className="p-14 space-y-6">
//             <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
//                 <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

//                 {message && (
//                     <div
//                         className={`mb-3 text-center text-sm font-medium ${message.includes("✅")
//                             ? "text-green-600"
//                             : "text-red-600"
//                             }`}
//                     >
//                         {message}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//                     <input
//                         name="name"
//                         placeholder="Tên sản phẩm"
//                         value={product.name}
//                         onChange={handleInputChange}
//                         className="border rounded px-3 py-2"
//                         required
//                     />

//                     <input
//                         name="origin"
//                         placeholder="Xuất xứ sản phẩm"
//                         value={product.origin}
//                         onChange={handleInputChange}
//                         className="border rounded px-3 py-2"
//                         required
//                     />

//                     <select
//                         name="categoryId"
//                         value={product.categoryId}
//                         onChange={handleInputChange}
//                         className="border rounded px-3 py-2 w-full"
//                         required
//                     >
//                         <option value="">-- Chọn danh mục --</option>
//                         {categories.map((cate) => (
//                             <option key={cate.id} value={cate.id}>
//                                 {cate.name}
//                             </option>
//                         ))}
//                     </select>

//                     <div>
//                         <label className="block mb-1 text-gray-700 font-medium">
//                             Ảnh chính
//                         </label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleMainImageChange}
//                             className="border rounded px-3 py-2 w-full"
//                             required
//                         />
//                         {previewMainImage && (
//                             <img
//                                 src={previewMainImage}
//                                 alt="Preview"
//                                 className="mt-3 w-32 h-32 object-cover rounded"
//                             />
//                         )}
//                     </div>

//                     <div>
//                         <label className="block mb-1 text-gray-700 font-medium">
//                             Ảnh phụ (có thể chọn nhiều)
//                         </label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={handleSlideImagesChange}
//                             className="border rounded px-3 py-2 w-full"
//                         />
//                         {previewSlideImages.length > 0 && (
//                             <div className="flex gap-2 mt-3 flex-wrap">
//                                 {previewSlideImages.map((src, index) => (
//                                     <div key={index} className="relative">
//                                         <img
//                                             src={src}
//                                             alt={`Slide ${index}`}
//                                             className="w-24 h-24 object-cover rounded"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeSlideImage(index)}
//                                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
//                                         >
//                                             ×
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div>
//                         <textarea
//                             name="description"
//                             rows="3"
//                             placeholder="Mô tả sản phẩm (tối thiểu 20 ký tự, tối đa 255 ký tự)"
//                             value={product.description}
//                             onChange={handleInputChange}
//                             className="border rounded px-3 py-2 w-full"
//                             required
//                         ></textarea>
//                         <div className="text-sm text-gray-500 mt-1">
//                             {product.description.length}/255 ký tự
//                             {product.description.length < 20 && product.description.length > 0 && (
//                                 <span className="text-red-500 ml-2">(Cần ít nhất 20 ký tự)</span>
//                             )}
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="mt-4 bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa] w-full"
//                     >
//                         Thêm sản phẩm
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddProduct;

import React, { useState, useEffect } from "react";
import SellerLayout from "../../component-seller-page/SellerLayout";
import axios from "axios";

const AddProduct = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const [product, setProduct] = useState({
    name: "",
    description: "",
    origin: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]); // danh sách thuộc tính lấy từ category
  const [selectedValues, setSelectedValues] = useState({}); // giá trị người bán chọn cho mỗi attribute
  const [variants, setVariants] = useState([]); // danh sách biến thể sinh ra

  const [mainImage, setMainImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [message, setMessage] = useState("");

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendURL}/categories`);
        setCategories(res.data?.data?.docs || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, [backendURL]);

  // Khi chọn category → tải attributes tương ứng
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setProduct((prev) => ({ ...prev, categoryId }));

    if (!categoryId) return;

    try {
      const res = await axios.get(`${backendURL}/categories/${categoryId}/attributes`);
      const attrs = res.data?.data || [];
      setAttributes(attrs);
      setSelectedValues({});
      setVariants([]);
    } catch (err) {
      console.error("Lỗi tải thuộc tính:", err);
    }
  };

  // Khi chọn giá trị attribute
  const handleAttributeValueChange = (attrName, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attrName]: value.split(",").map((v) => v.trim()),
    }));
  };

  // Sinh các variant từ attributes
  const generateVariants = () => {
    const attrNames = Object.keys(selectedValues);
    if (attrNames.length === 0) return;

    // Sinh tổ hợp variant
    const combine = (lists) => {
      if (lists.length === 0) return [[]];
      const [first, ...rest] = lists;
      const combos = combine(rest);
      return first.flatMap((val) => combos.map((combo) => [val, ...combo]));
    };

    const allValues = attrNames.map((k) => selectedValues[k]);
    const combos = combine(allValues);

    const newVariants = combos.map((values, idx) => ({
      id: idx + 1,
      combination: attrNames.map((attr, i) => `${attr}: ${values[i]}`).join(" | "),
      price: "",
      stock: "",
    }));

    setVariants(newVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      setMessage("❌ Vui lòng chọn ảnh chính!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name.trim());
      formData.append("description", product.description.trim());
      formData.append("origin", product.origin.trim());
      formData.append("categoryId", product.categoryId);
      formData.append("main_image", mainImage);

      // Gửi attributes và variants dưới dạng JSON
      formData.append("attributes", JSON.stringify(selectedValues));
      formData.append("variants", JSON.stringify(variants));

      const token = localStorage.getItem("sellerToken");
      await axios.post(`${backendURL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Thêm sản phẩm và biến thể thành công!");
      setTimeout(() => setMessage(""), 3000);

      setProduct({ name: "", description: "", origin: "", categoryId: "" });
      setAttributes([]);
      setSelectedValues({});
      setVariants([]);
      setMainImage(null);
      setPreviewMainImage(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Thêm sản phẩm thất bại!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-14 space-y-6">
      <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

        {message && (
          <div
            className={`mb-3 text-center text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            name="origin"
            placeholder="Xuất xứ sản phẩm"
            value={product.origin}
            onChange={(e) => setProduct({ ...product, origin: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleCategoryChange}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>

          {/* Hiển thị attributes */}
          {attributes.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-gray-700">Thuộc tính sản phẩm</h3>
              {attributes.map((attr) => (
                <div key={attr.id}>
                  <label className="block text-sm font-medium">{attr.name}</label>
                  <input
                    type="text"
                    placeholder="Nhập các giá trị, cách nhau bằng dấu phẩy (ví dụ: Đỏ, Xanh, Đen)"
                    onChange={(e) =>
                      handleAttributeValueChange(attr.name, e.target.value)
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={generateVariants}
                className="mt-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                Sinh biến thể
              </button>
            </div>
          )}

          {/* Danh sách variant */}
          {variants.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold text-gray-700">Các biến thể</h3>
              {variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border p-2 rounded"
                >
                  <span className="flex-1 text-sm">{variant.combination}</span>
                  <input
                    type="number"
                    placeholder="Giá"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(idx, "price", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-24"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Tồn kho"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(idx, "stock", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-20"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Ảnh chính</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMainImage(file);
                  setPreviewMainImage(URL.createObjectURL(file));
                }
              }}
              className="border rounded px-3 py-2 w-full"
              required
            />
            {previewMainImage && (
              <img
                src={previewMainImage}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <textarea
            name="description"
            rows="3"
            placeholder="Mô tả sản phẩm"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          ></textarea>

          <button
            type="submit"
            className="mt-4 bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa] w-full"
          >
            Thêm sản phẩm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
