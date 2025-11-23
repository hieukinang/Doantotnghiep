import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import MessageButton from "../../component-home-page/MessageButton";
import { ShopContext } from "../../context/ShopContext";

const StoreProfile = () => {
  const { storeId } = useParams();
  const { backendURL } = useContext(ShopContext);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) {
        setError("Không tìm thấy thông tin cửa hàng");
        setLoading(false);
        return;
      }

      try {
        // Lấy thông tin store từ API
        const res = await axios.get(`${backendURL}/stores/${storeId}`);
        const storeData = res.data?.data?.doc || res.data?.data;
        if (res.data?.status === "success" && storeData) {
          setStore({
            id: storeData.id || `STORE${storeData.id}`,
            name: storeData.name || "Cửa hàng",
            email: storeData.email || "",
            phone: storeData.phone || "",
            image: storeData.image || null, // FIX: Sửa lỗi chính tả 'storeDataa.city' thành 'storeData.city'
            address: storeData.address || storeData.city || "",
            description: storeData.description || "",
          });
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
  }, [storeId, backendURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />{" "}
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          <div className="text-gray-500">Đang tải thông tin...</div> {" "}
        </main>
        <Footer />{" "}
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />{" "}
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          {" "}
          <div className="text-red-500">
            {error || "Không tìm thấy cửa hàng"}
          </div>{" "}
        </main>
        <Footer />{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />{" "}
      <main className="pt-32 px-5 flex-1">
        {" "}
        <div className="max-w-4xl mx-auto">
          {" "}
          <div className="bg-white rounded-lg shadow p-6">
            {" "}
            <div className="flex items-start justify-between mb-6">
              {" "}
              <div className="flex items-center gap-4">
                {" "}
                {store.image ? (
                  <img
                    src={
                      store.image.startsWith("http")
                        ? store.image
                        : `${backendURL}/${store.image}`
                    }
                    alt={store.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                    {store.name.charAt(0).toUpperCase()}{" "}
                  </div>
                )}{" "}
                <div>
                  {" "}
                  <h1 className="text-2xl font-bold text-gray-800">
                    {store.name}
                  </h1>{" "}
                  <p className="text-gray-500 mt-1">Cửa hàng</p>{" "}
                </div>{" "}
              </div>{" "}
              <MessageButton
                userId={store.id}
                userType="STORE"
                userName={store.name}
                userImage={store.image}
              />{" "}
            </div>{" "}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {" "}
              {store.description && (
                <div>
                  {" "}
                  <span className="text-sm font-medium text-gray-600">
                    Mô tả:
                  </span>{" "}
                  <p className="mt-1 text-gray-800">{store.description}</p>{" "}
                </div>
              )}{" "}
              {store.email && (
                <div>
                  {" "}
                  <span className="text-sm font-medium text-gray-600">
                    Email:
                  </span>{" "}
                  <span className="ml-2 text-gray-800">{store.email}</span>{" "}
                </div>
              )}{" "}
              {store.phone && (
                <div>
                  {" "}
                  <span className="text-sm font-medium text-gray-600">
                    Số điện thoại:
                  </span>{" "}
                  <span className="ml-2 text-gray-800">{store.phone}</span>{" "}
                </div>
              )}{" "}
              {store.address && (
                <div>
                  {" "}
                  <span className="text-sm font-medium text-gray-600">
                    Địa chỉ:
                  </span>{" "}
                  <span className="ml-2 text-gray-800">{store.address}</span>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </main>
      <Footer />{" "}
    </div>
  );
};

export default StoreProfile;
