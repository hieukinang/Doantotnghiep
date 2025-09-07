import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ShipperHeader from '../component/ShipperHeader';
import ShipperSidebar from '../component/ShipperSidebar';

const ShipperOrderDetail = () => {
  const { orderId } = useParams();
  
  const [order, setOrder] = useState({
    id: orderId || 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123456789',
    customerEmail: 'nguyenvana@email.com',
    address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    totalAmount: 250000,
    shippingFee: 30000,
    discount: 0,
    finalAmount: 280000,
    status: 'assigned',
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-16',
    paymentMethod: 'COD',
    notes: 'Giao hàng vào buổi chiều, gọi trước khi giao',
    items: [
      { 
        id: 1,
        name: 'Áo thun nam cao cấp', 
        quantity: 2, 
        price: 125000,
        image: 'https://via.placeholder.com/80x80',
        size: 'L',
        color: 'Xanh dương'
      }
    ],
    statusHistory: [
      { status: 'pending', date: '2024-01-15 10:30', note: 'Đơn hàng được tạo' },
      { status: 'confirmed', date: '2024-01-15 11:00', note: 'Đơn hàng được xác nhận' },
      { status: 'assigned', date: '2024-01-15 14:30', note: 'Shipper nhận đơn hàng' }
    ]
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      assigned: { text: 'Đã nhận', color: 'bg-purple-100 text-purple-800' },
      picked_up: { text: 'Đã lấy hàng', color: 'bg-indigo-100 text-indigo-800' },
      delivering: { text: 'Đang giao', color: 'bg-orange-100 text-orange-800' },
      delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-800' },
      returned: { text: 'Đã trả', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      assigned: '📦',
      picked_up: '🚚',
      delivering: '🛣️',
      delivered: '🎉',
      failed: '❌',
      returned: '↩️'
    };
    return icons[status] || '❓';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShipperHeader />
      
      <div className="flex pt-24">
        <ShipperSidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Link to="/shipper/orders" className="text-blue-600 hover:text-blue-700">
                  ← Quay lại danh sách đơn hàng
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                  <p className="text-gray-600 mt-1">Đơn hàng #{order.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <Link
                    to={`/shipper/update-status/${order.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật trạng thái
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Họ và tên</p>
                      <p className="text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Số điện thoại</p>
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:text-blue-700">
                        {order.customerPhone}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:text-blue-700">
                        {order.customerEmail}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phương thức thanh toán</p>
                      <p className="text-gray-900">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">Địa chỉ giao hàng</p>
                    <p className="text-gray-900 mt-1">{order.address}</p>
                  </div>
                  
                  {order.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">Ghi chú đặc biệt:</p>
                      <p className="text-sm text-yellow-700 mt-1">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm trong đơn hàng</h3>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            <span>Số lượng: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Màu: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.price.toLocaleString('vi-VN')}đ/SP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status History */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử trạng thái</h3>
                  
                  <div className="space-y-4">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">{getStatusIcon(history.status)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(history.status)}
                            <span className="text-sm text-gray-500">{history.date}</span>
                          </div>
                          {history.note && (
                            <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="font-medium">{order.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dự kiến giao:</span>
                      <span className="font-medium">{order.expectedDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="font-medium text-red-600">-{order.discount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Tổng cộng:</span>
                        <span className="font-bold text-lg text-green-600">
                          {order.finalAmount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                  
                  <div className="space-y-3">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <span>📞</span>
                      Gọi khách hàng
                    </a>
                    <a
                      href={`sms:${order.customerPhone}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <span>💬</span>
                      Nhắn tin SMS
                    </a>
                    <Link
                      to={`/shipper/update-status/${order.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      <span>✏️</span>
                      Cập nhật trạng thái
                    </Link>
                  </div>
                </div>

                {/* Map/Directions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Định vị</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                      <span>🗺️</span>
                      Xem trên bản đồ
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                      <span>🧭</span>
                      Chỉ đường
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Địa chỉ:</span><br />
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
