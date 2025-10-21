import React, { useState, useEffect } from "react";
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchSuper = async () => {
      try {
        const res = await axios.get(`${backendURL}/supercategories`);
        setSuperCategories(res.data?.data?.docs || res.data?.data || []);
      } catch (err) {}
    };
    fetchSuper();
  }, [backendURL]);

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

      if (mode === "category") {
        if (!formData.name || !formData.image || attributes.length === 0) {
          setMessage("⚠️ Vui lòng nhập đầy đủ các trường bắt buộc!");
          return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("image", formData.image);
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

        setMessage("✅ Tạo danh mục thành công!");
      } else {
        if (!formData.name || !formData.image) {
          setMessage("⚠️ Vui lòng nhập tên và hình ảnh cho Super Category!");
          return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("image", formData.image);

        await axios.post(`${backendURL}/supercategories`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("✅ Tạo Super Category thành công!");
      }

      setTimeout(() => setMessage(""), 2500);
      setFormData({ name: "", image: null, superCategoryId: "" });
      setAttributes([""]);
      setPreviewImage(null);
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Lỗi khi tạo!");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Chọn mode */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setMode("super")}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "super" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Danh Mục Cha
        </button>
        <button
          onClick={() => setMode("category")}
          className={`px-4 py-2 rounded-md font-medium ${
            mode === "category" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Danh Mục
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-md p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên danh mục *</label>
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
            <label className="block mb-1 font-medium">Hình ảnh *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-gray-50"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            )}
          </div>

          {mode === "category" && (
            <>
              <div>
                <label className="block mb-1 font-medium">
                  Super Category (tuỳ chọn)
                </label>
                <select
                  name="superCategoryId"
                  value={formData.superCategoryId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">-- Super Categories --</option>
                  {superCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Thuộc tính *</label>
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 mb-2">
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
                <button
                  type="button"
                  onClick={addAttribute}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  + Thêm thuộc tính
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {mode === "category" ? "Tạo danh mục" : "Tạo Super Category"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;