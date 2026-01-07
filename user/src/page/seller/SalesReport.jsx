import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

const Stat = ({ label, value, color }) => (
  <div className="flex flex-col bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
    <span className="text-xs sm:text-sm text-gray-500">{label}</span>
    <span className={`text-lg sm:text-2xl font-semibold ${color || "text-gray-800"}`}>
      {value}
    </span>
  </div>
);

const getAuthHeaders = () => {
  const token = localStorage.getItem("sellerToken");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const SalesReport = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const currentYear = new Date().getFullYear();

  // States cho thống kê doanh thu theo ngày
  const [salesStartDate, setSalesStartDate] = useState(today);
  const [salesEndDate, setSalesEndDate] = useState(today);
  const [salesDayData, setSalesDayData] = useState([]);
  const [loadingSalesDay, setLoadingSalesDay] = useState(false);

  // States cho thống kê doanh thu theo năm
  const [salesYear, setSalesYear] = useState(currentYear);
  const [salesYearData, setSalesYearData] = useState([]);
  const [loadingSalesYear, setLoadingSalesYear] = useState(false);

  // States cho thống kê sản phẩm theo ngày
  const [productId, setProductId] = useState("");
  const [productStartDate, setProductStartDate] = useState(today);
  const [productEndDate, setProductEndDate] = useState(today);
  const [productDayData, setProductDayData] = useState([]);
  const [loadingProductDay, setLoadingProductDay] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // States cho thống kê sản phẩm theo năm
  const [productYearId, setProductYearId] = useState("");
  const [productYear, setProductYear] = useState(currentYear);
  const [productYearData, setProductYearData] = useState([]);
  const [loadingProductYear, setLoadingProductYear] = useState(false);
  const [showProductYearDropdown, setShowProductYearDropdown] = useState(false);

  // Danh sách sản phẩm của store
  const [products, setProducts] = useState([]);

  // Fetch danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/store`, getAuthHeaders());
      setProducts(res.data?.data?.products || res.data?.data?.docs || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch doanh thu theo ngày
  const fetchSalesDay = async () => {
    setLoadingSalesDay(true);
    try {
      const res = await axios.get(`${API_BASE}/statistics/store/sales/day`, {
        params: { startdate: salesStartDate, enddate: salesEndDate },
        ...getAuthHeaders(),
      });
      const dailyData = res.data?.data?.daily || [];
      const formattedData = dailyData.map((item) => ({
        name: item.date ? format(new Date(item.date), "dd/MM") : item.date,
        "Doanh thu": item.revenue || 0,
      }));
      setSalesDayData(formattedData);
    } catch (error) {
      console.error("Error fetching sales day:", error);
      setSalesDayData([]);
    }
    setLoadingSalesDay(false);
  };

  // Fetch doanh thu theo năm
  const fetchSalesYear = async () => {
    setLoadingSalesYear(true);
    try {
      const res = await axios.get(`${API_BASE}/statistics/store/sales/year`, {
        params: { year: salesYear },
        ...getAuthHeaders(),
      });
      const monthlyArr = res.data?.data?.monthly || [];
      const monthlyData = [];
      for (let i = 1; i <= 12; i++) {
        const monthItem = monthlyArr.find((item) => item.month === i);
        monthlyData.push({
          name: `T${i}`,
          "Doanh thu": monthItem?.revenue || 0,
        });
      }
      setSalesYearData(monthlyData);
    } catch (error) {
      console.error("Error fetching sales year:", error);
      setSalesYearData([]);
    }
    setLoadingSalesYear(false);
  };

  // Fetch thống kê sản phẩm theo ngày
  const fetchProductDay = async () => {
    if (!productId) return;
    setLoadingProductDay(true);
    try {
      const res = await axios.get(
        `${API_BASE}/statistics/store/product/${productId}/day`,
        {
          params: { startdate: productStartDate, enddate: productEndDate },
          ...getAuthHeaders(),
        }
      );
      const dailyData = res.data?.data?.daily || [];
      const formattedData = dailyData.map((item) => ({
        name: item.date ? format(new Date(item.date), "dd/MM") : item.date,
        "Số lượng": item.sold || 0,
        "Doanh thu": item.revenue || 0,
      }));
      setProductDayData(formattedData);
    } catch (error) {
      console.error("Error fetching product day:", error);
      setProductDayData([]);
    }
    setLoadingProductDay(false);
  };

  // Fetch thống kê sản phẩm theo năm
  const fetchProductYear = async () => {
    if (!productYearId) return;
    setLoadingProductYear(true);
    try {
      const res = await axios.get(
        `${API_BASE}/statistics/store/product/${productYearId}/year`,
        {
          params: { year: productYear },
          ...getAuthHeaders(),
        }
      );
      const monthlyArr = res.data?.data?.monthly || [];
      const monthlyData = [];
      for (let i = 1; i <= 12; i++) {
        const monthItem = monthlyArr.find((item) => item.month === i);
        monthlyData.push({
          name: `T${i}`,
          "Số lượng": monthItem?.sold || 0,
          "Doanh thu": monthItem?.revenue || 0,
        });
      }
      setProductYearData(monthlyData);
    } catch (error) {
      console.error("Error fetching product year:", error);
      setProductYearData([]);
    }
    setLoadingProductYear(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchSalesDay();
  }, [salesStartDate, salesEndDate]);

  useEffect(() => {
    fetchSalesYear();
  }, [salesYear]);

  useEffect(() => {
    fetchProductDay();
  }, [productId, productStartDate, productEndDate]);

  useEffect(() => {
    fetchProductYear();
  }, [productYearId, productYear]);

  // Tính tổng
  const totalSalesDay = salesDayData.reduce((sum, item) => sum + (item["Doanh thu"] || 0), 0);
  const totalSalesYear = salesYearData.reduce((sum, item) => sum + (item["Doanh thu"] || 0), 0);

  // Lấy sản phẩm đã chọn
  const selectedProduct = products.find((p) => p.id === Number(productId));
  const selectedProductYear = products.find((p) => p.id === Number(productYearId));

  // Component chọn sản phẩm với ảnh
  const ProductSelector = ({ value, onChange, show, setShow, selected }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 border rounded px-3 py-1.5 text-sm bg-white hover:bg-gray-50 min-w-[180px] sm:min-w-[220px]"
      >
        {selected ? (
          <>
            <img
              src={selected.main_image}
              alt={selected.name}
              className="w-8 h-8 object-cover rounded"
              onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }}
            />
            <span className="truncate max-w-[120px] sm:max-w-[150px]">{selected.name}</span>
          </>
        ) : (
          <span className="text-gray-500">Chọn sản phẩm</span>
        )}
        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {show && (
        <div className="absolute z-20 mt-1 w-full sm:w-[280px] bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          <div
            onClick={() => { onChange(""); setShow(false); }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
          >
            <span className="text-gray-500 text-sm">-- Bỏ chọn --</span>
          </div>
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => { onChange(String(p.id)); setShow(false); }}
              className={`flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer ${
                value === String(p.id) ? "bg-blue-50" : ""
              }`}
            >
              <img
                src={p.main_image}
                alt={p.name}
                className="w-10 h-10 object-cover rounded border"
                onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-500">{p.min_price?.toLocaleString()}đ</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-14 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Báo cáo doanh thu</h2>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="Doanh thu hôm nay" value={`${totalSalesDay.toLocaleString()}đ`} color="text-[#116AD1]" />
        <Stat label="Doanh thu năm" value={`${totalSalesYear.toLocaleString()}đ`} color="text-green-600" />
        <Stat label="Tổng sản phẩm" value={products.length} color="text-orange-600" />
        <Stat label="Năm hiện tại" value={currentYear} color="text-purple-600" />
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-700">Doanh thu theo ngày</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={salesStartDate}
              onChange={(e) => setSalesStartDate(e.target.value)}
              className="border rounded px-2 sm:px-3 py-1.5 text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={salesEndDate}
              onChange={(e) => setSalesEndDate(e.target.value)}
              className="border rounded px-2 sm:px-3 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="h-64">
          {loadingSalesDay ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Legend />
                <Bar dataKey="Doanh thu" fill="#116AD1" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ doanh thu theo năm */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-700">Doanh thu theo năm</h3>
          <input
            type="number"
            value={salesYear}
            onChange={(e) => setSalesYear(Number(e.target.value))}
            className="border rounded px-3 py-1.5 text-sm w-24"
            min="2020"
            max="2030"
          />
        </div>
        <div className="h-72">
          {loadingSalesYear ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Legend />
                <Bar dataKey="Doanh thu" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ sản phẩm theo ngày */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-700">Thống kê sản phẩm theo ngày</h3>
          <div className="flex flex-wrap items-center gap-2">
            <ProductSelector
              value={productId}
              onChange={setProductId}
              show={showProductDropdown}
              setShow={setShowProductDropdown}
              selected={selectedProduct}
            />
            <input
              type="date"
              value={productStartDate}
              onChange={(e) => setProductStartDate(e.target.value)}
              className="border rounded px-2 sm:px-3 py-1.5 text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={productEndDate}
              onChange={(e) => setProductEndDate(e.target.value)}
              className="border rounded px-2 sm:px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* Hiển thị sản phẩm đã chọn */}
        {/* {selectedProduct && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <img
              src={selectedProduct.main_image}
              alt={selectedProduct.name}
              className="w-16 h-16 object-cover rounded-lg border"
              onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
            />
            <div>
              <p className="font-medium text-gray-800">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">Giá: {selectedProduct.min_price?.toLocaleString()}đ</p>
              <p className="text-xs text-gray-400">Đã bán: {selectedProduct.sold || 0}</p>
            </div>
          </div>
        )} */}

        <div className="h-64">
          {!productId ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Vui lòng chọn sản phẩm</span>
            </div>
          ) : loadingProductDay ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Số lượng" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ sản phẩm theo năm */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-700">Thống kê sản phẩm theo năm</h3>
          <div className="flex flex-wrap items-center gap-2">
            <ProductSelector
              value={productYearId}
              onChange={setProductYearId}
              show={showProductYearDropdown}
              setShow={setShowProductYearDropdown}
              selected={selectedProductYear}
            />
            <input
              type="number"
              value={productYear}
              onChange={(e) => setProductYear(Number(e.target.value))}
              className="border rounded px-3 py-1.5 text-sm w-24"
              min="2020"
              max="2030"
            />
          </div>
        </div>

        {/* Hiển thị sản phẩm đã chọn */}
        {/* {selectedProductYear && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <img
              src={selectedProductYear.main_image}
              alt={selectedProductYear.name}
              className="w-16 h-16 object-cover rounded-lg border"
              onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
            />
            <div>
              <p className="font-medium text-gray-800">{selectedProductYear.name}</p>
              <p className="text-sm text-gray-500">Giá: {selectedProductYear.min_price?.toLocaleString()}đ</p>
              <p className="text-xs text-gray-400">Đã bán: {selectedProductYear.sold || 0}</p>
            </div>
          </div>
        )} */}

        <div className="h-72">
          {!productYearId ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Vui lòng chọn sản phẩm</span>
            </div>
          ) : loadingProductYear ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#ffc658" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Số lượng" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
