import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Sidebar from "../component/sidebar";
import Popup from "../component/popup";
import config from "../shipper-context/config";
import { useChat } from "../shipper-context/ChatContext";

const STATUS_MAP = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã giao",
  CLIENT_CONFIRMED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
  RETURNED: "Trả hàng",
};

const OrderDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order: orderParam, orderId } = route.params || {};
  const { conversations } = useChat();

  const [order, setOrder] = useState(orderParam || null);
  const [loading, setLoading] = useState(!orderParam && !!orderId);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch order nếu chỉ có orderId
  useEffect(() => {
    const fetchOrder = async () => {
      if (orderParam || !orderId) return;
      
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Gọi API lấy chi tiết đơn hàng
        const res = await axios.get(`${config.backendUrl}/orders/shipper/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success" && res.data.data?.order) {
          setOrder(res.data.data.order);
        }
      } catch (err) {
        console.error("Lỗi fetch order:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orderParam]);

  const confirmCancel = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn hủy đơn này?", [
      { text: "Không", style: "cancel" },
      { text: "Có", onPress: () => console.log("Đơn hàng đã bị hủy") },
    ]);
  };

  // Liên hệ khách hàng
  const handleContactCustomer = () => {
    const clientId = order?.clientId || order?.OrderClient?.id;
    const clientName = order?.OrderClient?.username || order?.client_username || "Khách hàng";
    
    if (!clientId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin khách hàng");
      return;
    }

    // Chuyển clientId sang string để so sánh chính xác
    const clientIdStr = String(clientId);

    // Kiểm tra xem đã có conversation với client này chưa
    const existingConv = conversations.find(conv => 
      conv.participants?.some(p => String(p.user_id) === clientIdStr)
    );

    if (existingConv) {
      // Đã có conversation -> mở ChatRoom với conversationId
      navigation.navigate("ChatRoom", {
        conversationId: existingConv._id,
        otherUser: { user_id: clientIdStr, username: clientName }
      });
    } else {
      // Chưa có conversation -> mở ChatRoom với targetUserId
      // Conversation sẽ được tạo khi gửi tin nhắn đầu tiên
      navigation.navigate("ChatRoom", {
        conversationId: null,
        targetUserId: clientIdStr,
        otherUser: { user_id: clientIdStr, username: clientName }
      });
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
      case "CLIENT_CONFIRMED":
        return "#22C55E";
      case "DELIVERED":
        return "#3B82F6";
      case "IN_TRANSIT":
        return "#F59E0B";
      case "CANCELLED":
      case "FAILED":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.menuBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#116AD1" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  // Nếu không có order data
  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.menuBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy thông tin đơn hàng</Text>
        </View>
      </View>
    );
  }

  const orderItems = order.OrderItems || [];
  const totalPrice = order.total_price || 0;
  const shippingFee = order.shipping_fee || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.menuBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <TouchableOpacity onPress={togglePopup}>
          <Text style={styles.menuBtn}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Thông tin đơn hàng */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) + "20" },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusColor(order.status) }]}
              >
                {STATUS_MAP[order.status] || order.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Địa chỉ giao:</Text>
            <Text style={styles.value}>{order.shipping_address || "Chưa có"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Ngày đặt:</Text>
            <Text style={styles.value}>
              {order.order_date ||
                new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>

          {order.delivered_at && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>✅ Giao lúc:</Text>
              <Text style={[styles.value, { color: "#22C55E" }]}>
                {new Date(order.delivered_at).toLocaleString("vi-VN")}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>💳 Thanh toán:</Text>
            <Text style={styles.value}>
              {order.payment_method === "CASH" ? "Tiền mặt (COD)" : "Ví KOHI"}
            </Text>
          </View>
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🛍️ Sản phẩm ({orderItems.length})</Text>
          
          {orderItems.length === 0 ? (
            <Text style={styles.emptyProducts}>Không có sản phẩm</Text>
          ) : (
            orderItems.map((item, index) => {
              // Lấy image từ item hoặc từ ProductVariantProduct
              const rawImageUrl = item.image || 
                item.OrderItemProductVariant?.ProductVariantProduct?.main_image;
              // Thay localhost bằng IP thực để hiển thị trên mobile
              const imageUrl = rawImageUrl?.replace("localhost", config.port);
              
              return (
                <View key={item.id || index} style={styles.productItem}>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.productImage}
                    />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.title || item.OrderItemProductVariant?.ProductVariantProduct?.name || "Sản phẩm"}
                    </Text>
                    <Text style={styles.productQty}>x{item.quantity || 1}</Text>
                  </View>
                  <Text style={styles.productPrice}>
                    {(item.price || 0).toLocaleString("vi-VN")}₫
                  </Text>
                </View>
              );
            })
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính:</Text>
            <Text style={styles.summaryValue}>
              {totalPrice.toLocaleString("vi-VN")}₫
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.summaryValue}>
              {shippingFee.toLocaleString("vi-VN")}₫
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>
              {(totalPrice + shippingFee).toLocaleString("vi-VN")}₫
            </Text>
          </View>
        </View>

        {/* Nút liên hệ khách hàng - chỉ hiện khi đơn chưa hoàn thành */}
        {order.status !== "CLIENT_CONFIRMED" && order.status !== "DELIVERED" && (
          <>
            <TouchableOpacity
              style={styles.buttonChat}
              onPress={handleContactCustomer}
            >
              <Text style={styles.buttonChatText}>💬 Liên hệ khách hàng</Text>
            </TouchableOpacity>

            {/* Nút hành động */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => console.log("Xác nhận giao")}
              >
                <Text style={styles.buttonText}>Xác nhận giao</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonCancel} onPress={confirmCancel}>
                <Text style={styles.buttonCancelText}>Hủy đơn</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
            { label: "Hồ sơ", onPress: () => console.log("Hồ sơ") },
            { label: "Đăng xuất", onPress: () => console.log("Đăng xuất") },
          ]}
        />
      )}
    </View>
  );
};

export default OrderDetail;

const HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    marginTop: 31,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menuBtn: { fontSize: 22, color: "#116AD1" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#116AD1" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#116AD1",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 2 },
  value: { fontSize: 14, color: "#666" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  emptyProducts: { fontSize: 14, color: "#999", textAlign: "center", paddingVertical: 20 },

  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
  productName: { fontSize: 14, color: "#333", marginBottom: 4 },
  productQty: { fontSize: 13, color: "#888" },
  productPrice: { fontSize: 14, fontWeight: "600", color: "#116AD1" },

  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, color: "#333" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#116AD1" },

  buttonChat: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonChatText: { color: "#2E7D32", fontWeight: "bold", fontSize: 15 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#116AD1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  buttonCancel: {
    backgroundColor: "#FDEDED",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonCancelText: { color: "#D32F2F", fontWeight: "bold" },

  overlay: {
    position: "absolute",
    top: HEADER_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 15,
  },
});
