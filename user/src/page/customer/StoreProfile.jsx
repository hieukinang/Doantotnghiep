import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import MessageButton from "../../component-home-page/MessageButton";
import { ShopContext } from "../../context/ShopContext";

const StoreProfile = () => {
  const { storeId } = useParams();
  const { backendURL, clientUser, clientToken } = useContext(ShopContext);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) {
        setError("Không tìm thấy thông tin cửa hàng");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/stores/${storeId}`);
        const storeData = res.data?.data ;
        if (res.data?.status === "success" && storeData) {
          setStore({
            id: storeData.id || `STORE${storeData.id}`,
            name: storeData.name || "Cửa hàng",
            email: storeData.email || "",
            phone: storeData.phone || "",
            image: storeData.image || null,
            address: storeData.address || storeData.city || "",
            description: storeData.description || "",
          });

          // Kiểm tra xem user đã follow shop chưa
          if (clientUser?.id) {
            const config = { headers: { Authorization: `Bearer ${clientToken}` } };
            const followRes = await axios.get(`${backendURL}/follows//client/followed-stores`, config);
            const followedStores = followRes.data?.data?.stores || [];
            const isFollowed = followedStores.some(s => s.id === storeData.id);
            setIsFollowing(isFollowed);
          }
        } else {
          setError("Không tìm thấy thông tin cửa hàng");
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setError("Không thể tải thông tin cửa hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId, backendURL, clientUser]);

  const handleFollowToggle = async () => {
    if (!clientUser || !clientUser.id) {
      alert("Bạn cần đăng nhập để theo dõi cửa hàng");
      return;
    }

    setFollowLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      };

      if (!isFollowing) {
        // Follow shop
        await axios.post(`${backendURL}/follows/${store.id}`, {}, config);
        setIsFollowing(true);
      } else {
        // Unfollow shop
        await axios.delete(`${backendURL}/follows/${store.id}`, config);
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Error following/unfollowing store:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setFollowLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          <div className="text-gray-500">Đang tải thông tin...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          <div className="text-red-500">{error || "Không tìm thấy cửa hàng"}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {store.image ? (
                  <img
                    src={store.image.startsWith("http") ? store.image : `${backendURL}/${store.image}`}
                    alt={store.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
                  <p className="text-gray-500 mt-1">Cửa hàng</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageButton
                  userId={store.id}
                  userType="STORE"
                  userName={store.name}
                  userImage={store.image}
                />
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 py-2 rounded ${
                    isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {followLoading
                    ? "Đang xử lý..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {store.description && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Mô tả:</span>
                  <p className="mt-1 text-gray-800">{store.description}</p>
                </div>
              )}
              {store.email && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{store.email}</span>
                </div>
              )}
              {store.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                  <span className="ml-2 text-gray-800">{store.phone}</span>
                </div>
              )}
              {store.address && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 text-gray-800">{store.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoreProfile;
