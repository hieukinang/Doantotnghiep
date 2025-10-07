import React, { useEffect, useState } from "react";
import axios from "axios";

  const url = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}/banners`;


const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null); // id banner đang xóa
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ image: null, type: "" });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const token = localStorage.getItem("adminToken");

  // Lấy tất cả banner
  const fetchBanners = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(url);
      setBanners(res.data.data?.docs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải banner");
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết 1 banner
  const fetchBannerDetail = async (id) => {
    setLoadingDetail(true);
    setShowDetail(null);
    setError("");
    try {
      const res = await axios.get(`${url}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setShowDetail(res.data.data?.doc || res.data.doc || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy chi tiết banner");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Xóa banner
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa banner này?")) return;
    setError("");
    setLoadingDelete(id);
    try {
      await axios.delete(`${url}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBanners((prev) => prev.filter((b) => b._id !== id && b.id !== id));
      setShowDetail(null);
    } catch (err) {
      setError(err.response?.data?.message || "Xóa banner thất bại");
    } finally {
      setLoadingDelete(null);
    }
  };

  // Tạo banner mới
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!createForm.image) {
      setCreateError("Vui lòng chọn ảnh!");
      return;
    }

    setLoadingCreate(true);
    try {
      const formData = new FormData();
      formData.append("images", createForm.image);
      formData.append("types", JSON.stringify([createForm.type]));

      await axios.post(`${url}/create`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      });

      setCreateForm({ image: null, type: "" });
      fetchBanners();
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoadingCreate(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-right text-white px-5 py-2 rounded shadow hover:bg-blue-700 font-semibold"
          onClick={() => setShowCreateForm(true)}
        >
          + Tạo Banner mới
        </button>
      </div>

      {/* Danh sách banner */}
      {loading ? (
        <div>Đang tải banner...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : banners.length === 0 ? (
        <div>Không có banner nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id || banner.id}
              className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 relative group transition hover:shadow-lg"
            >
              <img
                src={banner.image || "/default-banner.jpg"}
                alt="Banner"
                className="w-full h-40 object-cover rounded mb-3 border"
              />
              <div className="w-full flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-1">
                  Loại: <b>{banner.type}</b>
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                    onClick={() => fetchBannerDetail(banner._id || banner.id)}
                  >
                    {loadingDetail ? "Đang tải..." : "Xem chi tiết"}
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      loadingDelete === (banner._id || banner.id)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => handleDelete(banner._id || banner.id)}
                    disabled={loadingDelete === (banner._id || banner.id)}
                  >
                    {loadingDelete === (banner._id || banner.id) ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup tạo banner mới */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowCreateForm(false)}
            >
              &times;
            </button>
            <h2 className="font-semibold text-lg mb-4 text-blue-700">
              Tạo banner mới
            </h2>
            <form className="space-y-3" onSubmit={handleCreate} encType="multipart/form-data">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, image: e.target.files[0] }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
              <select
                name="type"
                value={createForm.type}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Chọn loại banner --</option>
                <option value="sidebar">Sidebar</option>
                <option value="fixed">Fixed</option>
              </select>
              {createError && <div className="text-red-500 text-sm">{createError}</div>}
              {createSuccess && <div className="text-green-600 text-sm">{createSuccess}</div>}
              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
                  loadingCreate ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingCreate}
              >
                {loadingCreate ? "Đang tạo..." : "Tạo banner"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Popup chi tiết banner */}
      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowDetail(null)}
            >
              &times;
            </button>
            <img
              src={showDetail.image || "/default-banner.jpg"}
              alt="Banner"
              className="w-full h-48 object-cover rounded mb-3 border"
            />
            <div className="mb-2 text-sm text-gray-500">
              Loại: <b>{showDetail.type}</b>
            </div>
            {showDetail.description && <p className="mb-2">{showDetail.description}</p>}
            {showDetail.link && (
              <a
                href={showDetail.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Xem chi tiết
              </a>
            )}
            <div className="mt-4 text-right">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowDetail(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
