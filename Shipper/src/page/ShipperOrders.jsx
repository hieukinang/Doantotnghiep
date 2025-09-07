import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShipperHeader from '../component/ShipperHeader';
import ShipperSidebar from '../component/ShipperSidebar';

const ShipperOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      totalAmount: 250000,
      status: 'pending',
      orderDate: '2024-01-15',
      items: [
        { name: 'Áo thun nam', quantity: 2, price: 125000 }
      ]
    },
    {
      id: 'ORD002',
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      totalAmount: 180000,
      status: 'pending',
      orderDate: '2024-01-15',
      items: [
        { name: 'Quần jean nữ', quantity: 1, price: 180000 }
      ]
    },
    {
      id: 'ORD003',
      customerName: 'Lê Văn C',
      customerPhone: '0369852147',
      address: '789 Đường DEF, Quận 5, TP.HCM',
      totalAmount: 320000,
      status: 'assigned',
      orderDate: '2024-01-14',
      items: [
        { name: 'Giày thể thao', quantity: 1, price: 320000 }
      ]
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ nhận', color: 'bg-yellow-100 text-yellow-800' },
      assigned: { text: 'Đã nhận', color: 'bg-blue-100 text-blue-800' },
      delivering: { text: 'Đang giao', color: 'bg-orange-100 text-orange-800' },
      delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'assigned' }
        : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShipperHeader />
      
      <div className="flex pt-24">
        <ShipperSidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Đơn hàng cần giao</h1>
              <p className="text-gray-600 mt-1">Danh sách các đơn hàng trong khu vực của bạn</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ nhận</option>
                    <option value="assigned">Đã nhận</option>
                    <option value="delivering">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng</h3>
                  <p className="text-gray-500">Hiện tại không có đơn hàng nào phù hợp với bộ lọc của bạn.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Đơn hàng #{order.id}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Khách hàng:</span> {order.customerName}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">SĐT:</span> {order.customerPhone}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Ngày đặt:</span> {order.orderDate}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Tổng tiền:</span> 
                                <span className="font-semibold text-green-600 ml-1">
                                  {order.totalAmount.toLocaleString('vi-VN')}đ
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Địa chỉ giao:</span> {order.address}
                            </p>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm font-medium mb-1">Sản phẩm:</p>
                            <ul className="text-sm text-gray-600">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} x{item.quantity} - {item.price.toLocaleString('vi-VN')}đ
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:min-w-[200px]">
                          <Link
                            to={`/shipper/order-detail/${order.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition-colors"
                          >
                            Xem chi tiết
                          </Link>
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                              Nhận đơn
                            </button>
                          )}
                          
                          {order.status === 'assigned' && (
                            <Link
                              to={`/shipper/update-status/${order.id}`}
                              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-center transition-colors"
                            >
                              Cập nhật trạng thái
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Chờ nhận</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orders.filter(o => o.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">📦</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Đã nhận</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orders.filter(o => o.status === 'assigned').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-orange-600 text-xl">🚚</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Đang giao</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orders.filter(o => o.status === 'delivering').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Đã giao</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orders.filter(o => o.status === 'delivered').length}
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

export default ShipperOrders;
