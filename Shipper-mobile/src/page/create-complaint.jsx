import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "../component/sidebar";
import Popup from "../component/popup";
import config from "../shipper-context/config";

const COMPLAINT_TYPES = [
  { value: "PRODUCT", label: "Sản phẩm", icon: "📦" },
  { value: "STORE", label: "Cửa hàng", icon: "🏪" },
  { value: "SERVICE", label: "Dịch vụ", icon: "🛎️" },
  { value: "DELIVERY", label: "Vận chuyển", icon: "🚚" },
  { value: "OTHER", label: "Khác", icon: "📝" },
];

const CreateComplaint = () => {
  const navigation = useNavigation();
  const [type, setType] = useState("DELIVERY");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Thông báo", "Chỉ được tải tối đa 5 ảnh!");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        type: "image/jpeg",
        name: `complaint-image-${Date.now()}.jpg`,
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!details.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập chi tiết khiếu nại!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại!");
        navigation.navigate("Login");
        return;
      }

      const formData = new FormData();
      formData.append("type", type);
      formData.append("details", details);
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(`${config.backendUrl}/complaints`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Thành công", "Gửi khiếu nại thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setType("DELIVERY");
      setDetails("");
      setImages([]);
    } catch (err) {
      console.error("Error creating complaint:", err);
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Text style={styles.menuBtn}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gửi khiếu nại</Text>
        <TouchableOpacity onPress={togglePopup}>
          <Text style={styles.menuBtn}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Gửi khiếu nại</Text>
          <Text style={styles.subtitle}>
            Chúng tôi sẽ xử lý khiếu nại của bạn trong thời gian sớm nhất
          </Text>
        </View>

        {/* Loại khiếu nại */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Loại khiếu nại <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.typeGrid}>
            {COMPLAINT_TYPES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.typeCard,
                  type === item.value && styles.typeCardActive,
                ]}
                onPress={() => setType(item.value)}
              >
                <Text style={styles.typeIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    type === item.value && styles.typeLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {type === item.value && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkMarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chi tiết */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mô tả chi tiết <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Vui lòng mô tả rõ ràng vấn đề bạn gặp phải..."
            placeholderTextColor="#999"
            value={details}
            onChangeText={setDetails}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{details.length} / 1000 ký tự</Text>
        </View>

        {/* Upload ảnh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình ảnh minh họa</Text>
          <Text style={styles.imageHint}>
            Tải lên tối đa 5 ảnh để giúp chúng tôi hiểu rõ hơn về vấn đề
          </Text>
          <View style={styles.imageGrid}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                <Text style={styles.addImageIcon}>+</Text>
                <Text style={styles.addImageText}>Thêm ảnh</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lưu ý */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Lưu ý quan trọng</Text>
            <Text style={styles.infoText}>
              • Cung cấp đầy đủ thông tin để được xử lý nhanh chóng
            </Text>
            <Text style={styles.infoText}>• Đính kèm ảnh chụp rõ ràng nếu có</Text>
            <Text style={styles.infoText}>
              • Thời gian xử lý khiếu nại: 24-48 giờ làm việc
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!details.trim() || loading) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!details.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Gửi khiếu nại</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Hotline */}
        <Text style={styles.hotline}>
          Cần hỗ trợ ngay? Liên hệ hotline: 1900 xxxx
        </Text>
      </ScrollView>

      {/* Overlay */}
      {(showSidebar || showPopup) && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeAll}
          style={styles.overlay}
        />
      )}

      {/* Sidebar */}
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Popup */}
      {showPopup && (
        <Popup
          visible={showPopup}
          onClose={closeAll}
          items={[
            { label: "Hồ sơ", onPress: () => navigation.navigate("Profile") },
            { label: "Đăng xuất", onPress: () => navigation.navigate("Login") },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    marginTop: 31,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    color: "#116AD1",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuBtn: {
    fontSize: 22,
    color: "#116AD1",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  required: {
    color: "#e53935",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeCard: {
    width: "48%",
    padding: 14,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  typeCardActive: {
    borderColor: "#116AD1",
    backgroundColor: "#e3f2fd",
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  typeLabelActive: {
    color: "#116AD1",
    fontWeight: "600",
  },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#116AD1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMarkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    backgroundColor: "#fafafa",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  imageHint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#bbb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageIcon: {
    fontSize: 28,
    color: "#999",
  },
  addImageText: {
    fontSize: 11,
    color: "#999",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#116AD1",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#116AD1",
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#b0bec5",
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  hotline: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
  },
  overlay: {
    position: "absolute",
    top: 81,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 15,
  },
});

export default CreateComplaint;
