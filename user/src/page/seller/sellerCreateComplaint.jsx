import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import { IoClose, IoCloudUploadOutline, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

const SellerCreateComplaint = () => {
  const { backendURL, sellerToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const [type, setType] = useState("PRODUCT");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const COMPLAINT_TYPES = [
    { value: "PRODUCT", label: "Sản phẩm", icon: "📦" },
    { value: "STORE", label: "Cửa hàng", icon: "🏪" },
    { value: "SERVICE", label: "Dịch vụ", icon: "🛎️" },
    { value: "DELIVERY", label: "Vận chuyển", icon: "🚚" },
    { value: "OTHER", label: "Khác", icon: "📝" },
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.warning("Chỉ được tải tối đa 5 ảnh!");
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      toast.warning("Vui lòng nhập chi tiết khiếu nại!");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("details", details);
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sellerToken}`,
        },
      };
      const res = await axios.post(`${backendURL}/complaints`, formData, config);
      toast.success("Gửi khiếu nại thành công!");
      setType("PRODUCT");
      setDetails("");
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
    } catch (err) {
      console.error("Error creating complaint:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="pt-32 pb-16 px-5 flex-1 flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gửi khiếu nại
            </h1>
            <p className="text-gray-600">
              Chúng tôi sẽ xử lý khiếu nại của bạn trong thời gian sớm nhất
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="bg-gradient-to-r from-[#116AD1] to-[#1e88e5] px-8 py-6">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">1</div>
                    <span className="text-sm font-medium">Chọn loại</span>
                  </div>
                  <div className="h-0.5 flex-1 mx-4 bg-white/30"></div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">2</div>
                    <span className="text-sm font-medium">Chi tiết</span>
                  </div>
                  <div className="h-0.5 flex-1 mx-4 bg-white/30"></div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">3</div>
                    <span className="text-sm font-medium">Xác nhận</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Loại khiếu nại */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Bạn muốn khiếu nại về vấn đề gì? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {COMPLAINT_TYPES.map((complaintType) => (
                      <label
                        key={complaintType.value}
                        className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          type === complaintType.value
                            ? "border-[#116AD1] bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-[#116AD1] hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={complaintType.value}
                          checked={type === complaintType.value}
                          onChange={(e) => setType(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{complaintType.icon}</span>
                            <span className="font-semibold text-gray-800">{complaintType.label}</span>
                          </div>
                        </div>
                        {type === complaintType.value && (
                          <IoCheckmarkCircle className="absolute top-3 right-3 text-[#116AD1] text-xl" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chi tiết khiếu nại */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Mô tả chi tiết vấn đề <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows="6"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#116AD1] focus:border-[#116AD1] transition-all resize-none"
                      placeholder="Vui lòng mô tả rõ ràng vấn đề bạn gặp phải để chúng tôi có thể hỗ trợ tốt nhất..."
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {details.length} / 1000 ký tự
                    </div>
                  </div>
                </div>

                {/* Upload ảnh */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Hình ảnh minh họa
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Tải lên tối đa 5 ảnh để giúp chúng tôi hiểu rõ hơn về vấn đề
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-28 h-28 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <IoClose className="text-lg" />
                        </button>
                      </div>
                    ))}

                    {images.length < 5 && (
                      <label className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#116AD1] hover:bg-blue-50 transition-all group">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <IoCloudUploadOutline className="text-3xl text-gray-400 group-hover:text-[#116AD1] transition-colors" />
                        <span className="text-xs text-gray-500 mt-1 group-hover:text-[#116AD1]">Thêm ảnh</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-[#116AD1] rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#116AD1] rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">💡</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Lưu ý quan trọng</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Cung cấp đầy đủ thông tin để được xử lý nhanh chóng</li>
                        <li>• Đính kèm ảnh chụp rõ ràng nếu có</li>
                        <li>• Thời gian xử lý khiếu nại: 24-48 giờ làm việc</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !details.trim()}
                  className={`px-8 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                    loading || !details.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#116AD1] to-[#1e88e5] hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <IoCheckmarkCircle className="text-xl" />
                      <span>Gửi khiếu nại</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Cần hỗ trợ ngay? Liên hệ hotline:{" "}
              <a href="tel:1900xxxx" className="text-[#116AD1] font-semibold hover:underline">
                1900 xxxx
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerCreateComplaint;