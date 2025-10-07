import React, { useState } from "react";
import axios from "axios";

const CreateCoupon = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount: "",
        quantity: "",
        expire: "", // để trống ban đầu, user sẽ chọn
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 🔥 Format lại ngày trước khi gửi
    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        const pad = (n) => (n < 10 ? "0" + n : n);
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            " " +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes()) +
            ":" +
            pad(date.getSeconds())
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.code ||
            !formData.description ||
            !formData.discount ||
            !formData.quantity ||
            !formData.expire
        ) {
            setMessage("⚠️ Vui lòng nhập đầy đủ các trường bắt buộc!");
            return;
        }

        try {
            const formattedData = {
                ...formData,
                expire: formatDateTime(formData.expire),
            };

            const res = await axios.post(`${backendURL}/admins/coupons`, formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setMessage("✅ Tạo mã giảm giá thành công!");
            console.log(res.data);
            setTimeout(() => setMessage(""), 1000);
            setFormData({
                code: "",
                description: "",
                discount: "",
                quantity: "",
                expire: "",
            });
        } catch (error) {
            console.error(error);
            setMessage("❌ Lỗi khi tạo mã giảm giá!");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Tạo mã giảm giá
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Mã giảm giá *</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md"
                        placeholder="VD: MID-AUTUMN30"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Mô tả *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md"
                        placeholder="Nhập mô tả mã giảm giá"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Giảm giá (%) *</label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md"
                            placeholder="30"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Số lượng *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md"
                            placeholder="100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Ngày hết hạn (chọn ngày & giờ) *
                    </label>
                    <input
                        type="datetime-local"
                        name="expire"
                        value={formData.expire}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md bg-gray-50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Tạo mã giảm giá
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-sm font-medium">{message}</p>
            )}
        </div>
    );
};

export default CreateCoupon;
