import React, { useState } from "react";
import SellerLayout from "../../component-seller-page/SellerLayout";

// 🧩 Các danh mục và thuộc tính tương ứng
const categoryAttributes = {
    Laptop: [
        { label: "RAM", key: "ram", type: "select", options: ["8GB", "16GB", "32GB"] },
        { label: "CPU", key: "cpu", type: "select", options: ["i5", "i7", "i9"] },
        { label: "SSD", key: "ssd", type: "text" },
        { label: "GPU", key: "gpu", type: "text" },
    ],
    Clothes: [
        { label: "Kích cỡ", key: "size", type: "select", options: ["S", "M", "L", "XL"] },
        { label: "Màu sắc", key: "color", type: "text" },
        { label: "Chất liệu", key: "material", type: "text" },
    ],
    Book: [
        { label: "Tác giả", key: "author", type: "text" },
        { label: "Nhà xuất bản", key: "publisher", type: "text" },
        { label: "ISBN", key: "isbn", type: "text" },
    ],
};

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: "",
        description: "",
    });

    const [attributes, setAttributes] = useState({});

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleAttributeChange = (key, value) => {
        setAttributes({ ...attributes, [key]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullProduct = { ...product, attributes };
        console.log("✅ Dữ liệu sản phẩm:", fullProduct);

        // TODO: Gửi dữ liệu tới backend (API POST)
        // fetch("/api/seller/products", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(fullProduct),
        // });
    };

    return (
        <SellerLayout title="Thêm sản phẩm">
            <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

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

                    {/* Danh mục */}
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                        required
                    >
                        <option value="">-- Chọn danh mục --</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Clothes">Quần áo</option>
                        <option value="Book">Sách</option>
                    </select>

                    {/* Ảnh */}
                    <input
                        name="image"
                        placeholder="Ảnh (URL)"
                        value={product.image}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                    />

                    {/* Mô tả */}
                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Mô tả sản phẩm"
                        value={product.description}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2"
                    ></textarea>

                    {/* Thuộc tính động */}
                    {product.category && (
                        <div className="mt-4 border-t pt-3">
                            <h3 className="font-medium mb-2">Thuộc tính sản phẩm ({product.category})</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {categoryAttributes[product.category].map((attr) => (
                                    <div key={attr.key}>
                                        <label className="block mb-1 text-sm font-medium">{attr.label}</label>
                                        {attr.type === "select" ? (
                                            <select
                                                value={attributes[attr.key] || ""}
                                                onChange={(e) =>
                                                    handleAttributeChange(attr.key, e.target.value)
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                            >
                                                <option value="">-- Chọn {attr.label.toLowerCase()} --</option>
                                                {attr.options.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={attributes[attr.key] || ""}
                                                onChange={(e) =>
                                                    handleAttributeChange(attr.key, e.target.value)
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                                placeholder={attr.label}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-4 bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]"
                    >
                        Lưu sản phẩm
                    </button>
                </form>
            </div>
        </SellerLayout>
    );
};

export default AddProduct;
