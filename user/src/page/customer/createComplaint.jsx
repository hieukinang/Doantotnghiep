import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";

const CreateComplaint = () => {
  const { backendURL, clientToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const [type, setType] = useState("PRODUCT");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details) {
      alert("Vui lòng nhập chi tiết khiếu nại");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("details", details);
    images.forEach((file, idx) => {
      formData.append("images", file);
    });

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${clientToken}`,
        },
      };
      const res = await axios.post(`${backendURL}/complaints`, formData, config);
      alert("Gửi khiếu nại thành công!");
      navigate("/complaints"); // chuyển sang danh sách khiếu nại
    } catch (err) {
      console.error("Error creating complaint:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1 flex justify-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Gửi khiếu nại</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loại khiếu nại</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PRODUCT">Sản phẩm</option>
                <option value="SERVICE">Dịch vụ</option>
                <option value="PAYMENT">Thanh toán</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chi tiết khiếu nại</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows="4"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả chi tiết vấn đề..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hình ảnh minh họa (nếu có)</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Đang gửi..." : "Gửi khiếu nại"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateComplaint;
