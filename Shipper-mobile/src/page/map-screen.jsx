import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Sidebar from '../component/sidebar';
import Popup from '../component/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../shipper-context/config';

const MIN_HEIGHT = 300;
const MAX_HEIGHT = 500;

const MapScreen = () => {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [shipperToken, setShipperToken] = useState(null);

  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  // PanResponder kéo bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        let newHeight = MIN_HEIGHT - gestureState.dy;
        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
        animatedHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(animatedHeight, {
          toValue: gestureState.dy < 0 ? MAX_HEIGHT : MIN_HEIGHT,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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

  const confirmCancel = (orderId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn hủy đơn này?",
      [
        { text: "Không", style: "cancel" },
        { text: "Có", onPress: () => console.log(`Đơn hàng ${orderId} đã bị hủy`) }
      ]
    );
  };
  const confirmDelivery = async (orderId) => {
    try {
      if (!shipperToken) {
        console.warn("Chưa có token!");
        return;
      }

      // Gọi API xác nhận giao hàng
      const res = await axios.post(
        `${config.backendUrl}/orders/shipper/${orderId}/deliver-order`,
        {}, // nếu API không cần body thì để {}
        { headers: { Authorization: `Bearer ${shipperToken}` } }
      );

      if (res.data.status === "success") {
        console.log(`Đơn ${orderId} đã được xác nhận giao hàng!`);

        // Sau khi xác nhận xong, fetch lại danh sách đơn
        const ordersRes = await axios.get(`${config.backendUrl}/orders/shipper`, {
          headers: { Authorization: `Bearer ${shipperToken}` },
          params: { status: "IN_TRANSIT" },
        });

        if (ordersRes.data.status === "success") {
          setOrders(ordersRes.data.data.orders || []);
        } else {
          console.warn('Không lấy được đơn hàng:', ordersRes.data.message);
        }

      } else {
        console.warn("Xác nhận giao hàng thất bại:", res.data.message);
      }

    } catch (err) {
      // Log lỗi chi tiết
      if (err.response) {
        console.error('Lỗi response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      } else if (err.request) {
        console.error('Lỗi request (không có phản hồi):', err.request);
      } else {
        console.error('Lỗi khi setup request:', err.message);
      }
      console.error('Full error object:', err.toJSON ? err.toJSON() : err);
    }
  };


  // Lấy token và fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setShipperToken(token);

        if (!token) return console.warn("Chưa có token");

        const res = await axios.get(`${config.backendUrl}/orders/shipper`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: "IN_TRANSIT" },
        });

        if (res.data.status === "success") {
          setOrders(res.data.data.orders || []);
        } else {
          console.warn('Không lấy được đơn hàng:', res.data.message);
        }
      } catch (err) {
        // Xử lý lỗi axios chi tiết
        if (err.response) {
          // Server trả về status lỗi
          console.error('Lỗi response:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
          });
        } else if (err.request) {
          // Request đã gửi nhưng không nhận được response
          console.error('Lỗi request (không có phản hồi):', err.request);
        } else {
          // Lỗi khác khi thiết lập request
          console.error('Lỗi khi setup request:', err.message);
        }
        console.error('Full error object:', err.toJSON ? err.toJSON() : err);
      }
    };
    fetchOrders();
  }, []);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Text style={styles.menuBtn}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>KOHI MALL</Text>

        <TouchableOpacity onPress={togglePopup}>
          <Text style={styles.menuBtn}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ color: 'gray' }}>Bản đồ sẽ hiển thị ở đây</Text>
      </View>

      {/* Bottom Info Tab */}
      <Animated.View style={[styles.bottomTab, { height: animatedHeight }]}>
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có đơn hàng</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.boxContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}>
                  <Text style={styles.boxText}>Mã đơn: #{order.id}</Text>
                  <Text style={styles.boxText}>Địa chỉ: {order.shipping_address}</Text>
                  <Text style={styles.boxText}>Tổng: {order.total_price.toLocaleString('vi-VN')}₫</Text>

                  {order.OrderItems.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                      <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 4, marginRight: 8 }} />
                      <View>
                        <Text>{item.title}</Text>
                        <Text>Số lượng: {item.quantity}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.boxRow}>
                    <TouchableOpacity
                      style={styles.buttonPrimary}
                      onPress={() => confirmDelivery(order.id)}
                    >
                      <Text style={styles.buttonText}>Xác nhận giao hàng</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={styles.buttonCancel}
                      onPress={() => confirmCancel(order.id)}
                    >
                      <Text style={styles.buttonCancelText}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {(showSidebar || showPopup) && (
        <TouchableOpacity activeOpacity={1} onPress={closeAll} style={styles.overlay} />
      )}

      {/* Sidebar */}
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Popup */}
      {showPopup && (
        <Popup
          visible={showPopup}
          onClose={closeAll}
          items={[
            { label: "Hồ sơ", onPress: () => console.log("Hồ sơ") },
            { label: "Đăng xuất", onPress: () => console.log("Đăng xuất") },
          ]}
        />
      )}
    </View>
  );
};

const HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    marginTop: 31,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: { color: '#116AD1', fontSize: 20, fontWeight: 'bold' },
  menuBtn: { fontSize: 22, color: '#116AD1' },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  dragHandleContainer: { alignItems: 'center', paddingVertical: 6 },
  dragHandle: { width: 50, height: 5, borderRadius: 3, backgroundColor: '#ccc' },
  boxContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginVertical: 10, backgroundColor: '#fff' },
  boxText: { fontSize: 14, marginBottom: 4 },
  boxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  buttonPrimary: { flex: 1, backgroundColor: '#116AD1', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginRight: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  buttonCancel: { backgroundColor: '#FDEDED', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' },
  buttonCancelText: { color: '#D32F2F', fontWeight: 'bold' },
  overlay: { position: 'absolute', top: HEADER_HEIGHT, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 15 },
});

export default MapScreen;
