import React, { useState, useEffect } from "react";
import SellerLayout from "../../component-seller-page/SellerLayout";
import axios from "axios";

const AddProduct = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
    });
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState("");

    // 🔹 Load danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${backendURL}/categories`);
                setCategories(res.data.data.docs);
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
            }
        };
        fetchCategories();
    }, [backendURL]);

    // 🔹 Cập nhật các input thường
    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // 🔹 Cập nhật ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // 🔹 Gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("stock", product.stock);
            formData.append("category", product.category);
            formData.append("description", product.description);
            if (imageFile) formData.append("image", imageFile);

            const res = await axios.post(`${backendURL}/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("✅ Thêm sản phẩm thành công!");
            console.log("✅ Dữ liệu gửi đi:", formData);
            console.log("📦 Server trả về:", res.data);

            // Reset form sau khi thêm
            setProduct({
                name: "",
                price: "",
                stock: "",
                category: "",
                description: "",
            });
            setImageFile(null);
            setPreviewImage(null);

            // Ẩn thông báo sau 2s
            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            console.error("❌ Lỗi khi thêm sản phẩm:", err);
            setMessage("❌ Thêm sản phẩm thất bại!");
        }
    };

    return (
        <SellerLayout title="Thêm sản phẩm">
            <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

                {message && (
                    <div className="mb-3 text-center text-sm font-medium text-green-600">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input
                        name="name"
                        placeholder="Tên sản phẩm"
                        value={product.name}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                        required
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Giá (VND)"
                        value={product.price}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                        required
                    />

                    <input
                        type="number"
                        name="stock"
                        placeholder="Tồn kho"
                        value={product.stock}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                        required
                    />

                    <select
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories?.map((cate) => (
                            <option key={cate._id || cate.id} value={cate.name}>
                                {cate.name}
                            </option>
                        ))}
                    </select>

                    {/* 🔹 Chọn ảnh từ máy */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Ảnh sản phẩm</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Xem trước ảnh"
                                className="mt-3 w-32 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Mô tả sản phẩm"
                        value={product.description}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                    ></textarea>

                    <button
                        type="submit"
                        className="mt-4 bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]"
                    >
                        Thêm sản phẩm
                    </button>
                </form>
            </div>
        </SellerLayout>
    );
};

export default AddProduct;
