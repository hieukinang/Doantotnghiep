import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'
import MessageButton from '../../component-home-page/MessageButton'
import { ShopContext } from '../../context/ShopContext'
import axios from 'axios';

const ChatWindow = ({ info, onClose }) => {
  if (!info) return null;
  return (
    <div 
      className="fixed bottom-0 right-5 w-80 h-96 bg-white border border-gray-300 rounded-t-lg shadow-2xl z-[1000] flex flex-col"
    >
      <div className="p-3 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <span className="font-semibold">{info.userName}</span>
        <button onClick={onClose} className="font-bold text-xl leading-none">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 text-gray-500">
        <div className="bg-blue-100 p-2 rounded-lg my-1 max-w-[80%] ml-auto">chắc đc rồi</div>
        <div className="bg-blue-100 p-2 rounded-lg my-1 max-w-[80%] ml-auto">cdsv</div>
        <div className="bg-gray-200 p-2 rounded-lg my-1 max-w-[80%] mr-auto">ok chưa</div>
      </div>
      <div className="p-2 border-t flex">
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.291-2.432 7.291a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FollowedShops = () => {
  const {
    followedStores,
    getFollowedStores,
    clientToken,
    backendURL
  } = useContext(ShopContext);

  const [followedStoreList, setFollowedStoreList] = useState([]);
  
  const [activeChat, setActiveChat] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const list = await getFollowedStores();
      if (!list) return;

      const details = await loadStoreDetails(list);
      setFollowedStoreList(details);
    };

    fetchAll();
  }, []);

  const loadStoreDetails = async (stores) => {
    try {
      const promises = stores.map((store) =>
        axios.get(`${backendURL}/stores/${store.id}`)
      );

      const responses = await Promise.all(promises);

      return stores.map((store, idx) => {
        const data = responses[idx]?.data?.data;

        return {
          ...store,
          followers: data?.followCount || data?.followers || 0,
          image: data?.image || store.image,
        };
      });
    } catch (err) {
      console.error("Lỗi khi load chi tiết store:", err);
      return stores;
    }
  };

  const handleUnfollow = async (storeId) => {
    if (!clientToken) return;

    try {
      await axios.delete(`${backendURL}/follows/${storeId}`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      const newList = await getFollowedStores();
      const details = await loadStoreDetails(newList);
      setFollowedStoreList(details);
    } catch (err) {
      console.error("Lỗi khi hủy theo dõi:", err);
    }
  };

  // 2. HÀM MỞ/ĐÓNG CHAT
  const handleOpenChat = (store) => {
    setActiveChat({ 
      userId: store.id, 
      userType: "STORE", 
      userName: store.name, 
      userImage: store.image 
    });
  };

  const handleCloseChat = () => {
    setActiveChat(null);
  };

  const totalPages = Math.ceil(followedStoreList.length / itemsPerPage);
  const currentItems = followedStoreList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Shop đang theo dõi</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Danh sách các shop bạn đã follow.
          </p>

          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
            {currentItems.length === 0 && (
              <div className="text-gray-500 text-sm md:text-base">Bạn chưa theo dõi shop nào.</div>
            )}

            {currentItems.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer p-4 md:p-5 border border-gray-100 hover:-translate-y-1"
              >
                <div onClick={() => navigate(`/store/${store.id}`)}>
                  {/* Phần hiển thị thông tin shop */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border-2 border-white shadow ring-2 ring-blue-100"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                        {store.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        {store.followers} người theo dõi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-gray-100">
                  <MessageButton
                    userId={store.id}
                    userType="STORE"
                    userName={store.name}
                    userImage={store.image}
                    onClick={() => handleOpenChat(store)}
                  />

                  <button
                    onClick={() => handleUnfollow(store.id)}
                    className="px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
                  >
                    Hủy theo dõi
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 md:mt-10 flex justify-center items-center gap-1 md:gap-2 flex-wrap">
              {/* Phân trang*/}
              <button
                onClick={() => goToPage(currentPage - 1)}
                className={`px-2 md:px-3 py-1 md:py-1.5 border rounded-lg text-xs md:text-sm ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Trước
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                className={`px-2 md:px-3 py-1 md:py-1.5 border rounded-lg text-xs md:text-sm ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>
      <ChatWindow info={activeChat} onClose={handleCloseChat} />

      <Footer />
    </div>
  );
};

export default FollowedShops;