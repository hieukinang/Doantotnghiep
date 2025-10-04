import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "../component/sidebar";
import Popup from "../component/popup";

const OrderDetail = () => {
    const navigation = useNavigation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const confirmCancel = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn hủy đơn này?",
            [
                { text: "Không", style: "cancel" },
                { text: "Có", onPress: () => console.log("Đơn hàng đã bị hủy") },
            ]
        );
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

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Thông tin đơn hàng */}
                <View style={styles.card}>
                    <Text style={styles.label}>Mã đơn:</Text>
                    <Text style={styles.value}>#DH00123</Text>

                    <Text style={styles.label}>Người nhận:</Text>
                    <Text style={styles.value}>Nguyễn Văn A</Text>

                    <Text style={styles.label}>SĐT:</Text>
                    <Text style={styles.value}>0123 456 789</Text>

                    <Text style={styles.label}>Địa chỉ:</Text>
                    <Text style={styles.value}>123 Đường ABC, Quận X, TP.HCM</Text>

                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text style={[styles.value, { color: "#116AD1" }]}>Đang giao</Text>

                    <Text style={styles.label}>Thời gian dự kiến:</Text>
                    <Text style={styles.value}>10:30 AM - 11:00 AM</Text>
                </View>

                {/* Danh sách sản phẩm */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Sản phẩm</Text>
                    <View style={styles.productRow}>
                        <Text style={styles.productName}>Áo thun nam</Text>
                        <Text style={styles.productQty}>x2</Text>
                        <Text style={styles.productPrice}>200.000đ</Text>
                    </View>
                    <View style={styles.productRow}>
                        <Text style={styles.productName}>Giày sneaker</Text>
                        <Text style={styles.productQty}>x1</Text>
                        <Text style={styles.productPrice}>1.200.000đ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalPrice}>1.400.000đ</Text>
                    </View>
                </View>

                {/* Nút hành động */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => console.log("Xác nhận giao")}
                    >
                        <Text style={styles.buttonText}>Xác nhận giao</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonCancel}
                        onPress={confirmCancel}
                    >
                        <Text style={styles.buttonCancelText}>Hủy đơn</Text>
                    </TouchableOpacity>
                </View>
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

    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    label: { fontSize: 14, fontWeight: "bold", marginTop: 6 },
    value: { fontSize: 14, marginBottom: 4 },

    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    productName: { flex: 2, fontSize: 14 },
    productQty: { flex: 1, fontSize: 14, textAlign: "center" },
    productPrice: { flex: 1, fontSize: 14, textAlign: "right" },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        paddingTop: 8,
    },
    totalLabel: { fontSize: 15, fontWeight: "bold" },
    totalPrice: { fontSize: 15, fontWeight: "bold", color: "#116AD1" },

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
