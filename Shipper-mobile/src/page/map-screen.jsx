import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder,
  Animated,
  Linking,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Sidebar from '../component/sidebar';
import Popup from '../component/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../shipper-context/config';

const MIN_HEIGHT = 300;
const MAX_HEIGHT = 500;

const LOCATIONIQ_API_KEY = 'pk.9d04aa17eed0056b2789ebb797f03cf8';

const MapScreen = () => {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [shipperToken, setShipperToken] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderMarkers, setOrderMarkers] = useState([]);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const mapRef = useRef(null);

  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  // Geocode địa chỉ thành tọa độ (LocationIQ API) với retry
  const geocodeAddress = async (address, retryCount = 0) => {
    try {
      // Thêm Vietnam vào địa chỉ để tăng độ chính xác
      const fullAddress = address.toLowerCase().includes('vietnam') || address.toLowerCase().includes('việt nam')
        ? address
        : `${address}, Vietnam`;
      
      console.log('Geocoding address:', fullAddress);
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(fullAddress)}&format=json&countrycodes=vn`;
      
      const response = await axios.get(url);
      console.log('Geocode response:', response.data);
      
      if (response.data && response.data.length > 0) {
        // Ưu tiên kết quả ở Vietnam
        const vietnamResult = response.data.find(r => 
          r.display_name?.toLowerCase().includes('vietnam') || 
          r.display_name?.toLowerCase().includes('việt nam') ||
          r.display_name?.toLowerCase().includes('ha noi') ||
          r.display_name?.toLowerCase().includes('hà nội')
        ) || response.data[0];
        
        const { lat, lon } = vietnamResult;
        console.log('Geocode success:', { lat, lon, display_name: vietnamResult.display_name });
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      }
      console.log('Geocode failed - no results');
      return null;
    } catch (error) {
      console.error('Geocode error:', error.message);
      // Retry nếu bị rate limit (429) và chưa retry quá 3 lần
      if (error.response?.status === 429 && retryCount < 3) {
        console.log(`Rate limited, retrying in 2 seconds... (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return geocodeAddress(address, retryCount + 1);
      }
      return null;
    }
  };

  // Lấy vị trí hiện tại
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần cấp quyền vị trí để sử dụng bản đồ');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  // Hàm delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Geocode địa chỉ đơn hàng khi orders thay đổi
  useEffect(() => {
    const geocodeOrders = async () => {
      console.log('Orders to geocode:', orders.length);
      if (orders.length === 0) {
        setOrderMarkers([]);
        return;
      }
      
      const markers = [];
      // Geocode tuần tự với delay để tránh rate limit
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        console.log('Processing order:', order.id, 'address:', order.shipping_address);
        
        if (order.shipping_address) {
          // Delay 1.5 giây giữa các request (LocationIQ free: 1 req/sec)
          if (i > 0) {
            await delay(1500);
          }
          
          const coords = await geocodeAddress(order.shipping_address);
          console.log('Order', order.id, 'coords:', coords);
          
          if (coords) {
            markers.push({
              id: order.id,
              ...coords,
              title: `Đơn #${order.id}`,
              description: order.shipping_address,
              receiverName: order.receiver_name,
            });
          }
        }
      }
      
      setOrderMarkers(markers);
    };
    
    geocodeOrders();
  }, [orders]);

  // Fit map để hiển thị tất cả markers khi có thay đổi
  useEffect(() => {
    if (mapRef.current && currentLocation && orderMarkers.length > 0) {
      // Lọc chỉ lấy markers có tọa độ hợp lệ (ở Việt Nam: lat 8-24, lon 102-110)
      const validMarkers = orderMarkers.filter(m => 
        m.latitude >= 8 && m.latitude <= 24 && 
        m.longitude >= 102 && m.longitude <= 115
      );
      
      if (validMarkers.length === 0) {
        console.log('No valid markers in Vietnam');
        return;
      }

      const allCoordinates = [
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        ...validMarkers.map(m => ({ latitude: m.latitude, longitude: m.longitude }))
      ];
      
      console.log('Fitting to coordinates:', allCoordinates);
      
      // Delay một chút để đảm bảo map đã render
      setTimeout(() => {
        mapRef.current.fitToCoordinates(allCoordinates, {
          edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [orderMarkers, currentLocation]);

  // Mở Google Maps với vị trí đơn hàng
  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

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

  // Mở camera để chụp ảnh giao hàng
  const takeDeliveryPhoto = async (orderId) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần cấp quyền camera để chụp ảnh giao hàng');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setDeliveryPhoto(result.assets[0]);
      setSelectedOrderId(orderId);
      setShowPhotoModal(true);
    }
  };

  // Xác nhận giao hàng với ảnh
  const confirmDelivery = async () => {
    try {
      if (!shipperToken) {
        Alert.alert('Lỗi', 'Chưa có token!');
        return;
      }

      if (!deliveryPhoto) {
        Alert.alert('Lỗi', 'Vui lòng chụp ảnh giao hàng!');
        return;
      }

      // Tạo FormData để gửi ảnh
      const formData = new FormData();
      formData.append('image', {
        uri: deliveryPhoto.uri,
        type: 'image/jpeg',
        name: `delivery_${selectedOrderId}.jpg`,
      });

      // Gọi API xác nhận giao hàng với ảnh
      const res = await axios.post(
        `${config.backendUrl}/orders/shipper/${selectedOrderId}/deliver-order`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${shipperToken}`,
            'Content-Type': 'multipart/form-data',
          } 
        }
      );

      if (res.data.status === "success") {
        Alert.alert('Thành công', `Đơn ${selectedOrderId} đã được xác nhận giao hàng!`);
        setShowPhotoModal(false);
        setDeliveryPhoto(null);
        setSelectedOrderId(null);

        // Clear markers cũ trước khi fetch lại
        setOrderMarkers([]);

        // Sau khi xác nhận xong, fetch lại danh sách đơn
        const ordersRes = await axios.get(`${config.backendUrl}/orders/shipper`, {
          headers: { Authorization: `Bearer ${shipperToken}` },
        });

        if (ordersRes.data.status === "success") {
          // Cập nhật orders sẽ trigger useEffect geocode lại
          setOrders(ordersRes.data.data.orders || []);
        }
      } else {
        Alert.alert('Lỗi', res.data.message || 'Xác nhận giao hàng thất bại');
      }

    } catch (err) {
      if (err.response) {
        Alert.alert('Lỗi', err.response.data?.message || 'Có lỗi xảy ra');
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối đến server');
      }
      console.error('Error:', err);
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

      {/* Map - Hiển thị vị trí hiện tại và các đơn hàng */}
      {currentLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle="light"
        >
          {/* Marker vị trí shipper - màu xanh */}
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Vị trí của bạn"
            pinColor="#116AD1"
          />
          
          {/* Markers cho các đơn hàng - màu đỏ */}
          {orderMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
              pinColor="#D32F2F"
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.mapLoading}>
          <Text style={{ color: '#666' }}>Đang tải bản đồ...</Text>
        </View>
      )}

      {/* Bottom Info Tab */}
      <Animated.View style={[styles.bottomTab, { height: animatedHeight }]}>
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
              <Text style={styles.emptySubtitle}>Bạn chưa nhận đơn hàng nào để giao</Text>
              <TouchableOpacity
                style={styles.takeOrderButton}
                onPress={() => navigation.navigate('TakeanOrder')}
              >
                <Text style={styles.takeOrderButtonText}>🚀 Nhận đơn hàng ngay</Text>
              </TouchableOpacity>
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
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Đang giao</Text>
                  </View>
                </View>
                
                {/* Thông tin người nhận */}
                <View style={styles.receiverInfo}>
                  <Text style={styles.receiverName}>👤 {order.receiver_name || 'Khách hàng'}</Text>
                  {order.receiver_phone && (
                    <Text style={styles.receiverPhone}>📞 {order.receiver_phone}</Text>
                  )}
                </View>
                
                <TouchableOpacity onPress={() => openGoogleMaps(order.shipping_address)}>
                  <Text style={[styles.orderText, { color: '#116AD1', textDecorationLine: 'underline' }]}>
                    📍 {order.shipping_address}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.orderPrice}>💰 {order.total_price?.toLocaleString('vi-VN')}₫</Text>
                {order.OrderItems && order.OrderItems.length > 0 && (
                  <Text style={styles.orderItems}>📦 {order.OrderItems.length} sản phẩm</Text>
                )}

                <View style={styles.boxRow}>
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => takeDeliveryPhoto(order.id)}
                  >
                    <Text style={styles.buttonText}>📷 Chụp ảnh & Xác nhận</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonCancel}
                    onPress={() => confirmCancel(order.id)}
                  >
                    <Text style={styles.buttonCancelText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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

      {/* Modal xác nhận ảnh giao hàng */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận giao hàng</Text>
            <Text style={styles.modalSubtitle}>Đơn hàng #{selectedOrderId}</Text>
            
            {deliveryPhoto && (
              <Image 
                source={{ uri: deliveryPhoto.uri }} 
                style={styles.previewImage}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => takeDeliveryPhoto(selectedOrderId)}
              >
                <Text style={styles.retakeButtonText}>📷 Chụp lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDelivery}
              >
                <Text style={styles.confirmButtonText}>✓ Xác nhận</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={() => {
                setShowPhotoModal(false);
                setDeliveryPhoto(null);
                setSelectedOrderId(null);
              }}
            >
              <Text style={styles.cancelModalText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  mapOverlayText: {
    color: '#fff',
    fontSize: 12,
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
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
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#116AD1',
    fontSize: 12,
    fontWeight: '600',
  },
  receiverInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  receiverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  receiverPhone: {
    fontSize: 13,
    color: '#666',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 13,
    color: '#888',
  },
  boxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  buttonPrimary: { flex: 1, backgroundColor: '#116AD1', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginRight: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  buttonCancel: { backgroundColor: '#FDEDED', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' },
  buttonCancelText: { color: '#D32F2F', fontWeight: 'bold' },
  overlay: { position: 'absolute', top: HEADER_HEIGHT, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 15 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    marginBottom: 24,
  },
  takeOrderButton: {
    backgroundColor: '#116AD1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#116AD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  takeOrderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  mapLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#116AD1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelModalButton: {
    paddingVertical: 10,
  },
  cancelModalText: {
    color: '#D32F2F',
    fontSize: 14,
  },
});

export default MapScreen;
