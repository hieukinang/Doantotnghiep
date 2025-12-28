import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const CreateCoupon = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const adminToken = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount: "",
    quantity: "",
    expire: null,
  });

  const [typeCode, setTypeCode] = useState("product");
  const [activeTab, setActiveTab] = useState("product");
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [shippingCodes, setShippingCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${backendURL}/coupons/admin`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        axios.get(`${backendURL}/shipping-codes`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
      ]);
      setCoupons(res1.data?.data?.docs || []);
      setShippingCodes(res2.data?.data?.codes || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
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

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.description || !formData.discount || !formData.quantity || !formData.expire) {
      toast.warning("Vui lòng nhập đầy đủ các trường!");
      return;
    }

    const API_URL = typeCode === "product" ? `${backendURL}/coupons/admin` : `${backendURL}/shipping-codes`;

    try {
      await axios.post(API_URL, {
        ...formData,
        expire: formatDateTime(formData.expire),
      }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Tạo mã giảm giá thành công!");
      setFormData({ code: "", description: "", discount: "", quantity: "", expire: null });
      fetchCoupons();
    } catch (error) {
      console.log("xxxzzz");
        const msg = error.response?.data?.errors?.[0]?.msg;

        if (msg ==="Coupon code must be unique") {
          console.log("xxxzzzvclassda");

          toast.error("Tên mã giảm giá đã tồn tại");
        } else {
          toast.error("Có lỗi xảy ra!");
        }
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    const deleteUrl = type === "product" 
      ? `${backendURL}/coupons/admin/${id}`
      : `${backendURL}/shipping-codes/${id}`;
    try {
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${adminToken}` },
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

  // Filter coupons by search term (chỉ theo tên/code)
  const filteredCoupons = coupons.filter((item) =>
    item.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShippingCodes = shippingCodes.filter((item) =>
    item.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form tạo */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Tạo mã giảm giá</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Mã giảm giá *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="VD: MID-AUTUMN30"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mô tả *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="2"
              placeholder="Nhập mô tả"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Loại mã</label>
              <select
                className="w-full border p-2 rounded"
                value={typeCode}
                onChange={(e) => setTypeCode(e.target.value)}
              >
                <option value="product">Mã giảm giá sản phẩm</option>
                <option value="shipping">Mã giảm giá vận chuyển</option>
              </select>
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
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Tạo mới
          </button>
        </form>
      </div>

      {/* Danh sách */}
      <div className="bg-white shadow rounded-lg p-5 h-[520px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Danh sách mã giảm giá</h2>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("product")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "product"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Mã sản phẩm ({filteredCoupons.length})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "shipping"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Mã vận chuyển ({filteredShippingCodes.length})
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Đang tải...</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Tab Mã giảm giá sản phẩm */}
            {activeTab === "product" && (
              <div className="space-y-2">
                {filteredCoupons.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Không tìm thấy mã nào</p>
                ) : (
                  filteredCoupons.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-600">{item.code}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              -{item.discount?.toLocaleString()}đ
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          <div className="flex gap-4 mt-1 text-xs text-gray-500">
                            <span>SL: {item.quantity}</span>
                            <span>HSD: {formatDate(item.expire)}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(item.id, "product")} className="p-1.5 text-red-600 hover:bg-red-50 rounded">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab Mã giảm giá vận chuyển */}
            {activeTab === "shipping" && (
              <div className="space-y-2">
                {filteredShippingCodes.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Không tìm thấy mã nào</p>
                ) : (
                  filteredShippingCodes.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-orange-600">{item.code}</span>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                              -{item.discount?.toLocaleString()}đ
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          <div className="flex gap-4 mt-1 text-xs text-gray-500">
                            <span>SL: {item.quantity}</span>
                            <span>HSD: {formatDate(item.expire)}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(item.id, "shipping")} className="p-1.5 text-red-600 hover:bg-red-50 rounded">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCoupon;
