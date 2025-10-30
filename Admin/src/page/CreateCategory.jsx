import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const CreateCategory = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    superCategoryId: "",
  });

  const [attributes, setAttributes] = useState([""]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("category"); // 'category' or 'super'
  const [superCategories, setSuperCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  const fetchSuper = async () => {
    try {
      const res = await axios.get(`${backendURL}/supercategories`);
      setSuperCategories(res.data?.data?.docs || res.data?.data || []);
    } catch (err) {
      console.error("Lỗi khi tải super categories:", err);
    }
  };

  useEffect(() => {
    fetchSuper();
  }, [backendURL]);

  useEffect(() => {
    resetForm();
  }, [mode]);

  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
      superCategoryId: "",
    });
    setAttributes([""]);
    setMessage("");
    if (previewImage) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch (e) {}
    }
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      if (previewImage) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (err) {}
      }
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAttributeChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index] = value;
    setAttributes(newAttrs);
  };

  const addAttribute = () => setAttributes([...attributes, ""]);
  const removeAttribute = (index) =>
    setAttributes(attributes.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("image", formData.image);

      if (mode === "category") {
        if (!formData.name || !formData.image || attributes.length === 0) {
          setMessage("Vui lòng nhập đầy đủ các trường bắt buộc!");
          return;
        }

        data.append(
          "name_attributes",
          JSON.stringify(attributes.filter((a) => a.trim() !== ""))
        );
        if (formData.superCategoryId)
          data.append("superCategoryId", formData.superCategoryId);

        await axios.post(`${backendURL}/categories`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Tạo danh mục thành công!");
      } else {
        if (!formData.name || !formData.image) {
          setMessage("Vui lòng nhập tên và hình ảnh cho Super Category!");
          return;
        }

        await axios.post(`${backendURL}/supercategories`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Tạo Super Category thành công!");
        await fetchSuper();
      }

      setTimeout(() => setMessage(""), 2500);
      resetForm();
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage('${error.response.data.message}');
      } else {
        setMessage("Lỗi khi tạo!");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Nút chọn form */}
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setMode("super")}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "super" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Danh Mục Cha
        </button>
        <button
          type="button"
          onClick={() => setMode("category")}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "category" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Danh Mục
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-md p-6">
        <form onSubmit={handleSubmit} className="w-full">
          {mode === "category" ? (
            /* --- Layout 2 cột cho form Thêm danh mục --- */
            <div className="grid grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-left">
                    Danh mục cha
                  </label>
                  <select
                    name="superCategoryId"
                    value={formData.superCategoryId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  >
                    <option value="">-- Danh mục cha --</option>
                    {superCategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-left">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    placeholder="VD: Giày dép"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-left">
                    Thuộc tính *
                  </label>
                  <div className="grid grid-cols-1 gap-2 mb-2">
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={attr}
                          onChange={(e) =>
                            handleAttributeChange(index, e.target.value)
                          }
                          placeholder={`Thuộc tính ${index + 1}`}
                          className="flex-1 border p-2 rounded-md"
                        />
                        {attributes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className="bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    + Thêm thuộc tính
                  </button>
                </div>
              </div>

              {/* Cột phải - ảnh */}
              <div className="flex flex-col items-center justify-start">
                <label className="block text-sm font-medium mb-2 text-center">
                  Ảnh
                </label>
                <div
                  className="border-2 border-dashed w-[200px] h-[200px] rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => document.getElementById("mainImageInput").click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="preview"
                      className="mx-auto w-[180px] h-[180px] object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">
                      📷 <br /> Chọn ảnh
                    </div>
                  )}
                </div>

                <input
                  id="mainImageInput"
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* --- Form Thêm danh mục cha (ảnh ở dưới) --- */
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-left">
                  Tên danh mục cha *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  placeholder="VD: Thời trang"
                />
              </div>

              <div className="flex flex-col justify-start mt-4">
                <label className="block text-sm font-medium mb-2 text-left">
                  Ảnh
                </label>
                <div
                  className="border-2 border-dashed w-[200px] h-[200px] rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => document.getElementById("mainImageInput").click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="preview"
                      className="mx-auto w-[180px] h-[180px] object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">
                      📷 <br /> Chọn ảnh
                    </div>
                  )}
                </div>

                <input
                  id="mainImageInput"
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-1/5 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {mode === "category" ? "Tạo danh mục" : "Tạo danh mục cha"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-left text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;