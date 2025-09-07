import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShipperHeader from '../component/ShipperHeader';
import ShipperSidebar from '../component/ShipperSidebar';

const ShipperDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      totalAmount: 250000,
      status: 'delivered',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      deliveryTime: '14:30',
      items: [
        { name: 'Áo thun nam', quantity: 2, price: 125000 }
      ],
      rating: 5,
      feedback: 'Giao hàng nhanh, thái độ tốt'
    },
    {
      id: 'ORD002',
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      totalAmount: 180000,
      status: 'delivered',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-15',
      deliveryTime: '10:15',
      items: [
        { name: 'Quần jean nữ', quantity: 1, price: 180000 }
      ],
      rating: 4,
      feedback: 'Giao hàng đúng giờ'
    },
    {
      id: 'ORD003',
      customerName: 'Lê Văn C',
      customerPhone: '0369852147',
      address: '789 Đường DEF, Quận 5, TP.HCM',
      totalAmount: 320000,
      status: 'failed',
      orderDate: '2024-01-13',
      deliveryDate: '2024-01-14',
      deliveryTime: '16:45',
      items: [
        { name: 'Giày thể thao', quantity: 1, price: 320000 }
      ],
      rating: null,
      feedback: 'Khách hàng không nhận hàng',
      failureReason: 'Khách hàng không có mặt tại địa chỉ'
    },
    {
      id: 'ORD004',
      customerName: 'Phạm Thị D',
      customerPhone: '0741258963',
      address: '321 Đường GHI, Quận 7, TP.HCM',
      totalAmount: 450000,
      status: 'delivered',
      orderDate: '2024-01-12',
      deliveryDate: '2024-01-13',
      deliveryTime: '09:20',
      items: [
        { name: 'Túi xách nữ', quantity: 1, price: 450000 }
      ],
      rating: 5,
      feedback: 'Rất hài lòng với dịch vụ'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    const matchesSearch = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const deliveryDate = new Date(delivery.deliveryDate);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisMonth = new Date(today);
      thisMonth.setMonth(thisMonth.getMonth() - 1);

      switch (filterDate) {
        case 'today':
          matchesDate = deliveryDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesDate = deliveryDate.toDateString() === yesterday.toDateString();
          break;
        case 'thisWeek':
          matchesDate = deliveryDate >= thisWeek;
          break;
        case 'thisMonth':
          matchesDate = deliveryDate >= thisMonth;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-800' },
      returned: { text: 'Đã trả', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.delivered;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">Chưa đánh giá</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-sm ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const getStats = () => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status === 'delivered').length;
    const failed = deliveries.filter(d => d.status === 'failed').length;
    const avgRating = deliveries
      .filter(d => d.rating)
      .reduce((sum, d) => sum + d.rating, 0) / deliveries.filter(d => d.rating).length || 0;

    return { total, delivered, failed, avgRating: avgRating.toFixed(1) };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <ShipperHeader />
      
      <div className="flex pt-24">
        <ShipperSidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Lịch sử giao hàng</h1>
              <p className="text-gray-600 mt-1">Theo dõi các đơn hàng đã giao và đánh giá từ khách hàng</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">📦</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Giao thành công</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.delivered}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Giao thất bại</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.failed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-600 text-xl">⭐</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.avgRating}</p>
                  </div>
                </div>
              </div>
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
                    <option value="delivered">Đã giao</option>
                    <option value="failed">Thất bại</option>
                    <option value="returned">Đã trả</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="yesterday">Hôm qua</option>
                    <option value="thisWeek">Tuần này</option>
                    <option value="thisMonth">Tháng này</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery History List */}
            <div className="space-y-4">
              {filteredDeliveries.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch sử giao hàng</h3>
                  <p className="text-gray-500">Hiện tại không có đơn hàng nào phù hợp với bộ lọc của bạn.</p>
                </div>
              ) : (
                filteredDeliveries.map(delivery => (
                  <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Delivery Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Đơn hàng #{delivery.id}
                            </h3>
                            {getStatusBadge(delivery.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Khách hàng:</span> {delivery.customerName}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">SĐT:</span> {delivery.customerPhone}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Ngày giao:</span> {delivery.deliveryDate} lúc {delivery.deliveryTime}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Tổng tiền:</span> 
                                <span className="font-semibold text-green-600 ml-1">
                                  {delivery.totalAmount.toLocaleString('vi-VN')}đ
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Địa chỉ giao:</span> {delivery.address}
                            </p>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm font-medium mb-1">Sản phẩm:</p>
                            <ul className="text-sm text-gray-600">
                              {delivery.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} x{item.quantity} - {item.price.toLocaleString('vi-VN')}đ
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Rating and Feedback */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Đánh giá:</p>
                                {renderStars(delivery.rating)}
                              </div>
                              {delivery.feedback && (
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-600">Phản hồi:</p>
                                  <p className="text-sm text-gray-700 italic">"{delivery.feedback}"</p>
                                </div>
                              )}
                            </div>
                            {delivery.failureReason && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-red-600">Lý do thất bại:</p>
                                <p className="text-sm text-red-700">{delivery.failureReason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:min-w-[200px]">
                          <Link
                            to={`/shipper/order-detail/${delivery.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition-colors"
                          >
                            Xem chi tiết
                          </Link>
                          
                          <a
                            href={`tel:${delivery.customerPhone}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center transition-colors"
                          >
                            Gọi lại khách hàng
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDeliveryHistory;
