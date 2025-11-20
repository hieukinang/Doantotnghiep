import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
    const { token } = useAuth();

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

            if (res.status = 'success') {
                Alert.alert("Nhận đơn thành công");
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


                <TouchableOpacity style={[styles.acceptBtn, { marginTop: 20 }]} onPress={handleTakeOrder}>
                    <Text style={styles.acceptBtnText}>Nhận đơn</Text>
                </TouchableOpacity>
                {/* Danh sách đơn hàng đã hoàn thành */}
                <ScrollView style={styles.historyList} contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* {completedOrders.map((order, index) => (
                        <View key={index} style={styles.orderCard}>
                            <Text style={styles.orderId}>Mã đơn: {order.id}</Text>
                            <Text style={styles.orderText}>Địa chỉ: {order.address}</Text>
                            <Text style={styles.orderDate}>Ngày hoàn thành: {order.date}</Text>
                        </View>
                    ))} */}
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
    cancelScan: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 }
});
