import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KOHI MALL</Text>
      </View>

      {/* Nội dung chính (Map sau này) */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ color: 'gray' }}>Bản đồ sẽ hiển thị ở đây</Text>
      </View>

      {/* Bottom Info Tab */}
      <View style={styles.bottomTab}>
        <Text style={styles.boxTitle}>Thông tin đơn hàng</Text>
        <Text style={styles.boxText}>Mã đơn: #DH00123</Text>
        <Text style={styles.boxText}>Địa chỉ: 123 Đường ABC, Quận X</Text>

        <View style={styles.boxRow}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => console.log('Nhận đơn')}>
            <Text style={styles.buttonText}>Nhận đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonOutlineText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    marginTop: 31,
    borderRadius: 10, // cho đẹp hơn
    paddingBottom: 0,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
  },
  headerTitle: { color: '#116AD1', fontSize: 20, fontWeight: 'bold'},
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
    padding: 24,
    minHeight: 200, // gấp đôi chiều cao
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  boxTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  boxText: { fontSize: 14, marginBottom: 4 },
  boxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  buttonPrimary: {
    backgroundColor: '#116AD1',
    padding: 14,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#116AD1',
    padding: 14,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonOutlineText: { color: '#116AD1', fontWeight: 'bold' },
});

export default MapScreen;
