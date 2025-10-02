import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DeliveryHistory = () => {
    const navigation = useNavigation();
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

    // ✅ Danh sách đơn hàng đã hoàn thành (demo)
    const completedOrders = [
        { id: 'DH001', address: '123 Đường A, Quận 1', date: '01/09/2025' },
        { id: 'DH002', address: '456 Đường B, Quận 2', date: '05/09/2025' },
        { id: 'DH003', address: '789 Đường C, Quận 3', date: '10/09/2025' },
        { id: 'DH004', address: '321 Đường D, Quận 4', date: '12/09/2025' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Text style={styles.menuBtn}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử giao hàng</Text>
                <TouchableOpacity onPress={togglePopup}>
                    <Text style={styles.menuBtn}>⚙</Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách đơn hàng đã hoàn thành */}
            <ScrollView style={styles.historyList} contentContainerStyle={{ paddingBottom: 20 }}>
                {completedOrders.map((order, index) => (
                    <View key={index} style={styles.orderCard}>
                        <Text style={styles.orderId}>Mã đơn: {order.id}</Text>
                        <Text style={styles.orderText}>Địa chỉ: {order.address}</Text>
                        <Text style={styles.orderDate}>Ngày hoàn thành: {order.date}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Overlay */}
            {(showSidebar || showPopup) && (
                <TouchableOpacity activeOpacity={1} onPress={closeAll} style={styles.overlay} />
            )}

            {/* Sidebar */}
            {showSidebar && (
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Menu</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("DeliveryHistory");
                        setShowSidebar(false);
                    }}>
                        <Text style={styles.sidebarItem}>Lịch sử giao hàng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Wallet");
                        setShowSidebar(false);
                    }}>
                        <Text style={styles.sidebarItem}>Ví tiền</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Orders");
                        setShowSidebar(false);
                    }}>
                        <Text style={styles.sidebarItem}>Đơn hàng</Text>
                    </TouchableOpacity>
                </View>
            )}

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

    historyList: { flex: 1, padding: 16 },

    orderCard: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#116AD1', marginBottom: 4 },
    orderText: { fontSize: 14, marginBottom: 2, color: '#333' },
    orderDate: { fontSize: 13, color: 'gray', fontStyle: 'italic' },

    overlay: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 15,
    },

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
    sidebarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    sidebarItem: { fontSize: 16, paddingVertical: 10, color: '#116AD1' },

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

export default DeliveryHistory;
