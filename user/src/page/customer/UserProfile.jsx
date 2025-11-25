import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../component-home-page/Header';
import Footer from '../../component-home-page/Footer';
import MessageButton from '../../component-home-page/MessageButton';
import { ShopContext } from '../../context/ShopContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { backendURL } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('Không tìm thấy thông tin người dùng');
        setLoading(false);
        return;
      }

      try {
        // Lấy thông tin client từ API
        const res = await axios.get(`${backendURL}/clients/${userId}`);
        if (res.data?.status === 'success' && res.data?.data?.doc) {
          const userData = res.data.data.doc;
          setUser({
            id: userData.id || `CLIENT${userData.id}`,
            username: userData.username || userData.name || 'Người dùng',
            email: userData.email || '',
            phone: userData.phone || '',
            image: userData.image || null,
            address: userData.address || ''
          });
        } else {
          setError('Không tìm thấy thông tin người dùng');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, backendURL]);

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

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          <div className="text-red-500">{error || 'Không tìm thấy người dùng'}</div>
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
                {user.image ? (
                  <img
                    src={user.image.startsWith('http') ? user.image : `${backendURL}/${user.image}`}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
                  <p className="text-gray-500 mt-1">Khách hàng</p>
                </div>
              </div>
              <MessageButton
                userId={user.id}
                userType="CLIENT"
                userName={user.username}
                userImage={user.image}
              />
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {user.email && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                  <span className="ml-2 text-gray-800">{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 text-gray-800">{user.address}</span>
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

export default UserProfile;