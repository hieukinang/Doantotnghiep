import React, { useState } from "react";
import axios from "axios";

const CreateCategory = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });

    const [attributes, setAttributes] = useState([""]);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

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

        if (!formData.name || !formData.image || attributes.length === 0) {
            setMessage("⚠️ Vui lòng nhập đầy đủ các trường bắt buộc!");
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("image", formData.image);
            const attrJSON = JSON.stringify(attributes.filter((a) => a.trim() !== ""));
            data.append("name_attributes", attrJSON);

            // ✅ Lấy token từ localStorage
            const token = localStorage.getItem("adminToken");

            console.log("Token:", token);
            const res = await axios.post(`${backendURL}/categories`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("✅ Tạo danh mục thành công!");
            setTimeout(() => setMessage(""), 2000);
            setFormData({ name: "", image: null });
            setAttributes([""]);
        } catch (error) {
            if (error.response?.data?.message) {
                setMessage(`❌ ${error.response.data.message}`);
            } else {
                setMessage("❌ Lỗi khi tạo danh mục!");
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Thêm danh mục mới
            </h2>

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

                {/* Thuộc tính */}
                <div>
                    <label className="block mb-2 font-medium">Thuộc tính *</label>
                    {attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={attr}
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
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

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Tạo danh mục
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-sm font-medium">{message}</p>
            )}
        </div>
    );
};

export default CreateCategory;
