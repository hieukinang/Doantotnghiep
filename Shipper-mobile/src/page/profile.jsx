import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sidebar from "../component/sidebar";
import Popup from "../component/popup";
import config from "../shipper-context/config";

const Profile = () => {
    const [shipper, setShipper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const fetchShipper = async () => {
        try {
            const id = await AsyncStorage.getItem("userId");
            console.log("ID lấy từ AsyncStorage:", id);

            if (!id) {
                setError("Không tìm thấy ID trong bộ nhớ");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${config.backendUrl}/shippers/${id}`);
            console.log("Dữ liệu trả về từ API:", response.data);

            setShipper(response.data.data.doc);
        } catch (err) {
            setError("Lỗi khi gọi API: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipper();
    }, []);

    //thay bằng ip máy
    const fixedImage = shipper.profile_image.replace("localhost", "172.16.12.117");

    return (
        <View style={{ flex: 1 }}>
            {/* Header (giống MapScreen) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Text style={styles.menuBtn}>☰</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Thông tin Shipper</Text>

                <TouchableOpacity onPress={togglePopup}>
                    <Text style={styles.menuBtn}>⚙</Text>
                </TouchableOpacity>
            </View>

            {/* Nội dung */}
            <ScrollView contentContainerStyle={styles.container}>
                {loading && <ActivityIndicator size="large" color="#0000ff" />}

                {error && <Text style={styles.error}>{error}</Text>}

                {!loading && !error && shipper && (
                    <View>
                        {/* Avatar */}
                        <View style={styles.center}>
                            <Image
                                source={{ uri: fixedImage}}
                                style={styles.avatar}
                            />
                            <Text style={styles.name}>{shipper.fullname}</Text>
                            <Text style={styles.subText}>{shipper.email}</Text>
                        </View>

                        {/* Thông tin cá nhân */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                            <Text>ID: {shipper.id}</Text>
                            <Text>Số CMT/CCCD: {shipper.citizen_id}</Text>
                            <Text>Số điện thoại: {shipper.phone}</Text>
                            <Text>Khu vực: {shipper.work_area_city}, {shipper.work_area_village}</Text>
                            <Text>Trạng thái: {shipper.status? "Đang rảnh" : "Không rảnh"}</Text>
                        </View>

                        {/* Xe cộ */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Phương tiện</Text>
                            <Text>Tên xe: {shipper.vehicle_name}</Text>
                            <Text>Biển số: {shipper.license_plate}</Text>
                        </View>

                        {/* Ngân hàng */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Tài khoản ngân hàng</Text>
                            <Text>Ngân hàng: {shipper.bank_name}</Text>
                            <Text>Số tài khoản: {shipper.bank_account_number}</Text>
                            <Text>Chủ tài khoản: {shipper.bank_account_holder_name}</Text>
                            <Text>Số dư: {shipper.wallet} VNĐ</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
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

const styles = StyleSheet.create({
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

    container: {
        padding: 20,
    },
    error: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    center: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
    },
    subText: {
        fontSize: 14,
        color: "gray",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    overlay: {
        position: 'absolute',
        top: 81, // header 31 marginTop + 50 height
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 15,
    },

});

export default Profile;
