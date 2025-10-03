import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HEADER_HEIGHT = 80;

const Popup = ({ visible, onClose, items }) => {
  if (!visible) return null; // Không render nếu chưa mở

  return (
    <View style={styles.popup}>
      <Text style={styles.popupTitle}>Cài đặt</Text>

      {/* Render danh sách item */}
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            item.onPress();
            onClose(); // tự đóng sau khi bấm
          }}
        >
          <Text style={styles.popupItem}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Nút đóng */}
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.popupItem, { color: "red" }]}>Đóng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    top: HEADER_HEIGHT,
    right: 10,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 30,
  },
  popupTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  popupItem: { fontSize: 14, paddingVertical: 8, color: "#116AD1" },
});

export default Popup;
