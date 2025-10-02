import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Wallet = () => {
    const navigation = useNavigation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
        if (!showSidebar) setShowPopup(false); // đóng popup nếu mở sidebar
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
        if (!showPopup) setShowSidebar(false); // đóng sidebar nếu mở popup
    };

    const closeAll = () => {
        setShowSidebar(false);
        setShowPopup(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Nút mở Sidebar */}
                <TouchableOpacity onPress={toggleSidebar}>
                    <Text style={styles.menuBtn}>☰</Text>
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.headerTitle}>KOHI MALL</Text>

                {/* Nút mở Popup */}
                <TouchableOpacity onPress={togglePopup}>
                    <Text style={styles.menuBtn}>⚙</Text>
                </TouchableOpacity>

            </View>

            {/* Map */}
            <View style={styles.mapPlaceholder}>
                <Text style={{ color: 'gray' }}>Bản đồ sẽ hiển thị ở đây</Text>
            </View>

            {/* Bottom Info Tab */}
            <View style={styles.bottomTab}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.boxContainer}>
                        <Text style={styles.boxTitle}>Thông tin đơn hàng</Text>
                        <Text style={styles.boxText}>Mã đơn: #DH00123</Text>
                        <Text style={styles.boxText}>Địa chỉ: 123 Đường ABC, Quận X</Text>

                        <View style={styles.boxRow}>
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={() => console.log('Nhận đơn')}
                            >
                                <Text style={styles.buttonText}>Nhận đơn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonOutline}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.buttonOutlineText}>Chi tiết</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* ... thêm boxContainer khác */}
                </ScrollView>
            </View>

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
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Menu</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("DeliveryHistory");
                        setShowSidebar(false); // đóng Sidebar sau khi bấm
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

const HEADER_HEIGHT = 80; // tổng chiều cao header

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
        padding: 24,
        height: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    boxContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    boxTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    boxText: { fontSize: 14, marginBottom: 4 },
    boxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    buttonPrimary: {
        backgroundColor: '#116AD1',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    buttonOutline: {
        borderWidth: 1,
        borderColor: '#116AD1',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        width: '48%',
        alignItems: 'center',
    },
    buttonOutlineText: { color: '#116AD1', fontWeight: 'bold' },

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

export default Wallet;
