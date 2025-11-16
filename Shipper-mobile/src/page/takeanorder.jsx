import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';


export default function TakeanOrder() {
    const insets = useSafeAreaInsets();
    const [orderCode, setOrderCode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    // Hàm nhận đơn
    const handleTakeOrder = () => {
        if (!orderCode) {
            Alert.alert("Vui lòng nhập mã đơn hoặc quét QR!");
            return;
        }
        fetch(`https://api.example.com/take-order/${orderCode}`, { method: 'POST' })
            .then(res => res.json())
            .then(() => {
                Alert.alert("Nhận đơn thành công", `Mã: ${orderCode}`);
                setOrderCode('');
            })
            .catch(err => console.log(err));
    };

    // Xử lý khi quét barcode/QR
    const handleBarCodeScanned = ({ data }) => {
        if (data) {
            setOrderCode(data);
            setScanning(false);
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
            <Text style={styles.title}>Nhận đơn</Text>

            <TextInput
                placeholder="Nhập mã đơn hàng"
                value={orderCode}
                onChangeText={setOrderCode}
                style={styles.input}
            />

            <TouchableOpacity style={styles.qrBtn} onPress={handleScanQR}>
                <Text style={styles.qrBtnText}>Quét QR / Barcode</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.acceptBtn, { marginTop: 20 }]} onPress={handleTakeOrder}>
                <Text style={styles.acceptBtnText}>Nhận đơn</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#116AD1' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
    qrBtn: { backgroundColor: '#116AD1', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    qrBtnText: { color: '#fff', fontWeight: 'bold' },
    acceptBtn: { backgroundColor: '#116AD1', padding: 16, borderRadius: 8, alignItems: 'center' },
    acceptBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    cancelScan: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 }
});
