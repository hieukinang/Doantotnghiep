import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../component/sidebar';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from '../shipper-context/config';

const HEADER_HEIGHT = 80;

const STATUS_MAP = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  IN_TRANSIT: 'Đang giao',
  DELIVERED: 'Đã giao',
  CLIENT_CONFIRMED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  FAILED: 'Thất bại',
  RETURNED: 'Trả hàng',
};

const DeliveryHistory = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch orders khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("Chưa có token");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${config.backendUrl}/orders/shipper/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setOrders(res.data.data.orders || []);
      } else {
        console.warn('Không lấy được đơn hàng:', res.data.message);
      }
    } catch (err) {
      console.error('Lỗi fetch orders:', err.message);
      // Nếu API history không tồn tại, thử gọi API shipper với filter
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${config.backendUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === "success") {
          // Lọc các đơn đã hoàn thành
          const completedOrders = (res.data.data.orders || []).filter(
            o => ['DELIVERED', 'CLIENT_CONFIRMED', 'CANCELLED', 'FAILED', 'RETURNED'].includes(o.status)
          );
          setOrders(completedOrders);
        }
      } catch (e) {
        console.error('Lỗi fallback:', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    if (!showSidebar) setShowPopup(false);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) setShowSidebar(false);
  };

  const closeAll = () => {
    setShowSidebar(false);
    setShowPopup(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CLIENT_CONFIRMED':
        return '#22C55E';
      case 'DELIVERED':
        return '#3B82F6';
      case 'CANCELLED':
      case 'FAILED':
        return '#EF4444';
      case 'RETURNED':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.headerSide}>
          <Text style={styles.menuBtn}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lịch sử giao hàng</Text>

        <TouchableOpacity onPress={togglePopup} style={styles.headerSideRight}>
          <Text style={styles.menuBtn}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#116AD1" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView style={styles.historyList} contentContainerStyle={{ paddingBottom: 80 }}>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
              <Text style={styles.emptySubtitle}>Bạn chưa hoàn thành đơn hàng nào</Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {STATUS_MAP[order.status] || order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.orderText}>📍 {order.shipping_address}</Text>
                  <Text style={styles.orderPrice}>💰 {order.total_price?.toLocaleString('vi-VN')}₫</Text>
                  <Text style={styles.orderDate}>
                    📅 {order.order_date || new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                  {order.delivered_at && (
                    <Text style={styles.deliveredDate}>
                      ✅ Giao lúc: {new Date(order.delivered_at).toLocaleString('vi-VN')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Overlay */}
      {(showSidebar || showPopup) && (
        <TouchableOpacity activeOpacity={1} onPress={closeAll} style={styles.overlay} />
      )}

      {/* Sidebar */}
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Popup */}
      {showPopup && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Cài đặt</Text>
          <TouchableOpacity onPress={closeAll}>
            <Text style={styles.popupItem}>Đóng</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Hồ sơ')}>
            <Text style={styles.popupItem}>Hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Đăng xuất')}>
            <Text style={styles.popupItem}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Button */}
      <View style={[styles.bottomButtonWrapper, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => navigation.navigate('TakeanOrder')}>
          <Text style={styles.acceptBtnText}>Nhận đơn hàng mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    marginTop: 31,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerSide: { width: 60, justifyContent: 'center' },
  headerSideRight: { width: 60, justifyContent: 'center', alignItems: 'flex-end' },
  headerTitle: {
    color: '#116AD1',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  menuBtn: { fontSize: 22, color: '#116AD1' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  historyList: { flex: 1, padding: 16 },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },

  orderCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#116AD1',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    gap: 4,
  },
  orderText: { 
    fontSize: 14, 
    color: '#333',
  },
  orderPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  orderDate: { 
    fontSize: 13, 
    color: '#666',
  },
  deliveredDate: {
    fontSize: 13,
    color: '#22C55E',
    fontStyle: 'italic',
  },

  overlay: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 15,
  },

  popup: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    right: 10,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 30,
  },
  popupTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  popupItem: { fontSize: 14, paddingVertical: 8, color: '#116AD1' },

  bottomButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  acceptBtn: {
    width: '100%',
    backgroundColor: '#116AD1',
    paddingVertical: 16,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveryHistory;
