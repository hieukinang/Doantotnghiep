import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FollowedPage = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const storeId = localStorage.getItem("storeId");

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!storeId) {
        toast.error("Không tìm thấy storeId");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/follows/${storeId}/followers`
        );
        setFollowers(res.data?.data?.clients || []);
      } catch (err) {
        console.error("Lỗi khi lấy followers:", err);
        toast.error("Không thể tải danh sách người theo dõi");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [storeId]);

  return (
    <div className="p-16">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6">
        Người theo dõi cửa hàng
      </h1>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : followers.length === 0 ? (
        <div className="text-center text-gray-500">
          Chưa có người theo dõi
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followers.map((client, index) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition"
            >
              {/* AVATAR */}
              <img
                src={client.image}
                alt={client.username}
                className="w-16 h-16 rounded-full object-cover border"
              />

              {/* INFO */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {client.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowedPage;
