import { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 4;

const AddCoupon = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { createCouponStore } = useContext(ShopContext);
    const sellerToken = localStorage.getItem("sellerToken");

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount: "",
        quantity: "",
        expire: null,
    });

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendURL}/coupons/store`, {
                headers: { Authorization: `Bearer ${sellerToken}` },
            });
            setCoupons(res.data?.data?.coupons || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách coupon:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, expire: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.code || !formData.description || !formData.discount || !formData.quantity || !formData.expire) {
            toast.warning("Vui lòng nhập đầy đủ các trường!");
            return;
        }

        try {
            await createCouponStore(formData);
            setFormData({ code: "", description: "", discount: "", quantity: "", expire: null });
            fetchCoupons();
        } catch (error) {
            console.error(error);
            // Kiểm tra errors array từ response
            const errors = error.response?.data?.errors || [];
            const firstError = errors[0]?.msg || error.response?.data?.message || "";
            
            if (firstError.includes("Coupon code must be unique") || firstError.includes("unique")) {
                toast.error("Tên mã giảm giá đã tồn tại!");
            } else {
                toast.error(firstError || "Có lỗi xảy ra!");
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendURL}/coupons/store/${id}`, {
                headers: { Authorization: `Bearer ${sellerToken}` },
            });
            toast.success("Xóa thành công!");
            fetchCoupons();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi xóa!");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("vi-VN");
    };

    // Phân trang
    const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);
    const paginatedCoupons = coupons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="p-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form tạo coupon */}
            <div className="bg-white shadow rounded-lg p-5">
                <h2 className="text-lg font-semibold mb-4">Thêm mã giảm giá mới</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="code"
                        placeholder="Mã giảm giá *"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    <textarea
                        name="description"
                        rows="2"
                        placeholder="Mô tả *"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1">Giảm giá (đ)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="30000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Ngày hết hạn</label>
                        <DatePicker
                            selected={formData.expire}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            placeholderText="Chọn ngày & giờ"
                            className="w-full border p-2 rounded"
                            minDate={new Date()}
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]">
                        Tạo mới
                    </button>
                </form>
            </div>

            {/* Danh sách coupon */}
            <div className="bg-white shadow rounded-lg p-5 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Danh sách mã giảm giá ({coupons.length})</h2>

                {loading ? (
                    <p className="text-gray-500 text-center py-8">Đang tải...</p>
                ) : coupons.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có mã giảm giá nào</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            {paginatedCoupons.map((coupon) => (
                                <div key={coupon.id} className="border rounded-lg p-3 hover:bg-gray-50 h-fit">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-[#116AD1] text-sm truncate">{coupon.code}</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                    -{coupon.discount.toLocaleString()}đ
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-1">{coupon.description}</p>
                                            <div className="flex flex-col gap-0.5 mt-1 text-xs text-gray-500">
                                                <span>SL: {coupon.quantity}</span>
                                                <span>HSD: {formatDate(coupon.expire)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded ml-1"
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded text-sm ${
                                            page === p
                                                ? "bg-[#116AD1] text-white"
                                                : "border hover:bg-gray-100"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AddCoupon;
