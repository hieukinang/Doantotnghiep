import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../component/sidebar';
import Popup from '../component/popup';

const HEADER_HEIGHT = 80;

const Wallet = () => {
    const navigation = useNavigation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [balance, setBalance] = useState(1250000);
    const [activeFilter, setActiveFilter] = useState("today");

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

            {/* Card số dư */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư ví</Text>
                <Text style={styles.balanceAmount}>{balance.toLocaleString()} đ</Text>
            </View>

            {/* Nút Nạp / Rút */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Nạp tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Rút tiền</Text>
                </TouchableOpacity>
            </View>

            {/* Biến động số dư */}
            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Biến động số dư</Text>
                <View style={styles.filterRow}>
                    {["today", "7days", "30days", "all"].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterBtn, activeFilter === filter && styles.filterActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                style={[styles.filterText, activeFilter === filter && styles.filterActiveText]}
                            >
                                {filter === "today"
                                    ? "Hôm nay"
                                    : filter === "7days"
                                        ? "7 ngày"
                                        : filter === "30days"
                                            ? "30 ngày"
                                            : "Tất cả"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.historyBox}>
                    <Text style={{ color: '#555' }}>
                        👉 Hiển thị giao dịch: {activeFilter === "today"
                            ? "Hôm nay"
                            : activeFilter === "7days"
                                ? "7 ngày qua"
                                : activeFilter === "30days"
                                    ? "30 ngày qua"
                                    : "Tất cả"}
                    </Text>
                </View>
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

const { width } = Dimensions.get('window');

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

    balanceCard: {
        marginTop: 30,
        alignSelf: 'center',
        width: width * 0.85,
        backgroundColor: '#fff',
        paddingVertical: 30,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    balanceLabel: { fontSize: 18, color: '#333', marginBottom: 8 },
    balanceAmount: { fontSize: 28, fontWeight: 'bold', color: '#116AD1' },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    actionBtn: {
        flex: 1,
        marginHorizontal: 8,
        backgroundColor: '#116AD1',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    historyContainer: { marginTop: 30, paddingHorizontal: 20 },
    historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    filterText: { fontSize: 14, color: '#333' },
    filterActive: { backgroundColor: '#116AD1' },
    filterActiveText: { color: '#fff', fontWeight: 'bold' },
    historyBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    overlay: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 15,
    },
});

export default Wallet;
