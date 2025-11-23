import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Dimensions,
    ActivityIndicator, ScrollView, Modal, TextInput, Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../component/sidebar';
import Popup from '../component/popup';
import axios from 'axios';
import config from '../shipper-context/config';
import { useAuth } from '../shipper-context/auth-context';
import * as WebBrowser from "expo-web-browser";

const HEADER_HEIGHT = 80;

const Wallet = () => {
    const navigation = useNavigation();
    const { token } = useAuth();
    const tokenShipper = "Bearer " + token;

    const [showSidebar, setShowSidebar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [balance, setBalance] = useState(0);
    const [activeFilter, setActiveFilter] = useState("today");
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // ===== Modal Nạp tiền =====
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('stripe'); // 'stripe' | 'momo'
    const [topupLoading, setTopupLoading] = useState(false);

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
        setShowTopupModal(false);
    };

    const fetchWallet = async () => {
        try {
            const res = await axios.get(`${config.backendUrl}/transactions/get-wallet`, {
                headers: { Authorization: tokenShipper }
            });
            setBalance(res.data.wallet ?? 0);
        } catch (err) {
            console.log("Lỗi get ví:", err);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.backendUrl}/transactions`, {
                headers: { Authorization: tokenShipper }
            });
            setHistory(res.data.data || []);
            setPage(res.data.pagination?.currentPage || 1);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            console.log("Lỗi history:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) {
            fetchWallet();
            fetchHistory();
        }
    }, [token]);

    const handleTopup = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        setTopupLoading(true);
        try {
            const endpoint = method === 'stripe'
                ? '/transactions/checkout-session/stripe'
                : '/transactions/checkout-session/momo';

            const res = await axios.post(`${config.backendUrl}${endpoint}`, {
                amount: Number(amount)
            }, {
                headers: { Authorization: tokenShipper }
            });

            console.log("Checkout session:", res.data);

            // mở ngay URL thanh toán
            const url = res.data.session?.url;
            const listener = Linking.addEventListener("url", (event) => {
                const redirectUrl = event.url;

                if (redirectUrl.includes("/wallet/success")) {
                    console.log("THANH TOÁN THÀNH CÔNG");
                    navigation.navigate("PaymentSuccess");
                }
            });

            // 3. Mở web thanh toán
            await WebBrowser.openBrowserAsync(url);

            listener.remove();

            setShowTopupModal(false);
            setAmount('');
            fetchWallet(); // cập nhật số dư nếu cần sau khi thanh toán xong
        } catch (err) {
            console.log("Lỗi nạp tiền:", err.response?.data || err);
            alert("Nạp tiền thất bại");
        }
        setTopupLoading(false);
    };
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Text style={styles.menuBtn}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>KOHI MALL</Text>
                <TouchableOpacity onPress={togglePopup}>
                    <Text style={styles.menuBtn}>⚙</Text>
                </TouchableOpacity>
            </View>

            {/* SỐ DƯ */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư ví</Text>
                <Text style={styles.balanceAmount}>{balance.toLocaleString()} đ</Text>
            </View>

            {/* Nút Nạp / Rút */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTopupModal(true)}>
                    <Text style={styles.actionText}>Nạp tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Rút tiền</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL NẠP TIỀN */}
            <Modal
                visible={showTopupModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nạp tiền vào ví</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số tiền"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <View style={styles.methodRow}>
                            <TouchableOpacity
                                style={[styles.methodBtn, method === 'stripe' && styles.methodActive]}
                                onPress={() => setMethod('stripe')}
                            >
                                <Text style={method === 'stripe' ? { color: '#fff' } : {}}>Stripe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.methodBtn, method === 'momo' && styles.methodActive]}
                                onPress={() => setMethod('momo')}
                            >
                                <Text style={method === 'momo' ? { color: '#fff' } : {}}>Momo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                                onPress={() => setShowTopupModal(false)}
                            >
                                <Text>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#116AD1' }]}
                                onPress={handleTopup}
                                disabled={topupLoading}
                            >
                                {topupLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: '#fff' }}>Nạp</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* OVERLAY */}
            {(showSidebar || showPopup) && (
                <TouchableOpacity activeOpacity={1} onPress={closeAll} style={styles.overlay} />
            )}

            {/* SIDEBAR */}
            {showSidebar && <Sidebar onClose={closeAll} />}

            {/* POPUP */}
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    methodRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
    methodBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    methodActive: { backgroundColor: '#116AD1' },
    modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center'
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
