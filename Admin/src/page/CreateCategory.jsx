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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    // load super categories for select
    const fetchSuper = async () => {
      try {
        const res = await axios.get(`${backendURL}/supercategories`);
        setSuperCategories(res.data?.data?.docs || res.data?.data || []);
      } catch (err) {
        // ignore
      }
    };
    fetchSuper();
  }, [backendURL]);

  const handleAttributeChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index] = value;
    setAttributes(newAttrs);
  };

  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  const removeAttribute = (index) => {
    const newAttrs = attributes.filter((_, i) => i !== index);
    setAttributes(newAttrs);
  };

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
        const attrJSON = JSON.stringify(
          attributes.filter((a) => a.trim() !== "")
        );
        data.append("name_attributes", attrJSON);
        // allow optional superCategoryId
        if (formData.superCategoryId)
          data.append("superCategoryId", formData.superCategoryId);

        await axios.post(`${backendURL}/categories`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("✅ Tạo danh mục thành công!");
        setTimeout(() => setMessage(""), 2000);
        setFormData({ name: "", image: null, superCategoryId: "" });
        setAttributes([""]);
      } else {
        // super category
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
        setTimeout(() => setMessage(""), 2000);
        setFormData({ name: "", image: null, superCategoryId: "" });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Lỗi khi tạo!");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Thêm danh mục mới
      </h2>

      <div className="flex gap-2 justify-center mb-4">
        <button
          type="button"
          onClick={() => setMode("category")}
          className={`px-3 py-1 rounded ${
            mode === "category" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Category
        </button>
        <button
          type="button"
          onClick={() => setMode("super")}
          className={`px-3 py-1 rounded ${
            mode === "super" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thêm Super Category
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên danh mục */}
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
        {/* Hình ảnh */}
        <div>
          <label className="block mb-1 font-medium">Hình ảnh *</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded-md bg-gray-50"
          />
        </div>

        {mode === "category" && (
          <>
            {/* Super category select */}
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

            {/* Thuộc tính */}
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

        {/* Submit */}
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
  );
};

export default CreateCategory;
