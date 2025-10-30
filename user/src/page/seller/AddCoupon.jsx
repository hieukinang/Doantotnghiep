import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddCoupon = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount: "",
        quantity: "",
        expire: null, // Date object
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            expire: date,
        }));
    };

    // 🔥 Format lại ngày trước khi gửi (YYYY-MM-DD HH:mm:ss)
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
            setTimeout(() => setMessage(""), 1500);
            setFormData({
                code: "",
                description: "",
                discount: "",
                quantity: "",
                expire: null,
            });
        } catch (error) {
            console.error(error);
            setMessage("❌ Lỗi khi tạo mã giảm giá!");
        }
    };

    return (
        <div className="p-14 space-y-6">
            <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    Thêm mã giảm giá mới
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input
                        name="code"
                        placeholder="Mã giảm giá *"
                        value={formData.code}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                        required
                    />

                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Mô tả mã giảm giá *"
                        value={formData.description}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                        required
                    ></textarea>

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

                    {/* ✅ DatePicker chọn ngày & giờ */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Ngày hết hạn (chọn ngày & giờ) *
                        </label>
                        <DatePicker
                            selected={formData.expire}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            placeholderText="Chọn ngày & giờ hết hạn"
                            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            minDate={new Date()}
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]"
                    >
                        Lưu mã giảm giá
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm font-medium">{message}</p>
                )}
            </div>
        </div>
    );
};

export default AddCoupon;
