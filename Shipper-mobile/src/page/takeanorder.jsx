import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import config from '../shipper-context/config';
import { useAuth } from '../shipper-context/auth-context';
import Sidebar from '../component/sidebar';


export default function TakeanOrder() {
    const [orderCode, setOrderCode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const { token } = useAuth();

    // Lấy danh sách đơn đã nhận
    const fetchAcceptedOrders = async () => {
        try {
            if (!token) return;
            const res = await axios.get(`${config.backendUrl}/orders/shipper`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.status === "success") {
                setAcceptedOrders(res.data.data.orders || []);
            }
        } catch (error) {
            console.log("Lỗi lấy đơn đã nhận:", error?.response?.data || error.message);
        }
    };

    // Fetch khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            fetchAcceptedOrders();
        }, [token])
    );

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

    // Hàm nhận đơn
    const handleTakeOrder = async () => {
        try {
            if (!orderCode) {
                Alert.alert("Vui lòng nhập mã đơn hoặc quét QR!");
                return;
            }
            console.log(`${config.backendUrl}/orders/shippers/${orderCode}`);

            console.log("Đang gửi request...");

            const res = await axios.post(
                `${config.backendUrl}/orders/shipper/${orderCode}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status === 'success') {
                Alert.alert("Nhận đơn thành công");
                setOrderCode('');
                // Reload danh sách đơn đã nhận
                fetchAcceptedOrders();
            }
            console.log("Kết quả trả về:", res.data);

        } catch (error) {
            console.log("LỖI API:", error?.response?.data || error.message);
            Alert.alert("Lỗi", error?.response?.data?.message || "Không thể nhận đơn");
        }
    };


    // Xử lý khi quét barcode/QR
    const handleBarCodeScanned = ({ data }) => {
        if (data) {
            setOrderCode(data);
            setScanning(false);
            console.log(data);
            Alert.alert("Quét thành công", `Mã: ${data}`);
        }
    };

    // Hàm xử lý khi nhấn nút quét QR
    const handleScanQR = async () => {
        if (!permission) {
            // Đang kiểm tra quyền
            return;
        }

        if (!permission.granted) {
            // Yêu cầu quyền
            const result = await requestPermission();
            if (result.granted) {
                setScanning(true);
            } else {
                Alert.alert("Thông báo", "Bạn cần cấp quyền camera để quét QR code!");
            }
        } else {
            // Đã có quyền, mở camera
            setScanning(true);
        }
    };

    // UI khi đang quét
    if (scanning) {
        if (!permission) {
            return (
                <View style={styles.container}>
                    <Text>Đang kiểm tra quyền camera...</Text>
                </View>
            );
        }
        if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <Text style={{ marginBottom: 20 }}>Không có quyền camera</Text>
                    <TouchableOpacity style={styles.qrBtn} onPress={handleScanQR}>
                        <Text style={styles.qrBtnText}>Yêu cầu quyền lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.qrBtn} onPress={() => setScanning(false)}>
                        <Text style={styles.qrBtnText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'code128', 'ean13'],
                }}
            >
                <TouchableOpacity
                    style={styles.cancelScan}
                    onPress={() => setScanning(false)}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>Hủy</Text>
                </TouchableOpacity>
            </CameraView>
        );
    }

    // UI chính
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                {/* Header (theo MapScreen) */}
                <View style={styles.header}>
                    {/* Left: nút menu */}
                    <TouchableOpacity onPress={toggleSidebar} style={styles.headerSide}>
                        <Text style={styles.menuBtn}>☰</Text>
                    </TouchableOpacity>

                    {/* Title căn giữa */}
                    <Text style={styles.headerTitle}>Nhận đơn</Text>

                    {/* Right: nút cài đặt */}
                    <TouchableOpacity onPress={togglePopup} style={styles.headerSideRight}>
                        <Text style={styles.menuBtn}>⚙</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ordercode}>
                    {/* INPUT 8 phần */}
                    <TextInput
                        placeholder="Nhập mã đơn hàng"
                        value={orderCode}
                        onChangeText={setOrderCode}
                        style={styles.input}
                    />

                    {/* BUTTON SCAN (2 phần) */}
                    <TouchableOpacity style={[styles.scanIconWrapper, { backgroundColor: '#fff' }]} onPress={handleScanQR}>
                        <Image source={require('../../assets/scan.png')} style={styles.scanImg} />
                    </TouchableOpacity>
                </View>


                <TouchableOpacity style={[styles.acceptBtn, { marginTop: 20, marginHorizontal: 16 }]} onPress={handleTakeOrder}>
                    <Text style={styles.acceptBtnText}>Nhận đơn</Text>
                </TouchableOpacity>

                {/* Danh sách đơn hàng đã nhận */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Đơn hàng đã nhận ({acceptedOrders.length})</Text>
                </View>
                <ScrollView style={styles.historyList} contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>
                    {acceptedOrders.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
                        </View>
                    ) : (
                        acceptedOrders.map((order) => (
                            <View key={order.id} style={styles.orderCard}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderId}>#{order.id}</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Đang giao</Text>
                                    </View>
                                </View>
                                {/* Thông tin người nhận */}
                                <View style={styles.receiverInfo}>
                                    <Text style={styles.receiverName}>👤 {order.OrderClient.username || 'Khách hàng'}</Text>
                                    {order.receiver_phone && (
                                        <Text style={styles.receiverPhone}>📞 {order.receiver_phone}</Text>
                                    )}
                                </View>
                                <Text style={styles.orderText}>📍 {order.shipping_address}</Text>
                                <Text style={styles.orderPrice}>💰 {order.total_price?.toLocaleString('vi-VN')}₫</Text>
                                {order.OrderItems && order.OrderItems.length > 0 && (
                                    <Text style={styles.orderItems}>📦 {order.OrderItems.length} sản phẩm</Text>
                                )}
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Overlay khi sidebar hoặc popup mở */}
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
                <Text style={styles.title}></Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    header: {
        marginTop: 31,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    headerSide: { width: 60, justifyContent: 'center' }, // giữ khoảng để title thật sự căn giữa
    headerSideRight: { width: 60, justifyContent: 'center', alignItems: 'flex-end' },
    headerTitle: {
        color: '#116AD1',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    ordercode: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        paddingHorizontal: 16
    },
    input: {
        flex: 8,
        height: 50,                 // <<< chiều cao cố định
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },

    scanIconWrapper: {
        flex: 2,
        height: 50,                 // <<< bằng input
        // backgroundColor: '#116AD1',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scanImg: {
        width: 26,
        height: 26,
    },
    menuBtn: { fontSize: 22, color: '#116AD1' },
    qrBtn: { backgroundColor: '#116AD1', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    qrBtnText: { color: '#fff', fontWeight: 'bold' },
    acceptBtn: { backgroundColor: '#116AD1', padding: 16, borderRadius: 8, alignItems: 'center' },
    acceptBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    cancelScan: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    historyList: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#116AD1',
    },
    statusBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#116AD1',
        fontSize: 12,
        fontWeight: '600',
    },
    orderText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    orderPrice: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginBottom: 4,
    },
    orderItems: {
        fontSize: 13,
        color: '#888',
    },
    receiverInfo: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    receiverName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    receiverPhone: {
        fontSize: 13,
        color: '#666',
    },
});
