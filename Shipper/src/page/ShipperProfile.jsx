import React, { useState } from 'react';
import ShipperHeader from '../component/ShipperHeader';
import ShipperSidebar from '../component/ShipperSidebar';

const ShipperProfile = () => {
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn Shipper',
    email: 'shipper@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    idCard: '123456789',
    licensePlate: '51A-12345',
    vehicleType: 'motorcycle',
    joinDate: '2024-01-01',
    totalDeliveries: 156,
    successRate: 95.5,
    averageRating: 4.8
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
    alert('Đã cập nhật thông tin thành công!');
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShipperHeader />
      
      <div className="flex pt-24">
        <ShipperSidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và tài khoản shipper</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{profile.fullName}</h3>
                    <p className="text-gray-600">Shipper KOHI MALL</p>
                    <p className="text-sm text-gray-500 mt-1">Tham gia từ {profile.joinDate}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng đơn giao:</span>
                      <span className="font-semibold">{profile.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ thành công:</span>
                      <span className="font-semibold text-green-600">{profile.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đánh giá TB:</span>
                      <span className="font-semibold text-yellow-600">⭐ {profile.averageRating}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleEdit}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chi tiết</h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="fullName"
                            value={editData.fullName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số CMND/CCCD
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="idCard"
                            value={editData.idCard}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.idCard}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={editData.address}
                          onChange={handleChange}
                          rows="2"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tỉnh/Thành phố
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={editData.city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quận/Huyện
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="district"
                            value={editData.district}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.district}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại phương tiện
                        </label>
                        {isEditing ? (
                          <select
                            name="vehicleType"
                            value={editData.vehicleType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="motorcycle">Xe máy</option>
                            <option value="bicycle">Xe đạp</option>
                            <option value="car">Ô tô</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2">
                            {profile.vehicleType === 'motorcycle' ? 'Xe máy' : 
                             profile.vehicleType === 'bicycle' ? 'Xe đạp' : 'Ô tô'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biển số xe
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="licensePlate"
                            value={editData.licensePlate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.licensePlate}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;
