import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../component/sidebar';
import Popup from '../component/popup';
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 500;

const MapScreen = () => {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  // PanResponder để kéo thanh Bottom Sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        let newHeight = MIN_HEIGHT - gestureState.dy;
        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
        animatedHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < 0) {
          // Kéo lên → bung max
          Animated.spring(animatedHeight, {
            toValue: MAX_HEIGHT,
            useNativeDriver: false,
          }).start();
        } else {
          // Kéo xuống → thu về min
          Animated.spring(animatedHeight, {
            toValue: MIN_HEIGHT,
            useNativeDriver: false,
          }).start();
        }
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

  const confirmCancel = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn hủy đơn này?",
      [
        { text: "Không", style: "cancel" },
        { text: "Có", onPress: () => console.log("Đơn hàng đã bị hủy") }
      ]
    );
  };

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
        {/* Thanh kéo */}
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.navigate('OrderDetail')}>
            <View style={styles.boxContainer}>
              <Text style={styles.boxText}>Mã đơn: #DH00123</Text>
              <Text style={styles.boxText}>Địa chỉ: 123 Đường ABC, Quận X</Text>
              <Text style={styles.boxText}>Người nhận: Nguyễn Văn A</Text>

              <View style={styles.boxRow}>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={() => console.log('Xác nhận giao hàng')}
                >
                  <Text style={styles.buttonText}>Xác nhận giao hàng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={confirmCancel}
                >
                  <Text style={styles.buttonCancelText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {(showSidebar || showPopup) && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeAll}
          style={styles.overlay}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar onClose={() => setShowSidebar(false)} />
      )}

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

  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },

  boxContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  boxText: { fontSize: 14, marginBottom: 4 },

  boxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },

  buttonPrimary: {
    flex: 1,
    backgroundColor: '#116AD1',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },

  buttonCancel: {
    backgroundColor: '#FDEDED',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonCancelText: { color: '#D32F2F', fontWeight: 'bold' },

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
});

export default MapScreen;
