import React, { useState } from "react";
// import CategorySelector from "../components/CategorySelector";
// import DynamicAttributesForm from "../components/DynamicAttributesForm";

const AddProduct = () => {
    const [category, setCategory] = useState("");
    const [attributes, setAttributes] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            category,
            ...attributes,
        };
        console.log("📦 Product data:", productData);
        // Gửi productData đến backend (Spring Boot)
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h2>

            {/* <form onSubmit={handleSubmit}>
                <CategorySelector category={category} onChange={setCategory} />

                <DynamicAttributesForm
                    category={category}
                    onChange={setAttributes}
                />

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Lưu sản phẩm
                </button>
            </form> */}
        </div>
    );
};

export default AddProduct;
