// Sidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 80;

const Sidebar = ({ onClose }) => {
  const navigation = useNavigation();

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    if (onClose) onClose(); // đóng Sidebar sau khi bấm
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Menu</Text>

      </View>

      {/* Items */}
      <TouchableOpacity onPress={() => handleNavigate("MapScreen")}>
        <Text style={styles.backText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate("DeliveryHistory")}>
        <Text style={styles.sidebarItem}>Lịch sử giao hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate("Wallet")}>
        <Text style={styles.sidebarItem}>Ví tiền</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate("TakeanOrder")}>
        <Text style={styles.sidebarItem}>Nhận thêm đơn hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate("ChatList")}>
        <Text style={styles.sidebarItem}>Tin nhắn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate("Profile")}>
        <Text style={styles.sidebarItem}>Hồ sơ cá nhân</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    bottom: 0,
    left: 0,
    width: width * 0.7,
    backgroundColor: '#fff',
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#ccc',
    elevation: 20,
    zIndex: 30,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarTitle: { fontSize: 18, fontWeight: 'bold' },
  backText: { fontSize: 16, paddingVertical: 10, color: '#116AD1' },
  sidebarItem: { fontSize: 16, paddingVertical: 10, color: '#116AD1' },
});

export default Sidebar;
