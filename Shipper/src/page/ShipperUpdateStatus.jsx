import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ShipperHeader from '../component/ShipperHeader';
import ShipperSidebar from '../component/ShipperSidebar';

const ShipperUpdateStatus = () => {
  const { orderId } = useParams();
  
  const [order, setOrder] = useState({
    id: orderId || 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    totalAmount: 250000,
    status: 'assigned',
    orderDate: '2024-01-15',
    items: [
      { name: 'Áo thun nam', quantity: 2, price: 125000 }
    ],
    notes: ''
  });

  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [updateNotes, setUpdateNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'assigned', label: 'Đã nhận đơn', description: 'Shipper đã nhận đơn hàng và chuẩn bị giao' },
    { value: 'picked_up', label: 'Đã lấy hàng', description: 'Shipper đã lấy hàng từ kho/người bán' },
    { value: 'delivering', label: 'Đang giao hàng', description: 'Shipper đang trên đường giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng', description: 'Đã giao hàng thành công cho khách hàng' },
    { value: 'failed', label: 'Giao hàng thất bại', description: 'Không thể giao hàng (khách không nhận, địa chỉ sai, v.v.)' },
    { value: 'returned', label: 'Đã trả hàng', description: 'Hàng đã được trả về kho/người bán' }
  ];

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentStatus(newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      setIsUpdating(false);
      
      // Show success message
      alert(`Đã cập nhật trạng thái thành: ${statusOptions.find(s => s.value === newStatus)?.label}`);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { text: 'Đã nhận', color: 'bg-blue-100 text-blue-800' },
      picked_up: { text: 'Đã lấy hàng', color: 'bg-purple-100 text-purple-800' },
      delivering: { text: 'Đang giao', color: 'bg-orange-100 text-orange-800' },
      delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-800' },
      returned: { text: 'Đã trả', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.assigned;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
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
              <div className="flex items-center gap-3 mb-2">
                <Link to="/shipper/orders" className="text-blue-600 hover:text-blue-700">
                  ← Quay lại danh sách đơn hàng
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Cập nhật trạng thái đơn hàng</h1>
              <p className="text-gray-600 mt-1">Đơn hàng #{order.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Mã đơn hàng:</span>
                      <p className="text-gray-900">#{order.id}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Khách hàng:</span>
                      <p className="text-gray-900">{order.customerName}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Số điện thoại:</span>
                      <p className="text-gray-900">{order.customerPhone}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Địa chỉ giao:</span>
                      <p className="text-gray-900">{order.address}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Tổng tiền:</span>
                      <p className="text-gray-900 font-semibold text-green-600">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Trạng thái hiện tại:</span>
                      <div className="mt-1">
                        {getStatusBadge(currentStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Sản phẩm:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{item.price.toLocaleString('vi-VN')}đ</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật trạng thái</h3>
                  
                  <div className="space-y-4">
                    {statusOptions.map((status) => (
                      <div
                        key={status.value}
                        className={`border rounded-lg p-4 transition-all ${
                          currentStatus === status.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                id={status.value}
                                name="status"
                                value={status.value}
                                checked={currentStatus === status.value}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={status.value} className="font-medium text-gray-900 cursor-pointer">
                                {status.label}
                              </label>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-6">
                              {status.description}
                            </p>
                          </div>
                          
                          {currentStatus === status.value && (
                            <button
                              onClick={() => handleStatusUpdate(status.value)}
                              disabled={isUpdating}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={updateNotes}
                      onChange={(e) => setUpdateNotes(e.target.value)}
                      placeholder="Nhập ghi chú về việc giao hàng..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Thao tác nhanh</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusUpdate('picked_up')}
                        disabled={isUpdating}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
                      >
                        Đã lấy hàng
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('delivering')}
                        disabled={isUpdating}
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 text-sm"
                      >
                        Bắt đầu giao
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('delivered')}
                        disabled={isUpdating}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        Giao thành công
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('failed')}
                        disabled={isUpdating}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                      >
                        Giao thất bại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Customer */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ khách hàng</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  <span>📞</span>
                  Gọi điện: {order.customerPhone}
                </a>
                <a
                  href={`sms:${order.customerPhone}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>💬</span>
                  Nhắn tin SMS
                </a>
                <Link
                  to={`/shipper/order-detail/${order.id}`}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <span>📋</span>
                  Xem chi tiết đơn hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperUpdateStatus;
